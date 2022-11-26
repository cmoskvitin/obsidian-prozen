# ProZen Plugin for Obsidian

The true 'Zen' (fullscreen) mode for Obsidian.

## Description

ProZen not just simply turns your active tab fullscreen - it removes every single distraction. All panels, icons, even scrollbar is gone in Zen mode. And for those who like **extra** concentration on writing or reading, ProZen can dim the sides of the screen, like a vignette.

![prozen](https://user-images.githubusercontent.com/69085343/203395343-b1b35200-662d-48f3-b400-3a99fccce915.gif)
*The gradient is much smoother than on the gif*.

## Usage
### Manual Installation
Hopefully, this plugin will make it to [Obsidian's plugin gallery](https://obsidian.md/plugins), until then, you can install it manually:
1. Download the `main.js`, `styles.css` and `manifest.json` files.
2. Go to the `/.obsidian/plugins` folder of your Obsidian vault. Create `/obsidian-prozen` in there.
3. Put the downloaded files into the `/obsidian-prozen` folder.
4. Restart Obsidian.
5. Open Obsidian's settings and find ProZen among Community plugins. Enable the plugin, set a hotkey for toggling Zen mode and tweak the plugin's settings to your liking.

### Plugin Settings
#### Vignette
Dims the sides of the screen gradually, drawing your attention to the text in the middle. Especially effective in the dark room with a dark Obsidian theme. The gradient starts from full transparent to black from the text to the sides. 
- **Opacity**: makes the dimming effect softer or darker. 0 turns off the vignette.
- **Scale**: determines how much of the screen space is dimmed.
#### Animations
- **Fade-in duration**: the duration of the content fade-in animation when entering Zen mode. Just my personal thing. With this animation (I set it to two seconds), the document draws more of my attention and sets me to a productive and inspired mood. 0 turns off the animation.
#### Toggles
Various toggles for showing/hiding view's elements in Zen mode:
- Scrollbar
- Header
- Graph controls in graph view
#### Other settings (Misc)
- **Force content centering**: There's a toggle in the _Editor_ section Obsidian's settings called _Readable line width_. When it's toggled off, text content takes all the page's width available. _Force content centering_ makes the text centered in Zen mode ignoring this global setting. 


## Known Issues
- When cycling through panes with `Ctrl-Tab` or switching to graph view with `Ctrl-G`, Zen mode styling turns off for all the tabs, but stays on the tab, for which Zen mode was initially triggered. In one of the future releases, I would like to make jumping to tabs possible while staying in Zen mode.    

## About me
My name (last name) is Moskvitin, I am an amateur self-taught JS developer, taking coding as a hobby. I hope, someday, I will be skilled enough to turn this hobby into a full-time job. I realize that experienced developers may find my code sloppy and sub-optimal, but I take my pet projects seriously, hunt for perfection in tiny things and try my best to fix the issues I can fix being at this skill level.
IRL I'm a tech writer for a company, which develops some sophisticated stuff, and describing this stuff requires full concentration on fine wording. So, ProZen is what I made for myself to use on daily basis.

I really appreciate any [feedback and feature requests](https://github.com/cmoskvitin/obsidian-prozen/discussions) on GitHub. You can also...
[<img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=moskvitin&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" alt="BuyMeACoffee" width="200">](https://www.buymeacoffee.com/moskvitin)
:)

Have fun using ProZen! :)