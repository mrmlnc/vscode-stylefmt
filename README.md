# VS Code Plugin for stylefmt

> [stylefmt](https://github.com/morishitter/stylefmt) is a tool that automatically formats your stylesheets.

![2016-06-14_20-03-46](https://cloud.githubusercontent.com/assets/7034281/16052074/2a94fc32-326b-11e6-9a34-b689fcca5d41.gif)

## Install

To install, press `F1` and select `Extensions: Install Extensions` and then search for and select `stylefmt`.

## Usage

Press `F1` and run the command named `stylefmt: Format CSS`.

## Supported settings

#### autoFormatOnSave

Type: `boolean`<br>
Default: `false`

Auto format on save.

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
