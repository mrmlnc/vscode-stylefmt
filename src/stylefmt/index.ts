'use strict';

import * as vscode from 'vscode';
import * as extend from 'extend';
import ConfigResolver from 'vscode-config-resolver';

import * as processor from './processor';

import * as Types from '../types';

export function runner(document: vscode.TextDocument, range: vscode.Range): Promise<Types.IResult> {
	const settingsFmt: Types.IStylefmtOptions = vscode.workspace.getConfiguration().get('stylefmt');
	const settingsLint: Types.IStylelintOptions = vscode.workspace.getConfiguration().get('stylelint');
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
		return processor.format(document, range, {
			configBasedir: settingsFmt.configBasedir || vscode.workspace.rootPath,
			config: extend(true, {}, resolved.json, { rules: configOverrides || {} })
		});
	}).catch(() => {
		return processor.format(document, range, { rules: configOverrides });
	});
}
