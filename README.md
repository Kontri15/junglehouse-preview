# Jungle House Tattoo Studio – web

Jednostránkový statický web (HTML + CSS + JS, žiadny build). Celý priečinok `web/` sa dá nahrať na akýkoľvek hosting (Webglobe, Websupport, Netlify, Vercel, GitHub Pages...).

## Štruktúra

- `index.html` – celá stránka (hero, O nás, Tatéri, FAQ, Kontakt + formulár, mapa)
- `dakujeme.html` – ďakovacia stránka po odoslaní formulára
- `styles.css`, `script.js`
- `assets/` – optimalizované fotky, fonty (self-hosted Anton + Montserrat), logo, ikony

## Pred spustením treba doplniť / skontrolovať

1. **Formulár (FormSubmit)** – posiela na `info@junglehouse.sk`.
   - Po nasadení treba formulár **raz odoslať** a potvrdiť aktivačný e-mail, ktorý príde na info@junglehouse.sk. Dovtedy sa dopyty nedoručujú.
   - V `index.html` uprav hidden pole `_next` na finálnu doménu (teraz `https://junglehouse.sk/dakujeme.html`).
2. **Telefón** – v sekcii Kontakt je placeholder `+421 XXX XXX XXX` (aj v `tel:` odkaze). Doplň skutočné číslo.
3. **Instagram tatérov** – všetky IG ikonky teraz vedú na `@junglehouse.tattoo`. Ak majú tatéri vlastné profily, uprav odkazy pri každom tatérovi.
4. **Hero + ikonky v sekcii O nás** sú AI-generované vizuály (GPT Image 2) v palete brandu. Keď budú profi fotky interiéru, stačí vymeniť `assets/brand/hero-*.jpg`.
   - **Logo** je tiež AI-rekreácia pôvodného loga s priehľadným pozadím (`logo-nav.png` bez riadku EST. 2026 pre hlavičku, `logo-full.png` pre pätičku). Ak klientka dodá originál vo vektore/PNG s alfou, stačí súbory vymeniť.
5. **OG obrázok** – meta `og:image` používa relatívnu cestu; po nasadení ideálne zmeniť na absolútnu URL.

## Poznámky

- Fotky prác sú zmenšené na max 1300 px (spolu ~5 MB); originály ostávajú v podkladoch.
- Fonty sú self-hostované (GDPR, žiadne requesty na Google).
- Formulár zmenšuje nahrané fotky v prehliadači (max 1600 px, JPEG), takže e-mail prílohy neprekročia limity.
- Mapa sa načítava lenivo až pri doscrollovaní; tlačidlo otvára Google Maps s adresou.
- FAQ, kontakt aj firma sú v štruktúrovaných dátach (schema.org TattooParlor + FAQPage) pre Google.
