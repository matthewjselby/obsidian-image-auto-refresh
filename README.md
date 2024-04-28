# Image Auto Refresh Plugin for Obsidian

This plugin watches for changes to files in an Obsidian vault and forces a refresh for images that have been modified on disk. Without this plugin, changes to images that are edited outside of Obsidian do not show up until the tab is closed and re-opened, or some kind of force-refresh is performed.

# How does it work?

The plugin watches for changes to files using the vault API. Once a change is detected, the plugin queries the document for any `img` tags and increments the numerical query parameter appended to all images by obsidian. This forces a refresh of the image.

# Installation

This plugin will be submitted to the [official list](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json), and thus hopefully will be available for install from there shortly.

For manual installation, create a folder in `{your_vault_folder}/.obsidian/plugins` and add the `main.js`, `manifest.json`, and `styles.css` files from a release to the folder. Then enable the plugin in Obsidian preferences.

# Settings

The settings includes a list of file extensions to watch for changes. Changing these allows you to update image types with certain extensions, but not others.