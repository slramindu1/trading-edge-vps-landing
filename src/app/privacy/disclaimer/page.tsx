// pages/disclaimer.js
import Head from "next/head";

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Disclaimer | Trading Edge</title>
        <meta
          name="description"
          content="Disclaimer for Trading Edge - Sri Lanka"
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: 11 May, 2025</p>

        <p className="mt-4">
          Disclaimer The information, tools, and educational content provided by
          Trading Edge are intended strictly for educational purposes and should
          not be interpreted as financial advice. Trading Edge is not a licensed
          financial advisor, and any decisions you make based on our content are
          made at your own risk. Trading in financial markets involves
          significant risk, and you should only trade with capital you can
          afford to lose. By accessing our services, website, or any associated
          materials, you acknowledge and agree to these terms in full. All
          content, including videos, written materials, and community resources,
          is the intellectual property of Trading Edge and may not be
          reproduced, distributed, or shared without explicit written consent.
        
        </p>
        <p className="mt-4">
          Trading in the financial markets carries a high level of risk and may
          not be suitable for all individuals. You alone are responsible for
          evaluating the risks involved and for any decisions you make based on
          the information provided by Trading Edge. Forex, futures, and other
          leveraged trading instruments involve substantial risk of loss, and
          you should never trade with funds you cannot afford to lose. The
          content shared through our platform whether educational, analytical,
          or opinion-based-does not constitute investment advice or financial
          recommendations. No guarantees are made regarding future performance,
          and past results of any strategy or system are not indicative of
          future outcomes. Trading Edge will not be held liable for any losses
          or damages arising from your use of our content or participation in
          our community.
        </p>
      </main>
    </>
  );
}
