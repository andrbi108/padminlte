# تاریخچهٔ تغییرات — PAdminLTE

> همهٔ تغییرات قابل مشاهده در: <https://github.com/andrbi108/padminlte/releases>

این پروژه از مدل نسخه‌بندی **Semantic Versioning** پیروی می‌کند:
`MAJOR.MINOR.PATCH` — تغییرات ناسازگار، افزودن قابلیت به‌صورت سازگار، و رفع باگ.

---

## [1.2.0] — 2026-11-07

به‌روزرسانی بزرگ سوم: ۱۰ صفحهٔ جدید (از جمله CRUD کامل)، موتور نمودار جدید (انیمیشن + tooltip)، گالری چندحالته با لایت‌باکس، دکمهٔ بازگشت به بالا، ۹ کامپوننت جدید، ۲۵+ انیمیشن، پاک‌سازی کامل لینک‌های «#» و اصلاح هم‌پوشانی ویجت کاربر در هدر.

### Added

#### صفحات جدید (۱۰)
- `pages/crud.html` — مدیریت محصولات: CRUD کامل سمت کلاینت (جستجو، فیلتر، صفحه‌بندی، انتخاب گروهی، مودال افزودن/ویرایش، حذف با تأیید، ذخیره در localStorage، شمارنده‌های انیمیشنی)
- `pages/crud-users.html` — مدیریت کاربران با همان امکانات
- `pages/orders.html` — لیست سفارش‌ها با فیلتر وضعیت، مودال جزئیات، تغییر وضعیت و نمودار هفته
- `pages/components.html` — نمایشگاه کامپوننت‌ها: آکاردئون، کاروسل، امتیازدهی، رینگ، مراحل، چیپس، درخت، تولتیپ، شمارنده، نوار پیشرفت، تب
- `pages/timeline.html` — تایم‌لاین فعالیت‌ها با reveal انیمیشنی
- `pages/team.html` — صفحهٔ تیم با امتیازدهی فقط‌خواندنی
- `pages/projects.html` — کارت‌های پروژه با نوار پیشرفت و مودال افزودن/ویرایش (localStorage)
- `pages/coming-soon.html` — صفحهٔ «به‌زودی» با شمارش معکوس زنده
- `pages/privacy.html` و `pages/terms.html` — صفحات حقوقی

#### کامپوننت‌های جدید (declarative, auto-init)
- **آکاردئون** — `data-pa-accordion` (حالت تک/چند باز)
- **کاروسل** — `data-pa-carousel` (پخش خودکار، لمس/swipe، نقطه‌ها و فلش‌ها، سازگار با RTL)
- **لایت‌باکس** — `PAdminLTE.lightbox.open(items, index)` با فلش قبلی/بعدی، شمارنده، کیبورد (Escape/فلش‌ها) و پشتیبانی RTL
- **امتیازدهی ستاره‌ای** — `data-pa-rating` (فقط‌خواندنی/تعاملی)
- **شمارندهٔ انیمیشنی** — `data-pa-counter="2500"` با IntersectionObserver
- **حلقهٔ پیشرفت SVG** — `data-pa-ring="72"`
- **نمایش تدریجی هنگام اسکرول** — `data-pa-reveal` (up/right/left/zoom)
- **چیپس قابل حذف** — `.pa-chip` + `.pa-chip-x`
- **مراحل (Stepper)** — `.pa-steps` / `.pa-step`
- **درخت** — `.pa-tree` با details/summary
- **تولتیپ CSS** — `data-pa-tip="متن"`
- **افکت Ripple** روی همهٔ دکمه‌ها
- **دکمهٔ بازگشت به بالا** — به‌صورت خودکار در همهٔ صفحات تزریق می‌شود (بعد از ۲۴۰px اسکرول)

#### نمودارها — موتور v2
- انیمیشن رسم با requestAnimationFrame و easing (خط/میله/دونات/اسپارک‌لاین)
- **tooltip هاور** برای همهٔ نمودارها: حالت برچسب (index) مثل Chart.js برای خط و میله، برش‌های دونات با بزرگ‌نمایی هاور
- راهنمای خط‌چین و بزرگ‌شدن نقاط هنگام هاور، نمایش مقدار روی میله‌ها
- ترسیم مجدد خودکار هنگام تغییر تم و تغییر اندازهٔ پنجره

### Changed
- گالری کاملاً بازنویسی شد: سه حالت نمایش (شبکه‌ای/ماسونری/فهرستی)، فیلتر دسته‌بندی، جستجوی زنده و لایت‌باکس جدید
- نسخه‌ها در layout به ۱.۲.۰ به‌روزرسانی شد

### Fixed
- **هم‌پوشانی «امیر رضایی / مدیر» در هدر**: `.pa-uw-name` و `.pa-uw-role` به‌صورت بلوک چیده شدند، `text-align:start`، برش با «…» و پنهان‌سازی متن ویجت کاربر در موبایل
- **استایل `.pa-small-box .pa-icon-bg` مطابق مشخصات بازنویسی شد**: در RTL آیکون تزئینی به لبهٔ چپ (`left:4rem; bottom:2.25rem`) و در LTR به لبهٔ راست (`right:2rem; bottom:2.25rem`) چسبیده می‌شود
- **تم صفحهٔ لندینگ**: دکمهٔ تم هم‌زمان دو هندلر داشت (`data-pa-theme-toggle` + `onclick`) و دوبار toggle می‌شد؛ `onclick` حذف و `data-pa-theme="light"` هاردکد حذف شد
- **مودال‌ها**: سلکتور خراب در `openModal` و پشتیبانی از فرم `#id` اضافه شد
- **۱۸۴ لینک «#» پاک‌سازی شد**: لینک‌های اعلان/پیام هدر به صفحات واقعی، برچسب‌ها و دسته‌ها به لیست مطالب، نتایج جستجو به صفحات مرتبط، دکمه‌های اشتراک‌گذاری به URLهای واقعی share، اکشن‌های (پسند/پاسخ/نقل‌قول) به `<button>` واقعی با کلاس `.pa-link-btn`، و TOC مقاله به لنگرهای درون‌صفحه‌ای
- **صفر لینک شکسته** — ممیزی کامل همهٔ ۵۶ صفحه

### Verification
- ۵۶/۵۶ صفحه PASS در تست smoke با Playwright (بدون خطای کنسول)

---

## [1.1.1] — 2026-11-07

رفع باگ‌های ناوبری و آیکون‌ها گزارش‌شده توسط کاربر.

### Fixed

#### ناوبری (لینک‌دهی)
- **سیستم resolve مسیر در `pa-layout.js`**: لینک‌های canonical (از دید ریشهٔ پروژه: `index.html`، `pages/xxx.html`) حالا بر اساس موقعیت صفحهٔ فعلی به مسیر صحیح تبدیل می‌شوند — در صفحات ریشه به‌صورت همان، و در صفحات `pages/` پیشوند `pages/` حذف و برای فایل‌های ریشه `../` اضافه می‌شود. این باگ باعث می‌شد **منوی کناری در تمام صفحات `pages/*` به `pages/pages/...` هدایت کند**.
- تابع `resolve()` روی همهٔ لینک‌های layout اعمال شد: لینک‌های sidebar، برند، dropdownهای header (اعلان‌ها، پیام‌ها، حساب کاربری) و footer.
- **اصلاح مسیرهای `index2.html` و `index3.html`**: این دو داشبورد در ریشه قرار دارند اما مسیرهای assetها (`../css/...`، `../js/...`) و لینک خانه (`../index.html`) را به‌صورت صفحات داخل پوشه نوشته بودند — نتیجه: CSS و JS اصلاً لود نمی‌شد. حالا مسیرها `css/...`، `js/...` و `index.html` هستند.
- **۴ لینک به صفحات ناموجود اصلاح شد**: `docs/USAGE.html`، `docs/API.html`، `changelog.html`، `roadmap.html` → به نسخهٔ Markdown مستندات در گیت‌هاب اشاره می‌کنند (external با `target="_blank"`).
- لینک «مستندات» در footer از `docs/README.html` (ناموجود) به README گیت‌هاب اصلاح شد و نسخهٔ نمایش‌داده‌شده به ۱.۱.۰ به‌روزرسانی شد.

#### آیکون‌ها
- **افزودن آیکون `arrow_left`** که در لینک‌های «جزئیات بیشتر» داشبورد استفاده شده بود اما تعریف نشده بود (خطای کنسول: `[PAdminLTE] Unknown icon: arrow_left`).

### Verification
- بررسی استاتیک: **۳۶۰ لینک محلی معتبر، ۰ لینک شکسته** در تمام ۴۶ صفحه.
- بررسی runtime با Playwright:
  - لینک‌های sidebar در صفحهٔ ریشه: canonical ✓
  - لینک‌های sidebar در `pages/*`: کاملاً resolve شده (sibling + `../`) ✓
  - کلیک روی لینک sibling → ناوبری صحیح ✓
  - کلیک برند از `pages/faq.html` → ریشه ✓
  - **صفر هشدار «Unknown icon»** در کنسول ✓
- تست smoke کامل: **۴۶/۴۶ صفحه PASS**.

---

## [1.1.0] — 2026-11-07

به‌روزرسانی بزرگ: افزودن ۲۶ صفحهٔ جدید، ۱۷۸ آیکون جدید، ۸ بخش CSS جدید، ۷ متد JavaScript جدید، و فعال‌سازی GitHub Pages.

### Added — قابلیت‌های جدید

#### آیکون‌ها
- **۱۷۸ آیکون SVG inline جدید** به `pa-icons.js` اضافه شد (مجموعاً ۲۷۳ آیکون).
- دسته‌بندی‌های جدید: بلاگ و محتوا (book, book_open, library, pen, highlighter, hashtag, message_circle, message_square, comments, thumbs_up, flame, pin, award, sparkles, zap, rocket)، فروشگاه (shopping_bag, shopping_cart, credit_card_alt, wallet, tag_alt, tags, percent, gift_alt, truck, package_alt, store)، امنیت و احراز هویت (key_alt, fingerprint, qr_code, scan, shield_check, shield_alt, lock_open, mail_check, mail_open, send_alt, inbox, reply, forward, archive_alt)، مدیریت فایل (folder_open, folder_plus, file_text, file_image, file_video, file_audio, file_pdf, file_code, file_archive, hard_drive, cloud, cloud_upload, cloud_download, upload_alt, camera, camera_off)، کانبان و وظایف (columns, grip, check_square, square, circle, check_check, bell_ring, alert_triangle, alert_circle, info_alt)، شبکه‌های اجتماعی (twitter, facebook, instagram, linkedin, youtube, telegram, whatsapp)، ارتباط (phone_call, video, video_off, mic, play, pause, skip_forward, volume)، توسعه (code_alt, terminal_alt, bug, cpu_alt, database_alt, server_alt, network, git_branch)، دستگاه‌ها (smartphone, tablet, monitor, tv, watch)، ویرایشگر زنده (pen_tool, paint_bucket, bold, italic, underline, strikethrough, quote, align_left, align_center, align_right, list_alt, list_ordered) و ده‌ها مورد دیگر.

#### CSS — ۲۲ بخش جدید (sections 29-50)
- **بخش ۲۹ — Extended palette**: ۷ رنگ برند جدید (purple, pink, indigo, teal, cyan, orange, brown) با gradient classes، badge variants، button variants و progress bar variants.
- **بخش ۳۰ — Animations**: ۱۵ keyframe animation (slide-in-up/down/right/left, zoom-in, bounce, pulse, shake, spin, tada, flash, heartbeat, shimmer, float, glow, ripple) با utility classes و delay variants. شامل `prefers-reduced-motion` support.
- **بخش ۳۱ — Hover effects**: ۷ الگوی hover (lift, glow, scale, rotate, shadow, overlay, underline) برای کارت‌ها و کامپوننت‌ها.
- **بخش ۳۲ — Typography scale**: utility classes برای font-size (`pa-text-xs` تا `pa-text-5xl`)، weight، style، transform، line-clamp، leading.
- **بخش ۳۳ — File upload**: dropzone با drag-and-drop، preview، progress bar، file items.
- **بخش ۳۴ — OTP input**: ۶ ورودی جداگانه با حالت‌های filled/error/success.
- **بخش ۳۵ — Notification items**: با icon backgrounds، unread state، time stamp.
- **بخش ۳۶ — Blog & content cards**: blog-card با thumb/category/meta/excerpt/footer، article styles با blockquote/code/pre.
- **بخش ۳۷ — Shop & product cards**: product-card با hover actions، badges، rating، price، cart-item با qty-stepper.
- **بخش ۳۸ — Forum**: forum-topic، forum-post با author info، role badge، action buttons.
- **بخش ۳۹ — Kanban board**: kanban-col با header/count، kanban-card با tags/priority/footer، add-card button.
- **بخش ۴۰ — Landing & marketing**: landing-nav، hero با blobs، features-grid، pricing-grid با featured state، testimonial، CTA banner.
- **بخش ۴۱ — Landing footer**: ۴ ستون با link lists، social icons.
- **بخش ۴۲ — Search results**: result items با title/url/excerpt و `<mark>` highlighting.
- **بخش ۴۳ — Mailbox**: ۳-column grid، folder list، mail row با avatar/star/time، unread state.
- **بخش ۴۴ — User panel**: userpanel-sidebar با menu items، header با avatar.
- **بخش ۴۵ — Tag cloud**: tags با ۵ اندازه (xs تا xl).
- **بخش ۴۶ — Category list**: category-item با icon، name، count، chevron.
- **بخش ۴۷ — Timeline**: vertical timeline با items و حالت‌های success/warning/danger.
- **بخش ۴۸ — LiveEdit playground**: ۲-column grid با tabs، panes، و iframe preview.
- **بخش ۴۹ — Stat list**: stat-card با icon backgrounds.
- **بخش ۵۰ — Misc utilities**: ۳۰+ utility class جدید (cursor، position، overflow، rounded، shadow، opacity، border، background، padding/margin)، print styles، skeleton loading.

#### JavaScript — ۷ متد جدید
- `PAdminLTE.initFileUpload(root)` — auto-bind `[data-pa-file-upload]` با drag-and-drop، preview، multiple files، max-files، progress bar شبیه‌سازی شده.
- `PAdminLTE.initOtpInputs(root)` — auto-bind `[data-pa-otp="6"]` با auto-advance، paste support، arrow navigation، Backspace handling، hidden input برای form submission.
- `PAdminLTE.initLiveEdit(root)` — auto-bind `[data-pa-liveedit]` با HTML/CSS/JS panes، debounced live preview در iframe، run/reset buttons، tab switching.
- `PAdminLTE.initQtySteppers(root)` — auto-bind `[data-pa-qty]` با +/- buttons و min/max enforcement.
- `PAdminLTE.initKanban(root)` — auto-bind `[data-pa-kanban]` با native HTML5 drag-and-drop بین columns.
- `PAdminLTE.countdown(element, seconds, opts)` — countdown timer با onTick/onComplete callbacks.
- `PAdminLTE.copyToClipboard(text, opts)` — کپی به clipboard با fallback برای مرورگرهای قدیمی + toast.
- `PAdminLTE.notify(opts)` — alias برای toast با options بیشتر.
- `PAdminLTE.markAllNotificationsRead(selector)` — علامت‌گذاری همهٔ اعلان‌های خوانده‌نشده.
- `PAdminLTE.initSearchableLists(root)` — auto-bind `[data-pa-searchable-list]` برای فیلتر زنده.

#### Data attributes جدید برای auto-init
- `data-pa-file-upload="#list-id"` + `data-pa-max-files="8"` — dropzone
- `data-pa-otp="6"` + `data-pa-otp-name="otp"` — OTP group
- `data-pa-liveedit` + `data-pa-liveedit-html/css/js/preview/run/reset/info/tab/pane` — LiveEdit
- `data-pa-qty` + `data-pa-qty-min/max/step` + `data-pa-qty-dec/inc` — quantity stepper
- `data-pa-kanban` — kanban board
- `data-pa-searchable-list="#list"` — searchable list
- `data-pa-copy="#selector"` یا `data-pa-copy-text="..."` — copy button
- `data-pa-mark-all-read="#list"` — mark-all-read button
- `data-pa-otp-resend` — OTP resend button با 30s countdown

#### صفحات جدید — ۲۶ صفحه
- **احراز هویت**: forgot-password, email-verify, otp
- **محتوا**: blog-list, blog-post, categories, tags, forum-list, forum-topic
- **فروشگاه**: shop, product, cart, checkout
- **مارکتینگ**: landing, about, contact, pricing, maintenance
- **اپ**: mailbox, file-manager, kanban, notifications, user-panel, search-results
- **ابزار**: live-edit, file-upload

#### GitHub Pages
- فعال‌سازی GitHub Pages روی شاخهٔ `main` در مسیر `/`.
- آدرس دمو آنلاین: <https://andrbi108.github.io/padminlte/>

#### بهبودهای رابط کاربری
- **ریسپانسیو موبایل**: تمام صفحات جدید responsive هستند. Sidebar در موبایل به‌صورت overlay باز می‌شود.
- **انیمیشن**: ۱۵ keyframe animation + utility classes برای ورود و تعامل.
- **hover گسترده**: ۷ الگوی hover برای کارت‌ها و دکمه‌ها.
- **طیف گسترده‌تر رنگ‌بندی**: ۷ رنگ برند جدید + gradient/badge/button variants.
- **فونت‌های پیش‌فرض**: Vazirmatn به‌عنوان فونت پیش‌فرض فارسی در CSS variables.

### Tests
- **۴۶/۴۶ صفحه PASS** با Playwright (تزریق خودکار sidebar/header، inject آیکون‌ها، بدون خطای console).
- تست تعاملی: theme toggle، sidebar mini، modal open/close، toast، datatable filter/sort، chart rendering (line/bar/donut/sparkline)، form validation، OTP typing، LiveEdit iframe، cart qty stepper، kanban draggable، mark-all-read، countdown.

### Stats
- **۴۶ صفحهٔ HTML** (افزایش از ۲۰ به ۴۶)
- **۲۷۳ آیکون SVG inline** (افزایش از ۹۵ به ۲۷۳)
- **~۱٬۵۵۵ خط CSS** در ۵۰ بخش (افزایش از ۷۱۳ خط در ۲۸ بخش)
- **~۱٬۱۴۷ خط JavaScript** (افزایش از ~۷۳۶ خط)
- **حجم کل پروژه**: ~۱MB (افزایش از ۴۸۰KB به‌دلیل افزودن صفحات)

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
