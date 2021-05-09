import React, { useCallback, useEffect, useState } from 'react';

import { MySky, SkynetClient } from 'skynet-js';
import { ContentRecordDAC } from '@skynetlabs/content-record-library';

import { SceneData, makeDefaultSceneData, Scene } from './data';
import { cleanPortalUrl, isProd } from './buildconfig';

const CLIENT = new SkynetClient(
  isProd ? undefined : /*'https://siasky.net/'*/ 'https://eu-ger-1.siasky.net/'
);
export const DATA_DOMAIN = isProd ? 'webgames-ide.hns' : 'localhost';

export class API {
  client = CLIENT;
  _initialized: boolean;
  _setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  _mySky: MySky;
  _setMySky: React.Dispatch<React.SetStateAction<MySky>>;
  _contentRecord: ContentRecordDAC;
  _setContentRecord: React.Dispatch<React.SetStateAction<ContentRecordDAC>>;
  _loggedIn: boolean;
  _setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  _currentFilename: string;
  _setCurrentFilename: React.Dispatch<React.SetStateAction<string>>;
  _userId: string;
  _setUserId: React.Dispatch<React.SetStateAction<string>>;
  _currentSceneData: SceneData;
  _setCurrentSceneData: React.Dispatch<React.SetStateAction<SceneData>>;
  _gamesList: string[];
  _setGamesList: React.Dispatch<React.SetStateAction<string[]>>;
  _saving: boolean;
  _setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  _wantsSave: boolean;
  _setWantsSave: React.Dispatch<React.SetStateAction<boolean>>;
  _loading: boolean;
  _setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    initialized: boolean,
    setInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    mySky: MySky,
    setMySky: React.Dispatch<React.SetStateAction<MySky>>,
    contentRecord: ContentRecordDAC,
    setContentRecord: React.Dispatch<React.SetStateAction<ContentRecordDAC>>,
    loggedIn: boolean,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    currentFilename: string,
    setCurrentFilename: React.Dispatch<React.SetStateAction<string>>,
    userId: string,
    setUserId: React.Dispatch<React.SetStateAction<string>>,
    currentSceneData: SceneData,
    setCurrentSceneData: React.Dispatch<React.SetStateAction<SceneData>>,
    gamesList: string[],
    setGamesList: React.Dispatch<React.SetStateAction<string[]>>,
    saving: boolean,
    setSaving: React.Dispatch<React.SetStateAction<boolean>>,
    wantsSave: boolean,
    setWantsSave: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.initialize = this.initialize.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadCurrentSceneData = this.loadCurrentSceneData.bind(this);
    this.saveCurrentSceneData = this.saveCurrentSceneData.bind(this);
    this.setCurrentSceneData = this.setCurrentSceneData.bind(this);

    this._initialized = initialized;
    this._setInitialized = setInitialized;
    this._mySky = mySky;
    this._setMySky = setMySky;
    this._contentRecord = contentRecord;
    this._setContentRecord = setContentRecord;
    this._loggedIn = loggedIn;
    this._setLoggedIn = setLoggedIn;
    this._currentFilename = currentFilename;
    this._setCurrentFilename = setCurrentFilename;
    this._userId = userId;
    this._setUserId = setUserId;
    this._currentSceneData = currentSceneData;
    this._setCurrentSceneData = setCurrentSceneData;
    this._gamesList = gamesList;
    this._setGamesList = setGamesList;
    this._saving = saving;
    this._setSaving = setSaving;
    this._wantsSave = wantsSave;
    this._setWantsSave = setWantsSave;
    this._loading = loading;
    this._setLoading = setLoading;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(value: boolean) {
    this._initialized = value;
    this._setInitialized(value);
  }

  get skynetClient(): SkynetClient {
    return CLIENT;
  }

  get mySky(): MySky {
    return this._mySky;
  }

  set mySky(value: MySky) {
    this._mySky = value;
    this._setMySky(value);
  }

  get contentRecord(): ContentRecordDAC {
    return this._contentRecord;
  }

  set contentRecord(value: ContentRecordDAC) {
    this._contentRecord = value;
    this._setContentRecord(value);
  }

  get loggedIn(): boolean {
    return this._loggedIn;
  }

  set loggedIn(value: boolean) {
    this._loggedIn = value;
    this._setLoggedIn(value);
  }

  get currentFilename(): string {
    return this._currentFilename;
  }

  set currentFilename(value: string) {
    this._currentFilename = value;
    this._setCurrentFilename(value);
    localStorage.setItem('latest-project-filename', value);
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
    this._setUserId(value);
  }

  get currentSceneData(): SceneData {
    return this._currentSceneData;
  }

  setCurrentSceneData(callback: (sceneData: SceneData) => SceneData) {
    const wrappedCallback = (sceneData: SceneData): SceneData => {
      return callback(JSON.parse(JSON.stringify(sceneData)));
    };
    this._currentSceneData = wrappedCallback(this._currentSceneData);
    this._setCurrentSceneData(wrappedCallback);
  }

  get gamesList(): string[] {
    return this._gamesList;
  }

  setGamesList(callback: (gamesList: string[]) => string[]) {
    const wrappedCallback = (gamesList: string[]): string[] => {
      return callback(JSON.parse(JSON.stringify(gamesList)));
    };
    this._gamesList = wrappedCallback(this._gamesList);
    this._setGamesList(wrappedCallback);
  }

  get saving(): boolean {
    return this._saving;
  }

  set saving(value: boolean) {
    this._saving = value;
    this._setSaving(value);
  }

  get wantsSave(): boolean {
    return this._wantsSave;
  }

  set wantsSave(value: boolean) {
    this._wantsSave = value;
    this._setWantsSave(value);
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    this._setLoading(value);
  }

  async initialize() {
    try {
      this.mySky = await CLIENT.loadMySky(DATA_DOMAIN);
      this.contentRecord = new ContentRecordDAC();
      await this.mySky.loadDacs(this.contentRecord);
      this.loggedIn = await this.mySky.checkLogin();
      if (this.loggedIn) {
        this.userId = await this.mySky.userID();
        const filename = localStorage.getItem('latest-project-filename');
        if (filename) {
          this.currentFilename = filename;
        }
        const sceneData = await this.loadCurrentSceneData();
        if (sceneData) {
          this.setCurrentSceneData(
            (_: SceneData): SceneData => {
              return sceneData;
            }
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.initialized = true;
  }

  async login() {
    try {
      this.loggedIn = await this.mySky.requestLoginAccess();
      if (this.loggedIn) {
        this.userId = await this.mySky.userID();
        const sceneData = await this.loadCurrentSceneData();
        if (sceneData) {
          this.setCurrentSceneData(
            (_: SceneData): SceneData => {
              return sceneData;
            }
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async logout() {
    this.loggedIn = false;
    this.userId = '';
    try {
      await this.mySky.logout();
    } catch (e) {
      console.error(e);
    }
  }

  async loadCurrentSceneData(): Promise<SceneData> {
    if (this.loading) {
      return;
    }
    if (!this.currentFilename) {
      console.log(
        'Could not load scene data because there was no filename to load'
      );
      return Promise.resolve(null);
    }
    console.log('Loading scene data...');
    this.loading = true;
    const { data } = await this.mySky.getJSON(
      `${DATA_DOMAIN}/games/${this.currentFilename}`
    );
    this.loading = false;
    if (data) {
      const sceneData = data as SceneData;
      if (sceneData) {
        return sceneData;
      }
    } else {
      console.log('Unable to load scene data');
    }
    return makeDefaultSceneData();
  }

  async saveCurrentSceneData(callsite: string) {
    const portalUrl = cleanPortalUrl(await CLIENT.portalUrl());

    if (this.saving) {
      this.wantsSave = true;
    } else {
      this.saving = true;

      // Make sure we have a clean copy and harcode saved scene name to 'main'
      const sceneData = JSON.parse(JSON.stringify(this.currentSceneData));
      sceneData.currentSceneName = 'main';

      console.log(
        `Saving scene data [${callsite}] to ${this.currentFilename}...`
      );
      const uri = `${DATA_DOMAIN}/games/${this.currentFilename}`;
      const prev = await this.mySky.getJSON(uri);
      const curr = await this.mySky.setJSON(uri, sceneData);
      console.log('Saved scene data');

      const metadata = {
        type: 'SavedGame',
        content: { link: portalUrl + curr.dataLink },
        uri: uri,
      };
      if (prev?.dataLink) {
        console.log(
          'Recording interaction with contentRecordDAC',
          prev.dataLink,
          '...'
        );
        const updateMeta = {
          action: 'Updated',
          content: { link: portalUrl + prev.dataLink },
          next: curr.dataLink,
          uri: uri,
        };
        console.log('Recording update interaction for previous', updateMeta);
        await this.contentRecord.recordInteraction({
          skylink: prev.dataLink,
          metadata: updateMeta,
        });
        console.log('Done.');
        metadata['prev'] = prev.dataLink;
      }
      console.log(
        'Recording new content with contentRecordDAC',
        curr.dataLink,
        metadata,
        '...'
      );
      await this.contentRecord.recordNewContent({
        skylink: curr.dataLink,
        metadata: metadata,
      });
      console.log('Done.');

      this.saving = false;

      if (this.wantsSave) {
        this.wantsSave = false;
        this.saveCurrentSceneData(callsite);
      }
    }
  }
}

export function useAPI(): API {
  const [initialized, setInitialized] = useState(false);
  const [mySky, setMySky] = useState(null);
  const [contentRecord, setContentRecord] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentFilename, setCurrentFilename] = useState('');
  const [userId, setUserId] = useState('');
  const [currentSceneData, setCurrentSceneData] = useState(
    makeDefaultSceneData()
  );
  const [gamesList, setGamesList] = useState([] as string[]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wantsSave, setWantsSave] = useState(false);
  const api = new API(
    initialized,
    setInitialized,
    mySky,
    setMySky,
    contentRecord,
    setContentRecord,
    loggedIn,
    setLoggedIn,
    currentFilename,
    setCurrentFilename,
    userId,
    setUserId,
    currentSceneData,
    setCurrentSceneData,
    gamesList,
    setGamesList,
    saving,
    setSaving,
    wantsSave,
    setWantsSave,
    loading,
    setLoading
  );
  useEffect(() => {
    api.initialize();
  }, []);

  const loadGames = useCallback(async (mySky: any): Promise<string[]> => {
    const resp = await mySky.getJSON(`${DATA_DOMAIN}/gameindex.json`);
    const games =
      resp && resp.data && resp.data.gameslist
        ? (resp.data.gameslist as string[])
        : [];
    return games;
  }, []);

  useEffect(() => {
    if (mySky) {
      loadGames(mySky).then(setGamesList);
    }
  }, [mySky]);

  const updateIndex = useCallback(
    async (mySky: any, currentFilename: string) => {
      if (!currentFilename) {
        return;
      }
      console.log(
        'Checking whether this project needs to be added to the index...'
      );
      const games = await loadGames(mySky);
      console.log('Current games list:', games);
      if (games.includes(currentFilename)) {
        console.log('...it does not.');
      } else {
        games.push(currentFilename);
        console.log(`Adding ${currentFilename} to the game index...`);
        await mySky.setJSON(`${DATA_DOMAIN}/gameindex.json`, {
          gameslist: games,
        });
        console.log('Done -- new games list:', games);
      }
      setGamesList(games);
    },
    []
  );

  useEffect(() => {
    if (mySky && currentFilename) {
      updateIndex(mySky, currentFilename);
    }
  }, [mySky, currentFilename, updateIndex]);

  return api;
}
