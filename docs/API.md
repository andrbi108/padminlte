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
