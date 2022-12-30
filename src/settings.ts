import { App, PluginSettingTab, Setting } from "obsidian";
import Plugin from "./main";
import { SortOrder } from "./sort";

const MIN_DELAY_MS = 0;
const MAX_DELAY_MS = 1000;
const DEFAULT_DELAY_MS = 250;

export interface Settings {
  sortOrder: SortOrder;
  delayMs: number;
}

export const DEFAULT_SETTINGS: Settings = {
  sortOrder: SortOrder.COMPLETED_TOP,
  delayMs: DEFAULT_DELAY_MS,
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
      .setName("Delay (ms)")
      .setDesc(
        "Values between 0 and 1000 are accepted. Short delays can result in degraded performance."
      )
      .addText((text) =>
        text
          .setValue(this.plugin.settings.delayMs.toString())
          .onChange(async (val) => {
            const inputtedDelayMS = val.replace(/[^\d]/g, "");
            let unboundedDelayMS = parseInt(inputtedDelayMS);
            if (isNaN(unboundedDelayMS)) {
              unboundedDelayMS = DEFAULT_DELAY_MS;
            }
            const delayMs = Math.min(
              Math.max(unboundedDelayMS, MIN_DELAY_MS),
              MAX_DELAY_MS
            );
            if (inputtedDelayMS !== "") {
              text.setValue(delayMs.toString()); // Update the input to reflect the clamped value.
            }
            this.plugin.settings.delayMs = delayMs;
            await this.plugin.saveSettings();
          })
      );
  }
}
