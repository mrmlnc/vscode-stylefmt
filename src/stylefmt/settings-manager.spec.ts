'use strict';

import * as assert from 'assert';

import * as settingsManager from './settings-manager';

describe('Settings Manager', () => {
	it('should return config', () => {
		const expected = {};

		const actual = settingsManager.prepare('rootPath', {});

		assert.deepEqual(actual, expected);
	});

	it('should return config with `configBasedir` option', () => {
		const expected = { configBasedir: 'something' };

		const actual = settingsManager.prepare('rootPath', { configBasedir: 'something' });

		assert.deepEqual(actual, expected);
	});

	it('should return config with `config` option as string', () => {
		const actual = settingsManager.prepare('rootPath', { config: './something' });

		assert.ok(actual.configFile.endsWith('something'));
	});

	it('should return config with `config` option as object', () => {
		const expected = { rules: 'something' };

		const actual = settingsManager.prepare('rootPath', { config: { rules: 'something' } });

		assert.deepEqual(actual, expected);
	});

	it('should return config with overrided rules', () => {
		const expected = {
			rules: { rule: { state: 'upper' } }
		};

		const actual = settingsManager.prepare('rootPath', {
			config: {
				rules: { rule: { state: 'lower' } }
			},
			useStylelintConfigOverrides: true,
			configOverrides: { rule: { state: 'upper' } }
		});

		assert.deepEqual(actual, expected);
	});

	it('should return config with non-overrided rules', () => {
		const expected = {
			rules: { rule: { state: 'lower' } }
		};

		const actual = settingsManager.prepare('rootPath', {
			config: {
				rules: { rule: { state: 'lower' } }
			},
			useStylelintConfigOverrides: false,
			configOverrides: { rule: { state: 'upper' } }
		});

		assert.deepEqual(actual, expected);
	});
});
