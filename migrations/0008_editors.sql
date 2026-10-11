create table if not exists editors (
  user_id text primary key,
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);
