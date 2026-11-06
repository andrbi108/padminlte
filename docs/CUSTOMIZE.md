# سفارشی‌سازی — PAdminLTE

PAdminLTE بر پایهٔ **CSS Custom Properties** و چند اسکریپت کوچک ساخته شده است. هیچ
preprocessor یا build لازم نیست؛ همهٔ تنظیمات از طریق `:root` و `[data-pa-theme="..."]`
و چند تابع ساده JS قابل تغییرند.

---

## فهرست

- [ساختار CSS Custom Properties](#ساختار-css-custom-properties)
- [جدول متغیرهای قابل تنظیم](#جدول-متغیرهای-قابل-تنظیم)
- [ساخت تم رنگی دلخواه](#ساخت-تم-رنگی-دلخواه)
- [تغییر فونت](#تغییر-فونت)
- [تغییر عرض sidebar](#تغییر-عرض-sidebar)
- [ساخت تم تیرهٔ شخصی](#ساخت-تم-تیرهٔ-شخصی)
- [افزودن آیکون جدید](#افزودن-آیکون-جدید)
- [افزودن صفحهٔ جدید به منوی کناری](#افزودن-صفحهٔ-جدید-به-منوی-کناری)
- [تعویض لوگو/برند](#تعویض-لوگوبرند)
- [RTL vs LTR](#rtl-vs-ltr)

---

## ساختار CSS Custom Properties

تمام توکن‌ها در `:root` تعریف شده‌اند. وقتی روی `<html>` صفت `data-pa-theme="dark"`
گذارده شود، بلاک `[data-pa-theme="dark"]` مقادیر را override می‌کند. مکانیک کار
ساده است:

```css
/* padminlte.css — بخش 1 */
:root {
  --pa-bg: #f4f6f9;
  --pa-text: #212529;
  /* … */
}

[data-pa-theme="dark"] {
  --pa-bg: #1a1d21;
  --pa-text: #e9ecef;
  /* … */
}

body {
  background: var(--pa-bg);
  color: var(--pa-text);
}
```

یعنی **هیچ قانون color-specific‌ای در کامپوننت‌ها نیست**. همه چیز از طریق توکن‌ها
جریان دارد. تم تیره فقط چند توکن را override می‌کند و تمام کامپوننت‌ها خودشان را
به‌روز می‌کنند.

برای سفارشی‌سازی، نیازی به ویرایش `padminlte.css` نیست. کافی است یک فایل
`custom.css` (یا یک تگ `<style>`) بعد از `padminlte.css` لود کنید و توکن‌ها را override کنید.

```html
<link rel="stylesheet" href="css/padminlte.css">
<link rel="stylesheet" href="css/custom.css">
```

---

## جدول متغیرهای قابل تنظیم

### رنگ‌های برند

| متغیر              | پیش‌فرض    | نقش                                  |
| ------------------ | ---------- | ------------------------------------ |
| `--pa-primary`     | `#0d6efd`  | رنگ اصلی لینک‌ها، دکمه‌ها، اکتیو     |
| `--pa-secondary`   | `#6c757d`  | خاکستری ثانویه                       |
| `--pa-success`     | `#198754`  | موفقیت                               |
| `--pa-info`        | `#0dcaf0`  | اطلاع                                |
| `--pa-warning`     | `#ffc107`  | هشدار                                 |
| `--pa-danger`      | `#dc3545`  | خطا                                   |
| `--pa-light`       | `#f8f9fa`  | روشن                                  |
| `--pa-dark`        | `#212529`  | تیره                                  |

### Soft tints (پس‌زمینهٔ badge و alert)

| متغیر                | پیش‌فرض    |
| -------------------- | ---------- |
| `--pa-primary-soft`  | `#cfe2ff`  |
| `--pa-success-soft`  | `#d1e7dd`  |
| `--pa-info-soft`     | `#cff4fc`  |
| `--pa-warning-soft`  | `#fff3cd`  |
| `--pa-danger-soft`   | `#f8d7da`  |

### Surface tokens (سطوح صفحه)

| متغیر                | پیش‌فرض روشن | پیش‌فرض تیره |
| -------------------- | ----------- | ----------- |
| `--pa-bg`            | `#f4f6f9`   | `#1a1d21`   |
| `--pa-surface`       | `#ffffff`   | `#212529`   |
| `--pa-surface-2`     | `#f8f9fa`   | `#2a2f34`   |
| `--pa-surface-3`     | `#e9ecef`   | `#343a40`   |
| `--pa-border`        | `#dee2e6`   | `#3a3f44`   |
| `--pa-text`          | `#212529`   | `#e9ecef`   |
| `--pa-text-muted`    | `#6c757d`   | `#adb5bd`   |
| `--pa-text-soft`     | `#adb5bd`   | `#6c757d`   |

### Sidebar tokens

| متغیر                  | پیش‌فرض روشن | پیش‌فرض تیره |
| ---------------------- | ----------- | ----------- |
| `--pa-sidebar-bg`      | `#343a40`   | `#0e1012`   |
| `--pa-sidebar-text`    | `#c2c7d0`   | `#adb5bd`   |
| `--pa-sidebar-link`    | `#c2c7d0`   | `#adb5bd`   |
| `--pa-sidebar-hover`   | `#495057`   | `#1a1d21`   |
| `--pa-sidebar-active`  | `#0d6efd`   | `#0d6efd`   |

### Header tokens

| متغیر             | پیش‌فرض روشن | پیش‌فرض تیره |
| ----------------- | ----------- | ----------- |
| `--pa-header-bg`  | `#ffffff`   | `#212529`   |
| `--pa-header-text`| `#212529`   | `#e9ecef`   |

### Shadows

| متغیر            | پیش‌فرض روشن                          |
| ---------------- | ------------------------------------ |
| `--pa-shadow`    | `0 .125rem .25rem rgba(0,0,0,.075)`  |
| `--pa-shadow-lg` | `0 .5rem 1rem rgba(0,0,0,.15)`       |

### Layout metrics

| متغیر                       | پیش‌فرض   | نقش                              |
| --------------------------- | --------- | -------------------------------- |
| `--pa-sidebar-width`        | `250px`   | عرض سایدبار در حالت expanded     |
| `--pa-sidebar-mini-width`   | `70px`    | عرض سایدبار در حالت mini         |
| `--pa-header-height`        | `57px`    | ارتفاع header و brand            |
| `--pa-content-padding`      | `1rem`    | padding کانتینر `.pa-content`    |
| `--pa-radius`               | `.375rem` | شعاع گوشه‌های کوچک                |
| `--pa-radius-lg`            | `.5rem`   | شعاع گوشه‌های بزرگ (کارت، مودال)  |
| `--pa-transition`           | `.18s ease-in-out` | مدت ترانزیشن پیش‌فرض  |

### Typography

| متغیر             | پیش‌فرض                                                  |
| ----------------- | ------------------------------------------------------- |
| `--pa-font-family`| `"Source Sans 3", -apple-system, …, "Vazirmatn", sans-serif` |
| `--pa-font-mono`  | `"JetBrains Mono", Menlo, Consolas, monospace`          |
| `--pa-font-size`  | `16px` (روی `html`)                                     |
| `--pa-line-height`| `1.5`                                                   |

---

## ساخت تم رنگی دلخواه

مثال: یک تم **سبز سازمانی** می‌خواهیم.

```css
/* css/custom.css */
:root {
  --pa-primary:   #198754;
  --pa-primary-soft: #d1e7dd;
  /* بقیهٔ رنگ‌های برند را هم می‌توانید عوض کنید: */
  --pa-secondary: #495057;
  --pa-success:   #2f9e44;
  --pa-info:      #1098ad;
  --pa-warning:   #f59f00;
  --pa-danger:    #e03131;
  --pa-sidebar-active: #198754;
}
```

همین. حالا همهٔ دکمه‌ها، badge‌ها، active link‌های سایدبار، focus ring‌ها و
progress bar‌ها از رنگ سبز پیروی می‌کنند، بدون آنکه هیچ کلاسی را دست بزنید.

برای اعمال بدون تغییر CSS سراسری، می‌توانید تم را روی یک scope محدود اعمال کنید:

```html
<html data-pa-brand="green">
```
```css
[data-pa-brand="green"] {
  --pa-primary: #198754;
}
```

---

## تغییر فونت

تنها کافی است `--pa-font-family` را override کنید. برای فونت فارسی، `Vazirmatn`
به‌صورت پیش‌فرض در انتهای استک آمده، اما اگر آن را از CDN یا لوکال لود می‌کنید
ترتیب را به‌این شکل بنویسید:

```css
:root {
  --pa-font-family: "Vazirmatn", "Source Sans 3", -apple-system, sans-serif;
}
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
<link rel="stylesheet" href="css/padminlte.css">
<link rel="stylesheet" href="css/custom.css">
```

> توجه: فونت‌های فارسی را بعد از `padminlte.css` و در `custom.css` override کنید تا
> اولویت داشته باشد.

---

## تغییر عرض sidebar

پیش‌فرض 250px است. برای داشبورد متراکم‌تر می‌توانید 220px بگذارید:

```css
:root {
  --pa-sidebar-width: 220px;
  --pa-sidebar-mini-width: 60px;   /* باید کوچک‌تر از normal باشد */
}
```

ساختار layout از این متغیرها در `margin-left`، `width` و چند transition استفاده
می‌کند، پس نیازی به بازنویسی دستی قواعد نیست.

---

## ساخت تم تیرهٔ شخصی

می‌خواهیم یک تم تیرهٔ شخصی به‌نام `midnight` بسازیم. ابتدا آن را با
`data-pa-theme="midnight"` فعال می‌کنیم:

```css
[data-pa-theme="midnight"] {
  --pa-bg:           #0b1020;
  --pa-surface:      #131a2e;
  --pa-surface-2:    #1a2342;
  --pa-surface-3:    #232d52;
  --pa-border:       #2a3360;
  --pa-text:         #e6ecff;
  --pa-text-muted:   #97a3c4;
  --pa-text-soft:    #5a6690;
  --pa-sidebar-bg:   #060914;
  --pa-sidebar-text: #97a3c4;
  --pa-sidebar-link: #97a3c4;
  --pa-sidebar-hover:#1a2342;
  --pa-header-bg:    #131a2e;
  --pa-header-text:  #e6ecff;
  --pa-shadow:       0 .125rem .25rem rgba(0,0,0,.5);
  --pa-shadow-lg:    0 .5rem 1rem rgba(0,0,0,.7);
  color-scheme: dark;
}
```

سپس برای فعال‌سازی:

```js
// از طریق API
PAdminLTE.setTheme('midnight');
```

> توجه: `setTheme` فقط مقادیر `'light'` و `'dark'` را در `localStorage` ذخیره می‌کند
> و toggle آن بین همین دو می‌چرخد. برای تم دلخواه باید `data-pa-theme` را به‌صورت
> دستی روی `<html>` بگذارید:
>
> ```js
> document.documentElement.setAttribute('data-pa-theme', 'midnight');
> ```

---

## افزودن آیکون جدید

آیکون‌ها در `js/pa-icons.js` در شیء `ICONS` نگه‌داری می‌شوند. هر ورودی، markup
داخلی یک SVG با `viewBox="0 0 24 24"` و `stroke="currentColor"` است. برای افزودن:

1. فایل `js/pa-icons.js` را باز کنید.
2. یک ورودی به شیء `ICONS` اضافه کنید:

```js
var ICONS = {
  // … آیکون‌های موجود …
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',

  // آیکون جدید شما:
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'
};
```

3. اکنون می‌توانید از آن استفاده کنید:

```html
<span data-pa-icon="rocket" data-pa-icon-size="24"></span>
```

یا از JS:

```js
const svg = PAdminLTE.icon('rocket', 24);
```

نکته‌ها:
- آیکون باید با `viewBox="0 0 24 24"` ترسیم شده باشد.
- برای اینکه رنگ به‌صورت خودکار با `currentColor` هماهنگ شود، از `stroke` و `fill`
  صرف‌نظر کنید؛ تابع `svg()` در `pa-icons.js` خودش `fill="none"` و `stroke="currentColor"`
  را اضافه می‌کند.
- اگر نام آیکون ناشناخته باشد، آیکون `question` نمایش داده می‌شود.

### فهرست کامل آیکون‌های موجود

برای دیدن همهٔ نام‌ها می‌توانید در کنسول بنویسید:

```js
console.log(Object.keys(PAdminLTE.ICONS));
```

بخش‌هایی از فهرست: `menu, search, bell, envelope, cog, user, users, dashboard, chart,
chartpie, chartline, table, form, calendar, file, folder, image, chat, map, clock,
cart, heart, star, bookmark, layers, cube, shield, lock, logout, plus, edit, trash,
eye, download, upload, refresh, check, check_circle, x, x_circle, chevron_right,
chevron_down, chevron_left, chevron_up, arrow_up, arrow_down, arrow_right, moon, sun,
palette, home, grid, list, info, warning, dollar, user_plus, user_check, printer, save,
phone, location, link, external, settings, filter, sort, sort_asc, sort_desc, copy,
question, server, activity, cpu, database, wifi, globe, flag, tag, bell_off, maximize,
minimize, fullscreen, power, box, gift, credit_card, briefcase, send, paperclip, smile,
code, terminal, github`.

---

## افزودن صفحهٔ جدید به منوی کناری

منوی کناری در تابع `sidebar(opts)` از `js/pa-layout.js` ساخته می‌شود. تابع یک
آرگومان `opts` می‌گیرد با کلید `sections` که آرایه‌ای از بخش‌هاست. هر بخش یکی از
دو شکل را دارد:

```js
// شکل ۱: لیست ساده
{
  title: 'ابزارها',
  items: [
    { href: 'pages/widgets.html', icon: 'grid',   label: 'ویجت‌ها' },
    { href: 'pages/charts.html',  icon: 'chart',  label: 'نمودارها' }
  ]
}

// شکل ۲: درختی (collapsible)
{
  title: 'مدیریت',
  tree: [
    {
      name: 'کاربران',
      icon: 'users',
      items: [
        { href: 'pages/profile.html', icon: 'user',  label: 'پروفایل' },
        { href: 'pages/users.html',   icon: 'users', label: 'لیست کاربران' }
      ]
    }
  ]
}
```

هر آیتم می‌تواند یک `badge` (رشته) هم داشته باشد:

```js
{ href: 'pages/chat.html', icon: 'chat', label: 'گفتگو', badge: '۳' }
```

### روش ۱: ویرایش مستقیم `pa-layout.js`

فایل را باز کنید و در `sections` پیش‌فرض داخل `sidebar()`، بخش دلخواه را اضافه کنید.

### روش ۲: پاس دادن `opts` از صفحه

اگر نمی‌خواهید فایل اصلی را تغییر دهید، می‌توانید بعد از لود اسکریپت‌ها،
`applyLayout` را با `opts` دلخواه صدا بزنید:

```html
<script src="js/pa-icons.js"></script>
<script src="js/padminlte.js"></script>
<script src="js/pa-layout.js"></script>
<script>
  PAdminLTE.layout.apply({
    sidebar: {
      brand: 'پنل من',
      brandMark: 'M',
      sections: [
        {
          title: 'اصلی',
          items: [
            { href: 'index.html',           icon: 'dashboard', label: 'داشبورد' },
            { href: 'pages/reports.html',   icon: 'chart',     label: 'گزارش‌ها' }
          ]
        }
      ]
    },
    header: { title: 'گزارش‌ها' }
  });
</script>
```

لینک فعال به‌صورت خودکار بر اساس نام فایل جاری (مثلاً `reports.html`) مشخص می‌شود.

---

## تعویض لوگو/برند

دو جا لوگو داریم: در سایدبار (`pa-sidebar-brand`) و در صفحات احراز هویت (`pa-auth-logo`).

### در سایدبار

`pa-sidebar-brand` دو جزء دارد: `.pa-brand-mark` (مربع 32×32 با حرف اول) و `.pa-label`
(نام برند). برای تغییر متن کافی است `opts.brand` و `opts.brandMark` را به
`PAdminLTE.layout.apply({sidebar: {…}})` بدهید (مثال بالا). برای تغییر گرافیک، در
`custom.css`:

```css
.pa-sidebar-brand .pa-brand-mark {
  background: url('logo.svg') center/cover no-repeat;
  text-indent: -9999px;
}
```

### در صفحات auth

```css
.pa-auth-logo {
  background: url('logo.svg') center/cover no-repeat;
  text-indent: -9999px;
  /* یا با SVG inline:
     content: url('logo.svg');
  */
}
```

---

## RTL vs LTR

PAdminLTE به‌صورت پیش‌فرض RTL است (چون صفحات نمونه با `dir="rtl"` شروع می‌شوند).
اما CSS کامل به `dir` گوش می‌دهد و در LTR هم درست کار می‌کند.

### روش HTML

```html
<!-- LTR -->
<html lang="en" dir="ltr">

<!-- RTL -->
<html lang="fa" dir="rtl">
```

### روش JavaScript

```js
PAdminLTE.setDir('ltr'); // یا 'rtl'
PAdminLTE.toggleDir();   // تغییر بین دو حالت
console.log(PAdminLTE.getDir());
```

مقدار در `localStorage` زیر کلید `pa-dir` ذخیره می‌شود. دکمهٔ `[data-pa-dir-toggle]`
در header (که از `pa-layout.js` تزریق می‌شود) همین کار را با کلیک انجام می‌دهد.

### قواعدی که RTL-specific هستند

در انتهای `padminlte.css` بخش ۲۸، چند قانون `[dir="rtl"]` وجود دارد که این موارد
را برعکس می‌کند:

- موقعیت سایدبار (چپ ↔ راست)
- جهت margin اصلی `.pa-main`
- جهت باز شدن dropdown (پیش‌فرض راست، در RTL چپ)
- جای آیکون داخل `.pa-search`
- جای کادر `.pa-input-addon` در `.pa-input-group`
- جهت افقی `.pa-sidebar-link` (border و hover)
- جهت transform سایدبار در موبایل

برای صفحات خاص که می‌خواهید مستقل از تنظیمات سراسری RTL باشند، کافی است
`dir` را روی یک زیردرخت اعمال کنید:

```html
<div dir="ltr">
  <table class="pa-table">…</table>
</div>
```
