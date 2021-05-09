import React, { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData, { GameScore } from '../components/data';
import { create, setup } from '../components/playercommon';
import { DATA_DOMAIN, useAPI } from '../components/api';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cleanPortalUrl } from '../components/buildconfig';

const Player = () => {
  const [barShowing, setBarShowing] = useState(true);
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [latestScore, setLatestScore] = useState(-1);
  const [k, setK] = useState(null);
  const api = useAPI();
  const [portalUrl, setPortalUrl] = useState(null as string);
  const loggedIn = api.loggedIn;

  useEffect(() => {
    api.skynetClient.portalUrl().then((nextPortalUrl: string) => {
      nextPortalUrl = cleanPortalUrl(nextPortalUrl);
      console.log('Portal URL:', nextPortalUrl);
      setPortalUrl(nextPortalUrl);
    });
  }, []);

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

  const handleHomeClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      (window.top ? window.top : window).location.href = portalUrl.replace(
        'https://',
        `https://${DATA_DOMAIN}.`
      );
    },
    [portalUrl]
  );

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    const newK = create(setLatestScore);
    newK.scene('tmpscene', () => {});
    newK.start('tmpscene');
    setK(newK);

    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'state.sceneData') {
        setSceneData(JSON.parse(window.atob(ev.data.data)));
      } else if (ev.data.type === 'state.submitScore' && ev.data.score) {
        setLatestScore(ev.data.score);
      }
    });
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(() => {
    const skylink = getSkylinkReferrer();
    if (api && api.mySky && k && skylink && portalUrl) {
      k.ext.mySky = api.mySky;
      k.ext.skynetClient = api.skynetClient;
      k.ext.skylink = skylink;
      k.ext.portalUrl = portalUrl;
    }
  }, [api, k, portalUrl]);

  useEffect(() => {
    if (!loggedIn || !api || !portalUrl || latestScore < 0) {
      return;
    }
    const skylink = getSkylinkReferrer();
    if (!skylink) {
      return;
    }
    api.mySky.getJSON(`${DATA_DOMAIN}/scores.json`).then((resp) => {
      const scores: GameScore[] =
        resp && resp.data && resp.data.scores
          ? (resp.data.scores as any[])
          : [];
      scores.push({ score: latestScore, skylink, ts: new Date().getTime() });
      console.log('Score count: ', scores.length);
      return api.mySky.setJSON(`${DATA_DOMAIN}/scores.json`, { scores });
    });
    console.log(`Recording score interaction (${latestScore})...`);
    const metadata = {
      action: 'Score',
      content: { link: portalUrl + skylink },
      score: latestScore,
    };
    api.contentRecord
      .recordInteraction({ skylink, metadata })
      .then((dacResp) => {
        console.log('Recorded score interaction', metadata, 'resp:', dacResp);
      })
      .catch((err) => {
        console.log('Could not record score interaction:', err);
      });
  }, [loggedIn, api, latestScore, portalUrl]);

  useEffect(() => {
    if (portalUrl) {
      setup(k, sceneData, true, -1, null, null);
    }
  }, [k, sceneData, portalUrl]);

  useEffect(() => {
    if (!loggedIn || !portalUrl) {
      return;
    }
    const skylink = getSkylinkReferrer();
    if (!skylink) {
      return;
    }
    console.log('Recording play interaction...');
    const metadata = {
      action: 'Play',
      content: { link: portalUrl + skylink },
    };
    api.contentRecord
      .recordInteraction({ skylink, metadata })
      .then((dacResp) => {
        console.log('Recorded play interaction', metadata, 'resp:', dacResp);
      })
      .catch((err) => {
        console.log('Could not record play interaction:', err);
      });
  }, [loggedIn, portalUrl]);

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

function getSkylinkReferrer(): string {
  const params = new URLSearchParams(window.location.search);
  const referrer = params.get('referrer');
  if (!referrer || !referrer.startsWith('http')) {
    return;
  }
  const skylink = referrer
    .split('/')
    .reverse()
    .filter((s) => s && s.length > 0)[0];
  return skylink;
}

export default Player;
