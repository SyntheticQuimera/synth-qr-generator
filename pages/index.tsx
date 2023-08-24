import Head from "next/head";
import { Inter } from "next/font/google";
import { GenerateQR } from "@/components/GenerateQR";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>SynthQR</title>
        <meta name="description" content="Dynamic QR Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <GenerateQR />
      </main>
    </>
  );
}
