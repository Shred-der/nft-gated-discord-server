import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MeshProvider>
  );
}

export default MyApp;
