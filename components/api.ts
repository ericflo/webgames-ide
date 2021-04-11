import React, { useEffect, useState } from 'react';

import { MySky, SkynetClient } from 'skynet-js';

const CLIENT = new SkynetClient('https://siasky.net/');
const DATA_DOMAIN = 'localhost';

export class API {
  _initialized: boolean;
  _setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  _mySky: MySky;
  _setMySky: React.Dispatch<React.SetStateAction<MySky>>;
  _loggedIn: boolean;
  _setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  _userId: string;
  _setUserId: React.Dispatch<React.SetStateAction<string>>;

  constructor(
    initialized: boolean,
    setInitialized: React.Dispatch<React.SetStateAction<boolean>>,
    mySky: MySky,
    setMySky: React.Dispatch<React.SetStateAction<MySky>>,
    loggedIn: boolean,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    userId: string,
    setUserId: React.Dispatch<React.SetStateAction<string>>
  ) {
    this.initialize = this.initialize.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this._initialized = initialized;
    this._setInitialized = setInitialized;
    this._mySky = mySky;
    this._setMySky = setMySky;
    this._loggedIn = loggedIn;
    this._setLoggedIn = setLoggedIn;
    this._userId = userId;
    this._setUserId = setUserId;
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

  async initialize() {
    try {
      this.mySky = await CLIENT.loadMySky(DATA_DOMAIN);
      // await mySky.loadDacs(contentRecord);
      this.loggedIn = await this.mySky.checkLogin();
      if (this.loggedIn) {
        this.userId = await this.mySky.userID();
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
}

export function useAPI(): API {
  const [initialized, setInitialized] = useState(false);
  const [mySky, setMySky] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const api = new API(
    initialized,
    setInitialized,
    mySky,
    setMySky,
    loggedIn,
    setLoggedIn,
    userId,
    setUserId
  );
  useEffect(() => {
    api.initialize();
  }, []);
  return api;
}
