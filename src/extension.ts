'use strict';

import * as vscode from 'vscode';
import * as postcss from 'postcss';
import * as scssSyntax from 'postcss-scss';
import * as stylefmt from 'stylefmt';

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

	let configOverrides = null;
	const useOverrides = settings.get<IStylefmtOptions>('stylefmt').useStylelintConfigOverrides;
	if (useOverrides) {
		configOverrides = settings.get<IStylelintOptions>('stylelint').configOverrides;
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

	const postcssConfig: postcss.ProcessOptions = {
		from: document.uri.fsPath || vscode.workspace.rootPath,
		syntax: scssSyntax
	};

	return postcss([stylefmt({
			rules: configOverrides
		})])
		.process(text, postcssConfig)
		.then((result) => (<IResult>{
			css: result.css,
			range
		}));
}

export function activate(context: vscode.ExtensionContext) {
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
