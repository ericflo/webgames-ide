import { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { clearAssets, create, setup } from '../components/playercommon';

const Player = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [k, setK] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    const newK = create();
    newK.scene('tmpscene', () => {});
    newK.start('tmpscene');
    setK(newK);

    const consoleLog = console.log;
    console.log = function (...args: any[]) {
      consoleLog(...args);
      window.top.postMessage(
        { type: 'console.log', args: JSON.parse(JSON.stringify(args)) },
        '*'
      );
    };

    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'state.sceneData') {
        setSceneData(ev.data.data);
      } else if (ev.data.type === 'state.isPlaying') {
        setIsPlaying(ev.data.data);
      }
    });
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(setup.bind(null, k, sceneData, isPlaying), [
    k,
    sceneData,
    isPlaying,
  ]);

  /*
  const resizeHandler = useCallback(() => {
    // Remove prev stuff
    const cnv = document.getElementsByTagName('canvas')[0];
    if (cnv) {
      k?.destroyAll();
      cnv.parentElement.removeChild(cnv);
      clearAssets();
    }

    // Create next stuff
    const nextK = create();
    nextK.scene('tmpscene', () => {});
    nextK.start('tmpscene');
    setK(nextK);

    // Request fresh data after 1.5 seconds (why do we need this?)
    setTimeout(() => {
      window.top.postMessage({ type: 'request.state.sceneData' }, '*');
    }, 1500);
  }, [k]);

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);
  */

  return (
    <>
      <Head>
        <title>WebGame</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kaboomjs.com/lib/0.4.1/kaboom.js"></script>
      </Head>
    </>
  );
};

export default Player;
