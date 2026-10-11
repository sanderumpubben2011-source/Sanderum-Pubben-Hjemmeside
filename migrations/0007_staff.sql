create table if not exists staff (
  id integer generated always as identity primary key,
  name text not null,
  role text not null,
  email text not null default '',
  phone text not null default '',
  image text not null default '',
  sort integer not null default 0
);

insert into staff (name, role, sort)
select 'Irene', 'Ejer', 10
where not exists (select 1 from staff);
