'use strict';

import * as extend from 'extend';
import * as vscode from 'vscode';
import * as postcss from 'postcss';
import * as scssSyntax from 'postcss-scss';
import * as stylefmt from 'stylefmt';

import ConfigResolver from 'vscode-config-resolver';

interface IStylefmtOptions {
	configBasedir?: string;
	config?: string | object;
	useStylelintConfigOverrides?: boolean;
}

interface IStylelintOptions {
	configOverrides?: any;
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
 * Process styles using Stylefmt
 */
function stylefmtProcess(document: vscode.TextDocument, range: vscode.Range, config?: any): Promise<IResult> {
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

	return postcss([
		stylefmt(config)
	])
		.process(text, postcssConfig)
		.then((result) => (<IResult>{
			css: result.css,
			range
		}));
}

/**
 * Resolve Stylefmt config
 */
function useStylefmt(document: vscode.TextDocument, range: vscode.Range): Promise<IResult> {
	const settingsFmt: IStylefmtOptions = vscode.workspace.getConfiguration().get('stylefmt');
	const settingsLint: IStylelintOptions = vscode.workspace.getConfiguration().get('stylelint');
	const configResolver = new ConfigResolver(vscode.workspace.rootPath);
	const resolveOptions = {
		packageProp: 'stylelint',
		configFiles: [
			'.stylelintrc',
			'stylelint.config.js'
		],
		editorSettings: settingsFmt.config
	};

	let configOverrides = null;
	if (settingsFmt.useStylelintConfigOverrides) {
		configOverrides = settingsLint.configOverrides;
	}

	return configResolver.scan(document.uri.fsPath, resolveOptions).then((resolved) => {
		return stylefmtProcess(document, range, {
			configBasedir: settingsFmt.configBasedir || vscode.workspace.rootPath,
			config: extend(true, {}, resolved.json, { rules: configOverrides || {} })
		});
	}).catch(() => {
		return stylefmtProcess(document, range, { rules: configOverrides });
	});
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
