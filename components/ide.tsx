import React, { useState, useCallback } from 'react';

import { useDropzone, FileWithPath } from 'react-dropzone';

import { UploadRequestResponse } from 'skynet-js';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';
import { Scene, Asset, AssetType } from './data';
import { useAPI } from './api';

const IDE = () => {
  const api = useAPI();
  const scene = api.currentSceneData.scenes.find(
    (value: Scene): Boolean => {
      return value.name == api.currentSceneData.currentSceneName;
    }
  );
  const onSceneChanged = useCallback(
    (name: string) => {
      console.log('onSceneChanged', name);
      api.currentSceneData = {
        scenes: api.currentSceneData.scenes,
        currentSceneName: name,
      };
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
  const handleLogoutClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      api.logout();
    },
    [api]
  );
  const handleDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      acceptedFiles.forEach((acceptedFile: FileWithPath) => {
        let assetType: AssetType;
        if (
          acceptedFile.name.endsWith('.png') ||
          acceptedFile.name.endsWith('.jpg') ||
          acceptedFile.name.endsWith('.jpeg')
        ) {
          assetType = AssetType.Sprite;
        } else if (
          acceptedFile.name.endsWith('.wav') ||
          acceptedFile.name.endsWith('.ogg') ||
          acceptedFile.name.endsWith('.mp3')
        ) {
          assetType = AssetType.Sound;
        } else {
          return;
        }
        api.client
          .uploadFile(acceptedFile)
          .then((response: UploadRequestResponse) => {
            const asset: Asset = {
              name: acceptedFile.name,
              type: assetType,
              skylink: response.skylink,
            };
            const sd = api.currentSceneData;
            if (sd.assets) {
              sd.assets.push(asset);
            } else {
              sd.assets = [asset];
            }
            api.currentSceneData = sd;
            api.saveCurrentSceneData();
          });
      });
    },
    [api]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
  });
  return (
    <div className="flex flex-col h-screen w-screen" {...getRootProps()}>
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1 max-w-xs">
          <SceneChooser
            className="flex-none bg-purple-500"
            sceneNames={api.currentSceneData.scenes.map(
              (scene: Scene) => scene.name
            )}
            onChange={onSceneChanged}
          />
          <Objects className="flex-1 bg-yellow-500" scene={scene} api={api} />
          <Assets
            className="flex-1 bg-red-500 max-h-72"
            assets={api.currentSceneData.assets || []}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="loginbar bg-green-200">
            {api.loggedIn ? null : (
              <a href="#" onClick={handleLoginClick}>
                Log in
              </a>
            )}
            {api.loggedIn ? (
              <a href="#" onClick={handleLogoutClick}>
                Logout
              </a>
            ) : null}
          </div>
          <Editor className="flex-1 bg-blue-500" />
        </div>
      </div>
      <Console className="flex-none h-36 bg-green-500" />
      <input {...getInputProps()} />
    </div>
  );
};

export default IDE;
