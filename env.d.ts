declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string;
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      }
    }
  }
}
