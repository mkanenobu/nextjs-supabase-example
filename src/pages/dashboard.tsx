import { useSupabase, useUser } from "@/contexts/supabase";
import type { Database } from "@/types/db-types";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  OrderedList,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type ServerSideProps = {
  posts: Array<{
    id: string;
    title: string;
    content: string;
  }>;
};

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <Box
      as="form"
      onSubmit={(e) => {
        e.preventDefault();

        return fetch("/api/posts", {
          method: "POST",
          body: JSON.stringify({
            title,
            content,
          }),
        }).then(async (res) => {
          const resBody = await res.json();
          console.log(resBody);
          if (resBody.ok) {
            setTitle("");
            setContent("");
            router.reload();
          }
        });
      }}
    >
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </FormControl>

      <Button marginTop={2} type="submit">
        Create!
      </Button>
    </Box>
  );
};

const DashboardPage = ({ posts }: ServerSideProps) => {
  const supabase = useSupabase();
  const user = useUser();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>ダッシュボード</title>
      </Head>
      <Box as="main" margin={2}>
        <Box>
          <Heading as="h2">Your Data</Heading>
          <Text>Your email is {user?.email}</Text>
          <Text>Your id is {user?.id}</Text>
        </Box>
        <Box marginTop={4}>
          <Heading as="h2">Posts</Heading>
          <Box>
            <Heading as="h3" marginTop={4} fontSize={24}>
              Create Post
            </Heading>
            <CreatePost />
          </Box>
          <Box marginTop={6}>
            <Heading as="h3" fontSize={24}>
              Your Posts
            </Heading>
            <OrderedList marginTop={2} padding={2}>
              {posts.map((post) => (
                <ListItem key={post.id}>
                  <Link href={`/dashboard/posts/${post.id}`}>{post.title}</Link>
                </ListItem>
              ))}
            </OrderedList>
            {posts.length === 0 && <Text>No Posts</Text>}
          </Box>
        </Box>
        <Button
          position="fixed"
          bottom={4}
          left={4}
          marginTop={4}
          onClick={() => {
            supabase.auth.signOut().then(() => {
              router.push("/login");
            });
          }}
        >
          SignOut
        </Button>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  ctx,
) => {
  const supabase = createPagesServerClient<Database>(ctx);
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user.id;
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId);

  return {
    props: {
      posts: data ?? [],
    },
  };
};

export default DashboardPage;
