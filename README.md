# [Webgames IDE](https://webgames-ide.hns.siasky.net/)

An [in-browser IDE](https://webgames-ide.hns.siasky.net/) to build Kaboom.js-based webgames that can take advantage of the Skynet data platform.

Example Game 1: [Roller Ball](https://siasky.net/GACADBuV6Wq_QCVVaKgFPS17WSQ26ZR8bz2FA6CYRgiKaQ/)

Example Game 2: [Space Shooter](https://siasky.net/IABCP7N7yCe75SYfEZrWg6hC76H4ZboFfeo0SWN67_BqPA/)


## Video Demo

[![Walkthrough Video](https://i.imgur.com/8LikgHS.png)](https://youtu.be/g6jRrBtVzI8)


## Integration with Content Record DAC

When users save a project for the first time:

    CREATE 'sia:AAZ0f...' {type: 'SavedGame', content: {link: 'https://siasky.net/AAZ0f...'}, uri: 'https://...', prev: null}

When users save updates to a project:

    INTERACTION 'sia:AAZ0f...' {action: 'Updated', content: {link: 'https://siasky.net/AAZ0f...'}, uri: 'https://...', next: 'sia:AAZ1f...'}
    CREATE 'sia:AAZ1f...' {type: 'SavedGame', content: {link: 'https://siasky.net/AAZ1f...'}, uri: 'https://...', prev: 'sia:AAZ0f...'}

When users export a game from a project:

    INTERACTION 'sia:AAZ1f...' {action: 'Exported', content: {link: 'https://siasky.net/AAZ1f...'}, uri: 'https://...', to: 'sia:AAZ2f...'}
    CREATE 'sia:AAZ2f...' {type: 'PublishedGame', content: {link: 'https://siasky.net/AAZ2f...'}, uri: 'https://...', prev: 'sia:AAZ1f...'}

When a user plays an exported game:

    INTERACTION 'sia:AAZ2f...' {action: 'Play', content: {link: 'https://siasky.net/AAZ2f...'}}

When the user publishes a score in an exported game

    INTERACTION 'sia:AAZ2f...' {action: 'Score', score: 123456, content: {link: 'https://siasky.net/AAZ2f...'}}


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

* Add the ability to import a deployed Skynet project
* Fix the editor and player so that it works properly on browser resize
* Allow selection of game objects by clicking in the editor window
* Add scroll/rotate tools to the editor in addition to the current move tool
