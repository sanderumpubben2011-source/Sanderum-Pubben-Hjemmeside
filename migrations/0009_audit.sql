create table if not exists audit_log (
  id serial primary key,
  user_id text not null,
  user_name text not null,
  area text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_idx on audit_log (created_at desc);
