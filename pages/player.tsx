import { useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { create, setup } from '../components/playercommon';

const Player = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [k, setK] = useState(null);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    const newK = create();
    newK.scene('tmpscene', () => {});
    newK.start('tmpscene');
    setK(newK);

    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'state.sceneData') {
        setSceneData(ev.data.data);
      }
    });
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(setup.bind(null, k, sceneData, true), [k, sceneData]);

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
