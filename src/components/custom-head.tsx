/* eslint-disable @next/next/no-sync-scripts */
// components/CustomHead.tsx
import Head from 'next/head';

const CustomHead = () => (
  <Head>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
  </Head>
);

export default CustomHead;
