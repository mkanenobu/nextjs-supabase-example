import { SupabaseProvider } from "@/contexts/supabase";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SupabaseProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SupabaseProvider>
  );
};

export default App;
