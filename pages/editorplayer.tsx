import React, { useCallback, useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { clearAssets, create, setup } from '../components/playercommon';

const Player = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [latestScore, setLatestScore] = useState(-1);
  const [k, setK] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    const newK = create(setLatestScore);
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
        if (!ev.data.data) {
          setLatestScore(-1);
        }
      }
    });
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(() => {
    if (latestScore >= 0) {
      console.log(
        `This is where we would record a score interaction (${latestScore}).`
      );
    }
  }, [latestScore]);

  useEffect(setup.bind(null, k, sceneData, isPlaying), [
    k,
    sceneData,
    isPlaying,
  ]);

  useEffect(() => {
    if (!k) {
      return;
    }
    const data = {
      clicked: false,
      startPos: k.vec2(0, 0),
      camScale: 1,
      camPos: k.vec2(window.innerWidth * 0.5, window.innerHeight * 0.5),
    };
    const handleMouseDown = (ev: MouseEvent) => {
      //if (ev.button != 2) {
      //  return;
      //}
      data.clicked = true;
      data.startPos = k.mousePos();
    };
    const handleMouseMove = (ev: MouseEvent) => {
      if (!data.clicked) {
        return;
      }
      const pos = data.camPos.clone().sub(k.mousePos().sub(data.startPos));
      k.camPos(pos);
    };
    const handleMouseUp = (ev: MouseEvent) => {
      //if (ev.button != 2) {
      //  return;
      //}
      data.clicked = false;
      data.camPos = data.camPos.clone().sub(k.mousePos().sub(data.startPos));
    };
    const handleWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      data.camScale += Math.max(ev.deltaY, ev.deltaX) * 0.01;
      k.camScale(data.camScale);
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [k]);

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
      <canvas className="game absolute top-0 right-0 bottom-0 left-0" />
    </>
  );
};

export default Player;
