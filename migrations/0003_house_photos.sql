update pub_site
set
  hero_image = '/media/facade.jpg',
  logo_image = '/media/logo.png',
  tagline = 'Gode øl, godt selskab og god stemning. Vi ses på Sanderumvej.'
where id = 1;

insert into gallery (kind, src, caption, sort)
values ('image', '/media/facade.jpg', 'Huset på Sanderumvej', 5);
