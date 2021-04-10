import Head from 'next/head';

import Testing123 from '../components/testing123';

export default function Index() {
  return (
    <div>
      <Head>
        <title>Webgames IDE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Testing123 />
      </main>
    </div>
  );
}