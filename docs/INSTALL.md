# نصب و استقرار — PAdminLTE

> PAdminLTE یک پروژهٔ صفر-وابستگی است: هیچ `npm`، `webpack`، `vite` یا CDN لازم نیست.
> سه فایل `css/padminlte.css`، `js/pa-icons.js`، `js/padminlte.js` و `js/pa-layout.js`
> کافی‌اند تا کل سیستم کار کند.

---

## فهرست

1. [پیش‌نیازها](#پیش-نیازها)
2. [سه روش اجرا](#سه-روش-اجرا)
3. [استقرار روی GitHub Pages](#استقرار-روی-github-pages)
4. [استقرار روی Netlify / Vercel](#استقرار-روی-netlify--vercel)
5. [استقرار روی Nginx](#استقرار-روی-nginx)
6. [استقرار روی Apache](#استقرار-روی-apache)
7. [ساخت ساختار دلخواه با Node.js یا Python](#ساخت-ساختار-دلخواه-با-nodejs-یا-python)
8. [عیب‌یابی](#عیب-یابی)
9. [حداقل مرورگر مورد نیاز](#حداقل-مرورگر-مورد-نیاز)

---

## پیش‌نیازها

**هیچ.** این پروژه عمداً بدون هیچ وابستگی خارجی طراحی شده تا از `file://` هم اجرا شود.
سه فایل اصلی پروژه از کار رها می‌شوند و هیچ build step لازم نیست:

| فایل                | نقش                                  |
| ------------------- | ------------------------------------ |
| `css/padminlte.css` | کل سیستم طراحی (توکن‌ها + کامپوننت‌ها) |
| `js/pa-icons.js`    | تزریق خودکار SVG از `data-pa-icon`   |
| `js/padminlte.js`   | هستهٔ runtime (مدال، توست، تم، چارت)  |
| `js/pa-layout.js`   | تزریق sidebar / header / footer      |

کافی است این چهار فایل کنار HTML صفحه باشند؛ هیچ کدام fetch از خارج انجام نمی‌دهند.

---

## سه روش اجرا

### روش ۱ — اجرا مستقیم از `file://`

ساده‌ترین راه: فایل `index.html` را در مرورگر باز کنید.

```bash
# لینوکس / مک
xdg-open index.html      # or: open index.html

# ویندوز
start index.html
```

این حالت برای ارزیابی سریع کافی است. در [بخش عیب‌یابی](#عیب-یابی) محدودیت‌هایش را ببینید.

### روش ۲ — سرور محلی

اگر می‌خواهید به وضعیت واقعی یک سرور نزدیک باشید:

```bash
# با Python 3
python3 -m http.server 8080

# با Node.js (بدون نصب پکیج)
npx --yes serve -l 8080 .

# یا با PHP
php -S localhost:8080
```

سپس به `http://localhost:8080` بروید.

### روش ۳ — میزبان استاتیک

پوشهٔ کامل پروژه را روی هر میزبان استاتیک (GitHub Pages، Netlify، Vercel، Cloudflare Pages، S3،
Nginx، Apache، Caddy و …) آپلود کنید. هیچ تنظیم build لازم نیست.

---

## استقرار روی GitHub Pages

۱. یک ریپو بسازید و فایل‌ها را push کنید:

```bash
git init
git add .
git commit -m "feat: initial PAdminLTE import"
git branch -M main
git remote add origin https://github.com/<USER>/padminlte.git
git push -u origin main
```

۲. از تنظیمات ریپو **Settings → Pages** را باز کنید.

۳. در بخش **Build and deployment** گزینهٔ **Deploy from a branch** را انتخاب کنید.

۴. شاخهٔ `main` و پوشهٔ `/ (root)` را انتخاب و **Save** کنید.

۵. پس از چند دقیقه سایت روی آدرس زیر در دسترس خواهد بود:

```
https://<USER>.github.io/padminlte/
```

> نکته: چون پروژه از مسیرهای نسبی استفاده می‌کند، روی زیرپوشهٔ ریپو هم درست کار می‌کند
> و نیاز به تنظیم `base` ندارد.

### استقرار با GitHub Actions (اختیاری)

اگر می‌خواهید build جداگانه داشته باشید (مثلاً برای اجرای تست)، این ورک‌فلو را در
`.github/workflows/deploy.yml` قرار دهید:

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

---

## استقرار روی Netlify / Vercel

### روش Drag-and-Drop (ساده‌ترین)

1. به [app.netlify.com/drop](https://app.netlify.com/drop) بروید.
2. پوشهٔ `padminlte/` را بکشید و رها کنید.
3. در چند ثانیه یک URL عمومی می‌گیرید.

### روش CLI — Netlify

```bash
npm install -g netlify-cli
cd padminlte
netlify deploy --dir=. --prod
```

### روش CLI — Vercel

```bash
npm install -g vercel
cd padminlte
vercel deploy --prod
```

هر دو پلتفرم به‌صورت پیش‌فرض تشخیص می‌دهند که پروژه استاتیک است؛ نیازی به فایل
`vercel.json` یا `netlify.toml` نیست.

---

## استقرار روی Nginx

پوشهٔ پروژه را مثلاً در `/var/www/padminlte` کپی کنید و این بلاک سرور را به `nginx.conf`
یا `/etc/nginx/sites-available/padminlte` اضافه کنید:

```nginx
server {
    listen 80;
    server_name padminlte.local;
    root /var/www/padminlte;
    index index.html;

    # UTF-8 پیش‌فرض
    charset utf-8;

    # لینک‌های تمیز (در صورت افزودن مسیریابی سمت کلاینت)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # کش طولانی برای CSS و JS هش‌دار
    location ~* \.(css|js|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # عدم کش HTML
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # فشرده‌سازی
    gzip on;
    gzip_types text/css application/javascript text/html application/json;
}
```

سپس:

```bash
sudo nginx -t          # اعتبارسنجی
sudo systemctl reload nginx
```

---

## استقرار روی Apache

فایل `.htaccess` زیر را در ریشهٔ پروژه بگذارید تا UTF-8 و `index.html` پیش‌فرض فعال شود:

```apache
# .htaccess
AddDefaultCharset utf-8
AddType "text/css; charset=utf-8" .css
AddType "application/javascript; charset=utf-8" .js
AddType "text/html; charset=utf-8" .html

DirectoryIndex index.html

# لینک‌های تمیز
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>

# کش طولانی برای فایل‌های استاتیک
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css              "access plus 30 days"
    ExpiresByType application/javascript "access plus 30 days"
    ExpiresByType image/svg+xml         "access plus 30 days"
    ExpiresByType text/html             "access plus 0 seconds"
</IfModule>

# فشرده‌سازی
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

> اگر پروژه را در زیرمسیر (مثلاً `/admin/`) می‌گذارید، نیازی به تغییر مسیرهای نسبی
> نیست؛ همهٔ `<link>` و `<script>` نسبی هستند.

---

## ساخت ساختار دلخواه با Node.js یا Python

اگر می‌خواهید قبل از استقرار، صفحات HTML را با templating تولید کنید، می‌توانید
`pa-layout.js` را در Node هم اجرا کنید (چون IIFE است و `global` را می‌شناسد).
اما برای پروژه‌های ساده‌تر، معمولاً همین کار با یک اسکریپت کوتاه Python یا Node کافی است:

### نمونهٔ Python: تبدیل متغیرهای قالب

```python
# build.py
import os, re, json
from pathlib import Path

BRAND = "شرکت من"
SRC = Path("templates")
OUT = Path("dist")

for html in SRC.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    text = text.replace("{{BRAND}}", BRAND)
    target = OUT / html.relative_to(SRC)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")
print("Build complete.")
```

### نمونهٔ Node.js: سرور توسعه با watch

```js
// serve.mjs
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const ROOT = process.cwd();
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

http.createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  try {
    const buf = await readFile(ROOT + p);
    res.setHeader('Content-Type', TYPES[extname(p)] || 'application/octet-stream');
    res.end(buf);
  } catch {
    res.statusCode = 404;
    res.end('Not Found');
  }
}).listen(8080, () => console.log('http://localhost:8080'));
```

```bash
node serve.mjs
```

---

## عیب‌یابی

### ۱. کش مرورگر

اگر تغییر CSS را نمی‌بینید:

- **DevTools → Network → Disable cache** را روشن کنید و صفحه را reload کنید.
- یا یک hard reload بزنید: `Ctrl+Shift+R` (ویندوز/لینوکس) / `Cmd+Shift+R` (مک).
- روی سرور، هدر `Cache-Control: no-cache` برای HTML و `immutable` برای CSS/JS هش‌دار بفرستید (نمونه‌ها در بخش‌های Nginx و Apache بالا).

### ۲. مشکلات `file://` در برخی مرورگرها

PAdminLTE عمداً از `fetch()` استفاده نمی‌کند تا روی `file://` هم کار کند، اما دو مورد را
باز هم در نظر بگیرید:

| مرورگر      | رفتار روی `file://`                                                |
| ----------- | ----------------------------------------------------------------- |
| Chrome      | به‌طور پیش‌فرض `localStorage` را روی `file://` مسدود می‌کند.     |
| Firefox     | `localStorage` کار می‌کند اما برخی پلاگین‌ها ممکن است محدود شوند. |
| Safari      | به‌طور کلی پایدار است.                                              |

اگر تنظیمات تم/سایدبار ذخیره نمی‌شوند، کد به‌صورت ایمن `try/catch` دارد و فقط به پیش‌فرض
برمی‌گردد — یعنی برنامه نمی‌شکند، اما تنظیمات باز نمی‌گردند. برای رفع، از یک سرور
محلی استفاده کنید.

### ۳. RTL پیش‌فرض

صفحات نمونه با `<html lang="fa" dir="rtl">` شروع می‌شوند. اگر LTR می‌خواهید:

```html
<html lang="en" dir="ltr">
```

یا در زمان اجرا:

```js
PAdminLTE.setDir('ltr');
```

این مقدار در `localStorage` زیر کلید `pa-dir` ذخیره می‌شود. برای پاک کردن کلی:

```js
localStorage.removeItem('pa-dir');
localStorage.removeItem('pa-theme');
localStorage.removeItem('pa-sidebar');
```

### ۴. آیکون‌ها نمایش داده نمی‌شوند

- مطمئن شوید `js/pa-icons.js` **قبل از** `js/padminlte.js` لود شده باشد (چون `padminlte.js`
  از `PAdminLTE.icon` در زمان boot استفاده می‌کند).
- در کنسول به دنبال هشدار `[PAdminLTE] Unknown icon:` بگردید — یعنی نام آیکون اشتباه است.
- اگر محتوای پویا اضافه کرده‌اید، `PAdminLTE.boot(root)` یا `PAdminLTE.injectIcons(root)`
  را روی زیردرخت جدید صدا بزنید.

### ۵. منوی سایدبار نمایش داده نمی‌شود

- ببینید المان `<div data-pa-layout="sidebar"></div>` در صفحه هست.
- مطمئن شوید `js/pa-layout.js` لود شده باشد.
- در console خطا نباشد.

---

## حداقل مرورگر مورد نیاز

PAdminLTE فقط از ویژگی‌های باثبات استفاده می‌کند. پشتیبانی تست‌شده:

| مرورگر       | حداقل نسخه | دلیل محدودیت                            |
| ------------ | ---------- | --------------------------------------- |
| Chrome       | 90+        | `:focus-visible`, CSS Custom Properties |
| Firefox      | 88+        | `color-scheme`, grid auto-fit           |
| Safari       | 14+        | `aspect-ratio` و canvas HiDPI           |
| Edge         | 90+        | همان Chrome (Chromium)                  |

روی مرورگرهای قدیمی‌تر (IE 11، Safari 13-) برنامه اجرا می‌شود اما تم تیره و برخی
انیمیشن‌ها درست کار نخواهند کرد.
