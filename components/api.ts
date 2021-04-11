import React, { useEffect, useState } from 'react';

import { MySky, SkynetClient } from 'skynet-js';

import { SceneData, makeDefaultSceneData } from './data';

const CLIENT = new SkynetClient('https://siasky.net/');
const DATA_DOMAIN = 'localhost';

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
    setCurrentSceneData: React.Dispatch<React.SetStateAction<SceneData>>
  ) {
    this.initialize = this.initialize.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadCurrentSceneData = this.loadCurrentSceneData.bind(this);
    this.saveCurrentSceneData = this.saveCurrentSceneData.bind(this);

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

  set currentSceneData(value: SceneData) {
    this._currentSceneData = value;
    this._setCurrentSceneData(value);
  }

  async initialize() {
    try {
      this.mySky = await CLIENT.loadMySky(DATA_DOMAIN);
      // await mySky.loadDacs(contentRecord);
      this.loggedIn = await this.mySky.checkLogin();
      if (this.loggedIn) {
        this.userId = await this.mySky.userID();
        this.currentSceneData = await this.loadCurrentSceneData();
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
        this.currentSceneData = await this.loadCurrentSceneData();
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
    await this.mySky.setJSON('currentSceneData.json', this.currentSceneData);
    console.log('Saved scene data', this.currentSceneData);
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
    setCurrentSceneData
  );
  useEffect(() => {
    api.initialize();
  }, []);
  return api;
}
