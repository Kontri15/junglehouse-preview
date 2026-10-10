# Jungle House Tattoo Studio – web

Jednostránkový statický web (HTML + CSS + JS, žiadny build). Celý priečinok `web/` sa dá nahrať na akýkoľvek hosting (Webglobe, Websupport, Netlify, Vercel, GitHub Pages...).

## Štruktúra

- `index.html` – celá stránka (hero, O nás, Tatéri, FAQ, Kontakt + formulár, mapa)
- `dakujeme.html` – ďakovacia stránka po odoslaní formulára
- `ochrana-osobnych-udajov.html` – zásady ochrany osobných údajov
- `styles.css`, `script.js`
- `assets/` – optimalizované fotky, fonty (self-hosted Anton + Montserrat), logo, ikony

## Stav

1. **Formulár** – `odoslat.php` pošle dopyt aj s fotkami na `junglehouse.tattoo@gmail.com` cez `mail()` hostingu. Odosielateľ je schránka **web@junglehouse.sk** (na Websupporte musí existovať, inak sa mail potichu zahodí), Reply-To = e-mail klienta. Po odoslaní presmeruje na `dakujeme.html`, pri chybe na `./?formular=chyba`. Pri testoch nepoužívaj ako e-mail klienta adresu adresáta – Websupport by pridal do predmetu [SPAM].
2. **Čaká sa od klientky:** nová titulná fotka (`assets/brand/hero-*.jpg`).
3. **Instagram tatérov** – Lukáš @lukas.senkar, Viktor @orochi.tatt, Paťka @patrisia_ink.
4. **Hero** je AI-generovaný vizuál (GPT Image 2) v palete brandu. Ikonky v sekcii O nás, logo (`logo-nav.png` bez riadku EST. 2026 pre hlavičku, `logo-full.png` pre pätičku) a favicon dodala klientka.
5. **Ochrana osobných údajov** – `ochrana-osobnych-udajov.html`, na adrese `/ochrana-osobnych-udajov` cez `.htaccess`.

## Poznámky

- Fotky prác sú zmenšené na max 1300 px (spolu ~5 MB); originály ostávajú v podkladoch.
- Fonty sú self-hostované (GDPR, žiadne requesty na Google).
- Formulár zmenšuje nahrané fotky v prehliadači (max 1600 px, JPEG), takže e-mail prílohy neprekročia limity.
- Mapa sa načítava lenivo až pri doscrollovaní; tlačidlo otvára Google Maps s adresou.
- FAQ, kontakt aj firma sú v štruktúrovaných dátach (schema.org TattooParlor + FAQPage) pre Google.
