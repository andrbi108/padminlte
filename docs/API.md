# مرجع API جاوااسکریپت — PAdminLTE

همهٔ API عمومی روی شیء سراسری `window.PAdminLTE` قرار دارد. این شیء توسط سه فایل
پر می‌شود:

| فایل             | متدهایی که اضافه می‌کند                                              |
| ---------------- | ------------------------------------------------------------------ |
| `pa-icons.js`    | `icon(name, size)`, `injectIcons(root)`, `ICONS`                  |
| `padminlte.js`   | Theme / Dir / Sidebar / Modal / Toast / Form / Datatable / Charts / Event bus / `boot` |
| `pa-layout.js`   | `layout.sidebar(opts)`, `layout.header(opts)`, `layout.footer(opts)`, `layout.apply(opts)`, `layout.navItem`, `layout.navTree` |

> ترتیب لود: **حتماً** `pa-icons.js` اول، سپس `padminlte.js` و در نهایت `pa-layout.js`.
> چون `padminlte.js` در زمان `boot()` از `PAdminLTE.icon` استفاده می‌کند و
> `pa-layout.js` هم از هر دو استفاده می‌کند.

---

## فهرست

- [Theme](#theme)
- [Direction](#direction)
- [Sidebar](#sidebar)
- [Modals](#modals)
- [Toast](#toast)
- [Forms](#forms)
- [Datatable](#datatable)
- [Charts](#charts)
- [Event bus](#event-bus)
- [Boot & layout](#boot--layout)
- [Icons](#icons-1)
- [Command palette](#command-palette)
- [CSV export](#csv-export-1)
- [Scroll progress](#scroll-progress-1)
- [Site chrome (v1.7)](#site-chrome-v17)
- [Shopping cart & store (v1.7)](#shopping-cart--store-v17)
- [Auto-init با data attributes](#auto-init-با-data-attributes)

---

## Theme

تم جاری در `localStorage` زیر کلید `pa-theme` ذخیره می‌شود. اگر کلیدی نبود،
اولویت با `prefers-color-scheme` مرورگر است.

### `PAdminLTE.getTheme()`

- **پارامتر:** —
- **خروجی:** `'light'` یا `'dark'`

```js
console.log(PAdminLTE.getTheme()); // 'dark' | 'light'
```

### `PAdminLTE.setTheme(theme)`

- **پارامتر `theme`:** رشتهٔ `'light'` یا `'dark'`.
- **کاری انجام می‌دهد:** روی `<html>` صفت `data-pa-theme` را تنظیم می‌کند،
  `colorScheme` را عوض می‌کند، آیکون دکمه‌های `[data-pa-theme-toggle]` را به‌روز
  می‌کند، مقدار را در `localStorage` ذخیره می‌کند و رویداد `pa:theme` را emit می‌کند.

```js
PAdminLTE.setTheme('dark');
```

### `PAdminLTE.toggleTheme()`

- بین `light` و `dark` سوییچ می‌کند. مقدار جدید را برمی‌گرداند.

```js
PAdminLTE.on('pa:theme', (p) => console.log('theme now:', p.theme));
PAdminLTE.toggleTheme();
```

---

## Direction

جهت متن صفحه (RTL/LTR) در `localStorage` زیر کلید `pa-dir` ذخیره می‌شود.

### `PAdminLTE.getDir()`

- **خروجی:** `'rtl'` یا `'ltr'`. اگر چیزی ذخیره نشده بود، مقدار `dir` فعلی `<html>`
  (یا `'ltr'` پیش‌فرض) را برمی‌گرداند.

### `PAdminLTE.setDir(dir)`

- **پارامتر `dir`:** `'rtl'` یا `'ltr'`.
- **کاری انجام می‌دهد:** صفت `dir` و `lang` را روی `<html>` تنظیم می‌کند
  (`lang` بر اساس `dir` به `'fa'` یا `'en'` تغییر می‌کند)، مقدار را در
  `localStorage` ذخیره می‌کند و رویداد `pa:dir` را emit می‌کند.

```js
PAdminLTE.setDir('ltr');
```

### `PAdminLTE.toggleDir()`

```js
document.querySelector('#switch-lang').addEventListener('click', PAdminLTE.toggleDir);
```

---

## Sidebar

سه حالت برای سایدبار داریم:

| state        | کلاس روی `.pa-app`    | رفتار                                 |
| ------------ | -------------------- | ------------------------------------- |
| `expanded`   | (هیچ)                | عرض کامل، پیش‌فرض                     |
| `mini`       | `pa-sidebar-mini`    | عرض 70px، فقط آیکون‌ها دیده می‌شوند   |
| `collapsed`  | `pa-sidebar-collapsed` | سایدبار کاملاً hidden                |

> در موبایل (عرض ≤ 992px) `toggleSidebar()` به‌جای تغییر state، کلاس `pa-sidebar-open`
> را روی `.pa-app` toggle می‌کند تا سایدبار به‌صورت overlay باز/بسته شود.

### `PAdminLTE.getSidebarState()`

- **خروجی:** `'expanded'` | `'mini'` | `'collapsed'`. اگر مقدار ذخیره‌شده معتبر
  نبود، `'expanded'`.

### `PAdminLTE.setSidebarState(state)`

- **پارامتر `state`:** یکی از مقادیر بالا.
- **رویداد:** `pa:sidebar` با payload `{state}`.

```js
PAdminLTE.setSidebarState('mini');
```

### `PAdminLTE.toggleSidebar()`

- در دسکتاپ: بین `expanded` و `mini` سوییچ می‌کند.
- در موبایل: کلاس `pa-sidebar-open` را toggle می‌کند.

```js
document.querySelector('#menu-btn').addEventListener('click', PAdminLTE.toggleSidebar);
```

> دکمه‌های `[data-pa-sidebar-toggle]` (که در header از `pa-layout.js` تزریق می‌شوند)
> به‌صورت خودکار به `toggleSidebar` وصل می‌شوند.

---

## Modals

### `PAdminLTE.openModal(id | el)`

- **پارامتر:** یا رشتهٔ `id` المان `.pa-modal-backdrop`، یا خود المان.
- **کاری انجام می‌دهد:** کلاس `is-open` را اضافه می‌کند، `body.style.overflow`
  را `'hidden'` می‌کند، اولین فیلد قابل focus را focus می‌کند و رویداد
  `pa:modal:open` را با `{id}` emit می‌کند.

```js
PAdminLTE.openModal('myModal');
// یا
PAdminLTE.openModal(document.getElementById('myModal'));
```

### `PAdminLTE.closeModal(id | el)`

- کلاس `is-open` را برمی‌دارد. اگر هیچ مودال باز دیگری نبود، `body.style.overflow`
  را پاک می‌کند. رویداد `pa:modal:close` را با `{id}` emit می‌کند.

```js
PAdminLTE.closeModal('myModal');
```

### روش declarative

```html
<button data-pa-modal-open="myModal">باز کن</button>
<button data-pa-modal-close>بستن</button>
<div class="pa-modal-backdrop" id="myModal">…</div>
```

- کلیک روی بک‌دراپ (نه روی `.pa-modal`) و فشردن `Esc` هم مودال را می‌بندد.

---

## Toast

### `PAdminLTE.toast(opts)`

- **پارامتر `opts` (شیء):**

| کلید       | نوع     | پیش‌فرض   | توضیح                                       |
| ---------- | ------- | --------- | ------------------------------------------- |
| `kind`     | string  | `'info'`  | `'info'` \| `'success'` \| `'warning'` \| `'danger'` |
| `title`    | string  | `''`      | عنوان (اختیاری)                              |
| `message`  | string  | `''`      | متن اصلی                                    |
| `duration` | number  | `4000`    | میلی‌ثانیه؛ `0` = بدون بستن خودکار          |

- **خروجی:** `{ el, dismiss }` که `el` المان DOM و `dismiss` تابعی برای بستن دستی است.

```js
const t = PAdminLTE.toast({
  kind: 'success',
  title: 'ذخیره شد',
  message: 'اطلاعات با موفقیت ذخیره شد.',
  duration: 5000
});

// بستن دستی بعد از ۲ ثانیه
setTimeout(() => t.dismiss(), 2000);
```

اگر ظرف توست (`.pa-toast-container`) وجود نداشته باشد، خودکار در `body` ساخته می‌شود.

---

## Forms

### `PAdminLTE.validateForm(form)`

- **پارامتر `form`:** المان `<form>`.
- **کاری انجام می‌دهد:** روی همهٔ فیلدهای `[data-pa-validate]` قواعد را اجرا می‌کند،
  کلاس‌های `is-valid` / `is-invalid` را روی فیلد و `.pa-form-feedback` همسایه می‌گذارد
  و در صورت نامعتبر بودن، پیام مناسب را در feedback می‌نویسد.
- **خروجی:** `true` اگر همه معتبر باشند، وگرنه `false`.

```js
const form = document.querySelector('#myform');
document.querySelector('#save').addEventListener('click', () => {
  if (PAdminLTE.validateForm(form)) {
    // ارسال به سرور
    fetch('/api/save', { method: 'POST', body: new FormData(form) });
  }
});
```

### روش declarative

روی `<form>` صفت `data-pa-validate-form` بگذارید. در زمان `boot()` فرم به‌صورت خودکار
به `submit` وصل می‌شود: `preventDefault`، `validateForm` و در صورت موفقیت، رویداد
`pa:form:valid` را emit می‌کند و یک توست موفق نمایش می‌دهد.

```js
PAdminLTE.on('pa:form:valid', (p) => {
  console.log('form valid:', p.form);
  // این‌جا می‌توانید fetch کنید
});
```

### قواعد اعتبارسنجی

| `data-pa-validate` | شرط                                 | attribute مکمل          |
| ------------------ | ----------------------------------- | ----------------------- |
| `required`         | مقدار نباید خالی باشد                | —                       |
| `email`            | تطبیق با الگوی ایمیل                  | —                       |
| `minlen`           | حداقل طول                            | `data-pa-minlen="6"`    |
| `number`           | قابل parse به عدد                    | —                       |

---

## Datatable

### `PAdminLTE.initDatatable(table, opts)`

- **پارامتر `table`:** المان `<table>` (باید `<thead>` و `<tbody>` داشته باشد).
- **پارامتر `opts` (شیء):**

| کلید           | نوع               | توضیح                                                  |
| -------------- | ----------------- | ----------------------------------------------------- |
| `pageSize`     | number            | تعداد ردیف در هر صفحه (پیش‌فرض `10`)                  |
| `filterInput`  | string \| Element | selector یا خود المان input فیلتر                     |
| `pagination`   | Element           | ظرف دکمه‌های صفحه‌بندی (یا از `table.parentElement.querySelector('[data-pa-pagination]')`) |

- **کاری انجام می‌دهد:**
  - `<thead> th[data-pa-sort]` را به‌صورت کلیک‌پذیر درمی‌آورد و آیکون مرتب‌سازی تزریق می‌کند.
  - به `filterInput` گوش می‌دهد و ردیف‌ها را فیلتر می‌کند.
  - در `pagination` دکمه‌های صفحه‌بندی می‌سازد.
  - رویداد `pa:datatable:render` را بعد از هر رندر emit می‌کند.
- **خروجی:** `{ state, render }` که:
  - `state`: شیء `{sort, dir, page, pageSize, filter}`
  - `render()`: تابعی برای رندر مجدد دستی

```js
const table = document.querySelector('#my-table');
const dt = PAdminLTE.initDatatable(table, {
  pageSize: 5,
  filterInput: '#search',
  pagination: document.querySelector('#pager')
});

// بعد از تغییر داده‌ها (مثلاً بعد از افزودن ردیف جدید):
dt.render();
console.log(dt.state);
```

### روش declarative

```html
<table data-pa-datatable
       data-pa-datatable-pagesize="10"
       data-pa-datatable-filter="#search">
  …
</table>
<div data-pa-pagination></div>
```

در زمان `boot()`، `initAllDatatables` به‌صورت خودکار همهٔ جداول با `data-pa-datatable`
را راه‌اندازی می‌کند.

---

## Charts

همهٔ توابع چارت با Canvas بومی نوشته شده‌اند (هیچ وابستگی به Chart.js نیست) و
HiDPI (گرفتن `devicePixelRatio`) را به‌صورت خودکار مدیریت می‌کنند.

### `PAdminLTE.lineChart(canvas, data, opts)`

- **پارامتر `canvas`:** المان `<canvas>`.
- **پارامتر `data` (شیء):**
  ```ts
  {
    labels: string[],
    series: { label?: string, values: number[] }[]
  }
  ```
- **پارامتر `opts` (شیء، اختیاری):**
  | کلید      | نوع       | پیش‌فرض                                              | توضیح                 |
  | --------- | --------- | ---------------------------------------------------- | --------------------- |
  | `colors`  | string[]  | `['#0d6efd','#198754','#ffc107','#dc3545']`         | رنگ هر سری            |
  | `area`    | boolean   | `true`                                               | پر کردن زیر خط        |
  | `points`  | boolean   | `true`                                               | رسم نقاط              |

```js
PAdminLTE.lineChart(document.querySelector('#sales'), {
  labels: ['فرو','ارد','خرد','تیر','مرد','شهر'],
  series: [
    { label: 'فروش',  values: [12, 19, 15, 25, 22, 30] },
    { label: 'هزینه', values: [8,  12, 10, 15, 18, 20] }
  ]
}, { colors: ['#0d6efd','#dc3545'] });
```

### `PAdminLTE.barChart(canvas, data, opts)`

- **`data`:** همانی که در lineChart.
- **`opts.colors`:** آرایهٔ رنگ‌ها (همان پیش‌فرض lineChart).

```js
PAdminLTE.barChart(document.querySelector('#bars'), {
  labels: ['فروردین','اردیبهشت','خرداد'],
  series: [
    { label: 'فروش', values: [30, 45, 28] },
    { label: 'هدف',  values: [40, 40, 40] }
  ]
}, { colors: ['#0d6efd','#adb5bd'] });
```

### `PAdminLTE.donutChart(canvas, data, opts)`

- **پارامتر `data`:** آرایهٔ `{value:number, label?:string}`.
- **پارامتر `opts` (اختیاری):**
  | کلید            | نوع       | پیش‌فرض                                                              | توضیح             |
  | --------------- | --------- | -------------------------------------------------------------------- | ----------------- |
  | `colors`        | string[]  | `['#0d6efd','#198754','#ffc107','#dc3545','#6c757d','#0dcaf0']`     | رنگ هر برش         |
  | `centerLabel`   | string    | `'Total'`                                                            | برچسب زیر عدد کل |

```js
PAdminLTE.donutChart(document.querySelector('#donut'), [
  { value: 35, label: 'مستقیم' },
  { value: 25, label: 'ارجاعی' },
  { value: 20, label: 'اجتماعی' },
  { value: 20, label: 'سایر' }
], { centerLabel: 'بازدید' });
```

### `PAdminLTE.sparkline(canvas, values, color)`

- **پارامتر `values`:** آرایهٔ عدد.
- **پارامتر `color`:** رشتهٔ رنگ (پیش‌فرض `'#0d6efd'`).

```js
PAdminLTE.sparkline(document.querySelector('#spark'), [4,8,6,12,9,15,11,18], '#198754');
```

### روش declarative

```html
<canvas data-pa-chart="line"
        data-pa-chart-data='{ "data": {…}, "options": {…} }'></canvas>
```

در `boot()` تمام `canvas[data-pa-chart]` پیدا شده و `JSON.parse` روی
`data-pa-chart-data` انجام می‌شود. اگر کلید `data` داشت، از آن به‌عنوان داده و از
`options` به‌عنوان opts استفاده می‌کند؛ وگرنه کل شیء به‌عنوان `data` در نظر گرفته
می‌شود.

برای sparkline: `data-pa-chart-data` باید شکل `{values:[…], color:'#…'}` داشته باشد.

> نکته: چارت‌ها در زمان تغییر تم به‌صورت خودکار دوباره رندر نمی‌شوند. اگر می‌خواهید
> با `pa:theme` هماهنگ شوند:
>
> ```js
> PAdminLTE.on('pa:theme', () => {
>   document.querySelectorAll('canvas[data-pa-chart]').forEach(c => PAdminLTE.boot(c));
> });
> ```

---

## Event bus

یک event bus سبک داخل `padminlte.js` پیاده‌سازی شده است.

### `PAdminLTE.on(name, fn)`

- **پارامتر `name`:** نام رویداد (رشته).
- **پارامتر `fn`:** callback با یک آرگومان payload.
- **خروجی:** تابع unbind (صدا بزنید تا listener حذف شود).

```js
const off = PAdminLTE.on('pa:theme', (p) => console.log('theme:', p.theme));
// بعداً:
off();
```

### `PAdminLTE.off(name, fn)`

- همان `fn` قبلی را حذف می‌کند.

```js
const handler = (p) => console.log(p);
PAdminLTE.on('pa:dir', handler);
PAdminLTE.off('pa:dir', handler);
```

### `PAdminLTE.emit(name, payload)`

- رویداد را emit می‌کند. اگر listener خطا دهد، آن را در `console.error` می‌نویسد
  اما به بقیه listener‌ها ادامه می‌دهد.

### فهرست رویدادهای داخلی

| نام                    | payload                  | زمان emit                                     |
| ---------------------- | ----------------------- | --------------------------------------------- |
| `pa:ready`             | `undefined`             | پایان `boot()`                                |
| `pa:theme`             | `{ theme }`             | `setTheme()`                                  |
| `pa:dir`               | `{ dir }`               | `setDir()`                                    |
| `pa:sidebar`           | `{ state }`             | `setSidebarState()` (نه `toggleSidebar` موبایل) |
| `pa:modal:open`        | `{ id }`                | `openModal()`                                 |
| `pa:modal:close`       | `{ id }`                | `closeModal()`                                |
| `pa:card:refresh`      | `{ card }`              | کلیک روی `data-pa-card-tool="refresh"`       |
| `pa:datatable:render`  | `{ total, page, pages }`| بعد از هر `render()` در datatable             |
| `pa:form:valid`        | `{ form }`              | ارسال موفق یک `form[data-pa-validate-form]`   |
| `pa:wizard:change`     | `{ index, total, el }`  | هر تغییر مرحله در `data-pa-wizard` (v1.5)     |
| `pa:wizard:complete`   | `{ el, data }`          | تکمیل آخرین مرحلهٔ ویزارد (v1.5)              |
| `pa:autosave:save`     | `{ key, el, data }`     | ذخیرهٔ پیش‌نویس فرم (v1.5)                    |
| `pa:autosave:restore`  | `{ key, el, data }`     | بازیابی پیش‌نویس پس از بارگذاری (v1.5)        |
| `pa:sortable:change`   | `{ el, order }`         | پایان درگ در `data-pa-sortable` (v1.5)        |
| `pa:net:online`        | `{ simulated }`         | بازگشت اتصال (v1.5)                           |
| `pa:net:offline`       | `{ simulated }`         | قطع اتصال (v1.5)                              |

---

## Boot & layout

### `PAdminLTE.boot(root)`

- **پارامتر `root`:** المانی که باید scan شود (پیش‌فرض `document`).
- **کاری انجام می‌دهد:**
  1. `applyTheme(getTheme())`
  2. `applySidebarState(getSidebarState())`
  3. `injectIcons(root)` (اگر موجود باشد)
  4. راه‌اندازی dropdown / sidebar tree / modals / alerts / tabs / card tools / datatables / forms / search / active nav
  5. وصل کردن دکمه‌های `[data-pa-theme-toggle]`, `[data-pa-sidebar-toggle]`, `[data-pa-dir-toggle]`
  6. رندر چارت‌های `canvas[data-pa-chart]`
  7. emit `pa:ready`

```js
// بعد از افزودن محتوای پویا (مثلاً بعد از fetch):
fetch('/api/panel').then(r => r.text()).then(html => {
  const div = document.createElement('div');
  div.innerHTML = html;
  document.querySelector('#panel').appendChild(div);
  PAdminLTE.boot(div);   // راه‌اندازی مجدد روی زیردرخت جدید
});
```

> مکانیزم idempotent است: هر المان با پرچم `__paBound` دوباره bind نمی‌شود.

### `PAdminLTE.layout.apply(opts)`

از `pa-layout.js`. اگر صفحهٔ شما placeholder‌های `<div data-pa-layout="sidebar|header|footer">`
دارد، آن‌ها را با HTML تولیدشده جایگزین می‌کند و سپس `injectIcons(document)` و
`boot(document)` را صدا می‌زند.

- **پارامتر `opts`:**

```js
{
  sidebar: { brand, brandMark, sections },
  header:  { title },
  footer:  { }
}
```

```js
PAdminLTE.layout.apply({
  sidebar: {
    brand: 'پنل من',
    brandMark: 'M',
    sections: [ { title: 'اصلی', items: [ {href:'index.html', icon:'dashboard', label:'داشبورد'} ] } ]
  }
});
```

> اگر در صفحه `data-pa-layout` باشد، `pa-layout.js` به‌صورت خودکار `apply({})` را
> در `DOMContentLoaded` صدا می‌زند. صدا زدن دستی فقط زمانی لازم است که بخواهید
> `opts` سفارشی بدهید.

### توابع کمکی layout

- `PAdminLTE.layout.sidebar(opts)` — رشتهٔ HTML سایدبار.
- `PAdminLTE.layout.header(opts)` — رشتهٔ HTML header.
- `PAdminLTE.layout.footer(opts)` — رشتهٔ HTML footer.
- `PAdminLTE.layout.siteNav(opts)` — رشتهٔ HTML ناوبری عمومی سایت (v1.7).
- `PAdminLTE.layout.siteFooter(opts)` — رشتهٔ HTML فوتر عمومی سایت (v1.7).
- `PAdminLTE.layout.navItem(href, icon, label, badge)` — HTML یک لینک تکی.
- `PAdminLTE.layout.navTree(icon, label, items)` — HTML یک درخت قابل جمع‌شدن.

```js
// تزریق لینک اضافی به سایدبار موجود (بدون بازسازی کامل)
const nav = document.querySelector('.pa-sidebar-nav');
nav.insertAdjacentHTML('beforeend',
  PAdminLTE.layout.navItem('pages/reports.html', 'chart', 'گزارش‌ها', 'جدید')
);
PAdminLTE.injectIcons(nav);
```

---

## Icons

از `pa-icons.js`.

### `PAdminLTE.icon(name, size)`

- **پارامتر `name`:** کلید داخل شیء `ICONS`.
- **پارامتر `size`:** عدد پیکسل (پیش‌فرض `24`).
- **خروجی:** رشتهٔ `<svg class="pa-icon" …>` که می‌توانید با `innerHTML` وارد DOM کنید.
- اگر `name` ناشناخته باشد، آیکون `question` برگردانده می‌شود و هشدار در کنسول چاپ می‌گردد.

```js
const btn = document.createElement('button');
btn.className = 'pa-btn pa-btn-ghost';
btn.innerHTML = PAdminLTE.icon('download', 16) + ' دانلود';
document.body.appendChild(btn);
```

### `PAdminLTE.injectIcons(root)`

- **پارامتر `root`:** المان ریشه برای scan (پیش‌فرض `document`).
- همهٔ `[data-pa-icon]` را پیدا می‌کند، نام و سایز را از attribute‌ها می‌خواند و
  `innerHTML` آن‌ها را با SVG جایگزین می‌کند.

```js
const card = document.createElement('div');
card.innerHTML = '<button><span data-pa-icon="save" data-pa-icon-size="16"></span> ذخیره</button>';
document.body.appendChild(card);
PAdminLTE.injectIcons(card);
```

### `PAdminLTE.ICONS`

شیء کامل اسم→markup. برای دیدن همهٔ نام‌ها:

```js
console.log(Object.keys(PAdminLTE.ICONS));
```

---

## Auto-init با data attributes

این جدول تمام الگوهای `data-pa-*` که در `boot()` به‌صورت خودکار شناسایی می‌شوند
را فهرست می‌کند.

| attribute                      | روی المان           | کارکرد                                                       |
| ------------------------------ | ------------------- | ----------------------------------------------------------- |
| `data-pa-chart="line|bar|donut|sparkline"` | `<canvas>`   | رندر چارت با داده از `data-pa-chart-data`                  |
| `data-pa-chart-data`           | `<canvas>`          | JSON با شکل `{data, options}` یا خود `data`                 |
| `data-pa-datatable`            | `<table>`           | فعال‌سازی pagination/sort/filter                             |
| `data-pa-datatable-pagesize`   | `<table>`           | اندازهٔ صفحه                                                 |
| `data-pa-datatable-filter`     | `<table>`           | selector ورودی فیلتر                                         |
| `data-pa-pagination`           | `<div>`             | ظرف دکمه‌های صفحه‌بندی                                        |
| `data-pa-sort`                 | `<th>`              | سرستون قابل مرتب‌سازی                                        |
| `data-pa-validate`             | field               | قواعد `required`/`email`/`minlen`/`number`                  |
| `data-pa-minlen`               | field               | حداقل طول                                                    |
| `data-pa-validate-form`        | `<form>`            | ارسال با اعتبارسنجی خودکار                                  |
| `data-pa-modal-open="id"`      | `<button>`/`<a>`    | باز کردن مودال                                                |
| `data-pa-modal-close`          | `<button>`/`<a>`    | بستن نزدیک‌ترین `.pa-modal-backdrop`                         |
| `data-pa-dropdown-toggle`      | `<button>`          | toggle منوی `.pa-dropdown-menu` همسایه                       |
| `data-pa-tree-toggle`          | `<a>`               | toggle سایدبار درختی                                         |
| `data-pa-card-tool="collapse|remove|refresh"` | `<button>` | ابزار کارت                                                  |
| `data-pa-tabs`                 | ظرف تب‌ها           | فعال‌سازی سیستم تب                                            |
| `data-pa-tab="id"`             | `.pa-tab`           | کلید پنل مرتبط                                               |
| `data-pa-panel="id"`           | `.pa-tab-panel`     | پنل محتوا                                                    |
| `data-pa-tabs-scope="document"`| ظرف تب‌ها           | جستجوی پنل‌ها در کل document به‌جای والد                      |
| `data-pa-theme-toggle`         | `<button>`          | toggle تم روشن/تیره                                          |
| `data-pa-sidebar-toggle`       | `<button>`          | toggle سایدبار                                               |
| `data-pa-dir-toggle`           | `<button>`          | toggle RTL/LTR                                               |
| `data-pa-search="#scope"`      | `<input>`           | فیلتر همهٔ `[data-pa-searchable]` داخل selector              |
| `data-pa-icon="name"`          | هر المان            | تزریق SVG در `innerHTML`                                     |
| `data-pa-icon-size="N"`        | هر المان            | سایز SVG به پیکسل                                            |
| `data-pa-layout="sidebar|header|footer"` | `<div>`     | placeholder برای تزریق توسط `pa-layout.js`                  |

### الگوی کلی

1. در HTML، فقط attribute‌ها را بگذارید.
2. در انتهای `<body>`، سه فایل را به ترتیب لود کنید:

```html
<script src="js/pa-icons.js"></script>
<script src="js/padminlte.js"></script>
<script src="js/pa-layout.js"></script>
```

3. `padminlte.js` در `DOMContentLoaded` به‌صورت خودکار `boot(document)` را صدا می‌زند
   و `pa-layout.js` هم `apply({})` را. هیچ کد اضافه لازم نیست.

4. اگر محتوای جدید به DOM اضافه کردید:

```js
PAdminLTE.boot(newContainer);
// یا حداقل:
PAdminLTE.injectIcons(newContainer);
```

---

## v1.2 — کامپوننت‌های جدید

### متدهای جدید

| متد | توضیح |
|---|---|
| `PAdminLTE.lightbox.open(items, index)` | باز کردن لایت‌باکس؛ `items` آرایه‌ای از `{title, gradient, icon}` |
| `PAdminLTE.lightbox.close()` / `.go(i)` | بستن / پرش به آیتم |
| `PAdminLTE.animateCount(el)` | اجرای دستی شمارندهٔ انیمیشنی |
| `PAdminLTE.initAccordions(root)` و بقیهٔ `init*` | راه‌اندازی مجدد کامپوننت‌ها برای محتوای تزریقی |

### Attributeهای جدید (declarative)

| Attribute | المان | کار |
|---|---|---|
| `data-pa-accordion` (اختیاری: `"multiple"`) | ظرف آکاردئون | آکاردئون؛ `.pa-accordion-item/-header/-body` |
| `data-pa-carousel` + `data-pa-interval="ms"` | ظرف کاروسل | کاروسل خودکار با swipe؛ `.pa-carousel-track/-slide` |
| `data-pa-rating="5"` + `data-pa-value="3"` | ظرف امتیاز | ستاره‌ها؛ `data-pa-readonly` و `data-pa-show-value` |
| `data-pa-counter="2500"` | هر المان متنی | شمارش انیمیشنی؛ `data-pa-counter-duration/-suffix/-sep` |
| `data-pa-ring="72"` | `<div>` | حلقهٔ پیشرفت SVG؛ `data-pa-size/-stroke/-color` |
| `data-pa-reveal` (up/right/left/zoom) | هر المان | نمایش با اسکرول؛ `data-pa-delay="ms"` |
| `data-pa-tip="متن"` | هر المان | تولتیپ CSS خالص |
| `data-pa-chart-data` با `opts.animate:false` | `<canvas>` | غیرفعال کردن انیمیشن نمودار |

### رویدادهای جدید

`pa:accordion:toggle`، `pa:carousel:change`، `pa:rating:change`، `pa:lightbox:open`، `pa:lightbox:close`

### نمودارها (v2)

- همهٔ نمودارها هنگام لود **انیمیشن** دارند و هنگام **هاور** tooltip نشان می‌دهند.
- با تغییر تم یا resize صفحه به‌صورت خودکار دوباره رسم می‌شوند.
- غیرفعال‌سازی: `PAdminLTE.lineChart(canvas, data, {animate:false})`.

---

## v1.3 — بارگذاری تنبل، لودرها، انیمیشن‌ها، احراز هویت و ذخیره‌گاه محتوا

### Lazy loading (بارگذاری تنبل تصاویر)

| الگو | توضیح |
|---|---|
| `<img data-pa-lazy data-pa-src="photo.jpg">` | `src` هنگام نزدیک شدن به دید (IntersectionObserver با rootMargin ۱۲۰px) تنظیم و تصویر با محو تدریجی ظاهر می‌شود |
| `<img data-pa-lazy src="...">` | فقط افکت ظهور (fade-in) اعمال می‌شود |

تا لحظهٔ بارگذاری، شیمر (پس‌زمینهٔ متحرک) نمایش داده می‌شود. با `prefers-reduced-motion` همهٔ افکت‌ها خاموش می‌شوند.

### Loaders

| API | کار |
|---|---|
| `PAdminLTE.loader.show(target, {label, dark})` | اورلی لودر روی هر بلوک (المان یا سلکتور) |
| `PAdminLTE.loader.hide(target)` | حذف اورلی |
| `PAdminLTE.pageLoader.show('متن…')` / `.hide()` | پری‌لودر تمام‌صفحه |
| `PAdminLTE.btnLoading(btn, true\|false, 'متن…')` | حالت بارگذاری دکمه با اسپینر |

مارک‌آپ اسپینرها: `<span class="pa-spinner pa-spinner-border|dual|dots|bars|pulse|flip">` + `pa-spinner-sm/lg`. برای اسکلتون: `.pa-skeleton` + `pa-skeleton-text/title/img/circle/chip` و تعویض خودکار:

```html
<div data-pa-skeleton="1400"><!-- اسکلتون‌ها --></div>
<div data-pa-skeleton-content class="pa-hidden"><!-- محتوای واقعی --></div>
```

### انیمیشن‌ها

| Attribute | مقادیر |
|---|---|
| `data-pa-reveal` | پیش‌فرض fade-up؛ مقادیر: `down`, `right`, `left`, `start`, `end`, `zoom`, `zoom-out`, `blur`, `flip-x`, `flip-y`, `rotate`, `bounce` |
| `data-pa-delay="ms"` | تأخیر نمایش |
| `data-pa-stagger="90"` | روی ظرف — به فرزندان `data-pa-reveal` تأخیر پله‌ای می‌دهد |
| `data-pa-typewriter` + `data-pa-text="الف|ب|ج"` | تایپ‌رایتر حلقه‌ای؛ `data-pa-speed`, `data-pa-hold` |

کلاس‌های کمکی بی‌پایان: `.pa-anim-pulse / float / shake / spin / bounce / heartbeat / wiggle / gradient`.
کلاس‌های هاور: `.pa-hover-zoom / lift / rotate / glow / ring`.

### Mock auth (نمونه — امنیت واقعی نیست)

```js
PAdminLTE.auth.login(email, pass)        // → user | null  (حساب نمونه: admin@example.com / admin123)
PAdminLTE.auth.register({name,email,pass,role,color})
PAdminLTE.auth.logout()
PAdminLTE.auth.currentUser()             // → user | null
PAdminLTE.auth.updateProfile({name, bio, color})
PAdminLTE.auth.changePassword(oldPass, newPass) // → {ok} | {ok:false, error}
PAdminLTE.auth.users()
```
داده‌ها در `localStorage` با کلیدهای `pa-users` و `pa-session` ذخیره می‌شوند. رویدادها: `pa:auth:login`, `pa:auth:register`, `pa:auth:logout`, `pa:auth:update`, `pa:auth:password`, `pa:auth:error`.

### Content store (ذخیره‌گاه محتوا)

```js
PAdminLTE.store.get(key, seed)         // آرایه (در اولین اجرا seed ذخیره می‌شود)
PAdminLTE.store.find(key, id, seed)
PAdminLTE.store.add(key, item, seed)   // id خودکار؛ آیتم به ابتدای آرایه اضافه می‌شود
PAdminLTE.store.update(key, id, patch, seed)
PAdminLTE.store.remove(key, id, seed)
```
کلیدهای استفاده‌شده: `pa-blog-posts`، `pa-blog-comments`، `pa-forum-topics`، `pa-forum-replies`.

### خروج از حساب

هر دکمهٔ `data-pa-logout` در `fullBoot` به `auth.logout()` + توست + ریدایرکت به صفحهٔ ورود متصل می‌شود.

### Attributeهای v1.3 (یک‌نگاه)

| Attribute | المان | کار |
|---|---|---|
| `data-pa-lazy` (+`data-pa-src`) | `<img>` | بارگذاری تنبل با fade-in |
| `data-pa-skeleton="ms"` | ظرف اسکلتون | تعویض خودکار با `data-pa-skeleton-content` |
| `data-pa-typewriter` | المان متنی | تایپ‌رایتر |
| `data-pa-logout` | دکمه | خروج از حساب |

---

## Command palette

پالت فرمان با `Ctrl+K`/`⌘K` باز می‌شود؛ منبع داده‌اش لینک‌های سایدبار و
فرمان‌های سریع است و نیازی به تنظیم ندارد.

### `PAdminLTE.palette.open()` / `.close()` / `.toggle()`

باز/بستن/تغییر وضعیت پالت.

### `PAdminLTE.initPalette()`

اتصال کلید میان‌بر و دکمه‌های `[data-pa-palette-open]` — در `boot()` خودکار اجرا می‌شود.

رویدادها: `pa:palette:open`، `pa:palette:close`.

---

## CSV export

### `PAdminLTE.exportTableCSV(table, filename)`

جدول را به CSV تبدیل و دانلود می‌کند. `table` المان جدول است؛ اگر `null` باشد توست خطا نمایش داده می‌شود و `false` برمی‌گردد.

| نکته | توضیح |
|---|---|
| BOM | خروجی با `\uFEFF` شروع می‌شود تا Excel رشته‌های فارسی را درست بخواند |
| `data-no-export` | ستون/سلول‌های حذف‌شده از خروجی |
| `data-export-value` | مقدار جایگزین سلول در خروجی |
| `tfoot` | همیشه نادیده گرفته می‌شود |

### `PAdminLTE.initExportButtons(root)`

اتصال دکمه‌های `[data-pa-export]` — در `boot()` خودکار اجرا می‌شود.
رویداد: `pa:export:csv` با `{rows, filename}`.

---

## Scroll progress

### `PAdminLTE.initScrollProgress()`

نوار پیشرفت مطالعه؛ صفحه باید `<div data-pa-scroll-progress></div>` داشته باشد
(کلاس `pa-scroll-progress` خودکار اضافه می‌شود). در `boot()` خودکار اجرا می‌شود.

---

## Form serialization (v1.5)

### `PAdminLTE.serializeForm(form)`

مقادیر همهٔ `input`/`select`/`textarea` فرم را به یک شیء ساده تبدیل می‌کند.
کلید هر فیلد `name` است و اگر نداشت `id`. چک‌باکس‌ها بولی، رادیو فقط مقدار انتخاب‌شده،
و فیلدهای `file` و `disabled` نادیده گرفته می‌شوند.

---

## Form wizard (v1.5)

### `PAdminLTE.initWizards(root)`

اتصال ویزاردهای `[data-pa-wizard]` — در `boot()` خودکار اجرا می‌شود.
اعتبارسنجی هر مرحله با اعتبارسنجی بومی مرورگر (`required`, `type`, `minlength`, …)
انجام می‌شود؛ فیلدهای نامعتبر کلاس `is-invalid` می‌گیرند.

رویدادها:

| نام | payload | زمان emit |
| --- | --- | --- |
| `pa:wizard:change` | `{ index, total, el }` | هر تغییر مرحله |
| `pa:wizard:complete` | `{ el, data }` | کلیک «ثبت نهایی» در آخرین مرحله |

نکته: کلیک روی مرحلهٔ `is-done` به همان مرحله برمی‌گردد.

---

## Draft auto-save (v1.5)

### `PAdminLTE.initAutosave(root)`

اتصال فرم‌های `[data-pa-autosave="key"]` — در `boot()` خودکار اجرا می‌شود.
مقادیر با تأخیر ۴۰۰ms در `localStorage` با کلید `pa:autosave:<key>` ذخیره و در
بارگذاری بعدی صفحه بازیابی می‌شود (به‌همراه توست اطلاع‌رسانی). دکمهٔ
`[data-pa-autosave-clear]` پیش‌نویس را پاک می‌کند.

رویدادها: `pa:autosave:save` و `pa:autosave:restore` با `{ key, el, data }`.

---

## Sortable lists (v1.5)

### `PAdminLTE.initSortables(root)`

اتصال لیست‌های `[data-pa-sortable]` — در `boot()` خودکار اجرا می‌شود.
آیتم‌ها باید `.pa-sort-item` باشند؛ اگر `.pa-sort-handle` داخل آیتم باشد فقط
دستگیره درگ می‌شود، در غیر این صورت کل آیتم. شماره‌گذاری `.pa-sort-index` خودکار است.

رویداد: `pa:sortable:change` با `{ el, order }` — آرایهٔ `data-pa-id` به ترتیب جدید.

---

## Connection status (v1.5)

### `PAdminLTE.initNetStatus()`

بنر وضعیت اتصال را می‌سازد و به رویدادهای `online`/`offline` گوش می‌دهد —
در `boot()` خودکار اجرا می‌شود (یک بار برای کل صفحه).

### `PAdminLTE.net.online`

وضعیت فعلی اتصال (`true`/`false`) — با احتساب override.

### `PAdminLTE.net.override(state)`

شبیه‌سازی وضعیت برای تست: `'offline'`، `'online'` یا `null` (بازگشت به وضعیت واقعی).
مقدار بازگشتی: وضعیت جدید.

رویدادها: `pa:net:online` و `pa:net:offline` با `{ simulated }`.

---

## Code blocks (v1.5)

### `PAdminLTE.initCodeBlocks(root)`

هر `pre[data-pa-code="lang"]` را در قاب `.pa-code` با هدر (برچسب زبان + دکمهٔ کپی)
می‌پیچد — در `boot()` خودکار اجرا می‌شود. دکمهٔ کپی از `copyToClipboard` استفاده می‌کند.

---

## Keyboard shortcuts (v1.5)

### `PAdminLTE.initShortcutsSheet()`

برگهٔ میانبرها (`?`) را می‌سازد و میان‌برهای سراسری را متصل می‌کند —
در `boot()` خودکار اجرا می‌شود. میان‌برها هنگام تایپ در فیلدها غیرفعال‌اند.

### `PAdminLTE.shortcuts.open()` / `.close()`

باز/بستن دستی برگهٔ میانبرها.

| میانبر | عمل |
| --- | --- |
| `Ctrl+K` / `⌘K` | پالت فرمان |
| `Shift+?` | برگهٔ میانبرها |
| `Shift+T` | `toggleTheme()` |
| `Shift+D` | `toggleDir()` |
| `Esc` | بستن برگهٔ میانبرها |

---

## Skip link (v1.5)

### `PAdminLTE.injectSkipLink()`

اگر صفحه لینک پرش نداشته باشد و `<main id="pa-main-content">` موجود باشد، لینک
«پرش به محتوای اصلی» را به‌عنوان اولین المان `body` تزریق می‌کند و `tabindex="-1"`
را روی main می‌گذارد — در `boot()` خودکار اجرا می‌شود (تکرار نمی‌شود).

---

## Site chrome (v1.7)

صفحات عمومیِ مستقل از داشبورد (فروشگاه، وبلاگ، انجمن و صفحات اطلاعاتی) به‌جای
سایدبار/هدرِ مدیریتی از یک پوستهٔ عمومی استفاده می‌کنند. کافی است در صفحه این دو
placeholder را بگذارید:

```html
<div data-pa-layout="site-nav"></div>     <!-- ناوبری چسبان با blur -->
<main class="pa-site-main" id="pa-main-content"> … </main>
<div data-pa-layout="site-footer"></div>  <!-- فوتر چندستونه -->
```

- ناوبری شامل: برند، لینک‌های خانه/فروشگاه/وبلاگ/انجمن/درباره/تماس، دکمهٔ تم و جهت،
  **سبد خرید با شمارندهٔ زندهٔ `[data-pa-cart-count]`** و ناحیهٔ احراز هویت
  (اگر کاربر وارد شده باشد منوی کاربر، وگرنه دکمهٔ «ورود») است.
- زیر ۹۰۰px لینک‌ها پشت دکمهٔ همبرگری جمع می‌شوند (`data-pa-site-burger`).
- لینک فعال صفحهٔ جاری خودکار کلاس `is-active` می‌گیرد.

## Shopping cart & store (v1.7)

### `PAdminLTE.cart`

سبد خرید واقعی و پایدار در `localStorage` (کلید `pa-cart`) — از `file://` هم کار می‌کند.

| متد | توضیح |
| --- | --- |
| `items()` | آرایهٔ اقلام سبد |
| `count()` | تعداد کل اقلام (با احتساب qty) |
| `total()` | جمع کل به تومان |
| `add(item, qty)` | افزودن/افزایش قلم؛ `item = {id, name, price, icon, color, href}` |
| `setQty(id, qty)` | تغییر تعداد؛ صفر یا منفی = حذف |
| `remove(id)` | حذف قلم |
| `clear()` | خالی کردن سبد |
| `sync()` | همگام‌سازی همهٔ نشان‌های `[data-pa-cart-count]` |

هر تغییر، رویداد `pa:cart` را روی `document` منتشر می‌کند (detail: `{count, total}`).

### روش declarative برای افزودن به سبد

```html
<button data-pa-cart-add
        data-pa-id="p1" data-pa-name="لپ‌تاپ ایسوس" data-pa-price="25000000"
        data-pa-item-icon="monitor" data-pa-item-color="#0d6efd"
        data-pa-qty="1">
  افزودن به سبد
</button>
```

اتصال رویدادها به‌صورت delegation روی `document` است؛ بنابراین روی گریدهای
بازرندرشده هم بدون `boot()` مجدد کار می‌کند. افزودن `data-pa-cart-goto` پس از افزودن
به سبد پرش به `cart.html` را انجام می‌دهد.

### `PAdminLTE.shop` (js/pa-shop.js)

منبع یگانهٔ دادهٔ فروشگاه نمونه — در shop/product/cart/checkout مشترک است.

| عضو | توضیح |
| --- | --- |
| `catalog` | آرایهٔ ۱۴ محصول: `{id, name, cat, brand, price, old, rating, reviews, badge, icon, color, stock, sold, added, desc, features}` |
| `byId(id)` | یافتن محصول با id |
| `money(n)` | «۲۵٬۰۰۰٬۰۰۰ ت» با ارقام فارسی |
| `discountPct(p)` | درصد تخفیف از `price` و `old` |
| `cats()` / `brands()` | دسته‌ها/برندهای یکتا با تعداد محصول |
| `shippingCost(subtotal)` | رایگان بالای ۵٬۰۰۰٬۰۰۰ تومان، وگرنه ۸۰٬۰۰۰ تومان |
| `couponPct(code)` | درصد کدهای تخفیف نمونه: `PADMIN10` و `WELCOME5` |

صفحات `product.html?id=…`، سبد خرید و تسویهٔ حساب همه از همین کاتالوگ و قواعد
سفارش استفاده می‌کنند؛ سفارش ثبت‌شده در `localStorage` (کلید `pa-orders`) ذخیره می‌شود.
