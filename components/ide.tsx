import React from 'react';

import Editor from './ide/editor';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';

const IDE = () => (
  <div className="flex flex-col h-screen w-screen">
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1 max-w-xs">
        <Objects className="flex-1" />
        <Assets className="flex-1" />
      </div>
      <Editor className="flex-1" />
    </div>
    <Console className="col-start-1 col-end-2 h-36 flex-none" />
  </div>
);

export default IDE;