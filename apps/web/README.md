# Movie App

Movie App je web aplikacija za pracenje filmova i serija koristeci
[TMDB](https://www.themoviedb.org) API za podatke.

Aplikacija sadrzi posebne stranice za zanrove filmova/serija, za odredjene predefinisane filtere poput "Upcoming movies", kao i posebne Discover stranice za filmove i serije na kojima se pretrazuje preko filtera.
U slucaju da korisnik vec zna koje podatke zeli da vidi, moze da search-uje pomocu search bar-a na navigacionoj traci.

Podacima svakog filma ili serije se moze pristupiti klikom na naslov ili poster.

Korisnici su u mogucnosti da sacuvaju filmove i serije u svoj watchlist i da posle taj watchlist dele sa svojim prijateljima ili obrnuto, da importuju watchlist od svojih prijatelja.

## Pokretanje dev servera na lokalnoj masini

Prvi korak je kloniranje projekta

```bash
git clone https://github.com/elab-development/klijentske-veb-tehnologije-2024-2022-0051-pracenje-filmova-i-serija.git movie-app

cd movie-app
```

Nakon toga, potrebno je instalirati dependency-je uz pomoc nekog package managera.

```bash
pnpm i
```

```bash
# Obavezno koristiti --force flag zbog @testing-library/react-hooks, posto koristimo verziju React-a noviju od 17.0.0
npm i --force
```

Onda, napraviti fajl `.env` i u njega upisati API key sa [TMDB-a](https://www.themoviedb.org)

```shell
# .env
VITE_TMDB_API_KEY=tmdb_api_key
```

Pokretanje dev servera se vrsi sledecom komandom

```bash
pnpm dev
```

## Build-ovanje aplikacije

Pre svega treba dodati `.env` fajl kao i za dev server, a nakon toga pokrenuti komandu

```bash
pnpm build
```

Build output ce biti u `dist` folderu. Serve-ovanje output-a se moze postici uz pomoc sledece komande

```bash
pnpm preview
```

Ukoliko nas zanimaju svi paketi korisceni u aplikaciji, mozemo otvoriti `stats.html` u kom se nalaze razni podaci o bundle size-u uz pomoc paketa `rollup-plugin-visualizer`.

## Autori

- Aleksa Savic
- Milos Kostic
- Nemanja Jovanovic
