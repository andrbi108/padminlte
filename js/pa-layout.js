/* =============================================================
   PAdminLTE — Layout partials
   ---------------------------------------------------------------
   Provides PAdminLTE.layout.sidebar(), .header(), .footer() that
   return HTML strings. Pages inject these into <div data-pa-layout>
   placeholders on DOMContentLoaded.

   Why a JS-rendered layout (instead of <iframe> or fetch()?
   Because file:// blocks fetch(), and an iframe-based shell would
   break the page's own CSS scope. This approach keeps each page
   a standalone HTML file that runs from any location (file://,
   http(s)://, or any static host), while still sharing a single
   source-of-truth layout.
   ============================================================= */

(function (global) {
  'use strict';
  var PAdminLTE = global.PAdminLTE || (global.PAdminLTE = {});
  var icon = PAdminLTE.icon;

  /* ---------- Path resolution ----------
     Canonical hrefs in this file are written from the project root
     perspective: "index.html", "pages/xxx.html", "css/...", "js/...".
     Pages live in two locations (root and pages/), so every link must
     be resolved relative to the CURRENT page location:
       - root page:   href used as-is
       - pages/ page: "pages/" prefix stripped (sibling), root assets get "../"
  */
  var IN_PAGES = (function () {
    var segs = (global.location && global.location.pathname || '').split('/');
    // The last segment is the file itself; check the directory segments.
    for (var i = 0; i < segs.length - 1; i++) {
      if (segs[i] === 'pages') return true;
    }
    return false;
  })();

  function resolve(href) {
    if (!href) return href;
    if (/^(https?:|mailto:|tel:|javascript:|#|data:)/.test(href)) return href;
    if (IN_PAGES) {
      if (href.indexOf('pages/') === 0) return href.slice('pages/'.length);
      if (href.indexOf('/') === 0) return href; // absolute — leave alone
      return '../' + href;
    }
    return href;
  }

  function navItem(href, iconName, label, badge) {
    var isExternal = /^https?:/.test(href);
    var active = ('/' + (location.pathname.split('/').pop() || 'index.html')) === href ||
                 (location.pathname.split('/').pop() || 'index.html') === href.split('/').pop();
    return '' +
      '<a class="pa-sidebar-link' + (active ? ' is-active' : '') + '" href="' + resolve(href) + '"' +
        (isExternal ? ' target="_blank" rel="noopener"' : '') + '>' +
        icon(iconName, 20) +
        '<span class="pa-label">' + label + '</span>' +
        (badge ? '<span class="pa-badge-mini">' + badge + '</span>' : '') +
      '</a>';
  }
  function navTree(iconName, label, items) {
    var anyActive = items.some(function (it) {
      return (location.pathname.split('/').pop() || 'index.html') === it.href.split('/').pop();
    });
    // v1.6: group (toggle button + tree) wrapped in .pa-tree-item so
    // initSidebarTree() can find the tree relative to the toggle.
    // v1.6: <button> instead of <a href="#"> — no dead link, real control.
    // v1.6: chevron carries .pa-chevron so the open-state rotation CSS applies.
    var chevron = icon('chevron_right', 14).replace('class="pa-icon"', 'class="pa-icon pa-chevron"');
    return '' +
      '<div class="pa-tree-item' + (anyActive ? ' is-open' : '') + '">' +
        '<button type="button" class="pa-sidebar-link" data-pa-tree-toggle aria-expanded="' + (anyActive ? 'true' : 'false') + '">' +
          icon(iconName, 20) +
          '<span class="pa-label">' + label + '</span>' +
          chevron +
        '</button>' +
        '<ul class="pa-sidebar-tree' + (anyActive ? ' is-open' : '') + '">' +
          items.map(function (it) { return '<li>' + navItem(it.href, it.icon || 'circle', it.label, it.badge) + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
  }

  function sidebar(opts) {
    opts = opts || {};
    var brand = opts.brand || 'PAdminLTE';
    var brandMark = (opts.brandMark || 'P');
    var sections = opts.sections || [
      {
        title: 'اصلی',
        items: [
          { href: 'index.html', icon: 'dashboard', label: 'داشبورد' },
          { href: 'index2.html', icon: 'chartline', label: 'داشبورد ۲' },
          { href: 'index3.html', icon: 'chartpie', label: 'داشبورد ۳' }
        ]
      },
      {
        title: 'ابزارها',
        items: [
          { href: 'pages/widgets.html', icon: 'grid', label: 'ویجت‌ها' },
          { href: 'pages/charts.html', icon: 'chart', label: 'نمودارها' },
          { href: 'pages/tables.html', icon: 'table', label: 'جداول' },
          { href: 'pages/forms.html', icon: 'form', label: 'فرم‌ها' },
          { href: 'pages/components.html', icon: 'cube', label: 'کامپوننت‌ها' },
          { href: 'pages/loaders.html', icon: 'spinner', label: 'لودرها و اسکلتون' },
          { href: 'pages/animations.html', icon: 'wand', label: 'انیمیشن‌ها' },
          { href: 'pages/icons.html', icon: 'sparkles', label: 'آیکون‌ها' },
          { href: 'pages/live-edit.html', icon: 'code', label: 'ویرایشگر زنده' },
          { href: 'pages/editor.html', icon: 'pen_tool', label: 'ویرایشگر متن غنی' },
          { href: 'pages/file-upload.html', icon: 'cloud_upload', label: 'بارگذاری فایل' }
        ]
      },
      {
        title: 'عملیات داده (CRUD)',
        items: [
          { href: 'pages/crud.html', icon: 'package_alt', label: 'مدیریت محصولات' },
          { href: 'pages/crud-users.html', icon: 'users_alt', label: 'مدیریت کاربران' },
          { href: 'pages/orders.html', icon: 'shopping_cart', label: 'سفارش‌ها' }
        ]
      },
      {
        title: 'مدیریت کاربر',
        tree: [
          { name: 'حساب کاربری', icon: 'user', items: [
            { href: 'pages/account.html', icon: 'user_cog', label: 'حساب من' },
            { href: 'pages/profile.html', icon: 'user', label: 'پروفایل' },
            { href: 'pages/users.html', icon: 'users', label: 'لیست کاربران' },
            { href: 'pages/roles.html', icon: 'shield_alt', label: 'نقش‌ها و مجوزها' },
            { href: 'pages/user-panel.html', icon: 'user_cog', label: 'پنل کاربری' },
            { href: 'pages/settings.html', icon: 'cog', label: 'تنظیمات' }
          ]},
          { name: 'احراز هویت', icon: 'lock', items: [
            { href: 'pages/login.html', icon: 'log_in', label: 'ورود' },
            { href: 'pages/register.html', icon: 'user_plus', label: 'ثبت‌نام' },
            { href: 'pages/forgot-password.html', icon: 'key_alt', label: 'فراموشی رمز' },
            { href: 'pages/email-verify.html', icon: 'mail_check', label: 'تایید ایمیل' },
            { href: 'pages/otp.html', icon: 'qr_code', label: 'کد یک‌بارمصرف' }
          ]}
        ]
      },
      {
        title: 'محتوا (مدیریت)',
        items: [
          { href: 'pages/blog-compose.html', icon: 'pen', label: 'نوشتن مطلب' }
        ]
      },
      {
        title: 'سایت عمومی',
        items: [
          { href: 'pages/landing.html', icon: 'rocket', label: 'صفحه اصلی' },
          { href: 'pages/shop.html', icon: 'shopping_bag', label: 'فروشگاه' },
          { href: 'pages/wishlist.html', icon: 'heart', label: 'علاقه‌مندی‌ها' },
          { href: 'pages/track-order.html', icon: 'map', label: 'پیگیری سفارش' },
          { href: 'pages/blog-list.html', icon: 'book', label: 'وبلاگ' },
          { href: 'pages/forum-list.html', icon: 'comments', label: 'انجمن' }
        ]
      },
      {
        title: 'صفحات اپ',
        tree: [
          { name: 'پیام‌ها', icon: 'envelope', items: [
            { href: 'pages/mailbox.html', icon: 'inbox', label: 'صندوق ورودی' },
            { href: 'pages/chat.html', icon: 'chat', label: 'گفتگو زنده', badge: '۳' },
            { href: 'pages/notifications.html', icon: 'bell', label: 'اعلان‌ها', badge: '۵' }
          ]},
          { name: 'سازماندهی', icon: 'layout', items: [
            { href: 'pages/file-manager.html', icon: 'folder_open', label: 'مدیریت فایل' },
            { href: 'pages/kanban.html', icon: 'columns', label: 'تخته کانبان' },
            { href: 'pages/calendar.html', icon: 'calendar', label: 'تقویم' },
            { href: 'pages/search-results.html', icon: 'search', label: 'نتایج جستجو' }
          ]}
        ]
      },
      {
        title: 'اطلاعات',
        items: [
          { href: 'pages/about.html', icon: 'info', label: 'درباره ما' },
          { href: 'pages/contact.html', icon: 'phone', label: 'تماس با ما' },
          { href: 'pages/faq.html', icon: 'question', label: 'سؤالات متداول' },
          { href: 'pages/invoice.html', icon: 'file_text', label: 'فاکتور' },
          { href: 'pages/gallery.html', icon: 'image', label: 'گالری' },
          { href: 'pages/timeline.html', icon: 'history', label: 'تایم‌لاین' },
          { href: 'pages/team.html', icon: 'users', label: 'تیم ما' },
          { href: 'pages/projects.html', icon: 'briefcase', label: 'پروژه‌ها' }
        ]
      },
      {
        title: 'حقوقی',
        items: [
          { href: 'pages/privacy.html', icon: 'shield_check', label: 'حریم خصوصی' },
          { href: 'pages/terms.html', icon: 'file_text', label: 'شرایط استفاده' }
        ]
      },
      {
        title: 'مستندات',
        items: [
          { href: 'pages/docs-install.html', icon: 'download', label: 'نصب و پیکربندی اولیه' },
          { href: 'pages/docs-usage.html', icon: 'book_open', label: 'راهنمای استفاده' },
          { href: 'pages/docs-customize.html', icon: 'wand', label: 'سفارشی‌سازی و تم' },
          { href: 'pages/docs-api.html', icon: 'terminal', label: 'مرجع API' }
        ]
      },
      {
        title: 'خطاها',
        items: [
          { href: 'pages/404.html', icon: 'x_circle', label: 'خطای ۴۰۴' },
          { href: 'pages/500.html', icon: 'server', label: 'خطای ۵۰۰' },
          { href: 'pages/maintenance.html', icon: 'settings', label: 'در حال تعمیر' },
          { href: 'pages/coming-soon.html', icon: 'hourglass', label: 'به‌زودی' },
          { href: 'pages/blank.html', icon: 'file', label: 'صفحه خالی' }
        ]
      }
    ];

    var nav = '';
    sections.forEach(function (sec) {
      nav += '<div class="pa-sidebar-section">' + sec.title + '</div>';
      if (sec.items) {
        sec.items.forEach(function (it) {
          nav += navItem(it.href, it.icon, it.label, it.badge);
        });
      }
      if (sec.tree) {
        sec.tree.forEach(function (t) {
          nav += navTree(t.icon, t.name, t.items);
        });
      }
    });

    return '' +
      '<aside class="pa-sidebar" aria-label="منوی اصلی">' +
        '<a class="pa-sidebar-brand" href="' + resolve('index.html') + '">' +
          '<span class="pa-brand-mark">' + brandMark + '</span>' +
          '<span class="pa-label">' + brand + '</span>' +
        '</a>' +
        '<nav class="pa-sidebar-nav" aria-label="ناوبری">' + nav + '</nav>' +
        '<div class="pa-sidebar-footer">نسخه ۲.۱.۰ — بدون وابستگی</div>' +
      '</aside>';
  }

  function header(opts) {
    opts = opts || {};
    var title = opts.title || 'داشبورد';
    // Session-aware user widget (mock auth, see PAdminLTE.auth)
    var u = null;
    try { u = PAdminLTE.auth && PAdminLTE.auth.currentUser && PAdminLTE.auth.currentUser(); } catch (e) {}
    var uwName = (u && u.name) || 'امیر رضایی';
    var uwRole = (u && u.role) || 'مدیر';
    var uwInitial = (uwName || 'A').trim().charAt(0);
    var uwColor = (u && u.color) ? ' style="background:' + u.color + '"' : '';
    return '' +
      '<header class="pa-header" role="banner">' +
        '<button class="pa-icon-btn" data-pa-sidebar-toggle aria-label="باز/بسته کردن منو">' +
          icon('menu', 20) +
        '</button>' +
        '<div class="pa-search">' +
          icon('search', 16) +
          '<input type="search" placeholder="جستجو…" aria-label="جستجو" data-pa-search="[data-pa-searchable-scope]">' +
        '</div>' +
        // Command palette trigger (Ctrl+K)
        '<button class="pa-palette-trigger" data-pa-palette-open aria-label="پالت فرمان (Ctrl+K)" title="پالت فرمان — Ctrl+K">' +
          icon('command', 14) +
          '<span>پالت فرمان</span>' +
          '<span class="pa-palette-kbd">Ctrl+K</span>' +
        '</button>' +
        '<div class="pa-header-spacer"></div>' +
        // Theme toggle
        '<button class="pa-icon-btn" data-pa-theme-toggle aria-label="تغییر تم"></button>' +
        // Direction toggle
        '<button class="pa-icon-btn" data-pa-dir-toggle aria-label="تغییر جهت" title="RTL/LTR">' +
          icon('arrow_right', 18) +
        '</button>' +
        // Notifications dropdown
        '<div class="pa-dropdown">' +
          '<button class="pa-icon-btn" data-pa-dropdown-toggle aria-label="اعلان‌ها">' +
            icon('bell', 20) +
          '</button>' +
          '<div class="pa-dropdown-menu" role="menu">' +
            '<div class="pa-dropdown-header">۵ اعلان جدید</div>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/orders.html') + '">' + icon('cart', 16) + 'سفارش جدید دریافت شد</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/users.html') + '">' + icon('user_plus', 16) + 'کاربر جدید ثبت‌نام کرد</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/charts.html') + '">' + icon('server', 16) + 'بار سرور بالا رفت</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/settings.html') + '">' + icon('warning', 16) + 'هشدار امنیتی</a>' +
            '<div class="pa-dropdown-divider"></div>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/notifications.html') + '">' + icon('list', 16) + 'مشاهده همه</a>' +
            '<div class="pa-dropdown-footer">همه اعلان‌ها</div>' +
          '</div>' +
        '</div>' +
        // Messages dropdown
        '<div class="pa-dropdown">' +
          '<button class="pa-icon-btn" data-pa-dropdown-toggle aria-label="پیام‌ها">' +
            icon('envelope', 20) +
          '</button>' +
          '<div class="pa-dropdown-menu" role="menu">' +
            '<div class="pa-dropdown-header">۳ پیام جدید</div>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/mailbox.html') + '">' +
              '<span class="pa-avatar pa-avatar-sm">P</span>' +
              '<span><strong>پویا</strong><br><small>۵ دقیقه پیش</small></span>' +
            '</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/mailbox.html') + '">' +
              '<span class="pa-avatar pa-avatar-sm">A</span>' +
              '<span><strong>امیر</strong><br><small>۱۰ دقیقه پیش</small></span>' +
            '</a>' +
            '<div class="pa-dropdown-divider"></div>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/chat.html') + '">' + icon('chat', 16) + 'مشاهده همه</a>' +
          '</div>' +
        '</div>' +
        // User dropdown
        '<div class="pa-dropdown">' +
          '<button class="pa-user-widget" data-pa-dropdown-toggle aria-label="حساب کاربری">' +
            '<span class="pa-avatar pa-avatar-md"' + uwColor + '>' + uwInitial + '</span>' +
            '<span class="pa-uw-text">' +
              '<span class="pa-uw-name">' + uwName + '</span>' +
              '<span class="pa-uw-role">' + uwRole + '</span>' +
            '</span>' +
            icon('chevron_down', 14) +
          '</button>' +
          '<div class="pa-dropdown-menu" role="menu">' +
            '<div class="pa-dropdown-header">حساب کاربری</div>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/account.html') + '">' + icon('user_cog', 16) + 'حساب من</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/profile.html') + '">' + icon('user', 16) + 'پروفایل</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/settings.html') + '">' + icon('cog', 16) + 'تنظیمات</a>' +
            '<div class="pa-dropdown-divider"></div>' +
            '<button type="button" class="pa-dropdown-item pa-link-btn" data-pa-logout>' + icon('logout', 16) + 'خروج از حساب</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function footer(opts) {
    opts = opts || {};
    var year = new Date().getFullYear();
    return '' +
      '<footer class="pa-card-footer" style="text-align:center; margin-top:1rem;">' +
        '<strong>PAdminLTE</strong> — نسخهٔ ۲.۱.۰ &copy; ' + year + ' &middot; ' +
        'بدون وابستگی خارجی &middot; قابل اجرا با file:// &middot; ' +
        '<a href="https://github.com/andrbi108/padminlte/blob/main/README.md" target="_blank" rel="noopener">مستندات</a>' +
      '</footer>';
  }

  /* ---------- Public site chrome (v1.7) ----------
     Pages independent of the dashboard (shop, blog, forum, info pages)
     declare <div data-pa-layout="site-nav"> and
     <div data-pa-layout="site-footer"> and get a public-site shell:
     sticky blurred navbar + multi-column footer. Session-aware like the
     admin header: shows the user avatar dropdown when logged in. */
  function siteNav(opts) {
    opts = opts || {};
    var brand = opts.brand || 'PAdminLTE';
    var links = opts.links || [
      { href: 'pages/landing.html', label: 'خانه' },
      { href: 'pages/shop.html', label: 'فروشگاه' },
      { href: 'pages/blog-list.html', label: 'وبلاگ' },
      { href: 'pages/forum-list.html', label: 'انجمن' },
      { href: 'pages/about.html', label: 'درباره ما' },
      { href: 'pages/contact.html', label: 'تماس با ما' }
    ];
    var here = location.pathname.split('/').pop() || 'index.html';
    var navLinks = links.map(function (l) {
      var active = here === l.href.split('/').pop();
      return '<a href="' + resolve(l.href) + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + l.label + '</a>';
    }).join('');
    // Session-aware auth area (mock auth, see PAdminLTE.auth)
    var u = null;
    try { u = PAdminLTE.auth && PAdminLTE.auth.currentUser && PAdminLTE.auth.currentUser(); } catch (e) {}
    var authArea;
    if (u) {
      var initial = (u.name || 'A').trim().charAt(0);
      var color = u.color ? ' style="background:' + u.color + '"' : '';
      authArea =
        '<div class="pa-dropdown">' +
          '<button class="pa-user-widget" data-pa-dropdown-toggle aria-label="حساب کاربری">' +
            '<span class="pa-avatar pa-avatar-md"' + color + '>' + initial + '</span>' +
            '<span class="pa-uw-text"><span class="pa-uw-name">' + u.name + '</span></span>' +
            icon('chevron_down', 14) +
          '</button>' +
          '<div class="pa-dropdown-menu" role="menu">' +
            '<div class="pa-dropdown-header">حساب کاربری</div>' +
            '<a class="pa-dropdown-item" href="' + resolve('index.html') + '">' + icon('dashboard', 16) + 'داشبورد</a>' +
            '<a class="pa-dropdown-item" href="' + resolve('pages/account.html') + '">' + icon('user_cog', 16) + 'حساب من</a>' +
            '<div class="pa-dropdown-divider"></div>' +
            '<button type="button" class="pa-dropdown-item pa-link-btn" data-pa-logout>' + icon('logout', 16) + 'خروج از حساب</button>' +
          '</div>' +
        '</div>';
    } else {
      authArea = '<a class="pa-btn pa-btn-primary pa-btn-sm" href="' + resolve('pages/login.html') + '" aria-label="ورود">' + icon('log_in', 15) + '<span>ورود</span></a>';
    }
    return '' +
      '<header class="pa-site-nav" role="banner">' +
        '<div class="pa-site-nav-in">' +
          '<a class="pa-site-brand" href="' + resolve('pages/landing.html') + '">' +
            '<span class="pa-brand-mark">' + (opts.brandMark || 'P') + '</span>' +
            '<span>' + brand + '</span>' +
          '</a>' +
          '<nav class="pa-site-links" aria-label="ناوبری سایت">' + navLinks + '</nav>' +
          '<div class="pa-site-actions">' +
            '<button class="pa-icon-btn" data-pa-theme-toggle aria-label="تغییر تم"></button>' +
            '<button class="pa-icon-btn" data-pa-dir-toggle aria-label="تغییر جهت" title="RTL/LTR">' + icon('arrow_right', 18) + '</button>' +
            '<a class="pa-site-cart" href="' + resolve('pages/wishlist.html') + '" aria-label="علاقه‌مندی‌ها">' +
              icon('heart', 20) +
              '<span class="pa-site-cart-badge" data-pa-wishlist-count hidden></span>' +
            '</a>' +
            '<a class="pa-site-cart" href="' + resolve('pages/cart.html') + '" aria-label="سبد خرید">' +
              icon('shopping_cart', 20) +
              '<span class="pa-site-cart-badge" data-pa-cart-count hidden></span>' +
            '</a>' +
            authArea +
            '<button class="pa-icon-btn pa-site-burger" data-pa-site-burger aria-label="باز و بسته کردن منو" aria-expanded="false">' + icon('menu', 20) + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function siteFooter(opts) {
    opts = opts || {};
    var year = new Date().getFullYear();
    function col(title, hrefs) {
      return '<div><h4>' + title + '</h4><div class="pa-site-footer-links">' +
        hrefs.map(function (h) {
          return '<a href="' + resolve(h.href) + '">' + icon('chevron_left', 12) + '<span>' + h.label + '</span></a>';
        }).join('') + '</div></div>';
    }
    return '' +
      '<footer class="pa-site-footer" role="contentinfo">' +
        '<div class="pa-site-footer-in">' +
          '<div class="pa-site-footer-grid">' +
            '<div>' +
              '<a class="pa-site-footer-brand" href="' + resolve('pages/landing.html') + '">' +
                '<span class="pa-brand-mark">' + (opts.brandMark || 'P') + '</span><span>' + (opts.brand || 'PAdminLTE') + '</span>' +
              '</a>' +
              '<p class="pa-site-footer-about">پنل مدیریت و سایت‌نمونهٔ تماماً بومی — بدون Bootstrap، بدون jQuery، بدون Chart.js و بدون هیچ وابستگی خارجی؛ همهٔ فایل‌ها حتی از file:// هم اجرا می‌شوند.</p>' +
              '<div class="pa-d-flex pa-gap-1" style="flex-wrap:wrap">' +
                '<span class="pa-badge pa-badge-primary">بدون وابستگی</span>' +
                '<span class="pa-badge pa-badge-success">RTL/LTR</span>' +
                '<span class="pa-badge pa-badge-info">تم تاریک</span>' +
              '</div>' +
            '</div>' +
            col('دسترسی سریع', [
              { href: 'pages/landing.html', label: 'خانه' },
              { href: 'pages/shop.html', label: 'فروشگاه' },
              { href: 'pages/wishlist.html', label: 'علاقه‌مندی‌ها' },
              { href: 'pages/track-order.html', label: 'پیگیری سفارش' },
              { href: 'pages/blog-list.html', label: 'وبلاگ' },
              { href: 'pages/forum-list.html', label: 'انجمن' }
            ]) +
            col('شرکت', [
              { href: 'pages/about.html', label: 'درباره ما' },
              { href: 'pages/contact.html', label: 'تماس با ما' },
              { href: 'pages/faq.html', label: 'سؤالات متداول' }
            ]) +
            col('قانونی', [
              { href: 'pages/privacy.html', label: 'حریم خصوصی' },
              { href: 'pages/terms.html', label: 'شرایط استفاده' }
            ]) +
          '</div>' +
          '<div class="pa-site-footer-bar">' +
            '<span><strong>PAdminLTE</strong> — نسخهٔ ۲.۰.۰ &copy; ' + year + '</span>' +
            '<span>بدون وابستگی خارجی &middot; قابل اجرا با file://</span>' +
            '<a href="https://github.com/andrbi108/padminlte" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:.3rem; color:var(--pa-text-muted)">' + icon('github', 14) + '<span>مخزن GitHub</span></a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /**
   * Inject sidebar + header into placeholders on the page.
   * Pages declare <div data-pa-layout="app"></div>,
   * <div data-pa-layout="header"></div> and <div data-pa-layout="footer"></div>.
   */
  function applyLayout(opts) {
    opts = opts || {};
    document.querySelectorAll('[data-pa-layout="sidebar"]').forEach(function (el) {
      el.outerHTML = sidebar(opts.sidebar || {});
    });
    document.querySelectorAll('[data-pa-layout="header"]').forEach(function (el) {
      el.outerHTML = header(opts.header || {});
    });
    document.querySelectorAll('[data-pa-layout="footer"]').forEach(function (el) {
      el.outerHTML = footer(opts.footer || {});
    });
    document.querySelectorAll('[data-pa-layout="site-nav"]').forEach(function (el) {
      el.outerHTML = siteNav(opts.siteNav || {});
    });
    document.querySelectorAll('[data-pa-layout="site-footer"]').forEach(function (el) {
      el.outerHTML = siteFooter(opts.siteFooter || {});
    });
    bindSiteNav();
    // Re-run icon injection + bindings for newly added nodes
    if (typeof PAdminLTE.injectIcons === 'function') PAdminLTE.injectIcons(document);
    if (typeof PAdminLTE.boot === 'function') PAdminLTE.boot(document);
    // Cart badges inside the freshly injected site nav
    if (PAdminLTE.cart && typeof PAdminLTE.cart.sync === 'function') PAdminLTE.cart.sync();
  }

  /* Burger toggle for the mobile site nav + close on link click */
  function bindSiteNav() {
    document.querySelectorAll('[data-pa-site-burger]').forEach(function (btn) {
      if (btn.__paBurgerBound) return;
      btn.__paBurgerBound = true;
      btn.addEventListener('click', function () {
        var nav = btn.closest('.pa-site-nav');
        if (!nav) return;
        var open = nav.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    document.querySelectorAll('.pa-site-nav .pa-site-links a').forEach(function (a) {
      if (a.__paNavCloseBound) return;
      a.__paNavCloseBound = true;
      a.addEventListener('click', function () {
        var nav = a.closest('.pa-site-nav');
        if (!nav) return;
        nav.classList.remove('is-open');
        var b = nav.querySelector('[data-pa-site-burger]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Auto-apply on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.querySelector('[data-pa-layout]')) applyLayout({});
    });
  } else if (document.querySelector('[data-pa-layout]')) {
    applyLayout({});
  }

  PAdminLTE.layout = {
    sidebar: sidebar,
    header: header,
    footer: footer,
    siteNav: siteNav,
    siteFooter: siteFooter,
    apply: applyLayout,
    navItem: navItem,
    navTree: navTree
  };
})(typeof window !== 'undefined' ? window : this);
