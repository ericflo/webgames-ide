import { useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { create, setup } from '../components/playercommon';

const Player = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [k, setK] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
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

  return (
    <>
      <Head>
        <title>WebGame</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kaboomjs.com/lib/0.4.0/kaboom.js"></script>
      </Head>
    </>
  );
};

export default Player;
