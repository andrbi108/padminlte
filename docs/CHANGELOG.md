# تاریخچهٔ تغییرات — PAdminLTE

> همهٔ تغییرات قابل مشاهده در: <https://github.com/andrbi108/padminlte/releases>

این پروژه از مدل نسخه‌بندی **Semantic Versioning** پیروی می‌کند:
`MAJOR.MINOR.PATCH` — تغییرات ناسازگار، افزودن قابلیت به‌صورت سازگار، و رفع باگ.

---

## [1.0.0] — 2026-11-06

اولین انتشار عمومی. هدف این نسخه، بازخلقی کامل AdminLTE v4 به‌صورت
**zero-dependency** و قابل اجرا از `file://` است — بدون Bootstrap، بدون jQuery،
بدون CDN و بدون build step.

### Added — قابلیت‌های اصلی

#### سیستم طراحی مبتنی بر CSS Custom Properties

- توکن‌های رنگ برند (`--pa-primary` تا `--pa-dark`) و soft tints (`--pa-*-soft`).
- توکن‌های سطح صفحه (`--pa-bg`, `--pa-surface`, `--pa-surface-2`, `--pa-surface-3`,
  `--pa-border`, `--pa-text`, `--pa-text-muted`, `--pa-text-soft`).
- توکن‌های سایدبار و هدر (`--pa-sidebar-*`, `--pa-header-*`).
- توکن‌های متریک layout (`--pa-sidebar-width`, `--pa-sidebar-mini-width`,
  `--pa-header-height`, `--pa-content-padding`, `--pa-radius`, `--pa-radius-lg`).
- توکن‌های تایپوگرافی (`--pa-font-family`, `--pa-font-mono`, `--pa-font-size`,
  `--pa-line-height`).
- توکن‌های سایه و ترانزیشن (`--pa-shadow`, `--pa-shadow-lg`, `--pa-transition`).

#### تم تیره و روشن

- تم تیره با `[data-pa-theme="dark"]` به‌صورت کامل override می‌شود.
- تشخیص خودکار `prefers-color-scheme` در نبود تنظیمات ذخیره‌شده.
- ذخیره‌سازی در `localStorage` زیر کلید `pa-theme`.
- API: `getTheme`, `setTheme`, `toggleTheme`.
- دکمهٔ `[data-pa-theme-toggle]` با آیکون پویا.

#### پشتیبانی کامل RTL و LTR

- پیش‌فرض صفحات RTL است، اما CSS با `[dir="rtl"]` / `[dir="ltr"]` تطبیق می‌یابد.
- API: `getDir`, `setDir`, `toggleDir`.
- دکمهٔ `[data-pa-dir-toggle]` در header.
- ذخیره‌سازی در `localStorage` زیر کلید `pa-dir`.

#### Layout

- `pa-app` به‌عنوان کانتینر ریشه.
- `pa-sidebar` ثابت با سه حالت `expanded`, `mini`, `collapsed`.
- حالت موبایل (≤992px): سایدبار به‌صورت overlay با کلاس `pa-sidebar-open`.
- تزریق layout با JavaScript به‌جای `fetch`/`iframe` (برای کارکرد روی `file://`).
- placeholder‌های `data-pa-layout="sidebar|header|footer"`.
- API: `getSidebarState`, `setSidebarState`, `toggleSidebar`.

#### شبکهٔ گرید

- `pa-row` با gap استاندارد 1rem.
- ستون‌ها: `pa-col-3`, `pa-col-4`, `pa-col-6`, `pa-col-8`, `pa-col-9`, `pa-col-12`.
- نقطهٔ شکست 992px (به 50٪) و 576px (به 100٪).

#### کامپوننت‌های UI

- **Cards**: `pa-card`, `pa-card-header`, `pa-card-body`, `pa-card-footer` با ابزار
  `data-pa-card-tool="collapse|remove|refresh"`.
- **Buttons**: `pa-btn` با رنگ‌های primary/secondary/success/danger/warning/outline/ghost
  و سایزهای sm/lg/block.
- **Forms**: `pa-form-group`, `pa-input`, `pa-select`, `pa-textarea`, `pa-input-group`,
  `pa-input-addon`, `pa-form-check`, `pa-form-row`, `pa-form-feedback`, `is-valid`,
  `is-invalid`. اعتبارسنجی با `data-pa-validate="required|email|minlen|number"` و
  `data-pa-minlen="N"`. فرم با `data-pa-validate-form` به‌صورت خودکار هندل می‌شود.
- **Tables**: `pa-table`, `pa-table-striped`, `pa-table-sm`, `pa-table-wrap`.
- **Datatable**: `data-pa-datatable`, `data-pa-datatable-pagesize`,
  `data-pa-datatable-filter`, `data-pa-sort`, `data-pa-pagination`. مرتب‌سازی، فیلتر
  و صفحه‌بندی سمت کلاینت.
- **Badges**: `pa-badge` با شش رنگ.
- **Alerts**: `pa-alert` با چهار رنگ و دکمهٔ close.
- **Modals**: `pa-modal-backdrop`, `pa-modal`, `pa-modal-header`, `pa-modal-body`,
  `pa-modal-footer`, `pa-modal-sm`, `pa-modal-lg`. بستن با Esc، کلیک روی backdrop،
  یا `data-pa-modal-close`.
- **Toasts**: `PAdminLTE.toast({kind, title, message, duration})` با چهار نوع.
- **Tabs**: `pa-tabs` + `pa-tab` + `pa-tab-panel` با پشتیبانی از scope سراسری.
- **Progress**: `pa-progress` + `pa-progress-bar pa-{success,info,warning,danger}`.
- **Small boxes**: `pa-small-box pa-bg-{primary,success,info,warning,danger,secondary}`
  با ساختار `pa-inner` / `pa-icon-bg` / `pa-footer-link`.
- **Info boxes**: `pa-info-box` با `pa-ib-icon pa-bg-*`, `pa-ib-body`, `pa-ib-text`,
  `pa-ib-number`.
- **Avatars**: `pa-avatar pa-avatar-{sm,md,lg}` و `pa-avatar-list`.
- **Dropdowns**: `pa-dropdown`, `pa-dropdown-menu`, `pa-dropdown-item`,
  `pa-dropdown-header`, `pa-dropdown-divider`, `pa-dropdown-footer` با toggle از نوع
  `data-pa-dropdown-toggle`.
- **User widget در header**: `pa-user-widget`, `pa-uw-name`, `pa-uw-role`.
- **Skip link برای دسترس‌پذیری**: `pa-skip-link`.

#### سیستم آیکون inline SVG

- بیش از ۹۰ آیکون داخلی بدون نیاز به icon font یا CDN.
- هر المان با `data-pa-icon="name"` به‌صورت خودکار به SVG inline تبدیل می‌شود.
- کنترل سایز با `data-pa-icon-size="N"`.
- API: `PAdminLTE.icon(name, size)` و `PAdminLTE.injectIcons(root)`.
- شیء کامل `PAdminLTE.ICONS` برای دسترسی برنامه‌نویسی.
- رنگ با `currentColor` هماهنگ می‌شود.
- در صورت نامعتبر بودن نام، آیکون `question` نمایش داده می‌شود.

#### چارت‌های Canvas بومی

- چهار نوع چارت: `line`, `bar`, `donut`, `sparkline`.
- HiDPI-aware (استفاده از `devicePixelRatio`).
- تطبیق خودکار رنگ‌های محور با تم.
- فعال‌سازی declarative با `data-pa-chart` و `data-pa-chart-data`.
- API: `lineChart`, `barChart`, `donutChart`, `sparkline`.
- پشتیبانی از area fill و points برای line chart.

#### Event bus داخلی

- API سبک: `PAdminLTE.on(name, fn)`, `off(name, fn)`, `emit(name, payload)`.
- ۹ رویداد داخلی: `pa:ready`, `pa:theme`, `pa:dir`, `pa:sidebar`,
  `pa:modal:open`, `pa:modal:close`, `pa:card:refresh`, `pa:datatable:render`,
  `pa:form:valid`.

#### صفحه‌های نمونه

- `index.html`, `index2.html`, `index3.html` — داشبوردهای گوناگون.
- `pages/widgets.html`, `pages/charts.html`, `pages/tables.html`, `pages/forms.html`.
- `pages/profile.html`, `pages/users.html`, `pages/calendar.html`, `pages/chat.html`.
- `pages/invoice.html`, `pages/faq.html`, `pages/gallery.html`.
- `pages/blank.html`, `pages/settings.html`.
- `pages/login.html`, `pages/register.html`.
- `pages/404.html`, `pages/500.html`.

### Removed — آنچه حذف شده در مقایسه با AdminLTE اصلی

- وابستگی به **Bootstrap 5** حذف شد. هیچ CSS یا JS از Bootstrap استفاده نمی‌شود.
- وابستگی به **jQuery** حذف شد. همهٔ کد vanilla است.
- وابستگی به **OverlayScrollbars** و **Chart.js** حذف شد.
- هیچ **CDN خارجی** در هیچ صفحه‌ای استفاده نمی‌شود.
- هیچ **build step** لازم نیست.

### Documentation

- `docs/INSTALL.md` — راهنمای نصب و استقرار روی GitHub Pages / Netlify / Vercel /
  Nginx / Apache.
- `docs/USAGE.md` — راهنمای همهٔ کامپوننت‌ها با مثال.
- `docs/CUSTOMIZE.md` — سفارشی‌سازی تم، فونت، فاصله‌ها، آیکون و منو.
- `docs/API.md` — مرجع کامل API جاوااسکریپت.
- `docs/ARCHITECTURE.md` — تصمیمات طراحی و معماری داخلی.
- `docs/CHANGELOG.md` — همین فایل.

### Minimum browser requirements

- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.
- استفاده از CSS Custom Properties, `:focus-visible`, `color-scheme`,
  `aspect-ratio`, `grid auto-fit`, HiDPI canvas.

---

## الگوی انتشارهای آینده

- **PATCH** (`1.0.x`): رفع باگ، بهبود دسترس‌پذیری، اصلاح استایل.
- **MINOR** (`1.x.0`): افزودن کامپوننت یا آیکون جدید به‌صورت سازگار.
- **MAJOR** (`x.0.0`): تغییرات ناسازگار در API یا کلاس‌ها.
