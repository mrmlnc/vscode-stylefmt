# vscode-stylefmt

> [stylefmt](https://github.com/morishitter/stylefmt) is a tool that automatically formats your stylesheets.

![VS Code Plugin for stylefmt](https://cloud.githubusercontent.com/assets/7034281/16056620/f7442b8c-327e-11e6-9400-b59085d4abef.gif)

## Install

  * Press <kbd>F1</kbd> and `select Extensions: Install Extensions`.
  * Search for and select `stylefmt`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

Press <kbd>F1</kbd> and run the command named `stylefmt: Format CSS`.

## Supported languages

  * CSS
  * SCSS

## Supported settings

**autoFormatOnSave**

  * Type: `boolean`
  * Default: `false`

Auto format on save.

**useStylelintConfigOverrides**

  * Type: `boolean`
  * Default: `false`

Overrides rules using Stylelint plugin settings.

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

## Stylefmt modifications (need to check before release)

**lib/params.js**

```diff
function params (options) {
+ if (options.skip) {
+   return Promise.resolve(options);
+ }
  // same as the options in stylelint
  var cosmiconfigOpts = {
    argv: false,
    rcExtensions: true
  }

  var moduleName
- var cwd = process.cwd()
+ var cwd = options.cwd || process.cwd()
  // ...
}
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-stylefmt/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
