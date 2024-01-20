import { useSupabase } from "@/contexts/supabase";
import { getURL } from "@/utils/url-utils";
import { Center, Flex } from "@chakra-ui/react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Head from "next/head";

const LoginPage = () => {
  const supabase = useSupabase();

  return (
    <>
      <Head>
        <title>ログイン</title>
      </Head>
      <Center as="main">
        <Flex flexDirection="column" margin={4} width="312px">
          <Auth
            supabaseClient={supabase}
            // providers={["github"]}
            redirectTo={`${getURL()}/auth/callback`}
            magicLink={true}
            appearance={{
              theme: ThemeSupa,
            }}
          />
        </Flex>
      </Center>
    </>
  );
};

export default LoginPage;
