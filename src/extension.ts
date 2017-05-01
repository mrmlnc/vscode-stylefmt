'use strict';

import * as vscode from 'vscode';

import * as stylefmt from './stylefmt';
import * as utils from './utils';

import * as Types from './types';

function getSettings(): Types.ISettings {
	return Object.assign(
		{},
		vscode.workspace.getConfiguration('stylefmt'),
		vscode.workspace.getConfiguration('stylelint'),
		vscode.workspace.getConfiguration('editor').get('formatOnSave')
	);
}

function needShowErrorMessages(settings: Types.ISettings): boolean {
	return settings.formatOnSave ? false : settings.showErrorMessages;
}

export function activate(context: vscode.ExtensionContext) {
	const outputChannel: vscode.OutputChannel = null;

	// Supported languages
	const supportedDocuments: vscode.DocumentSelector = [
		{ language: 'css', scheme: 'file' },
		{ language: 'scss', scheme: 'file' }
	];

	// For plugin command: "stylefmt.execute"
	const command = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
		const settings = getSettings();
		const document = textEditor.document;
		const needShowErrors = needShowErrorMessages(settings);

		stylefmt
			.use(settings, document, null)
			.then((result) => {
				textEditor.edit((editBuilder) => {
					editBuilder.replace(result.range, result.css);
				});
			})
			.catch((err) => utils.output(outputChannel, err, needShowErrors));
	});

	// For commands: "Format Document" and "Format Selection"
	const format = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
		provideDocumentRangeFormattingEdits(document, range) {
			const settings = getSettings();
			const needShowErrors = needShowErrorMessages(settings);

			return stylefmt
				.use(settings, document, range)
				.then((result) => [vscode.TextEdit.replace(range, result.css)])
				.catch((err) => utils.output(outputChannel, err, needShowErrors));
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(format);
}
