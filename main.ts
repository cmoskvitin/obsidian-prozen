import { App, ItemView, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";

interface PluginSettings {
	animationDuration: number,
	showHeader: boolean,
	showScroll: boolean,
	vignetteOpacity: number,
	vignetteScale: number
}

const DEFAULT_SETTINGS: PluginSettings = {
	animationDuration: 1.2,
	showHeader: false,
	showScroll: true,
	vignetteOpacity: 0.5,
	vignetteScale: 20
}

export default class Prozen extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "zenmode",
			name: "Zen mode",
			callback: this.fullscreenMode.bind(this),
		});
		this.addSettingTab(new ProzenSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	fullscreenMode() {
		console.log("SUP")
		// Use ItemView rather than only MarkdownView
		const leaf = this.app.workspace.getActiveViewOfType(ItemView).leaf;
		if (!leaf) return;
		// Don't trigger fullscreen mode when current leaf is empty.
		if(leaf.view.getViewType() === "empty") return;

		const containerEl = leaf.containerEl;
		const viewEl = leaf.view.contentEl
		const root = document.documentElement
				root.style.setProperty('--vignette-opacity', this.settings.vignetteOpacity)
				root.style.setProperty('--fadeIn-duration', this.settings.animationDuration + 's')
				root.style.setProperty('--vignette-scale', this.settings.vignetteScale + '%')
		const header = leaf.view.headerEl

		if (!document.fullscreenElement){
			containerEl.requestFullscreen();
			viewEl.classList.add("vignette", "animate")
			if (!this.settings.showScroll){
				viewEl.classList.add("noscroll")
			}
			this.settings.showHeader ? header.classList.add("animate") : header.classList.add("hide")
			return;
		} else {
			document.exitFullscreen();
			viewEl.classList.remove("vignette", "animate", "noscroll")
			header.classList.remove("animate", "hide")
		}

		containerEl.onfullscreenchange = () => {
			if (!document.fullscreenElement && viewEl.classList.contains("vignette")){
				viewEl.classList.remove("vignette", "animate", "noscroll");
				header.classList.remove("animate", "hide");
			}
		}
	}
}

class ProzenSettingTab extends PluginSettingTab {
	plugin: Prozen;

	constructor(app: App, plugin: Prozen) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

// VIGNETTE OPACITY SETTING
		let opacityLevel: HTMLDivElement;
		new Setting(containerEl)
			.setName('Vignette opacity')
			.setDesc("Opacity of the vignette's initial color. The higher the value the more saturated the color is. Set to 0 to turn vignetting off.")
			.addSlider((slider) => slider
				.setLimits(0.00,1,0.01)
				.setValue(this.plugin.settings.vignetteOpacity)
				.onChange(async (value) => {
					opacityLevel.innerText = " " + value.toString();
					this.plugin.settings.vignetteOpacity = value;
					await this.plugin.saveSettings();
				}))
				.settingEl.createDiv("", (el: HTMLDivElement) => {
					opacityLevel = el;
					el.style.minWidth = "2.0em";
					el.style.textAlign = "right";
					el.innerText = " " + this.plugin.settings.vignetteOpacity.toString();
				});

// VIGNETTE SCALE SETTING
		let vignetteScaleNumber: HTMLDivElement;
		new Setting(containerEl)
			.setName('Vignette scale')
			.setDesc("How far the vignetting spreads. The higher the value the closer it is to the middle.")
			.addSlider((slider) => slider
				.setLimits(5,30,5)
				.setValue(this.plugin.settings.vignetteScale)
				.onChange(async (value) => {
					vignetteScaleNumber.innerText = " " + value.toString();
					this.plugin.settings.vignetteScale = value;
					await this.plugin.saveSettings();
				}))
				.settingEl.createDiv("", (el: HTMLDivElement) => {
					vignetteScaleNumber = el;
					el.style.minWidth = "2.0em";
					el.style.textAlign = "right";
					el.innerText = " " + this.plugin.settings.vignetteScale.toString();
				});

// CONTENT FADE-IN DURATION SETTING
		new Setting(containerEl)
			.setName('Fade-in duration')
			.setDesc('The duration (in seconds) of fade-in animation on entering Zen mode')
			.addText(text => text
				.setPlaceholder('1.2')
				.setValue(String(this.plugin.settings.animationDuration))
				.onChange(async (value) => {
					this.plugin.settings.animationDuration = Number(value);
					await this.plugin.saveSettings();
				}));

// SHOW HEADER TOGGLE SETTING
		new Setting(containerEl)
			.setName("Show header")
			.setDesc("Show the tab's header in Zen mode")
			.addToggle((toggle) =>	toggle
				.setValue(this.plugin.settings.showHeader)
				.onChange(async (value) => {
					this.plugin.settings.showHeader = value;
					await this.plugin.saveSettings();
			})
		);
// SHOW SCROLLBAR TOGGLE SETTING
		new Setting(containerEl)
			.setName("Show scrollbar")
			.setDesc("Show the scrollbar in Zen mode. If it is hidden, scrolling is still available with mousewheel, arrows, touchpad, etc.")
			.addToggle((toggle) =>	toggle
				.setValue(this.plugin.settings.showScroll)
				.onChange(async (value) => {
					this.plugin.settings.showScroll = value;
					await this.plugin.saveSettings();
			})
		);
	}

}
