'use strict';

const vscode = require('vscode');
const postcss = require('postcss');
const stylefmt = require('stylefmt');
const scssSyntax = require('postcss-scss');

function init(document, onDidSaveStatus) {
  const text = document.getText();
  const lang = document.languageId;
  const cwd = vscode.workspace.rootPath ? vscode.workspace.rootPath : '';

  postcss([stylefmt({ cwd })])
    .process(text, lang === 'sass' && {
      syntax: scssSyntax
    })
    .then((result) => {
      const editor = vscode.editor || vscode.window.activeTextEditor;
      if (!editor) {
        throw new Error('Ooops...');
      }

      const document = editor.document;
      const lastLine = document.lineAt(document.lineCount - 1);
      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
      const range = new vscode.Range(start, end);

      if (document.stylefmt) {
        delete document.stylefmt;
        return;
      }

      if (onDidSaveStatus) {
        const we = new vscode.WorkspaceEdit();
        we.replace(document.uri, range, result.css);
        document.stylefmt = true;
        vscode.workspace.applyEdit(we).then(() => {
          document.save();
        });
      } else {
        editor.edit((builder) => {
          builder.replace(range, result.css);
        });
      }
    })
    .catch((err) => {
      vscode.window.showWarningMessage(err);
    });
}

function activate(context) {
  const execute = vscode.commands.registerTextEditorCommand('stylefmt.execute', (textEditor) => {
    init(textEditor.document, false);
  });

  context.subscriptions.push(execute);

  const onSave = vscode.workspace.onDidSaveTextDocument((document) => {
    const onDidSave = vscode.workspace.getConfiguration('stylefmt').autoFormatOnSave;
    if (onDidSave) {
      init(document, true);
    }
  });

  context.subscriptions.push(onSave);
}

exports.activate = activate;
