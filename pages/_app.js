// pages/_app.js
import '../styles/globals.css'; // ✅ Correct path based on your folder structure

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
