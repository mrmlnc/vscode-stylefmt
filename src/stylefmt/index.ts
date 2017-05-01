'use strict';

import * as vscode from 'vscode';

import * as postcss from 'postcss';
import * as scssSyntax from 'postcss-scss';
import * as stylefmt from 'stylefmt';

import * as settingsManager from './settings-manager';

import * as Types from '../types';

export function use(settings: Types.ISettings, document: vscode.TextDocument, range: vscode.Range): Promise<Types.IResult> {
	const rootDirectory = vscode.workspace.rootPath || '';
	const stylefmtConfig = settingsManager.prepare(rootDirectory, settings);

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
		from: document.uri.fsPath || vscode.workspace.rootPath || '',
		syntax: scssSyntax
	};

	const postcssPlugins: postcss.AcceptedPlugin[] = [
		stylefmt(stylefmtConfig)
	];

	return postcss(postcssPlugins)
		.process(text, postcssConfig)
		.then((result) => (<Types.IResult>{
			css: result.css,
			range
		}));
}
