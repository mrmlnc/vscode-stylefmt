'use strict';

import * as vscode from 'vscode';

export interface IStylefmtOptions {
	configBasedir?: string;
	config?: string | object;
	useStylelintConfigOverrides?: boolean;
	showErrorMessages?: boolean;
}

export interface IStylelintOptions {
	configOverrides?: any;
}

export interface IResult {
	css: string;
	range: vscode.Range;
}
