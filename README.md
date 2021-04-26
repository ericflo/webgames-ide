# [Webgames IDE](https://webgames-ide.hns.siasky.net/)

An [in-browser IDE](https://webgames-ide.hns.siasky.net/) to build Kaboom.js-based webgames that can take advantage of the Skynet data platform.

Example Game: [Roller Ball](https://siasky.net/EADnbyTecWqMQHGHV4kNGmx1r_45So4twRTu8gCWMTiGLg/)

## Integration with Content Record DAC

When users save a project for the first time:

    CREATE 'sia:AAZ0f...' {type: 'SavedGame', uri: 'https://...', prev: null}

When users save updates to a project:

    UPDATE 'sia:AAZ0f...' {action: 'updated', uri: 'https://...', next: 'sia:AAZ1f...'}
    CREATE 'sia:AAZ1f...' {type: 'SavedGame', uri: 'https://...', prev: 'sia:AAZ0f...'}

When users export from a project:

    UPDATE 'sia:AAZ1f...' {action: 'exported', uri: 'https://...', to: 'sia:AAZ2f...'}
    CREATE 'sia:AAZ2f...' {type: 'PublishedGame', uri: 'https://...', prev: 'sia:AAZ1f...'}


### TODO

* Add support for per-object actions
* Add the ability to import a deployed Skynet project
* Fix the editor and player so that it works properly on browser resize
* Allow selection of game objects by clicking the editor window
* Add controls for dragging game objects around in the editor window
* Add controls for rotating game objects in the editor window