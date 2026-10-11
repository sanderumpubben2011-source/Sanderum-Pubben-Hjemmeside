create table if not exists pub_site (
  id integer primary key default 1 check (id = 1),
  owner_id text,
  name text not null,
  tagline text not null,
  about text not null,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  facebook text not null default '',
  instagram text not null default '',
  hero_image text not null,
  logo_image text not null default '',
  backdrop text not null default '',
  theme text not null default 'papir' check (theme in ('papir', 'nat', 'filt')),
  hours_json text not null,
  hours_note text not null,
  prices_note text not null,
  prices_live boolean not null default false,
  calendar_live boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id serial primary key,
  title text not null,
  description text not null default '',
  event_date date not null,
  start_time text not null,
  end_time text not null default '',
  image text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists events_date_idx on events (event_date);

create table if not exists prices (
  id serial primary key,
  category text not null,
  name text not null,
  price_kr integer not null,
  note text not null default '',
  sort integer not null default 0
);

create table if not exists gallery (
  id serial primary key,
  kind text not null check (kind in ('image', 'video')),
  src text not null,
  caption text not null default '',
  sort integer not null default 0
);

insert into pub_site (
  id, owner_id, name, tagline, about, phone, email, address, city,
  facebook, instagram, hero_image, logo_image, backdrop, theme,
  hours_json, hours_note, prices_note, prices_live, calendar_live
) values (
  1,
  null,
  'Sanderum Pubben',
  'Lokalt værtshus på Sanderumvej. Billard, dart og plads til en fyraftensøl.',
  'Sanderum Pubben er stamstedet på Sanderumvej. Irene Lykke Christiansen har drevet huset siden marts 2011: et lokalt værtshus, hvor man kan få en øl, spille en omgang og blive siddende lidt længere end planlagt.

Der er billard, dart og rafle, og en terrasse når vejret er til det. Køkkenet er ligetil. Tarteletter, frikadeller og det, der står på kortet den dag.',
  '23 90 11 08',
  'kama@sanderumpubben.dk',
  'Sanderumvej 1',
  '5250 Odense SV',
  '',
  '',
  '/media/hero.jpg',
  '',
  '',
  'papir',
  '[{"day":"Mandag","open":"11:00","close":"20:00","closed":false},{"day":"Tirsdag","open":"11:00","close":"20:00","closed":false},{"day":"Onsdag","open":"11:00","close":"20:00","closed":false},{"day":"Torsdag","open":"11:00","close":"20:00","closed":false},{"day":"Fredag","open":"11:00","close":"21:00","closed":false},{"day":"Lørdag","open":"11:00","close":"21:00","closed":false},{"day":"Søndag","open":"11:00","close":"19:00","closed":false}]',
  'Åbningstiderne kan ændre sig på helligdage. Ring gerne, hvis du er i tvivl.',
  'Priserne fastsættes af huset.',
  false,
  false
);

insert into events (title, description, event_date, start_time, end_time, image) values
  ('Billardturnering', 'Tilmelding i baren. Vi spiller om en omgang og æren.', '2026-10-16', '19:00', '22:30', '/media/billard.jpg'),
  ('Hyggeaften', 'Ingen scene. Bare plads til at blive hængende, med musik i baggrunden.', '2026-10-17', '19:00', '23:00', '/media/terrasse.jpg'),
  ('Dartaften', '501 og en tavle. Nye spillere er velkomne.', '2026-10-22', '19:00', '22:00', '/media/dart.jpg'),
  ('Halloween på pubben', 'Kostume er frivilligt. Der er en lille præmie til aftenens bedste.', '2026-10-30', '19:00', '23:30', '/media/oel.jpg'),
  ('Frikadellesøndag', 'Frikadeller, kartofler og stuvet spidskål, så længe de rækker.', '2026-11-01', '12:00', '15:00', '/media/mad.jpg');

insert into prices (category, name, price_kr, note, sort) values
  ('Øl', 'Lille fadøl', 35, '', 10),
  ('Øl', 'Stor fadøl', 48, '', 20),
  ('Øl', 'Pilsner, flaske', 35, '', 30),
  ('Øl', 'Specialøl', 52, 'Spørg hvad der er på køl', 40),
  ('Spiritus', 'Snaps', 25, '', 50),
  ('Spiritus', 'Gammel Dansk', 30, '', 60),
  ('Spiritus', 'Gin og tonic', 70, '', 70),
  ('Spiritus', 'Husets whisky', 60, '', 80),
  ('Vin og vand', 'Husets vin', 48, 'Rød eller hvid', 90),
  ('Vin og vand', 'Sodavand', 25, '', 100),
  ('Vin og vand', 'Kaffe', 20, '', 110),
  ('Køkken', 'Tarteletter', 85, '', 120),
  ('Køkken', 'Frikadeller med tilbehør', 95, 'Med kartofler og stuvet spidskål', 130),
  ('Køkken', 'Pommes frites', 40, '', 140);

insert into gallery (kind, src, caption, sort) values
  ('image', '/media/billard.jpg', 'Billardbordet', 10),
  ('image', '/media/dart.jpg', 'Dart', 20),
  ('image', '/media/terrasse.jpg', 'Terrassen', 30),
  ('image', '/media/oel.jpg', 'Fadøl og en snaps', 40),
  ('image', '/media/mad.jpg', 'Frikadeller og tarteletter', 50),
  ('image', '/media/haner.jpg', 'Hanerne', 60),
  ('video', '/media/stemning.mp4', 'En stille aften i baren', 70);
