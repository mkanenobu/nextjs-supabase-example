import { createServerClient } from "@/contexts/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content } = JSON.parse(req.body);
  const supabase = createServerClient({ req, res });
  const { error } = await supabase
    .from("posts")
    .insert({ title, content });

  if (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  } else {
    res.status(201).json({ ok: true });
  }
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return postHandler(req, res);
  }
  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
