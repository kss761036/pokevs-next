import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="author" content="김승석" />
        <meta
          name="keywords"
          content="포켓몬, 포켓몬 대결, 포켓몬 AI, 포켓몬 시뮬레이터, 포켓몬 승부 예측"
        />
        <meta
          name="description"
          content="포켓몬 두 마리를 드래그해서 AI가 승자를 예측해주는 대결 시뮬레이터입니다."
        />
        <meta property="og:title" content="포켓몬 AI 대결 시뮬레이터" />
        <meta
          property="og:description"
          content="포켓몬 두 마리를 드래그해서 AI가 승자를 예측해주는 대결 시뮬레이터입니다."
        />
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:url" content="https://pokevs.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
