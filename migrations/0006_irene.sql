update pub_site set
  phone = '66 17 25 37',
  prices_live = true,
  prices_note = $note$Husk: hver den 15. i måneden kl. 17 trækker vi lod blandt de brugte 10-turskort om 2 nye 10-turskort.
Vi har flere gode tilbud mandag–onsdag kl. 19–20 samt torsdag–lørdag kl. 19–21. Kom og se eller hør nærmere.$note$,
  about = $about$Håber, at vi mødes på Sanderum Pubben.

Hilsen Irene

Der er billard, dart og plads til at blive siddende. Kig forbi på Sanderumvej.$about$
where id = 1;

delete from prices;

insert into prices (category, name, price_kr, note, sort) values
  ('Priser og tilbud', 'Almindelig pilsner', 25, '', 10),
  ('Priser og tilbud', 'Luxus pilsner', 30, '', 20),
  ('Priser og tilbud', 'Vand', 25, '', 30),
  ('Priser og tilbud', 'Spiritus alm.', 25, '', 40),
  ('Priser og tilbud', 'Irsk kaffe', 45, 'eller 60 kr', 50),
  ('Priser og tilbud', '10 shots', 200, '', 60),
  ('Priser og tilbud', 'Ølkort', 230, 'Gælder alle drikkevarer, der normalt koster 25 kr.', 70);
