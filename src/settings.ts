import { App, PluginSettingTab, Setting } from "obsidian";
import Plugin from "./main";
import { SortOrder } from "./sort";

export interface Settings {
  sortOrder: SortOrder;
  delayMS: number;
}

export const DEFAULT_SETTINGS: Settings = {
  sortOrder: SortOrder.COMPLETED_TOP,
  delayMS: 0,
};

export class SettingsTab extends PluginSettingTab {
  plugin: Plugin;

  constructor(app: App, plugin: Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", { text: "Todo sort" });
    new Setting(containerEl).setName("Sort order").addDropdown((dropdown) =>
      dropdown
        .addOption(SortOrder.COMPLETED_TOP, "Completed at top")
        .addOption(SortOrder.COMPLETED_BOTTOM, "Completed at bottom")
        .setValue(this.plugin.settings.sortOrder)
        .onChange(async (val) => {
          this.plugin.settings.sortOrder = val as SortOrder;
          await this.plugin.saveSettings();
        })
    );
    new Setting(containerEl)
      .setName("Delay")
      .setDesc("How long to wait after a change until sorting todos?")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("0", "No delay")
          .addOption("125", "125ms")
          .addOption("250", "250ms")
          .setValue(this.plugin.settings.delayMS.toString())
          .onChange(async (val) => {
            this.plugin.settings.delayMS = parseInt(val, 10);
            await this.plugin.saveSettings();
          })
      );
  }
}
