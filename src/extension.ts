'use strict';

import * as path from 'path';

import * as vscode from 'vscode';
import * as postcss from 'postcss';

const stylefmt = require('stylefmt');
const configScanner = require('stylefmt/lib/params');
const scssSyntax = require('postcss-scss');

interface IStylefmtOptions {
	formatOnSave: boolean;
	useStylelintConfigOverrides: boolean;
}

interface IStylelintOptions {
	configOverrides: any;
}

interface IResult {
	css: string;
	range: vscode.Range;
}

let editorConfiguration: IStylefmtOptions;
let output: vscode.OutputChannel;

/**
 * Show message in output channel.
 */
function showOutput(msg: string): void {
	msg = msg.toString();

	if (!output) {
		output = vscode.window.createOutputChannel('Stylefmt');
	}

	output.clear();
	output.appendLine('[Stylefmt]');
	output.append(msg);
	output.show();
}

/**
 * Use Stylefmt module.
 */
function useStylefmt(document: vscode.TextDocument, range: vscode.Range): Promise<IResult> {
	const settings = vscode.workspace.getConfiguration();
	const cwd = document.uri.fsPath ? path.dirname(document.uri.fsPath) : vscode.workspace.rootPath;

	let overrides = null;
	const useOverrides = settings.get<IStylefmtOptions>('stylefmt').useStylelintConfigOverrides;
	if (useOverrides) {
		overrides = settings.get<IStylelintOptions>('stylelint').configOverrides;
	}

	let text;
	if (!range) {
		const lastLine = document.lineAt(document.lineCount - 1);
		const start = new vscode.Position(0, 0);
		const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);

		range = new vscode.Range(start, end);
		text = document.getText();
	} else {
		text = document.getText(range);
	}

	return configScanner({ cwd }).then(async (options) => {
		options.skip = true;

		if (overrides) {
			options.stylelint = Object.assign(options.stylelint, overrides);
		}

		return postcss([stylefmt(options)])
			.process(text, document.languageId === 'scss' && { syntax: scssSyntax })
			.then((result) => (<IResult>{
				css: result.css,
				range
			}));
	});
}

export function activate(context: vscode.ExtensionContext) {
	editorConfiguration = vscode.workspace.getConfiguration().get<IStylefmtOptions>('stylefmt');

	const supportedDocuments: vscode.DocumentSelector = [
		{ language: 'css', scheme: 'file' },
		{ language: 'scss', scheme: 'file' }
	];

	const command = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
		useStylefmt(textEditor.document, null)
			.then((result) => {
				textEditor.edit((editBuilder) => {
					editBuilder.replace(result.range, result.css);
				});
			})
			.catch(showOutput);
	});

	const formatCode = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
		provideDocumentRangeFormattingEdits(document, range) {
			return useStylefmt(document, range).then((result) => {
				return [vscode.TextEdit.replace(range, result.css)];
			}).catch(showOutput);
		}
	});

	// Subscriptions
	context.subscriptions.push(command);
	context.subscriptions.push(formatCode);
}
