'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import * as rimraf from 'rimraf';
import * as vscode from 'vscode';
import * as proxyquire from 'proxyquire';

import * as Types from '../types';

const text = fs.readFileSync('./fixtures/test.scss').toString();

export function fileExist(filepath: string): Promise<boolean> {
	return new Promise((resolve) => {
		fs.access(filepath, (err) => resolve(!err));
	});
}

export function removeFile(filepath: string): Promise<any> {
	return fileExist(filepath).then((exists) => {
		if (!exists) {
			return false;
		}

		return new Promise((resolve, reject) => {
			fs.unlink(filepath, (err) => err ? reject(err) : resolve());
		});
	});
}

export function writeFile(filepath: string, data: string) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filepath, data, (err) => err ? reject(err) : resolve());
	});
}

function mockupDocument(): vscode.TextDocument {
	return <any>{
		uri: { fsPath: '.tmp/test.scss' },
		lineCount: text.split('\n').length,
		lineAt: (line: number) => ({
			lineNumber: line,
			text: text.split('\n')[line]
		}),
		getText: () => text
	};
}

class Position {
	constructor(public line: number, public character: number) { }
}

class Range {
	constructor(public start: Position, public end: Position) { }
}

const stylefmt = proxyquire('./index', {
	vscode: {
		Position,
		Range,
		workspace: {
			getWorkspaceFolder: () => ({ uri: { fsPath: '.tmp' } })
		},
		'@noCallThru': true
	}
});

describe('Stylefmt API', () => {
	before(() => {
		rimraf.sync('./.tmp');
		fs.mkdirSync('./.tmp');
		fs.writeFileSync('./.tmp/test.scss', text);
	});

	afterEach(() => {
		rimraf.sync('./.tmp/!(test.scss)*');
	});

	after(() => {
		rimraf.sync('./.tmp');
	});

	it('should work without configuration', async () => {
		const document = mockupDocument();
		const settings: Types.ISettings = {};

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('@mixin clearfix()') !== -1);
	});

	it('should work with stylelint config as js file', async () => {
		const configTpl = 'module.exports={rules:{\'color-hex-case\':\'upper\'}}';

		const document = mockupDocument();
		const settings: Types.ISettings = {};

		await writeFile('./.tmp/stylelint.config.js', configTpl);

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('#AAACCC') !== -1);
	});

	it('should work with stylelint config as field in package.json', async () => {
		const configTpl = '{"stylelint":{"rules":{"color-hex-case":"upper"}}}';

		const document = mockupDocument();
		const settings: Types.ISettings = {};

		await writeFile('./.tmp/package.json', configTpl);

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('#AAACCC') !== -1);
	});

	it('should work with stylelint config as .stylelintrc file with JSON syntax', async () => {
		const configTpl = '{rules:{"color-hex-case":"upper"}}';

		const document = mockupDocument();
		const settings: Types.ISettings = {};

		await writeFile('./.tmp/.stylelintrc', configTpl);

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('#AAACCC') !== -1);
	});

	it('should work with stylelint config as .stylelintrc file with YAML syntax', async () => {
		const configTpl = 'rules:\n  color-hex-case: upper';

		const document = mockupDocument();
		const settings: Types.ISettings = {};

		await writeFile('./.tmp/.stylelintrc', configTpl);

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('#AAACCC') !== -1);
	});

	it('should work with config string from settings', async () => {
		const configTpl = '{rules:{"color-hex-case":"upper"}}';

		const document = mockupDocument();
		const settings: Types.ISettings = {
			config: './.my-stylelint-config.json'
		};

		await writeFile('./.tmp/.my-stylelint-config.json', configTpl);

		const result = await stylefmt.use(settings, document, null);

		assert.ok(result.css.search('#AAACCC') !== -1);
	});
});
