# vscode-stylefmt

> [stylefmt](https://github.com/morishitter/stylefmt) is a tool that automatically formats your stylesheets.

## :warning: This plugin is archived

The main package ([`stylefmt`](https://github.com/morishitter/stylefmt)) does not develop.

Alternatively you can use:

* [vscode-stylefmt](https://github.com/ronilaukkarinen/vscode-stylefmt) plugin with `stylefmt` [fork](https://github.com/ronilaukkarinen/stylefmt).
* [`postcss`](https://github.com/postcss/postcss) with similar plugins.
* [`stylelint`](https://github.com/stylelint/stylelint)

## Donation

Do you like this project? Support it by donating, creating an issue or pull request.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/mrmlnc)

## Install

  * Press <kbd>F1</kbd> and `select Extensions: Install Extensions`.
  * Search for and select `stylefmt`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

  * You can use global keyboard shortcut <kbd>ALT+SHIFT+F</kbd> or right-click context menu `Format code`.
  * Or press <kbd>F1</kbd> and run the command named `stylefmt: Format CSS`.

## Supported languages

  * CSS
  * PostCSS
  * Less
  * SCSS
  * SugarSS

## Supported settings

**configBasedir**

  * Type: `string`
  * Default: `null`

Base working directory; useful for stylelint `extends` parameter.

**config**

  * Type: `object || string`
  * Default: `null`

Config object for stylelint or path to a stylelint config file.

*Will automatically look for `.stylelintrc` and `stylelint.config.js` in workspace root, or a `stylelint` param in the `package.json`, if config is omitted.*

> **Warning!**
>
> If you want to specify a file in the current directory, the path must begin with a `./` or `../` if relative to the current directory. Also you can use HOME directory as `~` symbol.

**useStylelintConfigOverrides**

  * Type: `boolean`
  * Default: `false`

Overrides rules using Stylelint plugin settings.

**showErrorMessages**

  * Type: `boolean`
  * Default: `true`

Show error messages or not. Will be automatically set to false if `editor.formatOnSave` is enabled.

## Keyboard shortcuts

For changes keyboard shortcuts, create a new rule in `File -> Preferences -> Keyboard Shortcuts`:

```json
{
  "key": "ctrl+shift+c",
  "command": "stylefmt.execute"
}
```

## Custom configuration

Read about the [stylelint rules](https://github.com/morishitter/stylefmt#stylelint-rules-that-stylefmt-can-handle) and [default rules](https://github.com/morishitter/stylefmt#default-formatting-rules-without-stylelint-config-file) in stylefmt repository.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-stylefmt/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
