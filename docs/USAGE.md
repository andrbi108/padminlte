# راهنمای کامپوننت‌ها — PAdminLTE

این سند همهٔ کلاس‌های موجود در `css/padminlte.css` و الگوهای `data-pa-*` که در
`js/padminlte.js` به آن‌ها متصل می‌شوند را فهرست می‌کند. هر بخش با یک نمونهٔ کوتاه HTML
نشان داده شده است.

> برای راهنمای API جاوااسکریپت به [`API.md`](./API.md) و برای سفارشی‌سازی به [`CUSTOMIZE.md`](./CUSTOMIZE.md) مراجعه کنید.

---

## فهرست

- [Layout](#layout) — `pa-app`, `pa-sidebar`, `pa-main`, `pa-content`, `pa-row`, `pa-col-*`
- [Page header & breadcrumb](#page-header--breadcrumb)
- [Cards](#cards)
- [Buttons](#buttons)
- [Forms](#forms)
- [Tables & Datatables](#tables--datatables)
- [Badges](#badges)
- [Alerts](#alerts)
- [Modals](#modals)
- [Toasts](#toasts)
- [Tabs](#tabs)
- [Progress](#progress)
- [Small boxes](#small-boxes)
- [Info boxes](#info-boxes)
- [Avatars](#avatars)
- [Dropdowns](#dropdowns)
- [Charts](#charts)
- [User widget in header](#user-widget-in-header)
- [Skip link for a11y](#skip-link-for-a11y)
- [Icons](#icons)

---

## Layout

کانتینر ریشه `pa-app` است. دو بخش دارد: سایدبار (که با `data-pa-layout="sidebar"` از `pa-layout.js` تزریق می‌شود) و `pa-main` که خود شامل `pa-header` (تزریق‌شده) و `pa-content` است.

```html
<div class="pa-app">
  <div data-pa-layout="sidebar"></div>
  <div class="pa-main">
    <div data-pa-layout="header"></div>
    <main class="pa-content" id="pa-main-content">
      <!-- محتوای صفحه -->
    </main>
  </div>
</div>
```

### Grid — `pa-row` و `pa-col-*`

`pa-row` یک flex container با `gap: 1rem` است. ستون‌های موجود: `pa-col-3`, `pa-col-4`,
`pa-col-6`, `pa-col-8`, `pa-col-9`, `pa-col-12`. در عرض کمتر از 992px همه به 50٪ و در
کمتر از 576px به 100٪ تبدیل می‌شوند.

```html
<div class="pa-row">
  <div class="pa-col-3">.pa-col-3</div>
  <div class="pa-col-9">.pa-col-9</div>
</div>
<div class="pa-row">
  <div class="pa-col-4">.pa-col-4</div>
  <div class="pa-col-4">.pa-col-4</div>
  <div class="pa-col-4">.pa-col-4</div>
</div>
```

| کلاس         | عرض در دسکتاپ | عرض < 992px | عرض < 576px |
| ------------ | ------------ | ----------- | ----------- |
| `pa-col-3`   | 25%          | 50%         | 100%        |
| `pa-col-4`   | 33.33%       | 50%         | 100%        |
| `pa-col-6`   | 50%          | 50%         | 100%        |
| `pa-col-8`   | 66.66%       | 50%         | 100%        |
| `pa-col-9`   | 75%          | 50%         | 100%        |
| `pa-col-12`  | 100%         | 100%        | 100%        |

---

## Page header & breadcrumb

```html
<div class="pa-page-header">
  <div>
    <h1>داشبورد</h1>
    <div class="pa-breadcrumb">
      <a href="index.html">خانه</a>
      <span class="pa-sep">›</span>
      <span>داشبورد</span>
    </div>
  </div>
  <div class="pa-d-flex pa-gap-2">
    <button class="pa-btn pa-btn-outline pa-btn-sm">خروجی</button>
    <button class="pa-btn pa-btn-primary pa-btn-sm">افزودن</button>
  </div>
</div>
```

---

## Cards

ساختار ثابت: `pa-card` → `pa-card-header` / `pa-card-body` / `pa-card-footer`. در
`pa-card-header` یک `.pa-tools` می‌گذارید و داخلش دکمه‌هایی با `data-pa-card-tool`.

| مقدار `data-pa-card-tool` | رفتار                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `collapse`                | `.pa-card-body` را hide/show می‌کند و آیکون را عوض می‌کند.   |
| `remove`                  | کل کارت را با fade-out حذف می‌کند.                          |
| `refresh`                 | آیکون را 360 درجه می‌چرخاند و رویداد `pa:card:refresh` emit می‌کند. |

```html
<div class="pa-card">
  <div class="pa-card-header">
    <h3>عنوان کارت</h3>
    <div class="pa-tools">
      <button data-pa-card-tool="collapse" aria-label="جمع کردن"></button>
      <button data-pa-card-tool="refresh"  aria-label="بازخوانی"></button>
      <button data-pa-card-tool="remove"   aria-label="حذف"></button>
    </div>
  </div>
  <div class="pa-card-body">
    <p>محتوای کارت.</p>
  </div>
  <div class="pa-card-footer">فوتر کارت</div>
</div>
```

> آیکون دکمه‌های tools به‌صورت خودکار توسط `boot()` تزریق نمی‌شوند؛ می‌توانید از
> `data-pa-icon="maximize"` / `"minimize"` / `"refresh"` / `"x"` استفاده کنید.

---

## Buttons

کلاس پایه `pa-btn` است و رنگ‌ها با modifier می‌آیند.

| کلاس              | توضیح                                  |
| ----------------- | ------------------------------------- |
| `pa-btn`          | پایه                                   |
| `pa-btn-primary`  | آبی پررنگ                              |
| `pa-btn-secondary`| خاکستری                                |
| `pa-btn-success`  | سبز                                    |
| `pa-btn-danger`   | قرمز                                   |
| `pa-btn-warning`  | زرد (متن تیره)                         |
| `pa-btn-outline`  | کادر مرزی، بدون پس‌زمینه               |
| `pa-btn-ghost`    | شفاف                                   |
| `pa-btn-sm`       | کوچک                                   |
| `pa-btn-lg`       | بزرگ                                   |
| `pa-btn-block`    | عرض کامل (`width: 100%`)              |
| `pa-btn:disabled` / `.is-disabled` | غیرفعال                   |

```html
<button class="pa-btn pa-btn-primary">اصلی</button>
<button class="pa-btn pa-btn-success pa-btn-sm">کوچک سبز</button>
<button class="pa-btn pa-btn-outline pa-btn-lg">بزرگ کادردار</button>
<a class="pa-btn pa-btn-ghost pa-btn-block" href="#">لینک بلوکی</a>
```

---

## Forms

```html
<form data-pa-validate-form>
  <div class="pa-form-row">
    <div class="pa-form-group">
      <label for="name">نام</label>
      <input id="name" class="pa-input" type="text"
             data-pa-validate="required">
      <div class="pa-form-feedback"></div>
    </div>
    <div class="pa-form-group">
      <label for="email">ایمیل</label>
      <input id="email" class="pa-input" type="email"
             data-pa-validate="email">
      <div class="pa-form-feedback"></div>
    </div>
  </div>

  <div class="pa-form-group">
    <label for="pw">رمز</label>
    <input id="pw" class="pa-input" type="password"
           data-pa-validate="minlen" data-pa-minlen="6">
    <div class="pa-form-feedback"></div>
  </div>

  <div class="pa-form-group">
    <label for="age">سن</label>
    <input id="age" class="pa-input" type="text" data-pa-validate="number">
    <div class="pa-form-feedback"></div>
  </div>

  <div class="pa-form-group">
    <label for="site">وب‌سایت</label>
    <div class="pa-input-group">
      <span class="pa-input-addon"><span data-pa-icon="link" data-pa-icon-size="14"></span></span>
      <input id="site" class="pa-input" type="text" placeholder="example.com">
    </div>
  </div>

  <div class="pa-form-group">
    <label for="bio">بیو</label>
    <textarea id="bio" class="pa-textarea" rows="3"></textarea>
  </div>

  <div class="pa-form-group">
    <div class="pa-form-check">
      <input id="terms" type="checkbox" data-pa-validate="required">
      <label for="terms">قبول قوانین</label>
      <div class="pa-form-feedback"></div>
    </div>
  </div>

  <button type="submit" class="pa-btn pa-btn-primary">ذخیره</button>
</form>
```

### قواعد اعتبارسنجی

| `data-pa-validate` | شرط                                  | attribute مکمل         |
| ------------------ | ----------------------------------- | --------------------- |
| `required`         | مقدار نباید خالی باشد                | —                     |
| `email`            | الگوی ایمیل                            | —                     |
| `minlen`           | حداقل تعداد کاراکتر                  | `data-pa-minlen="6"` |
| `number`           | باید قابل parse به عدد باشد           | —                     |

اگر فیلد نامعتبر باشد، کلاس‌های `is-invalid` روی فیلد و روی `.pa-form-feedback` همسایه
گذاشته می‌شوند. اگر معتبر و دارای مقدار باشد، `is-valid` می‌گیرد. ارسال فرم با
`form[data-pa-validate-form]` به‌صورت خودکار `preventDefault` می‌شود و در صورت موفقیت،
رویداد `pa:form:valid` را emit می‌کند.

---

## Tables & Datatables

```html
<div class="pa-table-wrap">
  <table class="pa-table pa-table-striped pa-table-sm"
         data-pa-datatable
         data-pa-datatable-pagesize="5"
         data-pa-datatable-filter="#search">
    <thead>
      <tr>
        <th data-pa-sort>شناسه</th>
        <th data-pa-sort>نام</th>
        <th data-pa-sort>مبلغ</th>
        <th>وضعیت</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>۱</td><td>پویا</td><td>۱۰۰</td><td><span class="pa-badge pa-badge-success">تکمیل</span></td></tr>
      <tr><td>۲</td><td>امیر</td><td>۲۰۰</td><td><span class="pa-badge pa-badge-warning">در انتظار</span></td></tr>
    </tbody>
  </table>
</div>
<div data-pa-pagination class="pa-d-flex pa-gap-1"></div>
<input id="search" class="pa-input" type="search" placeholder="جستجو در جدول…">
```

| کلاس / attribute                | کارکرد                                          |
| ------------------------------- | ----------------------------------------------- |
| `pa-table`                      | جدول پایه                                       |
| `pa-table-striped`              | ردیف‌های زوج/فرد متمایز                          |
| `pa-table-sm`                   | padding کمتر                                    |
| `pa-table-wrap`                 | اسکرول افقی در صفحات کوچک                        |
| `data-pa-sort` روی `<th>`       | سرستون قابل مرتب‌سازی                            |
| `data-pa-datatable`             | فعال‌سازی خودکار pagination + sort + filter      |
| `data-pa-datatable-pagesize="N"`| تعداد ردیف در هر صفحه                            |
| `data-pa-datatable-filter="#id"`| selector ورودی فیلتر                            |
| `<div data-pa-pagination>`      | نگه‌دارندهٔ دکمه‌های صفحه‌بندی                   |

> ترتیب: اول متن داخل خانه به‌عنوان عدد parse می‌شود؛ اگر نشد، `localeCompare` استفاده
> می‌شود.

---

## Badges

```html
<span class="pa-badge pa-badge-primary">اصلی</span>
<span class="pa-badge pa-badge-secondary">ثانویه</span>
<span class="pa-badge pa-badge-success">موفق</span>
<span class="pa-badge pa-badge-info">اطلاع</span>
<span class="pa-badge pa-badge-warning">هشدار</span>
<span class="pa-badge pa-badge-danger">خطا</span>
```

رنگ متن در تم تیره به‌صورت خودکار روشن‌تر می‌شود.

---

## Alerts

هر alert یک دکمه با کلاس `pa-close` می‌تواند داشته باشد که با کلیک، alert را حذف می‌کند.

```html
<div class="pa-alert pa-alert-info">
  <span data-pa-icon="info"></span>
  <div class="pa-alert-body"><strong>اطلاع.</strong> این یک پیام اطلاع‌رسانی است.</div>
  <button class="pa-close" aria-label="بستن">&times;</button>
</div>

<div class="pa-alert pa-alert-success">
  <span data-pa-icon="check_circle"></span>
  <div class="pa-alert-body"><strong>موفق.</strong> عملیات با موفقیت انجام شد.</div>
  <button class="pa-close" aria-label="بستن">&times;</button>
</div>

<div class="pa-alert pa-alert-warning">…</div>
<div class="pa-alert pa-alert-danger">…</div>
```

---

## Modals

ساختار ثابت: `pa-modal-backdrop` (نگه‌دارندهٔ تاری، نقطهٔ anchor برای `id`) → `pa-modal`
→ `pa-modal-header` / `pa-modal-body` / `pa-modal-footer`. سایز با `pa-modal-sm` یا
`pa-modal-lg` روی `.pa-modal`.

```html
<div class="pa-modal-backdrop" id="myModal" role="dialog" aria-modal="true">
  <div class="pa-modal pa-modal-lg">
    <div class="pa-modal-header">
      <h3>عنوان</h3>
      <button class="pa-close" data-pa-modal-close aria-label="بستن">&times;</button>
    </div>
    <div class="pa-modal-body">
      <p>محتوای مودال.</p>
    </div>
    <div class="pa-modal-footer">
      <button class="pa-btn pa-btn-outline" data-pa-modal-close>بستن</button>
      <button class="pa-btn pa-btn-primary" data-pa-modal-close>ذخیره</button>
    </div>
  </div>
</div>
```

| attribute / API                     | کارکرد                                    |
| ----------------------------------- | ----------------------------------------- |
| `data-pa-modal-open="myModal"`      | باز کردن مودال با کلیک                     |
| `data-pa-modal-close`               | بستن نزدیک‌ترین `.pa-modal-backdrop`       |
| `PAdminLTE.openModal('myModal')`    | باز کردن با JS                              |
| `PAdminLTE.closeModal('myModal')`   | بستن با JS                                  |
| کلیک روی بک‌دراپ / فشردن `Esc`       | بستن خودکار                                |

---

## Toasts

توست با API جاوااسکریپت ساخته می‌شود؛ هیچ HTML لازم نیست.

```js
PAdminLTE.toast({
  kind: 'success',            // 'info' | 'success' | 'warning' | 'danger'
  title: 'ذخیره شد',
  message: 'اطلاعات با موفقیت ذخیره شد.',
  duration: 4000              // میلی‌ثانیه؛ 0 = بدون بستن خودکار
});
```

خروجی `{ el, dismiss }` است؛ `dismiss()` برای بستن دستی کاربرد دارد.

---

## Tabs

هر گروه تب با `[data-pa-tabs]` علامت‌گذاری می‌شود. دکمه‌های `.pa-tab` با
`data-pa-tab="id"` و پنل‌ها با `data-pa-panel="id"` (یا `id="id"`) به هم متصل می‌شوند.
اگر پنل‌ها در خارج از والد `[data-pa-tabs]` هستند، `data-pa-tabs-scope="document"` بگذارید.

```html
<div class="pa-tabs" data-pa-tabs>
  <button class="pa-tab is-active" data-pa-tab="t-home">خانه</button>
  <button class="pa-tab" data-pa-tab="t-profile">پروفایل</button>
  <button class="pa-tab" data-pa-tab="t-msg">پیام‌ها</button>
</div>

<div class="pa-tab-panel is-active" data-pa-panel="t-home">محتوای خانه</div>
<div class="pa-tab-panel" data-pa-panel="t-profile">محتوای پروفایل</div>
<div class="pa-tab-panel" data-pa-panel="t-msg">محتوای پیام‌ها</div>
```

وقتی پنل‌ها بیرون از والد تب‌ها هستند:

```html
<div class="pa-tabs" data-pa-tabs data-pa-tabs-scope="document">
  <button class="pa-tab" data-pa-tab="x">…</button>
</div>
<!-- … -->
<div class="pa-tab-panel" data-pa-panel="x">…</div>
```

---

## Progress

```html
<div class="pa-progress">
  <div class="pa-progress-bar" style="width:40%"></div>
</div>

<div class="pa-progress">
  <div class="pa-progress-bar pa-success" style="width:80%"></div>
</div>

<div class="pa-progress">
  <div class="pa-progress-bar pa-info"    style="width:60%"></div>
</div>

<div class="pa-progress">
  <div class="pa-progress-bar pa-warning" style="width:35%"></div>
</div>

<div class="pa-progress">
  <div class="pa-progress-bar pa-danger"  style="width:15%"></div>
</div>
```

عرض با `style="width:N%"` تنظیم می‌شود. رنگ‌های پشتیبانی‌شده: `pa-success`,
`pa-info`, `pa-warning`, `pa-danger`. اگر رنگی نگذارید، رنگ برند `--pa-primary` استفاده
می‌شود.

---

## Small boxes

کارت آماری رنگی برای داشبورد. رنگ با `pa-bg-{primary,success,info,warning,danger,secondary}`
می‌آید. ساختار درونی: `pa-inner` (عدد و توضیح)، `pa-icon-bg` (آیکون بزرگ نیمه‌شفاف) و
`pa-footer-link` (لینک پایین).

```html
<div class="pa-small-box pa-bg-primary">
  <div class="pa-inner">
    <h3>۱۵۰</h3>
    <p>سفارش جدید</p>
  </div>
  <span class="pa-icon-bg" data-pa-icon="cart" data-pa-icon-size="60"></span>
  <a class="pa-footer-link" href="pages/tables.html">جزئیات بیشتر</a>
</div>
```

---

## Info boxes

کارت افقی با آیکون رنگی سمت راست و متن سمت چپ.

```html
<div class="pa-info-box">
  <div class="pa-ib-icon pa-bg-info" data-pa-icon="cart"></div>
  <div class="pa-ib-body">
    <p class="pa-ib-text">سفارش‌های امروز</p>
    <p class="pa-ib-number">۲۴۵</p>
    <div class="pa-progress"><div class="pa-progress-bar pa-info" style="width:60%"></div></div>
  </div>
</div>
```

| کلاس            | نقش                                  |
| --------------- | ------------------------------------ |
| `pa-info-box`   | ظرف اصلی                             |
| `pa-ib-icon`    | بلوک آیکون 70×70; با `pa-bg-*` رنگی |
| `pa-ib-body`    | بدنهٔ متنی                           |
| `pa-ib-text`    | برچسب کوچک                           |
| `pa-ib-number`  | عدد بزرگ                             |

---

## Avatars

```html
<span class="pa-avatar pa-avatar-sm">پ</span>
<span class="pa-avatar pa-avatar-md">A</span>
<span class="pa-avatar pa-avatar-lg"><img src="avatar.jpg" alt=""></span>

<!-- لیست آورلپ‌شده -->
<div class="pa-avatar-list">
  <span class="pa-avatar pa-avatar-sm">پ</span>
  <span class="pa-avatar pa-avatar-sm">ا</span>
  <span class="pa-avatar pa-avatar-sm">س</span>
</div>
```

اگر داخل `pa-avatar` یک `<img>` باشد، خودش با `object-fit: cover` فیت می‌شود.

---

## Dropdowns

```html
<div class="pa-dropdown">
  <button class="pa-icon-btn" data-pa-dropdown-toggle aria-label="منو">
    <span data-pa-icon="cog"></span>
  </button>
  <div class="pa-dropdown-menu" role="menu">
    <div class="pa-dropdown-header">تنظیمات</div>
    <a class="pa-dropdown-item" href="#"><span data-pa-icon="user" data-pa-icon-size="16"></span>پروفایل</a>
    <a class="pa-dropdown-item" href="#"><span data-pa-icon="cog" data-pa-icon-size="16"></span>تنظیمات</a>
    <div class="pa-dropdown-divider"></div>
    <a class="pa-dropdown-item" href="#"><span data-pa-icon="logout" data-pa-icon-size="16"></span>خروج</a>
    <div class="pa-dropdown-footer">نسخهٔ ۱.۰.۰</div>
  </div>
</div>
```

| کلاس                  | نقش                              |
| --------------------- | -------------------------------- |
| `pa-dropdown`         | ظرف relative                     |
| `pa-dropdown-menu`    | منوی popover                     |
| `pa-dropdown-item`    | آیتم منو                         |
| `pa-dropdown-header`  | هدر منو                          |
| `pa-dropdown-divider` | خط جداکننده                       |
| `pa-dropdown-footer`  | فوتر منو                         |

بستن منو با کلیک خارج، یا فشردن `Esc`.

---

## Charts

هر چارت با `<canvas data-pa-chart="..." data-pa-chart-data='...JSON...'>` کار می‌کند و
به‌صورت خودکار در `boot()` رندر می‌شود. دور آن را با `<div class="pa-chart-wrap">`
بپوشانید تا ارتفاع ثابت بگیرد.

### Line chart

```html
<div class="pa-chart-wrap">
  <canvas data-pa-chart="line"
    data-pa-chart-data='{
      "data": {
        "labels": ["فرو","ارد","خرد","تیر","مرد","شهر"],
        "series": [
          { "label": "فروش", "values": [12, 19, 15, 25, 22, 30] },
          { "label": "هزینه", "values": [8, 12, 10, 15, 18, 20] }
        ]
      },
      "options": {
        "colors": ["#0d6efd", "#dc3545"],
        "area": true,
        "points": true
      }
    }'></canvas>
</div>
```

شکل `data`:
```ts
{
  labels: string[],
  series: { label?: string, values: number[] }[]
}
```

گزینه‌های پشتیبانی‌شده در `options`:
- `colors`: آرایهٔ رنگ‌ها (پیش‌فرض: `["#0d6efd","#198754","#ffc107","#dc3545"]`)
- `area`: پر کردن ناحیه زیر خط (پیش‌فرض `true`؛ `false` برای غیرفعال)
- `points`: رسم نقاط (پیش‌فرض `true`)

### Bar chart

```html
<div class="pa-chart-wrap">
  <canvas data-pa-chart="bar"
    data-pa-chart-data='{
      "data": {
        "labels": ["فروردین","اردیبهشت","خرداد"],
        "series": [
          { "label": "فروش", "values": [30, 45, 28] },
          { "label": "هدف",  "values": [40, 40, 40] }
        ]
      },
      "options": { "colors": ["#0d6efd", "#adb5bd"] }
    }'></canvas>
</div>
```

شکل `data` مانند line. گزینهٔ پشتیبانی‌شده: `colors`.

### Donut chart

`data` یک آرایه از `{value:number, label?:string}` است.

```html
<div class="pa-chart-wrap">
  <canvas data-pa-chart="donut"
    data-pa-chart-data='{
      "data": [
        { "value": 35, "label": "مستقیم" },
        { "value": 25, "label": "ارجاعی" },
        { "value": 20, "label": "اجتماعی" },
        { "value": 20, "label": "سایر" }
      ],
      "options": {
        "colors": ["#0d6efd","#198754","#ffc107","#dc3545"],
        "centerLabel": "بازدید"
      }
    }'></canvas>
</div>
```

گزینه‌ها: `colors` (تا ۶ رنگ پیش‌فرض)، `centerLabel` (متن زیر عدد کل).

### Sparkline

یک چارت خطی کوچک بدون محور.

```html
<canvas data-pa-chart="sparkline"
  data-pa-chart-data='{
    "values": [4, 8, 6, 12, 9, 15, 11, 18],
    "color": "#0d6efd"
  }'
  style="height:32px"></canvas>
```

> توضیح فنی: تابع `boot` فیلد `data-pa-chart-data` را `JSON.parse` می‌کند و اگر کلید
> `data` داشت از آن، وگرنه کل شیء را به‌عنوان `data` می‌دهد. `options` را نیز از همان
> شیء می‌خواند. برای نمونه‌های خطی/بار/دونات فرمت `{data:{...}, options:{...}}` توصیه
> می‌شود تا رنگ‌ها به‌درستی اعمال شوند.

### Legend (اختیاری، دستی)

```html
<div class="pa-chart-legend">
  <span class="pa-cl-item"><span class="pa-cl-dot" style="background:#0d6efd"></span> فروش</span>
  <span class="pa-cl-item"><span class="pa-cl-dot" style="background:#dc3545"></span> هزینه</span>
</div>
```

---

## User widget in header

این ویجت داخل `pa-header` توسط `pa-layout.js` تزریق می‌شود. اگر در صفحهٔ دلخواه می‌خواهید
از آن استفاده کنید:

```html
<button class="pa-user-widget" data-pa-dropdown-toggle>
  <span class="pa-avatar pa-avatar-md">A</span>
  <span class="pa-uw-text">
    <span class="pa-uw-name">امیر رضایی</span>
    <span class="pa-uw-role">مدیر</span>
  </span>
  <span data-pa-icon="chevron_down" data-pa-icon-size="14"></span>
</button>
```

---

## Skip link for a11y

اولین المان قابل focus در صفحه باشد. با focus به گوشهٔ چپ-بالا می‌آید.

```html
<a class="pa-skip-link" href="#pa-main-content">پرش به محتوا</a>
```

و در main:
```html
<main class="pa-content" id="pa-main-content" tabindex="-1">…</main>
```

---

## Icons

هر المانی با `data-pa-icon="name"` در زمان `boot()` به یک SVG inline با
`stroke="currentColor"` تبدیل می‌شود. سایز با `data-pa-icon-size="N"` (به پیکسل).

```html
<button class="pa-btn pa-btn-primary">
  <span data-pa-icon="download" data-pa-icon-size="16"></span> دانلود
</button>
```

برای دیدن فهرست کامل نام‌ها به [`CUSTOMIZE.md`](./CUSTOMIZE.md#افزودن-آیکون-جدید) مراجعه
کنید. اگر نام آیکون اشتباه باشد، آیکون `question` نمایش داده می‌شود و هشدار در کنسول
چاپ می‌گردد.

برای تزریق آیکون‌ها روی محتوای پویا:

```js
PAdminLTE.injectIcons(myContainer);
```
