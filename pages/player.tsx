import React, { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { create, setup } from '../components/playercommon';
import { useAPI } from '../components/api';
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Player = () => {
  const [barShowing, setBarShowing] = useState(true);
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [k, setK] = useState(null);
  const api = useAPI();
  const loggedIn = api.loggedIn;

  const handleLogoutClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      api.logout();
    },
    [api]
  );

  const handleLoginClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      api.login();
    },
    [api]
  );

  const handleCloseClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setBarShowing(false);
  }, []);

  const handleHomeClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    (window.top ? window.top : window).location.href =
      'https://webgames-ide.hns.siasky.net';
  }, []);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    const newK = create();
    newK.scene('tmpscene', () => {});
    newK.start('tmpscene');
    setK(newK);

    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'state.sceneData') {
        setSceneData(JSON.parse(window.atob(ev.data.data)));
      }
    });
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(setup.bind(null, k, sceneData, true), [k, sceneData]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const referrer = params.get('referrer');
    if (!referrer || !referrer.startsWith('http')) {
      return;
    }
    const skylink = referrer
      .split('/')
      .reverse()
      .filter((s) => s && s.length > 0)[0];
    if (!skylink) {
      return;
    }
    console.log('Recording play interaction...');
    api.contentRecord
      .recordInteraction({ skylink, metadata: { action: 'play' } })
      .then((dacResp) => {
        console.log('Recorded play interaction', dacResp);
      })
      .catch((err) => {
        console.log('Could not record play interaction:', err);
      });
  }, [loggedIn]);

  return (
    <>
      <Head>
        <title>WebGame</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kaboomjs.com/lib/0.4.1/kaboom.js"></script>
      </Head>
      {barShowing ? (
        <div className="absolute z-10 top-0 h-8 w-full px-4 flex place-items-center justify-between bg-white bg-opacity-50">
          <img
            className="h-6 cursor-pointer select-none"
            src="/built-with-skynet.png"
            alt="Built with skynet"
            onClick={handleHomeClick}
          />
          <div>
            <a
              href="#"
              className="mr-4 select-none"
              onClick={loggedIn ? handleLogoutClick : handleLoginClick}
            >
              {loggedIn ? 'Logout' : 'Login'}
            </a>
            {loggedIn ? (
              <FontAwesomeIcon
                className="cursor-pointer"
                onClick={handleCloseClick}
                icon={faTimes}
              />
            ) : null}
          </div>
        </div>
      ) : null}
      <canvas className="game absolute top-0 right-0 bottom-0 left-0" />
    </>
  );
};

export default Player;
