# PAdminLTE — نسخهٔ کاملاً اختصاصی AdminLTE (بدون وابستگی)

<div dir="rtl">

> **PAdminLTE** یک باز‌خلق‌کردنِ کاملِ AdminLTE v4 با HTML، CSS و JavaScript خالص (vanilla) است که **هیچ وابستگی خارجی ندارد**، **بدون سرور و قابل اجرا با `file://`** است و **مستندات کاملی** دارد.
>
> 🌐 **دمو آنلاین**: <https://andrbi108.github.io/padminlte/>

[English version below ↓](#-english-documentation)

---

## ✨ ویژگی‌ها

- 🚫 **بدون وابستگی خارجی** — نه Bootstrap، نه jQuery، نه Chart.js، نه Font Awesome، نه CDN
- 📂 **قابل اجرا با `file://`** — فقط `index.html` را در مرورگر باز کنید؛ نیازی به سرور نیست
- 🎨 **تم تاریک/روشن** با ذخیره‌سازی در `localStorage` و رعایت ترجیح سیستمی
- 🌐 **پشتیبانی کامل RTL/LTR** با امکان تعویض زنده
- 📊 **نمودارهای vanilla** (خطی، میله‌ای، دونات، اسپارک‌لاین) با Canvas API بومی
- 🧩 **کامپوننت‌های کامل**: کارت، جدول، فرم، مودال، توست، تب، آلرت، بج، آواتار، dropdown، صفحه‌بندی
- 🔍 **جدول داده‌ی پویا** با جستجو، مرتب‌سازی و صفحه‌بندی — بدون DataTables
- ✅ **اعتبارسنجی فرم** با قواعد required/email/minlen/number
- 🧰 **۶۴ صفحه‌ی آماده** در دسته‌های: داشبورد × ۳، ویجت، نمودار، جدول، فرم، پروفایل، کاربران، حساب من، نقش‌ها، تنظیمات، فاکتور، تقویم، گالری، گفتگو، سؤالات متداول، ورود، ثبت‌نام، فراموشی رمز، تایید ایمیل، OTP، وبلاگ، نوشتن مطلب، انجمن، موضوع جدید، دسته‌بندی، برچسب، فروشگاه، محصول، سبد خرید، تسویه حساب، صفحه فرود، درباره ما، تماس با ما، قیمت‌گذاری، در حال تعمیر، ایمیل، مدیریت فایل، کانبان، اعلان‌ها، پنل کاربری، نتایج جستجو، ویرایشگر زنده، بارگذاری فایل، CRUD محصولات، CRUD کاربران، سفارش‌ها، کامپوننت‌ها، لودرها، انیمیشن‌ها، آیکون‌ها، تایم‌لاین، تیم، پروژه‌ها، به‌زودی، حریم خصوصی، شرایط استفاده، ۴۰۴، ۵۰۰، صفحهٔ خالی، **مستندات × ۴ (نصب و پیکربندی اولیه، راهنمای استفاده، سفارشی‌سازی، مرجع API)**
- 🎬 **۱۵ انیمیشن آماده** (slide, zoom, bounce, pulse, shake, spin, tada, flash, heartbeat, shimmer, float, glow, ripple) و ۷ الگوی hover
- 🎨 **طیف گسترده رنگ‌بندی**: ۱۳ رنگ برند با gradient، badge، button و progress bar variants
- 📝 **LiveEdit playground** برای ویرایش زنده HTML/CSS/JS با پیش‌نمایش در iframe
- 📤 **بارگذاری فایل** با drag-and-drop، پیش‌نمایش تصاویر، progress bar
- 🔐 **احراز هویت کامل**: ورود، ثبت‌نام، فراموشی رمز، تایید ایمیل، OTP/۲FA با auto-advance
- 🏪 **پوستهٔ سایت عمومی (v1.7)** — ۱۶ صفحهٔ مستقل از داشبورد (فروشگاه، وبلاگ، انجمن، اطلاعات و قانونی) با ناوبری چسبان مات، فوتر چندستونه، شمارندهٔ زندهٔ سبد و منوی موبایل
- 🛒 **فروشگاه واقعاً قابل استفاده**: کاتالوگ ۱۴ محصولهٔ مشترک (`js/pa-shop.js`)، فیلتر/مرتب‌سازی/دو نمای کارا، صفحهٔ محصول پویا با `?id=`، سبد خرید پایدار در localStorage با کد تخفیف (`PADMIN10`)، قواعد ارسال و تسویهٔ حساب با ثبت سفارش
- 💬 **انجمن و وبلاگ**: لیست مطالب، مطلب کامل، لیست گفتگوها، موضوع انجمن، دسته‌بندی‌ها، ابر برچسب‌ها
- 📋 **اپ‌های کامل**: صندوق ایمیل، مدیریت فایل، تخته کانبان با drag-and-drop، مرکز اعلان‌ها، پنل کاربری، نتایج جستجو
- ⌨️ **پالت فرمان (Ctrl+K/⌘K)**: جستجوی زندهٔ همهٔ صفحات + فرمان‌های سریع، بدون وابستگی
- 📈 **۸ حالت تایم‌لاین** (پایه، آیکونی، یک‌درمیان، فشرده، گروهی، رسانه‌ای، افقی، رهگیری پیشرفت) با پشتیبانی کامل RTL/LTR
- 📤 **خروجی CSV جداول** با یک کلیک (سازگار با Excel فارسی)
- 🧙 **فرم‌ویزارد چندمرحله‌ای** با نوار پیشرفت، تیک مراحل و اعتبارسنجی هر گام (`data-pa-wizard`)
- 💾 **ذخیرهٔ خودکار پیش‌نویس فرم** در localStorage با بازیابی خودکار (`data-pa-autosave`)
- ↕️ **لیست مرتب‌شدنی** با کشیدن و رها کردن و شماره‌گذاری خودکار (`data-pa-sortable`)
- 📶 **بنر خودکار وضعیت اتصال** (قطع/وصل اینترنت) با شبیه‌ساز تست
- 💻 **بلوک کد با هدر و دکمهٔ کپی** (`pre[data-pa-code]`)
- ⌨️ **برگهٔ میانبرهای کیبورد** با کلید `?` — شامل Shift+T (تم) و Shift+D (جهت)
- 🖨️ **چاپ حرفه‌ای**: `@media print` کامل، دکمهٔ چاپ، `data-pa-no-print` / `.pa-print-only`
- 📚 **مرکز مستندات درون‌برنامه‌ای**: نصب و پیکربندی اولیه، راهنمای استفاده، سفارشی‌سازی و مرجع API — به‌همراه بلوک‌های کد با دکمهٔ کپی و نمونه‌های زنده
- ♿ **دسترسی‌پذیری**: skip-link خودکار، ARIA، پشتیبانی کیبورد، `:focus-visible`، `prefers-reduced-motion`
- 📦 **ساختار ساده** — سه فایل اصلی (`css/padminlte.css`, `js/pa-icons.js`, `js/padminlte.js`, `js/pa-layout.js`, `js/pa-shop.js`) و صفحات HTML
- 🆓 **مجوز MIT** — آزاد برای استفادهٔ تجاری و غیرتجاری

---

## 📁 ساختار پروژه

```
padminlte/
├── index.html               # داشبورد ۱
├── index2.html              # داشبورد ۲ (نمودار میله‌ای)
├── index3.html              # داشبورد ۳ (اسپارک‌لاین)
├── css/
│   └── padminlte.css        # تمام طراحی (CSS Custom Properties)
├── js/
│   ├── pa-icons.js          # ۲۸۱ آیکون SVG inline (به جای Font Awesome)
│   ├── padminlte.js         # هستهٔ runtime (theme, dropdown, modal, toast, chart, datatable, ...)
│   └── pa-layout.js         # partial های sidebar/header/footer (inject خودکار)
├── pages/
│   ├── widgets.html
│   ├── charts.html
│   ├── tables.html
│   ├── forms.html
│   ├── users.html
│   ├── profile.html
│   ├── settings.html
│   ├── invoice.html
│   ├── faq.html
│   ├── gallery.html
│   ├── chat.html
│   ├── calendar.html
│   ├── blank.html
│   ├── login.html
│   ├── register.html
│   ├── 404.html
│   └── 500.html
├── docs/
│   ├── INSTALL.md
│   ├── USAGE.md
│   ├── CUSTOMIZE.md
│   ├── API.md
│   ├── CHANGELOG.md
│   └── ARCHITECTURE.md
├── LICENSE
└── README.md                # همین فایل
```

---

## 🚀 شروع سریع

### روش ۱: باز کردن مستقیم فایل

کافی است `index.html` را در مرورگر باز کنید. همه‌چیز بدون سرور کار می‌کند:

```bash
# لینوکس/مک
xdg-open index.html      # یا open index.html

# ویندوز
start index.html
```

### روش ۲: سرور محلی (اختیاری)

اگر ترجیح می‌دهید از یک سرور محلی استفاده کنید:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (بدون نصب چیز اضافه)
npx --yes serve .

# PHP
php -S localhost:8000
```

سپس به `http://localhost:8000` بروید.

### روش ۳: کپی در هر میزبان استاتیک

پوشهٔ پروژه را در هر میزبان استاتیک (GitHub Pages، Netlify، Vercel، Cloudflare Pages، Nginx، Apache، S3) قرار دهید. هیچ build-step یا تنظیمی لازم نیست.

---

## 🎯 صفحات نمونه

| صفحه | توضیحات |
|------|----------|
| `index.html` | داشبورد اصلی با small-box، نمودار خطی، دونات، جدول آخرین سفارش‌ها |
| `index2.html` | داشبورد با تمرکز بر نمودار میله‌ای و دونات |
| `index3.html` | داشبورد با اسپارک‌لاین‌ها و نمودار ترکیبی |
| `pages/widgets.html` | نمایش تمام ویجت‌ها (small-box, info-box, progress, badges, avatars) |
| `pages/charts.html` | نمونهٔ تمام انواع نمودار |
| `pages/tables.html` | جدول با جستجو/مرتب‌سازی/صفحه‌بندی + جدول ساده + جدول فشرده |
| `pages/forms.html` | فرم اعتبارسنجی‌دار، مودال، توست، آلرت + فرم‌ویزارد چندمرحله‌ای + ذخیرهٔ خودکار پیش‌نویس |
| `pages/users.html` | لیست کاربران با جدول پویا و مودال افزودن |
| `pages/profile.html` | پروفایل کاربر با تب |
| `pages/settings.html` | تنظیمات حساب + تنظیمات ظاهری (تم، منو، جهت) |
| `pages/invoice.html` | فاکتور قابل چاپ |
| `pages/faq.html` | سؤالات متداول با آکاردئون |
| `pages/gallery.html` | گالری تصاویر با ۵ حالت نمایش (شبکه‌ای، ماسونری، فلکس، کارت، فهرستی) + بارگذاری تنبل + lightbox |
| `pages/chat.html` | پنل گفتگو با پاسخ خودکار نمونه |
| `pages/calendar.html` | تقویم ماهانه با رویداد |
| `pages/blank.html` | صفحهٔ خالی برای شروع توسعهٔ صفحهٔ جدید |
| `pages/login.html` | ورود فعال با حساب نمونه (`admin@example.com / admin123`) |
| `pages/register.html` | ثبت‌نام فعال + ورود خودکار |
| `pages/account.html` | حساب من: ویرایش پروفایل، تغییر رمز، نشست‌های فعال |
| `pages/roles.html` | نقش‌ها و مجوزها با ماتریس تعاملی |
| `pages/blog-compose.html` | نوشتن مطلب با ذخیرهٔ واقعی در localStorage |
| `pages/shop.html` | فروشگاه عمومی: کاتالوگ ۱۴ محصول، فیلتر دسته/برند/قیمت، مرتب‌سازی، نمای شبکه‌ای/لیستی، افزودن به سبد |
| `pages/product.html` | صفحهٔ محصول پویا با `?id=`: گالری، رنگ/سایز، تعداد، نظرات پایدار، محصولات مرتبط و بازدیدهای اخیر |
| `pages/cart.html` | سبد خرید واقعی در localStorage: تغییر تعداد، حذف، کد تخفیف (`PADMIN10`)، محاسبهٔ ارسال |
| `pages/checkout.html` | تسویهٔ حساب: فرم ارسال با اعتبارسنجی، روش پرداخت، ثبت سفارش با شماره و پنل موفقیت |
| `pages/forum-new.html` | ایجاد موضوع انجمن با ذخیرهٔ واقعی |
| `pages/loaders.html` | نمایشگاه اسپینرها، پری‌لودر، اسکلتون و نوارهای پیشرفت |
| `pages/animations.html` | نمایشگاه ۱۲ حالت reveal، شمارنده‌ها، تایپ‌رایتر و هاورها |
| `pages/icons.html` | نمایشگاه ۲۸۱ آیکون با جستجو و کپی با یک کلیک |
| `pages/404.html` | صفحهٔ خطای ۴۰۴ |
| `pages/500.html` | صفحهٔ خطای ۵۰۰ |

---

## 🛠️ شروع توسعهٔ صفحهٔ جدید

ساده‌ترین راه، کپی کردن `pages/blank.html` و ویرایش محتوای داخل `<main class="pa-content">` است. ساختار پایه:

```html
<!doctype html>
<html lang="fa" dir="rtl" data-pa-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAdminLTE — صفحهٔ من</title>
  <link rel="stylesheet" href="../css/padminlte.css">
</head>
<body>
  <a class="pa-skip-link" href="#pa-main-content">پرش به محتوا</a>
  <div class="pa-app">
    <div data-pa-layout="sidebar"></div>
    <div class="pa-main">
      <div data-pa-layout="header"></div>
      <main class="pa-content" id="pa-main-content">
        <div class="pa-page-header">
          <h1>عنوان صفحه</h1>
        </div>
        <!-- محتوای شما -->
        <div data-pa-layout="footer"></div>
      </main>
    </div>
  </div>
  <script src="../js/pa-icons.js"></script>
  <script src="../js/padminlte.js"></script>
  <script src="../js/pa-layout.js"></script>
</body>
</html>
```

برای راهنمای کامل کامپوننت‌ها به [`docs/USAGE.md`](docs/USAGE.md) و برای راهنمای API جاوااسکریپت به [`docs/API.md`](docs/API.md) مراجعه کنید.

---

## 📚 مستندات

| فایل | محتوا |
|------|-------|
| [docs/INSTALL.md](docs/INSTALL.md) | راهنمای نصب و استقرار |
| [docs/USAGE.md](docs/USAGE.md) | راهنمای استفاده از کامپوننت‌ها |
| [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md) | سفارشی‌سازی رنگ‌ها، فونت، layout |
| [docs/API.md](docs/API.md) | مرجع کامل API جاوااسکریپت |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | معماری پروژه و تصمیمات طراحی |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | تاریخچهٔ تغییرات |

---

## 📊 مقایسه با AdminLTE اصلی

| ویژگی | AdminLTE v4 | PAdminLTE |
|--------|-------------|-----------|
| Bootstrap | ✔️ (نسخهٔ ۵) | ❌ — CSS خالص |
| jQuery | ❌ (در v4 حذف شده) | ❌ |
| Chart.js | ✔️ | ❌ — Canvas بومی |
| Font Awesome / Bootstrap Icons | ✔️ (CDN) | ❌ — SVG inline |
| OverlayScrollbars | ✔️ | ❌ |
| jsvectormap | ✔️ | ❌ |
| به Node.js / Build نیاز دارد | ✔️ | ❌ |
| از CDN استفاده می‌کند | ✔️ | ❌ |
| قابل اجرا با `file://` | ❌ (به‌دلیل CDN) | ✔️ |
| حجم (بدون caching) | ~۵۰۰KB+ | ~۸۰KB |
| تعداد فایل‌های مورد نیاز | ده‌ها | ۴ فایل |

---

## 🔐 امنیت و حریم خصوصی

PAdminLTE **هیچ‌گونه درخواست شبکه‌ای انجام نمی‌دهد**. هیچ CDN، هیچ فونت گوگل، هیچ تله‌متری. تمام داده‌ها (تم، جهت، وضعیت منو) در `localStorage` مرورگر کاربر ذخیره می‌شوند و به جایی ارسال نمی‌شوند.

---

## 📜 مجوز

MIT — آزاد برای استفادهٔ تجاری و غیرتجاری. برای جزئیات به [`LICENSE`](LICENSE) مراجعه کنید.

---

## 🙏 سپاسگزاری

این پروژه با الهام از [AdminLTE](https://github.com/ColorlibHQ/AdminLTE) ساخته‌شده‌است. ساختار UI، الگوی چیدمان و بسیاری از الگوهای تعاملی از AdminLTE قرض گرفته شده‌اند، اما پیاده‌سازی کاملاً از صفر و بدون هیچ وابستگی خارجی انجام شده‌است.

</div>

---

## 🇬🇧 English Documentation

> **PAdminLTE** is a from-scratch, dependency-free reimplementation of AdminLTE v4 using vanilla HTML, CSS, and JavaScript. It runs from `file://` with **no build step**, **no CDN**, **no Bootstrap, jQuery, Chart.js, or icon fonts**.

### Quick start
- **Option A:** open `index.html` in your browser — done.
- **Option B:** serve locally with `python3 -m http.server 8000` and visit `http://localhost:8000`.
- **Option C:** copy the folder onto any static host (GitHub Pages, Netlify, Vercel, Nginx, S3, …).

### Highlights
- Zero external dependencies — pure HTML/CSS/JS
- Works from `file://` — no server required
- Light/Dark theme with system-preference fallback and `localStorage` persistence
- Full RTL/LTR support with live switching
- Vanilla charts (line / bar / donut / sparkline) using the native Canvas API
- Full component set: cards, tables, forms, modals, toasts, tabs, alerts, badges, avatars, dropdowns, pagination
- Datatable with search/sort/pagination — no DataTables.js
- Form validation (required / email / minlen / number)
- 60 ready-to-use pages — 3 dashboards, CRUD, user management, auth flows, blog & forum (localStorage-backed), gallery with 5 view modes, loaders/skeletons, animations showcase, icon gallery and more
- Mock auth (`PAdminLTE.auth`) with localStorage sessions + content store (`PAdminLTE.store`)
- Lazy-loaded images, spinner/skeleton/preloader toolkit, scroll-reveal animations (12 modes), typewriter
- Command palette (Ctrl+K/⌘K), 8 timeline variants, one-click CSV table export
- Multi-step form wizard, form draft auto-save, drag-and-drop sortable lists, offline/online banner, copy-to-clipboard code blocks
- Keyboard shortcuts sheet (`?`) with Shift+T (theme) / Shift+D (direction); professional `@media print` stylesheet
- Accessibility: skip links, ARIA, keyboard support, focus-visible, prefers-reduced-motion
- MIT licensed

### Docs
- [INSTALL.md](docs/INSTALL.md) — installation & deployment
- [USAGE.md](docs/USAGE.md) — component usage guide
- [CUSTOMIZE.md](docs/CUSTOMIZE.md) — theming & customization
- [API.md](docs/API.md) — full JavaScript API reference
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — architecture decisions
- [CHANGELOG.md](docs/CHANGELOG.md) — changelog

### License
MIT — see [LICENSE](LICENSE).
