create table
  public.posts (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null default auth.uid (),
    title character varying not null,
    content text not null,
    created_at timestamp with time zone not null default now(),
    constraint posts_pkey primary key (id)
  ) tablespace pg_default;
