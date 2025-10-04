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
git clone https://github.com/elab-development/serverske-veb-tehnologije-2024-25-steh-2022-0051-pracenje-filmova.git movie-app

cd movie-app
```

Nakon toga, potrebno je instalirati dependency-je uz pomoc pnpm package managera.

```bash
pnpm i
```

Onda, popuniti .env fajlove u svakoj aplikaciji po uzoru na .env.sample

```shell
# apps/server/.env
NODE_ENV=development
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
DB_FILE_NAME=file:local.db
ETHEREAL_USERNAME=aaa@ethereal.email
ETHEREAL_PASSWORD=aaa
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=aaa@ethereal.email
SMTP_PASSWORD=aaa
CLIENT_URL=http://localhost:5173
```

```shell
# apps/web/.env
NODE_ENV=development
VITE_TMDB_API_KEY=your_api_key_here
CHOKIDAR_USEPOLLING=true
VITE_SERVER_BASE_URL=http://localhost:3000
VITE_WEB_BASE_URL=http://localhost:5173
```

Pokretanje dev servera se vrsi sledecim komandama (za pravilan rad aplikacije pokrenuti oba dev servera paralelno u dva razlicita terminala)

```bash
pnpm web dev
```

```bash
pnpm backend dev
```

## Build-ovanje aplikacije

Pre svega treba dodati `.env` fajl kao i za dev server, a nakon toga pokrenuti komandu

```bash
pnpm -r build
```

Build outputi ce biti u `dist` folderima. Serve-ovanje output-a se moze postici uz pomoc sledece komande

```bash
# Za client
pnpm web preview
```

```bash
# Za server
pnpm backend start
```

## Autori

- Aleksa Savic
- Milos Kostic
- Nemanja Jovanovic
