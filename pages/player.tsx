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

    const params = new URLSearchParams(window.location.search);
    // TODO: Why is this delay needed?
    setTimeout(() => {
      setSceneData(JSON.parse(decodeURIComponent(params.get('scenedata'))));
    }, 0);
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
