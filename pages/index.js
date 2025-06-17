// pages/index.js
import Head from 'next/head';
import EnhancedSINDAAssistant from '../components/SINDAAssistant';

export default function Home() {
  return (
    <>
      <Head>
        <title>Enhanced SINDA Assistant</title>
        <meta name="description" content="AI-powered SINDA assistant with advanced analytics and security" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <EnhancedSINDAAssistant />
      </main>
    </>
  );
}
