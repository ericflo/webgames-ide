import React from 'react';

import Editor from './ide/editor';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';

const IDE = () => (
  <>
    <Editor />
    <Objects />
    <Assets />
    <Console />
  </>
);

export default IDE;