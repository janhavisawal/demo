import Head from 'next/head';
import SINDAAssistant from '../components/SINDAAssistant';

export default function Home() {
  return (
    <>
      <Head>
        <title>SINDA Community Assistant</title>
        <meta name="description" content="Singapore Indian Development Association - AI-powered community support" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SINDAAssistant />
      </main>
    </>
  );
}
