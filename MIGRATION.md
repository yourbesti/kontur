# Kontur: перенос з Webflow на Astro

Статус: сайт перенесено 1:1 з опублікованої версії Webflow (10.11.2026).

- **Сторінки**: `/`, `/privacy-policy`, `/public-offer`, `/404`.
  Розмітка лежить у `src/html/*.body.html`, мета-дані (title, description, JSON-LD) у `src/html/meta.json`.
- **Стилі й скрипти**: CSS Webflow у `public/css/site.css`, runtime (`webflow.*.js`, jQuery), Swiper, three.js і Clarity самохостяться з `public/js`. Жодних запитів до `cdn.prod.website-files.com`.
- **Ассети**: `public/assets` (зображення, відео, шрифти).
- **Форми**: Web3Forms, обробник у `src/scripts/contact-form.ts`. Ключ задається змінною `PUBLIC_WEB3FORMS_KEY`
  (локально в `.env`, на GitHub у Settings → Secrets and variables → Actions → Secrets).
- **Хостинг**: GitHub Pages через `.github/workflows/deploy.yml`, домен у `public/CNAME`.

## Що ще лишилось
- Отримати access key на web3forms.com і додати як `PUBLIC_WEB3FORMS_KEY`.
- Запушити в GitHub, ввімкнути Pages (Source: GitHub Actions), налаштувати DNS.
- Перевірити 301-редиректи зі старих URL, якщо вони були у Webflow.
