import type { Database } from "@/types/db-types";
import { Box, Heading, Text } from "@chakra-ui/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { type GetServerSideProps } from "next";

type ServerSideProps = {
  post: {
    id: string;
    title: string;
    content: string;
  };
};

const PostPage = ({ post }: ServerSideProps) => {
  return (
    <Box as="main" margin={4}>
      <Heading>Post</Heading>
      <Box marginTop={2}>
        <Heading as="h2" fontSize={24}>
          Title: {post.title}
        </Heading>
        <Heading as="h3" fontSize={18} marginTop={2}>
          Content:
        </Heading>
        <Text whiteSpace="pre-wrap">{post.content}</Text>
      </Box>
    </Box>
  );
};

export default PostPage;

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

  const postId = ctx.params?.postId as string;

  const post = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("user_id", userId)
    .then((res) => res.data?.at(0));

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
