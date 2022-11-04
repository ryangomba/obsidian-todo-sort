import { Editor, MarkdownView, Plugin } from "obsidian";
import { sortTodos } from "./sort";

export default class MyPlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on("editor-change", this._onEditorChange)
    );
  }

  onunload() {}

  _onEditorChange = (editor: Editor, markdownView: MarkdownView) => {
    this._sortTodos(editor);
  };

  _lastSort = new Date();
  _lastValue = "";
  _sortTodos = (editor: Editor) => {
    const began = new Date();
    const value = editor.getValue();
    if (value === this._lastValue) {
      return;
    }
    if (new Date().getTime() - this._lastSort.getTime() < 100) {
      console.error("WARNING!!! Possible infinite sort detected");
      return;
    }
    const cursor = editor.getCursor();
    const lineNumber = cursor.line;
    const result = sortTodos(value);
    if (result.output !== value) {
      const now = new Date();
      console.log(`Sorted todos in ${now.getTime() - began.getTime()}ms`);
      this._lastSort = now;
      this._lastValue = result.output;
      editor.setValue(result.output);
      const newLine = result.lineMap[lineNumber];
      if (newLine != cursor.line) {
        editor.setCursor({
          line: newLine,
          ch: cursor.ch,
        });
      }
    }
  };
}
