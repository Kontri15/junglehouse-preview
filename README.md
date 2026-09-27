# Jungle House Tattoo Studio – web

Jednostránkový statický web (HTML + CSS + JS, žiadny build). Celý priečinok `web/` sa dá nahrať na akýkoľvek hosting (Webglobe, Websupport, Netlify, Vercel, GitHub Pages...).

## Štruktúra

- `index.html` – celá stránka (hero, O nás, Tatéri, FAQ, Kontakt + formulár, mapa)
- `dakujeme.html` – ďakovacia stránka po odoslaní formulára
- `styles.css`, `script.js`
- `assets/` – optimalizované fotky, fonty (self-hosted Anton + Montserrat), logo, ikony

## Pred spustením treba doplniť / skontrolovať

1. **Formulár (FormSubmit)** – posiela na `junglehouse.tattoo@gmail.com`.
   - Odosielanie je v náhľade vypnuté (`SUBMIT_DISABLED` v `script.js`) – pred spustením zmazať celý blok.
   - Po nasadení treba formulár **raz odoslať** a potvrdiť aktivačný e-mail, ktorý príde na junglehouse.tattoo@gmail.com. Dovtedy sa dopyty nedoručujú.
   - V `index.html` uprav hidden pole `_next` na finálnu doménu (teraz `https://junglehouse.sk/dakujeme.html`).
2. **Čaká sa od klientky:** nová titulná fotka (`assets/brand/hero-*.jpg`), favicon, logo (hlavička + pätička), ochrana osobných údajov (odkaz v pätičke).
3. **Instagram tatérov** – Lukáš @lukas.senkar, Viktor @orochi.tatt, Paťka @patrisia_ink.
4. **Hero** je AI-generovaný vizuál (GPT Image 2) v palete brandu. Ikonky v sekcii O nás dodala klientka (`assets/icons/*.webp`).
   - **Logo** je tiež AI-rekreácia pôvodného loga s priehľadným pozadím (`logo-nav.png` bez riadku EST. 2026 pre hlavičku, `logo-full.png` pre pätičku). Ak klientka dodá originál vo vektore/PNG s alfou, stačí súbory vymeniť.
5. **OG obrázok** – meta `og:image` používa relatívnu cestu; po nasadení ideálne zmeniť na absolútnu URL.

## Poznámky

- Fotky prác sú zmenšené na max 1300 px (spolu ~5 MB); originály ostávajú v podkladoch.
- Fonty sú self-hostované (GDPR, žiadne requesty na Google).
- Formulár zmenšuje nahrané fotky v prehliadači (max 1600 px, JPEG), takže e-mail prílohy neprekročia limity.
- Mapa sa načítava lenivo až pri doscrollovaní; tlačidlo otvára Google Maps s adresou.
- FAQ, kontakt aj firma sú v štruktúrovaných dátach (schema.org TattooParlor + FAQPage) pre Google.
