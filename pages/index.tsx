import Head from 'next/head';

import IDE from '../components/ide';

const Index = () => (
  <>
    <Head>
      <title>Webgames IDE</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <IDE />
  </>
);

export default Index;