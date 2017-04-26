'use strict';

import * as vscode from 'vscode';

import * as stylefmt from './stylefmt';
import * as output from './utils/output';

import * as Types from './types';

export function activate(context: vscode.ExtensionContext) {
	const outputChannel: vscode.OutputChannel = null;

	// Supported languages
	const supportedDocuments: vscode.DocumentSelector = [
		{ language: 'css', scheme: 'file' },
		{ language: 'scss', scheme: 'file' }
	];

	// For plugin command: "stylefmt.execute"
	const command = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
		const settings: Types.IStylefmtOptions = vscode.workspace.getConfiguration('stylefmt');

		stylefmt.runner(textEditor.document, null)
			.then((result) => {
				textEditor.edit((editBuilder) => {
					editBuilder.replace(result.range, result.css);
				});
			})
			.catch((err) => output.show(outputChannel, err, settings.showErrorMessages));
	});

	// For commands: "Format Document" and "Format Selection"
	const format = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
		provideDocumentRangeFormattingEdits(document, range) {
			const settings = vscode.workspace.getConfiguration('stylefmt');

			return stylefmt.runner(document, range)
				.then((result) => [vscode.TextEdit.replace(range, result.css)])
				.catch((err) => output.show(outputChannel, err, settings.showErrorMessages));
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(format);
}
