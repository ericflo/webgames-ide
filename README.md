# [Webgames IDE](https://webgames-ide.hns.siasky.net/)

An [in-browser IDE](https://webgames-ide.hns.siasky.net/) to build Kaboom.js-based webgames that can take advantage of the Skynet data platform.

Example Game 1: [Roller Ball](https://siasky.net/GACr9xJDpyZQu7mQLg0eI7SoVP078KHjYt4Es_-mcs_CvA/)

Example Game 2: [Space Shooter](https://siasky.net/IACnlOugbhu5Xfq953P-TEcjyMU_GzwhWUpiWNb5P9ta8A/)


## Video Demo

[![Walkthrough Video](https://i.imgur.com/8LikgHS.png)](https://youtu.be/g6jRrBtVzI8)


## Integration with Content Record DAC

When users save a project for the first time:

    CREATE 'sia:AAZ0f...' {type: 'SavedGame', uri: 'https://...', prev: null}

When users save updates to a project:

    UPDATE 'sia:AAZ0f...' {action: 'updated', uri: 'https://...', next: 'sia:AAZ1f...'}
    CREATE 'sia:AAZ1f...' {type: 'SavedGame', uri: 'https://...', prev: 'sia:AAZ0f...'}

When users export a game from a project:

    UPDATE 'sia:AAZ1f...' {action: 'exported', uri: 'https://...', to: 'sia:AAZ2f...'}
    CREATE 'sia:AAZ2f...' {type: 'PublishedGame', uri: 'https://...', prev: 'sia:AAZ1f...'}

When a user plays an exported game:

    UPDATE 'sia:AAZ2f...' {action: 'play'}

When the user publishes a score in an exported game

    UPDATE 'sia:AAZ2f...' {action: 'score', score: 123456}


## Files maintained which may be useful

`${DATA_DOMAIN}/gameindex.json`
Format: `{gameslist: ["Game1.json", "Game2.json", ...]}`

    A list of game projects that the user has worked on. This populates the loading
    modal popup in the IDE.

    The path to the actual game JSON file in MySky is e.g. "${DATA_DOMAIN}/game/Game1.json"

`${DATA_DOMAIN}/scores.json`
Format: `{scores: [{score: 123, skylink: "EAB...tLw", ts: 1619686786000}, ...]}`

    A list of scores that this user has submitted to all games. This is filtered and
    sent to games in order to power their leaderboards.


### TODO

* Add support for per-object actions
* Add the ability to import a deployed Skynet project
* Fix the editor and player so that it works properly on browser resize
* Allow selection of game objects by clicking the editor window
* Add controls for dragging game objects around in the editor window
* Add controls for rotating game objects in the editor window