import React, { useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData from '../components/data';
import { create, setup } from '../components/playercommon';
import { useAPI } from '../components/api';
import { cleanPortalUrl } from '../components/buildconfig';

const Player = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(-1);
  const [latestScore, setLatestScore] = useState(-1);
  const [k, setK] = useState(null);
  const api = useAPI();
  const [portalUrl, setPortalUrl] = useState(null as string);
  const [camConfig, setCamConfig] = useState(
    null as { x: number; y: number; scale: number }
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [objectOffset, setObjectOffset] = useState({ x: 0, y: 0 });

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
        if (ev.data.data) {
          setCamConfig({
            x: window.innerWidth * 0.5,
            y: window.innerHeight * 0.5,
            scale: 1,
          });
        } else {
          setLatestScore(-1);
        }
      } else if (ev.data.type === 'state.currentObjectIndex') {
        setCurrentObjectIndex(ev.data.data);
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

  useEffect(() => {
    api.skynetClient.portalUrl().then((nextPortalUrl: string) => {
      nextPortalUrl = cleanPortalUrl(nextPortalUrl);
      console.log('Portal URL:', nextPortalUrl);
      setPortalUrl(nextPortalUrl);
    });
  }, []);

  useEffect(() => {
    if (k && portalUrl) {
      //k.ext.mySky = api.mySky;
      //k.ext.skynetClient = api.skynetClient;
      //k.ext.skylink = '';
      k.ext.portalUrl = portalUrl;
    }
  }, [k, portalUrl]);

  useEffect(() => {
    if (portalUrl) {
      setup(
        k,
        sceneData,
        isPlaying,
        currentObjectIndex,
        objectOffset,
        camConfig
      );
    }
  }, [
    k,
    sceneData,
    isPlaying,
    currentObjectIndex,
    objectOffset,
    camConfig,
    portalUrl,
  ]);

  useEffect(() => {
    if (!k || isPlaying) {
      return;
    }

    const data = {
      clicked: -1,
      metaPressed: false,
      prevPos: k.vec2(0, 0),
      camScale: 1,
      camPos: k.vec2(window.innerWidth * 0.5, window.innerHeight * 0.5),
    };

    const invCamScale = 1.0 / data.camScale;

    const handleMouseDown = (ev: MouseEvent) => {
      data.clicked = ev.button;
      data.prevPos = k.mousePos();
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (data.clicked < 0) {
        return;
      }
      const isCamMove = data.clicked === 2 || data.metaPressed;
      const isObjectMove = data.clicked === 0;
      if (isCamMove) {
        data.camPos = data.camPos
          .clone()
          .sub(k.mousePos().sub(data.prevPos).scale(invCamScale));
        setCamConfig((cc) => {
          if (cc) {
            cc = JSON.parse(JSON.stringify(cc));
            cc.x = data.camPos.x;
            cc.y = data.camPos.y;
            return cc;
          }
          return { x: data.camPos.x, y: data.camPos.y, scale: data.camScale };
        });
      } else if (isObjectMove) {
        const offset = k.mousePos().sub(data.prevPos).scale(invCamScale);
        setObjectOffset((totalOffset) => {
          return { x: totalOffset.x + offset.x, y: totalOffset.y + offset.y };
        });
        setSceneData((sd) => JSON.parse(JSON.stringify(sd)));
      }
      data.prevPos = k.mousePos();
    };

    const handleMouseUp = (ev: MouseEvent) => {
      data.clicked = -1;
      setObjectOffset((prevOffset) => {
        if (prevOffset.x != 0 || prevOffset.y != 0) {
          const msg = {
            type: 'state.currentObject.pos',
            x: prevOffset.x,
            y: prevOffset.y,
          };
          window.top.postMessage(msg, '*');
        }
        return { x: 0, y: 0 };
      });
    };

    const handleWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      data.camScale += ev.deltaY * 0.001;
      data.camScale = Math.max(Math.min(data.camScale, 10), 0.01);
      setCamConfig((cc) => {
        if (cc) {
          cc = JSON.parse(JSON.stringify(cc));
          cc.scale = data.camScale;
          return cc;
        }
        return { x: data.camPos.x, y: data.camPos.y, scale: data.camScale };
      });
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === 'meta') {
        data.metaPressed = true;
      }
    };

    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === 'meta') {
        data.metaPressed = false;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [k, isPlaying]);

  return (
    <>
      <Head>
        <title>WebGame</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kaboomjs.com/lib/0.4.1/kaboom.js"></script>
      </Head>
      <canvas className="game absolute" />
    </>
  );
};

export default Player;
