# معماری — PAdminLTE

این سند تصمیمات طراحی، ساختار فایل‌ها، و مکانیزم‌های داخلی PAdminLTE را توضیح
می‌دهد. مخاطب آن کسی است که می‌خواهد کد را بخواند، تغییر دهد، یا درک کند چرا
چنین انتخاب‌هایی شده است.

---

## فهرست

- [تصمیمات طراحی اصلی](#تصمیمات-طراحی-اصلی)
- [ساختار فایل‌ها](#ساختار-فایل‌ها)
- [جریان اجرای یک صفحه](#جریان-اجرای-یک-صفحه)
- [مدیریت state](#مدیریت-state)
- [Event bus داخلی](#event-bus-داخلی)
- [چرا layout با JS inject می‌شود؟](#چرا-layout-با-js-inject-می‌شود)
- [چرا charts با Canvas بومی؟](#چرا-charts-با-canvas-بومی)
- [تعامل JS و CSS: data attributes به‌عنوان API declarative](#تعامل-js-و-css-data-attributes-به‌عنوان-api-declarative)
- [مقایسه با AdminLTE اصلی](#مقایسه-با-adminlte-اصلی)

---

## تصمیمات طراحی اصلی

سه تصمیم بنیادی پروژه را شکل می‌دهند:

### ۱. Vanilla JavaScript به‌جای framework

PAdminLTE عمداً از هیچ فریم‌ورک (React, Vue, Alpine, …) استفاده نمی‌کند. دلایل:

- **قابلیت اجرا از `file://`:** هیچ transpiler یا bundler لازم نیست. کاربر نهایی
  می‌تواند فایل `index.html` را روی دیسک باز کند و همه چیز کار کند.
- **هیچ وابستگی chain نداریم:** npm tree، vulnerabilities، lockfile‌ها و
  conflict‌های نسخه حذف می‌شوند.
- **حجم کم:** سه فایل اصلی مجموعاً کمتر از ۳۵KB gzipped هستند (CSS + JS + آیکون‌ها).
- **افزایش طول عمر کد:** کد vanilla که امروز می‌نویسیم، ۱۰ سال دیگر هم بدون تغییر
  کار می‌کند؛ چیزی که دربارهٔ کد فریم‌ورک‌محور نمی‌توان گفت.
- **کنترل دقیق:** هر رفتار دقیقاً در کد دیده می‌شود و نیاز به دانستن internals یک
  فریم‌ورک نیست.

### ۲. CSS Custom Properties به‌جای preprocessor

بخش اعظم `padminlte.css` از CSS Custom Properties (`var(--pa-…)`) برای تمام توکن‌ها
استفاده می‌کند. دلایل:

- **تم تیره به‌صورت runtime قابل تعویض است:** کافی است صفت `data-pa-theme` روی
  `<html>` عوض شود تا تمام کامپوننت‌ها خودشان را به‌روز کنند. نیازی به recompile
  یا تعویض فایل CSS نیست.
- **سفارشی‌سازی بدون build:** کاربر می‌تواند یک `<style>` کوچک بعد از `padminlte.css`
  اضافه کند و فقط متغیرهایی که می‌خواهد را override کند.
- **cascade طبیعی:** همان مکانیزم `:root` → `[data-pa-theme="dark"]` → scope محلی،
  بدون نیاز به naming convention خاص.
- **پشتیبانی باثبات:** همهٔ مرورگرهای مدرن (Chrome 49+, Firefox 31+, Safari 9.1+)
  از سال‌ها پیش پشتیبانی می‌کنند.

### ۳. Inline SVG به‌جای icon font

آیکون‌ها به‌صورت markup داخلی SVG در `pa-icons.js` تعریف می‌شوند و با
`data-pa-icon` تزریق می‌شوند. دلایل:

- **رنگ با `currentColor`:** آیکون به‌صورت خودکار رنگ متن والد را می‌گیرد. در تم
  تیره یا hover state نیاز به کار اضافی نیست.
- **هیچ فونت باینری لازم نیست:** مشکل icon font‌ها (FOIT, FOUT, هم‌ترازی پیکسلی،
  subpixel rendering) حذف می‌شود.
- **قابل style دادن با CSS:** می‌توان `width`, `height`, `stroke-width` را با
  CSS تغییر داد.
- **بدون درخواست شبکهٔ اضافی:** آیکون‌ها در همان JS bundle هستند و fetch جداگانه
  لازم نیست.
- **دسترس‌پذیری:** `aria-hidden="true"` و `focusable="false"` روی هر SVG تنظیم می‌شود.

---

## ساختار فایل‌ها

```
padminlte/
├── css/
│   └── padminlte.css          ← کل سیستم طراحی (~700 خط، 28 بخش)
├── js/
│   ├── pa-icons.js            ← تعریف آیکون‌ها + تابع svg/injectAll
│   ├── padminlte.js           ← هستهٔ runtime (theme, modal, toast, chart, …)
│   └── pa-layout.js           ← تولید HTML سایدبار/هدر/فوتر + تزریق
├── index.html                 ← داشبورد اصلی (نمونه)
├── index2.html, index3.html   ← داشبوردهای جایگزین
├── pages/                     ← صفحات کاربردی و نمونه
│   ├── forms.html             ← فرم + مودال + توست + الدرت
│   ├── tables.html            ← datatable کامل
│   ├── charts.html            ← هر چهار نوع چارت
│   ├── widgets.html           ← small box + info box + progress
│   ├── profile.html, users.html, calendar.html, chat.html
│   ├── invoice.html, faq.html, gallery.html
│   ├── blank.html, settings.html
│   ├── login.html, register.html   ← صفحات auth
│   ├── 404.html, 500.html          ← صفحات خطا
├── docs/
│   ├── INSTALL.md, USAGE.md, CUSTOMIZE.md, API.md, ARCHITECTURE.md, CHANGELOG.md
└── README.md
```

### نقش هر فایل JS

| فایل           | نقش                                              | API عمومی                                              |
| -------------- | ------------------------------------------------ | ----------------------------------------------------- |
| `pa-icons.js`  | منبع آیکون‌ها و تزریق آنها                          | `PAdminLTE.icon`, `PAdminLTE.injectIcons`, `PAdminLTE.ICONS` |
| `padminlte.js` | مغز runtime: تم، جهت، سایدبار، dropdown، مودال، توست، tabs، cards، datatable، form validation، چارت، event bus، boot | حدود ۲۰ متد روی `PAdminLTE.*` (دیدن `API.md`)         |
| `pa-layout.js` | تولید HTML سایدبار/هدر/فوتر و تزریق آن‌ها در placeholder‌های `data-pa-layout` | `PAdminLTE.layout.{sidebar,header,footer,apply,navItem,navTree}` |

### بخش‌بندی CSS

`padminlte.css` به‌صورت خطی با کامنت‌های شماره‌دار بخش‌بندی شده تا قابل scan باشد:

| # | بخش                          | # | بخش                          |
| - | ---------------------------- | - | ---------------------------- |
| 1 | Design Tokens (`:root`)      | 15 | Badges                       |
|   | Dark theme override          | 16 | Alerts                       |
| 2 | Reset                        | 17 | Modals                       |
| 3 | App Layout (`pa-app`)        | 18 | Toasts                       |
| 4 | Main wrapper (`pa-main`)     | 19 | Tabs                         |
| 5 | Dropdown                     | 20 | Avatars                      |
| 6 | Content area                 | 21 | User widget in header        |
| 7 | Cards                        | 22 | Login & standalone pages     |
| 8 | Grid                         | 23 | Error pages                  |
| 9 | Small boxes                  | 24 | Chart canvas                 |
| 10 | Info box                     | 25 | Sidebar mini & responsive    |
| 11 | Progress                     | 26 | Misc utilities               |
| 12 | Buttons                      | 27 | Skip link (a11y)             |
| 13 | Tables                       | 28 | RTL support                  |
| 14 | Forms                        |   |                              |

---

## جریان اجرای یک صفحه

وقتی کاربر `index.html` را باز می‌کند، این اتفاقات به‌ترتیب رخ می‌دهند:

```
1. Parse HTML
   ├── <link rel="stylesheet" href="css/padminlte.css">  ← load و parse می‌شود
   ├── <div data-pa-layout="sidebar"></div>  ← placeholder خالی
   ├── <div data-pa-layout="header"></div>
   ├── <main class="pa-content">…</main>
   ├── <div data-pa-layout="footer"></div>
   └── <div class="pa-modal-backdrop" id="…">…</div>  ← مودال‌ها در DOM ولی پنهان

2. اجرای <script src="js/pa-icons.js"></script>
   ├── تعریف شیء ICONS
   ├── تعریف PAdminLTE.icon(name, size) → رشتهٔ SVG
   ├── تعریف PAdminLTE.injectIcons(root) → جایگزینی [data-pa-icon]
   └── نکته: هنوز کسی را صدا نزده.

3. اجرای <script src="js/padminlte.js"></script>
   ├── تعریف همهٔ توابع داخلی (theme, dir, sidebar, modal, toast, …)
   ├── تعریف event bus (listeners, on, off, emit)
   ├── public API را روی window.PAdminLTE قرار می‌دهد
   └── چون readyState دیگر 'loading' نیست (اسکریپت بعد از DOM آمده):
       boot(document) به‌صورت خودکار صدا زده می‌شود

4. boot(document):
   ├── applyTheme(getTheme())          ← data-pa-theme روی <html>
   ├── applySidebarState(getSidebarState())  ← کلاس‌های pa-sidebar-* روی .pa-app
   ├── injectIcons(document)            ← همهٔ [data-pa-icon] پر می‌شوند
   ├── initDropdowns, initSidebarTree, initModals, initAlerts
   ├── initTabs, initCardTools, initAllDatatables, initForms, initSearch
   ├── highlightActiveNav (بر اساس location.pathname)
   ├── وصل کردن [data-pa-theme-toggle], [data-pa-sidebar-toggle], [data-pa-dir-toggle]
   ├── رندر canvas[data-pa-chart]‌ها
   └── emit('pa:ready')

5. اجرای <script src="js/pa-layout.js"></script>
   ├── تعریف sidebar(opts), header(opts), footer(opts), applyLayout(opts)
   ├── چون [data-pa-layout] در صفحه هست:
   │   applyLayout({}) اجرا می‌شود:
   │   ├── جایگزینی [data-pa-layout="sidebar"] با HTML سایدبار
   │   ├── جایگزینی [data-pa-layout="header"]  با HTML هدر
   │   ├── جایگزینی [data-pa-layout="footer"]  با HTML فوتر
   │   ├── PAdminLTE.injectIcons(document)  ← آیکون‌های تازه‌تزریق‌شده
   │   └── PAdminLTE.boot(document)         ← re-bind روی نودهای جدید
   └── public API را روی PAdminLTE.layout قرار می‌دهد

6. صفحهٔ نهایی آماده. event 'pa:ready' قبلاً emit شده ولی
   applyLayout یک بار دیگر boot را صدا می‌زند (که idempotent است).
```

### نکته دربارهٔ idempotency

هر تابع `init*` قبل از bind کردن پرچم `__paBound` را روی المان چک می‌کند:

```js
function initDropdowns(root) {
  root.querySelectorAll('[data-pa-dropdown-toggle]').forEach(function (toggle) {
    if (toggle.__paBound) return;          // قبلاً bind شده
    toggle.__paBound = true;
    toggle.addEventListener('click', …);
  });
}
```

به همین دلیل `boot(document)` را می‌توان چندین بار بدون عوارض جانبی صدا زد، مثلاً
بعد از تزریق layout و دوباره بعد از افزودن محتوای پویا.

---

## مدیریت state

سه state در `localStorage` نگه‌داری می‌شوند:

| کلید          | مقادیر ممکن                           | متدهای مرتبط                                |
| ------------- | ------------------------------------ | ------------------------------------------- |
| `pa-theme`    | `'light'` \| `'dark'`                | `getTheme`, `setTheme`, `toggleTheme`       |
| `pa-dir`      | `'ltr'` \| `'rtl'`                   | `getDir`, `setDir`, `toggleDir`             |
| `pa-sidebar`  | `'expanded'` \| `'mini'` \| `'collapsed'` | `getSidebarState`, `setSidebarState`, `toggleSidebar` |

> کلید چهارم `pa-lang` هم تعریف شده ولی در نسخهٔ ۱.۰.۰ استفاده نمی‌شود؛ برای
> توسعه‌های آینده i18n آماده نگه‌داری شده است.

### رفتار در نبود مقدار ذخیره‌شده

- **Theme:** اولویت با `prefers-color-scheme` مرورگر است.
- **Dir:** اولویت با صفت `dir` فعلی `<html>` است، وگرنه `'ltr'`.
- **Sidebar:** پیش‌فرض `'expanded'`.

### مقاومت در برابر خطا

تمام `localStorage.getItem`/`setItem` در `try/catch` پیچیده‌اند. در حالت `file://`
که Chrome آن را مسدود می‌کند، برنامه نمی‌شکند و فقط به مقادیر پیش‌فرض برمی‌گردد.

### State اعمال‌شده در DOM

- Theme → `<html data-pa-theme="…">` و `<html style.color-scheme=…>`
- Dir   → `<html dir="…" lang="…">`
- Sidebar → کلاس‌های `pa-sidebar-mini` / `pa-sidebar-collapsed` / `pa-sidebar-open`
  روی `.pa-app`

به این ترتیب state هم در storage ماندگار است و هم در DOM منعکس می‌شود.

---

## Event bus داخلی

یک bus سبک در `padminlte.js` تعریف شده است:

```js
var listeners = {};
function on(name, fn)   { (listeners[name] = listeners[name] || []).push(fn);
                          return function () { off(name, fn); }; }
function off(name, fn)  { if (!listeners[name]) return;
                          listeners[name] = listeners[name].filter(f => f !== fn); }
function emit(name, p)  { (listeners[name] || []).forEach(fn => { try { fn(p); } catch (e) { console.error(e); } }); }
```

### ویژگی‌ها

- **سبک و بدون وابستگی:** حدود ۱۰ خط کد.
- **ایمن:** هر خطای listener در `try/catch` گرفته می‌شود تا یک listener بد，
  بقیه را متوقف نکند.
- **unsub آسان:** `on` یک تابع unbind برمی‌گرداند.
- **سراسری:** همهٔ listener‌ها در یک `Map` سراسری نگه‌داری می‌شوند.

### رویدادهای داخلی

| نام                   | payload                  | منبع                              |
| --------------------- | ----------------------- | --------------------------------- |
| `pa:ready`            | —                       | پایان `boot()`                    |
| `pa:theme`            | `{ theme }`             | `setTheme()`                      |
| `pa:dir`              | `{ dir }`               | `setDir()`                        |
| `pa:sidebar`          | `{ state }`             | `setSidebarState()`               |
| `pa:modal:open`       | `{ id }`                | `openModal()`                     |
| `pa:modal:close`      | `{ id }`                | `closeModal()`                    |
| `pa:card:refresh`     | `{ card }`              | کلیک `data-pa-card-tool="refresh"`|
| `pa:datatable:render` | `{ total, page, pages }`| `initDatatable().render()`        |
| `pa:form:valid`       | `{ form }`              | ارسال موفق `form[data-pa-validate-form]` |

### الگوی استفاده

```js
// گوش دادن به تغییر تم برای رندر مجدد چارت‌ها
PAdminLTE.on('pa:theme', () => {
  document.querySelectorAll('canvas[data-pa-chart]').forEach(c => PAdminLTE.boot(c));
});

// unsub
const off = PAdminLTE.on('pa:modal:open', ({ id }) => console.log('opened:', id));
off();  // حذف listener
```

---

## چرا layout با JS inject می‌شود؟

این یکی از مهم‌ترین تصمیمات طراحی است. سه گزینهٔ ممکن بود:

### گزینهٔ ۱ — `<iframe>` برای شل مشترک

```html
<iframe src="shell.html" style="width:100%;height:100vh"></iframe>
```

**رد شد چون:**
- اسکوپ CSS iframe از صفحهٔ بیرونی جدا است؛ تم تیره، RTL و سایدبار باید در iframe
  هم به‌صورت جداگانه هندل شوند.
- ارتفاع iframe به‌صورت خودکار با محتوا تطبیق نمی‌یابد؛ نیاز به `postMessage`
  و کد اضافی دارد.
- SEO و دسترس‌پذیری بدتر می‌شود.
- فایل `index.html` دیگر مستقل نیست.

### گزینهٔ ۲ — `fetch()` کردن فایل‌های جزئی

```js
fetch('partials/sidebar.html').then(r => r.text()).then(html => { … });
```

**رد شد چون:**
- `file://` در مرورگرهای مدرن `fetch` را به دلایل امنیتی مسدود می‌کند.
- یعنی پروژه از همان حالت سادهٔ «دابل‌کلیک و باز کن» خارج می‌شد.

### گزینهٔ ۳ — تزریق با JavaScript (انتخاب ما)

`pa-layout.js` توابعی دارد که HTML سایدبار/هدر/فوتر را به‌صورت رشته می‌سازند و
در placeholder‌های `data-pa-layout` تزریق می‌کنند:

```js
function applyLayout(opts) {
  document.querySelectorAll('[data-pa-layout="sidebar"]').forEach(el => {
    el.outerHTML = sidebar(opts.sidebar || {});
  });
  // …
  PAdminLTE.injectIcons(document);
  PAdminLTE.boot(document);
}
```

**مزایا:**
- کار از `file://` می‌کند چون هیچ درخواست شبکه نیست.
- اسکوپ CSS مشترک است (همان صفحه).
- یک منبع واحد برای layout (DRY)؛ تغییر در `pa-layout.js` روی همهٔ صفحات اعمال می‌شود.
- state تم/جهت/سایدبار در یک DOM واحد مدیریت می‌شود.

**معایب:**
- اگر JavaScript خاموش باشد، سایدبار/هدر/فوتر نمایش داده نمی‌شوند. این برای یک
  پنل ادمین قابل قبول است (که اساساً بدون JS بی‌معنی است).
- FOUC کوتاه ممکن است: سایدبار پس از parse شدن HTML ظاهر می‌شود. با گذاشتن
  اسکریپت‌ها در انتهای `<body>` این حداقل است.

---

## چرا charts با Canvas بومی؟

گزینهٔ آشنا Chart.js یا مشابه آن بود. چرا ننوشتیم؟

| معیار            | Chart.js                       | Canvas بومی PAdminLTE          |
| ---------------- | ------------------------------ | ------------------------------ |
| حجم              | ~70KB min+gzip                 | ~۳KB در داخل `padminlte.js`    |
| وابستگی          | نیاز به CDN یا npm             | هیچ                            |
| کار از `file://` | بله، اگر فایل لوکال باشد       | بله                            |
| کنترل ظاهر       | در حد options API Chart.js     | کامل، هر پیکسل                 |
| تم تیره          | نیاز به تنظیمات جداگانه        | یک خط `isDark` چک می‌شود        |
| زمان یادگیری     | API Chart.js باید یاد گرفته شود | API سادهٔ ۴ تابع                |

### آنچه پیاده‌سازی شد

چهار تابع سبک در `padminlte.js`:

- `lineChart(canvas, data, opts)` — با grid, axis labels, area fill, points
- `barChart(canvas, data, opts)` — با grouped bars
- `donutChart(canvas, data, opts)` — با central hole و عدد کل
- `sparkline(canvas, values, color)` — خط کوچک بدون محور

همه با `devicePixelRatio` سازگارند (HiDPI) و رنگ محور را با `data-pa-theme` تطبیق
می‌دهند:

```js
var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
var axisColor = isDark ? '#adb5bd' : '#6c757d';
var gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
```

### معایب

- تعاملی نیستند (no tooltip, no hover). اگر تعامل لازم است، می‌توان از
  رویداد `pa:datatable:render` یا event bus برای افزودن overlay سفارشی استفاده کرد.
- انیمیشن ورود ندارند. این یک انتخاب آگاهانه برای حفظ سبکی بود.

---

## تعامل JS و CSS: data attributes به‌عنوان API declarative

یکی از الگوهای کلیدی PAdminLTE، استفاده از `data-pa-*` به‌عنوان API declarative
است. هر کامپوننت با attribute‌ها در HTML معرفی می‌شود و `boot()` آن‌ها را
پیدا و فعال می‌کند:

```html
<!-- بدون نوشتن JS -->
<table data-pa-datatable data-pa-datatable-pagesize="5" data-pa-datatable-filter="#search">
  <thead><tr><th data-pa-sort>نام</th>…</tr></thead>
  <tbody>…</tbody>
</table>
<div data-pa-pagination></div>
```

### مزایا

- **HTML به‌عنوان مستند:** با خواندن markup می‌توان فهمید چه چیزی فعال است.
- **قابل compose:** چندین کامپوننت در یک صفحه بدون تداخل کار می‌کنند.
- **قابل توسعه:** افزودن کامپوننت جدید با اضافه کردن یک `data-pa-*` است.
- **بدون نیاز به selector query دستی:** `boot()` همه‌چیز را یک‌جا اسکن می‌کند.

### مکانیزم bind یک‌بار

برای جلوگیری از bind مجدد، هر المان پس از bind شدن با پرچم `__paBound` علامت‌گذاری
می‌شود:

```js
function initModals(root) {
  root.querySelectorAll('[data-pa-modal-open]').forEach(function (btn) {
    if (btn.__paBound) return;
    btn.__paBound = true;
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-pa-modal-open'));
    });
  });
}
```

به این ترتیب `boot(newContainer)` را می‌توان برای محتوای پویا صدا زد بدون آنکه
listener‌های تکراری روی عناصر قبلی ثبت شود.

### فهرست کامل الگوهای declarative

| attribute                                       | کارکرد                          |
| ----------------------------------------------- | ------------------------------- |
| `data-pa-chart="line|bar|donut|sparkline"`      | رندر چارت                       |
| `data-pa-chart-data='…'`                        | دادهٔ چارت به‌صورت JSON         |
| `data-pa-datatable`                             | فعال‌سازی datatable             |
| `data-pa-datatable-pagesize`, `data-pa-datatable-filter` | تنظیمات datatable         |
| `data-pa-pagination`                            | ظرف صفحه‌بندی                   |
| `data-pa-sort`                                  | سرستون قابل مرتب‌سازی           |
| `data-pa-validate="required|email|minlen|number"` | قواعد اعتبارسنجی              |
| `data-pa-minlen="N"`                            | حداقل طول                       |
| `data-pa-validate-form`                         | ارسال فرم با اعتبارسنجی         |
| `data-pa-modal-open="id"`, `data-pa-modal-close` | مودال                          |
| `data-pa-dropdown-toggle`                       | dropdown                        |
| `data-pa-tree-toggle`                           | سایدبار درختی                   |
| `data-pa-card-tool="collapse|remove|refresh"`   | ابزار کارت                      |
| `data-pa-tabs`, `data-pa-tab="id"`, `data-pa-panel="id"` | tabs                  |
| `data-pa-tabs-scope="document"`                 | scope تب سراسری                 |
| `data-pa-theme-toggle`, `data-pa-sidebar-toggle`, `data-pa-dir-toggle` | toggle ها      |
| `data-pa-search="#scope"`                       | فیلتر جستجو                     |
| `data-pa-icon="name"`, `data-pa-icon-size="N"`  | آیکون                           |
| `data-pa-layout="sidebar|header|footer"`        | placeholder برای تزریق layout  |
| `data-pa-theme="light|dark"`                    | تم روی `<html>`                |

---

## مقایسه با AdminLTE اصلی

PAdminLTE بازخلقی کامل AdminLTE v4 است، نه یک fork. تفاوت‌ها:

| جنبه                 | AdminLTE v4                      | PAdminLTE                          |
| -------------------- | -------------------------------- | ---------------------------------- |
| Bootstrap            | لازم (CSS + JS)                  | حذف شده، جایگزین با CSS اختصاصی    |
| jQuery               | لازم برای برخی افزونه‌ها          | حذف شده                            |
| OverlayScrollbars    | لازم                             | حذف شده؛ از scrollbar بومی استفاده می‌شود |
| Chart.js             | لازم برای چارت‌ها                 | پیاده‌سازی داخلی با Canvas بومی    |
| Build step           | npm + bundler                    | هیچ                                |
| CDN                  | چندین CDN خارجی                  | هیچ                                |
| حجم (gzipped)        | ~۲۵۰KB (شامل وابستگی‌ها)         | ~۳۵KB (همه چیز)                    |
| کار از `file://`     | نه (CORS در fetch)               | بله                                |
| Tem تیره             | کلاس‌های مخصوص                   | یک صفت `data-pa-theme`            |
| RTL                  | نیاز به فایل جدا                 | پشتیبانی داخلی با `dir="rtl"`     |
| آیکون‌ها             | Font Awesome یا Bootstrap Icons  | SVG inline بومی (۹۰+ آیکون)        |
| Layout shell         | هر صفحه تکرار می‌شد               | تزریق با `pa-layout.js`            |

### چرا وابستگی‌ها حذف شدند؟

هدف اصلی پروژه **«بدون وابستگی، بدون build، بدون CDN»** بود. این یعنی:

1. کاربر نهایی می‌تواند فایل را دانلود کند و فوراً از `file://` اجرا کند.
2. هیچ vulnerability chain در `package-lock.json` نیست (چون چنین فایلی وجود ندارد).
3. هیچ قطعی CDN رخ نمی‌دهد.
4. ارتقاء نسخه‌های آینده ساده است: فایل‌های جدید را جایگزین کنید، تمام.
5. کنترل کامل روی هر پیکسل و هر بایت.

### چه چیزهایی از AdminLTE حذف شد؟

- افزونه‌های غیرضروری (jqGrid, jQuery UI, …)
- پشتیبانی از مرورگرهای قدیمی
- پوسته‌های متعدد (یک سیستم تم کافی است)
- بستهٔ icon font (با SVG جایگزین شد)
- کدهای Polyfill که برای مرورگرهای مدرن لازم نیستند

### چه چیزهایی حفظ شد؟

- ساختار کلی layout (sidebar + main + header + content)
- فلسفهٔ small box / info box / card
- مفهوم widgetهای آماری
- ساختار منوی سایدبار با section‌ها و tree‌ها
- تجربهٔ کاربری کلی AdminLTE که توسعه‌دهندگان به آن عادت دارند

---

## جمع‌بندی

PAdminLTE نشان می‌دهد که یک پنل ادمین کامل می‌تواند بدون هیچ وابستگی خارجی، با
کدی شفاف و قابل فهم، و قابل اجرا از `file://` باشد. انتخاب‌های ساده (vanilla JS،
CSS Custom Properties، inline SVG، Canvas بومی) در کنار هم تجربه‌ای می‌سازند که
هم برای کاربر نهایی سبک است و هم برای توسعه‌دهنده قابل نگه‌داری.
