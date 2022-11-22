import { Editor, MarkdownView, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, Settings, SettingsTab } from "./settings";
import { sortTodos } from "./sort";

export default class MyPlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingsTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("editor-change", this._onEditorChange)
    );
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  _onEditorChange = async (editor: Editor, _markdownView: MarkdownView) => {
    // Settings can change while the editor is open, so we need to reload them.
    await this.loadSettings();
    setTimeout(() => {
      this._sortTodos(editor);
    }, this.settings.delayMS);
  };

  _lastSort = new Date();
  _lastValue = "";
  _sortTodos = async (editor: Editor) => {
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
    const result = sortTodos(value, this.settings.sortOrder);
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
