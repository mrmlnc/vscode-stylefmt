'use strict';

import * as path from 'path';
import * as os from 'os';

import * as extend from 'extend';

import * as Types from '../types';

export function prepare(rootDirectory: string, settings: Types.ISettings): Types.IStylefmtOptions {
	let config: Types.IStylefmtOptions = <any>{};

	if (settings.config) {
		if (typeof settings.config !== 'string') {
			config = <any>settings.config;
		} else {
			const configPath: string = (<string>settings.config);
			let filepath = configPath;

			// Expand HOME directory within filepath
			if (configPath.startsWith('~')) {
				const home = os.homedir();
				filepath = configPath.replace(/^~($|\/|\\)/, `${home}$1`);
			}

			// Expand relative path within filepath
			if (rootDirectory && (configPath.startsWith('./') || configPath.startsWith('../'))) {
				filepath = path.resolve(rootDirectory, configPath);
			}

			config.configFile = filepath;
		}
	}

	if (settings.configBasedir) {
		config.configBasedir = settings.configBasedir;
	}

	// Override stylfmt rules by stylelint rules
	if (settings.useStylelintConfigOverrides && settings.configOverrides) {
		config.rules = extend(true, {}, config.rules, settings.configOverrides);
	}

	return config;
}
