// pages/index.js
import Head from 'next/head';
import EnhancedSINDAAssistant from '../components/SINDAAssistant';

export default function Home() {
  return (
    <>
      <Head>
        <title>SINDA Assistant</title>
        <meta name="description" content="AI-powered SINDA assistant with emotional wellness support and programs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <EnhancedSINDAAssistant />
      </main>
    </>
  );
}
