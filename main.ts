import { App, ItemView, Plugin, PluginSettingTab, Setting } from "obsidian";

interface PluginSettings {
	animationDuration: number,
	showHeader: boolean,
	showScroll: boolean,
	showGraphControls: boolean,
	vignetteOpacity: number,
	vignetteScaleLinear: number,
	vignetteScaleRadial: number
}

const DEFAULT_SETTINGS: PluginSettings = {
	animationDuration: 2,
	showHeader: false,
	showScroll: false,
	showGraphControls: false,
	vignetteOpacity: 0.75,
	vignetteScaleLinear: 20,
	vignetteScaleRadial: 75
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
		// Use ItemView for multiple view types (previously it was only MarkdownView)
		const leaf = this.app.workspace.getActiveViewOfType(ItemView).leaf;
		if (!leaf) return;
		// Don't trigger fullscreen mode when current leaf is empty.
		if(leaf.view.getViewType() === "empty") return;

		const containerEl = leaf.containerEl;
		const viewEl = leaf.view.contentEl
		const root = document.documentElement
				root.style.setProperty('--fadeIn-duration', this.settings.animationDuration + 's')
				root.style.setProperty('--vignette-opacity', this.settings.vignetteOpacity)
				root.style.setProperty('--vignette-scale-linear', this.settings.vignetteScaleLinear + '%')
				root.style.setProperty('--vignette-scale-radial', this.settings.vignetteScaleRadial + '%')
		const header = leaf.view.headerEl
		
		// I do this to graph controls (I mean multiple checks of the leaf type down below)
		// to get rid of console errors on adding/removing classes from when not in the graph view.
		// I think there is a better solution to this problem, probably, even with a single getViewType() check,
		// but I couldn't find it. If I'll have found it, I will include it in a future release.
		let graphControls;
		if (leaf.view.getViewType() === "graph") { graphControls = leaf.view.dataEngine.controlsEl}

		if (!document.fullscreenElement){
			containerEl.requestFullscreen();

			if (!this.settings.showScroll){
				viewEl.classList.add("noscroll")
			}

			viewEl.classList.add("animate")
			leaf.view.getViewType() === "graph" ? viewEl.classList.add("vignette-radial") : viewEl.classList.add("vignette-linear")
			if (leaf.view.getViewType() === "graph" && !this.settings.showGraphControls) { graphControls.classList.add("hide") }
			this.settings.showHeader ? header.classList.add("animate") : header.classList.add("hide")
		} else {
			document.exitFullscreen();

			viewEl.classList.remove("vignette-linear", "vignette-radial", "animate", "noscroll")
			header.classList.remove("animate", "hide")
			if (leaf.view.getViewType() === "graph") { graphControls.classList.remove("animate", "hide") }
		}
		
		containerEl.onfullscreenchange = () => {
			if (!document.fullscreenElement && (viewEl.classList.contains("vignette-linear") || viewEl.classList.contains("vignette-radial"))){
				viewEl.classList.remove("vignette-linear", "vignette-radial", "animate", "noscroll");
				header.classList.remove("animate", "hide");
				if (leaf.view.getViewType() === "graph") { graphControls.classList.remove("animate", "hide") }	
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

		this.containerEl.createEl("h3", {
			text: "Vignette",
		})

// VIGNETTE OPACITY SETTING
		let vignetteOpacityNumber: HTMLDivElement;
		new Setting(containerEl)
			.setName('Opacity')
			.setDesc("Intensity of vignette's dimming effect. Set to 0 to turn vignetting off.")
			.addSlider((slider) => slider
				.setLimits(0.00,1,0.01)
				.setValue(this.plugin.settings.vignetteOpacity)
				.onChange(async (value) => {
					vignetteOpacityNumber.innerText = " " + value.toString();
					this.plugin.settings.vignetteOpacity = value;
					await this.plugin.saveSettings();
				}))
				.settingEl.createDiv("", (el: HTMLDivElement) => {
					vignetteOpacityNumber = el;
					el.style.minWidth = "2.0em";
					el.style.textAlign = "right";
					el.innerText = " " + this.plugin.settings.vignetteOpacity.toString();
				});

// VIGNETTE SCALE LINEAR SETTING
		let vignetteScaleLinearNumber: HTMLDivElement;
		new Setting(containerEl)
			.setName('Scale in text views')
			.setDesc("Determines how close to the screen's center vignetting spreads from both sides of the screen, as linear gradients.")
			.addSlider((slider) => slider
				.setLimits(5,50,5)
				.setValue(this.plugin.settings.vignetteScaleLinear)
				.onChange(async (value) => {
					vignetteScaleLinearNumber.innerText = " " + value.toString();
					this.plugin.settings.vignetteScaleLinear = value;
					await this.plugin.saveSettings();
				}))
				.settingEl.createDiv("", (el: HTMLDivElement) => {
					vignetteScaleLinearNumber = el;
					el.style.minWidth = "2.0em";
					el.style.textAlign = "right";
					el.innerText = " " + this.plugin.settings.vignetteScaleLinear.toString();
				});
// VIGNETTE SCALE RADIAL SETTING
		let vignetteScaleRadialNumber: HTMLDivElement;
		new Setting(containerEl)
			.setName('Scale in graph view')
			.setDesc("Determines how close to the screen's center vignetting spreads from borders of the screen, as a radial gradient.")
			.addSlider((slider) => slider
				.setLimits(5,100,5)
				.setValue(this.plugin.settings.vignetteScaleRadial)
				.onChange(async (value) => {
					vignetteScaleRadialNumber.innerText = " " + value.toString();
					this.plugin.settings.vignetteScaleRadial = value;
					await this.plugin.saveSettings();
				}))
				.settingEl.createDiv("", (el: HTMLDivElement) => {
					vignetteScaleRadialNumber = el;
					el.style.minWidth = "2.0em";
					el.style.textAlign = "right";
					el.innerText = " " + this.plugin.settings.vignetteScaleRadial.toString();
				});

		this.containerEl.createEl("h3", {
			text: "Animation",
		})
// CONTENT FADE-IN DURATION SETTING
		new Setting(containerEl)
			.setName('Fade-in duration')
			.setDesc('The duration (in seconds) of fade-in animation on entering Zen mode')
			.addText(text => text
				.setPlaceholder('1.2')
				.setValue(String(this.plugin.settings.animationDuration))
				.onChange(async (value) => {
					this.plugin.settings.animationDuration = Number(value)
					await this.plugin.saveSettings();
				}));

		this.containerEl.createEl("h3", {
			text: "Element Toggles",
		})

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
// SHOW GRAPH CONTROLS SETTING
		new Setting(containerEl)
			.setName("Show graph controls")
			.setDesc("Show the graph view's controls in Zen mode")
			.addToggle((toggle) =>	toggle
				.setValue(this.plugin.settings.showGraphControls)
				.onChange(async (value) => {
					this.plugin.settings.showGraphControls = value;
					await this.plugin.saveSettings();
			})
		);
	}

}
