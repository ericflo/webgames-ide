import React, { useState, useEffect } from 'react';

type Props = {
  className?: string;
};

const Editor = ({ className }: Props) => {
  const [srcDoc, setSrcDoc] = useState(null);
  useEffect(() => {
    setSrcDoc(`<!DOCTYPE html>
<html>
  <head>
    <title>WebGame</title>
    <meta charset="utf-8">
    <style>
    * {
      margin: 0;
    }
    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    canvas {
      display: block;
      position: absolute;
    }
    </style>
  </head>
  <body>
    <script src="https://kaboomjs.com/lib/0.1.0/kaboom.js"></script>
    <h1>Editor</h1>
  </body>
</html>`);
  });
  return <iframe className={className} srcDoc={srcDoc} />;
};

export default Editor;
