import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface ImageAutoRefreshPluginSettings {
	extensionsToRefresh: string[];
}

const DEFAULT_SETTINGS: ImageAutoRefreshPluginSettings = {
	extensionsToRefresh: ["svg", "png", "gif", "jpg", "jpeg"]
}

export default class ImageAutoRefreshPlugin extends Plugin {
	settings: ImageAutoRefreshPluginSettings;

	async onload() {
		await this.loadSettings();

		// Register for event to refresh editors when an SVG is modified
		this.app.vault.on('modify', (file) => {
			const fileExtension = file.path.split(".").at(-1);
			if (fileExtension && this.settings.extensionsToRefresh.includes(fileExtension)  && file instanceof TFile) {
				const doc = this.app.workspace.containerEl.doc;
				
				const matches = doc.evaluate(
					`//img[contains(@alt, "${file.name}")]`,
					doc,
					null,
					XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
					null
				);

				for (let i = 0; i < matches.snapshotLength; i++) {
					const match = matches.snapshotItem(i);
					if (match instanceof HTMLImageElement) {
						match.src = match.src.replace(/\?([0-9]*)$/, (str, n, offset, rem) => `?${Number(n) + 1}`);
					}
				}
			}
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ImageAutoRefreshSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ImageAutoRefreshSettingTab extends PluginSettingTab {
	plugin: ImageAutoRefreshPlugin;

	constructor(app: App, plugin: ImageAutoRefreshPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Image file extensions to refresh')
			.setDesc('Comma separated list of file extensions to refresh if modified.')
			.addText(text => text
				.setPlaceholder('svg, png, gif, jpg, jpeg')
				.setValue(this.plugin.settings.extensionsToRefresh.join(", "))
				.onChange(async (value) => {
					this.plugin.settings.extensionsToRefresh = value.replace(/\s/g, "").split(",");
					await this.plugin.saveSettings();
				}));
	}
}
