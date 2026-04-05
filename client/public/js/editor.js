import * as monaco from "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/+esm";

let editor;

export function initEditor() {
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Start coding...",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
  });
}

export function setLanguage(lang) {
  monaco.editor.setModelLanguage(editor.getModel(), lang);
}

export function getCode() {
  return editor.getValue();
}

export function setCode(code) {
  if (editor.getValue() !== code) {
    editor.setValue(code);
  }
}

export function onCodeChange(callback) {
  editor.onDidChangeModelContent(() => {
    callback(editor.getValue());
  });
}

export function onCursorChange(callback) {
  editor.onDidChangeCursorPosition((e) => {
    callback(e.position);
  });
}

let decorations = {};

export function showRemoteCursor(socketId, position, username) {
  const className = "cursor-" + socketId;

  if (!document.getElementById(className)) {
    const style = document.createElement("style");
    style.id = className;
    style.innerHTML = `
      .${className} {
        border-left: 2px solid red;
      }
    `;
    document.head.appendChild(style);
  }

  decorations[socketId] = editor.deltaDecorations(
    decorations[socketId] || [],
    [
      {
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: className
        }
      }
    ]
  );
}