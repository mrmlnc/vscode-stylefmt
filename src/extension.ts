'use strict';

import * as vscode from 'vscode';

import * as stylefmt from './stylefmt';
import * as utils from './utils';

import * as Types from './types';

function getSettings(document: vscode.TextDocument): Types.ISettings {
	const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);

	return <Types.ISettings>Object.assign(
		{},
		vscode.workspace.getConfiguration('stylefmt', workspaceFolder.uri),
		vscode.workspace.getConfiguration('stylelint', workspaceFolder.uri),
		vscode.workspace.getConfiguration('editor', workspaceFolder.uri).get('formatOnSave')
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
		{ language: 'postcss', scheme: 'file' },
		{ language: 'less', scheme: 'file' },
		{ language: 'scss', scheme: 'file' },
		{ language: 'sugarss', scheme: 'file' }
	];

	// For plugin command: "stylefmt.execute"
	const command = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
		const document = textEditor.document;
		const settings = getSettings(document);
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
			const settings = getSettings(document);
			const needShowErrors = needShowErrorMessages(settings);

			return stylefmt
				.use(settings, document, range)
				.then((result) => <any>[vscode.TextEdit.replace(range, result.css)])
				.catch((err) => utils.output(outputChannel, err, needShowErrors));
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(format);
}
