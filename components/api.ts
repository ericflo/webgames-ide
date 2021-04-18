import React, { useEffect, useState } from 'react';

import { MySky, SkynetClient } from 'skynet-js';

import { SceneData, makeDefaultSceneData } from './data';
import { isProd } from './buildconfig';

const CLIENT = new SkynetClient(isProd ? undefined : 'https://siasky.net/');
const DATA_DOMAIN = isProd ? 'webgames-ide' : 'localhost';

export class API {
  client = CLIENT;
  _initialized: boolean;
  _setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  _mySky: MySky;
  _setMySky: React.Dispatch<React.SetStateAction<MySky>>;
  _loggedIn: boolean;
  _setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  _userId: string;
  _setUserId: React.Dispatch<React.SetStateAction<string>>;
  _currentSceneData: SceneData;
  _setCurrentSceneData: React.Dispatch<React.SetStateAction<SceneData>>;
  _saving: boolean;
  _setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  _wantsSave: boolean;
  _setWantsSave: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    initialized: boolean,
    setInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    mySky: MySky,
    setMySky: React.Dispatch<React.SetStateAction<MySky>>,
    loggedIn: boolean,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    userId: string,
    setUserId: React.Dispatch<React.SetStateAction<string>>,
    currentSceneData: SceneData,
    setCurrentSceneData: React.Dispatch<React.SetStateAction<SceneData>>,
    saving: boolean,
    setSaving: React.Dispatch<React.SetStateAction<boolean>>,
    wantsSave: boolean,
    setWantsSave: React.Dispatch<React.SetStateAction<boolean>>
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
    this._loggedIn = loggedIn;
    this._setLoggedIn = setLoggedIn;
    this._userId = userId;
    this._setUserId = setUserId;
    this._currentSceneData = currentSceneData;
    this._setCurrentSceneData = setCurrentSceneData;
    this._saving = saving;
    this._setSaving = setSaving;
    this._wantsSave = wantsSave;
    this._setWantsSave = setWantsSave;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  set initialized(value: boolean) {
    this._initialized = value;
    this._setInitialized(value);
  }

  get mySky(): MySky {
    return this._mySky;
  }

  set mySky(value: MySky) {
    this._mySky = value;
    this._setMySky(value);
  }

  get loggedIn(): boolean {
    return this._loggedIn;
  }

  set loggedIn(value: boolean) {
    this._loggedIn = value;
    this._setLoggedIn(value);
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
    this._currentSceneData = callback(
      JSON.parse(JSON.stringify(this._currentSceneData))
    );
    this._setCurrentSceneData(callback);
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

  async initialize() {
    try {
      this.mySky = await CLIENT.loadMySky(
        DATA_DOMAIN,
        isProd ? { debug: true } : undefined
      );
      // await mySky.loadDacs(contentRecord);
      this.loggedIn = await this.mySky.checkLogin();
      if (this.loggedIn) {
        this.userId = await this.mySky.userID();
        const sceneData = await this.loadCurrentSceneData();
        this.setCurrentSceneData(
          (_: SceneData): SceneData => {
            return sceneData;
          }
        );
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
        this.setCurrentSceneData(
          (_: SceneData): SceneData => {
            return sceneData;
          }
        );
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
    const { data } = await this.mySky.getJSON('currentSceneData.json');
    if (data) {
      const sceneData = data as SceneData;
      if (sceneData) {
        console.log('Loaded scene data', sceneData);
        return sceneData;
      }
    }
    return makeDefaultSceneData();
  }

  async saveCurrentSceneData() {
    if (this.saving) {
      this.wantsSave = true;
    } else {
      //this.currentSceneData = this.currentSceneData; // Used to trigger graph update
      this.saving = true;
      await this.mySky.setJSON('currentSceneData.json', this.currentSceneData);
      this.saving = false;
      console.log('Saved scene data', this.currentSceneData);
      if (this.wantsSave) {
        this.wantsSave = false;
        this.saveCurrentSceneData();
      }
    }
  }
}

export function useAPI(): API {
  const [initialized, setInitialized] = useState(false);
  const [mySky, setMySky] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [currentSceneData, setCurrentSceneData] = useState(
    makeDefaultSceneData()
  );
  const [saving, setSaving] = useState(false);
  const [wantsSave, setWantsSave] = useState(false);
  const api = new API(
    initialized,
    setInitialized,
    mySky,
    setMySky,
    loggedIn,
    setLoggedIn,
    userId,
    setUserId,
    currentSceneData,
    setCurrentSceneData,
    saving,
    setSaving,
    wantsSave,
    setWantsSave
  );
  useEffect(() => {
    api.initialize();
  }, []);
  return api;
}
