import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
faConfig.autoAddCss = false;

import type { AppProps } from 'next/app';

function WebgamesIDE({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default WebgamesIDE;