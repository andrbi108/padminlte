/* =============================================================
   PAdminLTE — Core runtime (vanilla JS, no dependencies)
   ---------------------------------------------------------------
   Provides layout control, dropdowns, modals, toasts, theme
   switcher, tabs, sidebar navigation and a small chart helper.
   Exposed as window.PAdminLTE.* — see docs/API.md for the full
   surface.
   ============================================================= */

(function (global) {
  'use strict';

  var PAdminLTE = global.PAdminLTE || (global.PAdminLTE = {});
  var STORAGE_THEME = 'pa-theme';
  var STORAGE_SIDEBAR = 'pa-sidebar';
  var STORAGE_LANG = 'pa-lang';
  var STORAGE_DIR = 'pa-dir';

  /* ---------- Theme ---------- */
  function getTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_THEME); } catch (e) {}
    if (stored === 'light' || stored === 'dark') return stored;
    var prefersDark = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-pa-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('[data-pa-theme-toggle]').forEach(function (btn) {
      btn.innerHTML = PAdminLTE.icon(theme === 'dark' ? 'sun' : 'moon', 18);
      btn.setAttribute('aria-label', theme === 'dark' ? 'روشن' : 'تاریک');
      btn.setAttribute('title', theme === 'dark' ? 'حالت روشن' : 'حالت تاریک');
    });
  }
  function setTheme(theme) {
    try { localStorage.setItem(STORAGE_THEME, theme); } catch (e) {}
    applyTheme(theme);
    emit('pa:theme', { theme: theme });
  }
  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  /* ---------- Direction (LTR/RTL) ---------- */
  function getDir() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_DIR); } catch (e) {}
    return stored === 'rtl' || stored === 'ltr' ? stored : (document.documentElement.dir || 'ltr');
  }
  function setDir(dir) {
    try { localStorage.setItem(STORAGE_DIR, dir); } catch (e) {}
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = dir === 'rtl' ? 'fa' : 'en';
    emit('pa:dir', { dir: dir });
  }
  function toggleDir() { setDir(getDir() === 'rtl' ? 'ltr' : 'rtl'); }

  /* ---------- Sidebar ---------- */
  function getSidebarState() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_SIDEBAR); } catch (e) {}
    if (stored === 'mini' || stored === 'expanded' || stored === 'collapsed') return stored;
    return 'expanded';
  }
  function applySidebarState(state) {
    var app = document.querySelector('.pa-app');
    if (!app) return;
    app.classList.remove('pa-sidebar-mini', 'pa-sidebar-collapsed', 'pa-sidebar-open');
    if (state === 'mini') app.classList.add('pa-sidebar-mini');
    else if (state === 'collapsed') app.classList.add('pa-sidebar-collapsed');
    document.querySelectorAll('[data-pa-sidebar-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', state === 'mini' ? 'true' : 'false');
    });
  }
  function setSidebarState(state) {
    try { localStorage.setItem(STORAGE_SIDEBAR, state); } catch (e) {}
    applySidebarState(state);
    emit('pa:sidebar', { state: state });
  }
  function toggleSidebar() {
    var state = getSidebarState();
    var mq = global.matchMedia && global.matchMedia('(max-width: 992px)').matches;
    if (mq) {
      // Mobile: open/close overlay
      var app = document.querySelector('.pa-app');
      if (app) app.classList.toggle('pa-sidebar-open');
      return;
    }
    setSidebarState(state === 'mini' ? 'expanded' : 'mini');
  }

  /* ---------- Event bus ---------- */
  var listeners = {};
  function on(name, fn) { (listeners[name] = listeners[name] || []).push(fn); return function () { off(name, fn); }; }
  function off(name, fn) { if (!listeners[name]) return; listeners[name] = listeners[name].filter(function (f) { return f !== fn; }); }
  function emit(name, payload) { (listeners[name] || []).forEach(function (fn) { try { fn(payload); } catch (e) { console.error(e); } }); }

  /* ---------- Dropdowns ---------- */
  function initDropdowns(root) {
    (root || document).querySelectorAll('[data-pa-dropdown-toggle]').forEach(function (toggle) {
      if (toggle.__paBound) return;
      toggle.__paBound = true;
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var menu = toggle.parentElement.querySelector('.pa-dropdown-menu');
        if (!menu) return;
        var isOpen = menu.classList.contains('is-open');
        closeAllDropdowns();
        if (!isOpen) menu.classList.add('is-open');
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-pa-dropdown-toggle]') && !e.target.closest('.pa-dropdown-menu')) {
        closeAllDropdowns();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }
  function closeAllDropdowns() {
    document.querySelectorAll('.pa-dropdown-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
  }

  /* ---------- Sidebar tree (collapsible nav) ---------- */
  function initSidebarTree(root) {
    (root || document).querySelectorAll('[data-pa-tree-toggle]').forEach(function (toggle) {
      if (toggle.__paBound) return;
      toggle.__paBound = true;
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var li = toggle.closest('li');
        if (!li) return;
        var tree = li.querySelector(':scope > .pa-sidebar-tree');
        if (!tree) return;
        var open = tree.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    // Open the active tree by default
    (root || document).querySelectorAll('.pa-sidebar-link.is-active').forEach(function (link) {
      var li = link.closest('li');
      if (li) {
        var parent = li.parentElement;
        if (parent && parent.classList.contains('pa-sidebar-tree')) {
          parent.classList.add('is-open');
          var trigger = parent.parentElement.querySelector(':scope > [data-pa-tree-toggle]');
          if (trigger) trigger.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  /* ---------- Modals ---------- */
  function _modalEl(id) {
    if (typeof id !== 'string') return id;
    if (id.charAt(0) === '#') id = id.slice(1); // tolerate "#id" form
    return document.getElementById(id);
  }
  function openModal(id) {
    var el = _modalEl(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var focusable = el.querySelector('input, button, select, textarea, a[href]');
    if (focusable) setTimeout(function () { focusable.focus(); }, 50);
    emit('pa:modal:open', { id: el.id });
  }
  function closeModal(id) {
    var el = _modalEl(id);
    if (!el) return;
    el.classList.remove('is-open');
    if (!document.querySelector('.pa-modal-backdrop.is-open')) document.body.style.overflow = '';
    emit('pa:modal:close', { id: el.id });
  }
  function initModals(root) {
    (root || document).querySelectorAll('[data-pa-modal-open]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () { openModal(btn.getAttribute('data-pa-modal-open')); });
    });
    (root || document).querySelectorAll('[data-pa-modal-close]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        var backdrop = btn.closest('.pa-modal-backdrop');
        if (backdrop) closeModal(backdrop);
      });
    });
    document.querySelectorAll('.pa-modal-backdrop').forEach(function (backdrop) {
      if (backdrop.__paBound) return;
      backdrop.__paBound = true;
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var open = document.querySelector('.pa-modal-backdrop.is-open');
        if (open) closeModal(open);
      }
    });
  }

  /* ---------- Toasts ---------- */
  function ensureToastContainer() {
    var c = document.querySelector('.pa-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'pa-toast-container';
      c.setAttribute('role', 'alert');
      c.setAttribute('aria-live', 'polite');
      document.body.appendChild(c);
    }
    return c;
  }
  function toast(opts) {
    opts = opts || {};
    var kind = opts.kind || 'info'; // info|success|warning|danger
    var title = opts.title || '';
    var message = opts.message || '';
    var duration = typeof opts.duration === 'number' ? opts.duration : 4000;
    var iconName = { info: 'info', success: 'check_circle', warning: 'warning', danger: 'x_circle' }[kind] || 'info';
    var c = ensureToastContainer();
    var el = document.createElement('div');
    el.className = 'pa-toast pa-' + kind;
    el.innerHTML =
      PAdminLTE.icon(iconName, 18) +
      '<div class="pa-toast-body">' +
        (title ? '<div class="pa-toast-title"></div>' : '') +
        '<div class="pa-toast-message"></div>' +
      '</div>' +
      '<button class="pa-toast-close" aria-label="بستن">&times;</button>';
    if (title) el.querySelector('.pa-toast-title').textContent = title;
    el.querySelector('.pa-toast-message').textContent = message;
    el.querySelector('.pa-toast-close').addEventListener('click', function () { dismiss(); });
    c.appendChild(el);
    function dismiss() {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      el.style.transition = 'all .25s ease-in';
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    }
    if (duration > 0) setTimeout(dismiss, duration);
    return { el: el, dismiss: dismiss };
  }

  /* ---------- Alerts (close button) ---------- */
  function initAlerts(root) {
    (root || document).querySelectorAll('.pa-alert .pa-close').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        var alert = btn.closest('.pa-alert');
        if (alert) {
          alert.style.opacity = '0';
          alert.style.transition = 'opacity .2s';
          setTimeout(function () { if (alert.parentNode) alert.parentNode.removeChild(alert); }, 200);
        }
      });
    });
  }

  /* ---------- Tabs ---------- */
  function initTabs(root) {
    (root || document).querySelectorAll('[data-pa-tabs]').forEach(function (group) {
      if (group.__paBound) return;
      group.__paBound = true;
      var tabs = group.querySelectorAll('.pa-tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-pa-tab');
          tabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
          // Panels can be inside or outside the [data-pa-tabs] group
          var scope = group.getAttribute('data-pa-tabs-scope') === 'document' ? document : group.parentElement;
          scope.querySelectorAll('.pa-tab-panel').forEach(function (panel) {
            panel.classList.toggle('is-active', panel.id === target || panel.getAttribute('data-pa-panel') === target);
          });
        });
      });
    });
  }

  /* ---------- Card tools (collapse / remove / refresh) ---------- */
  function initCardTools(root) {
    (root || document).querySelectorAll('[data-pa-card-tool]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        var card = btn.closest('.pa-card');
        if (!card) return;
        var action = btn.getAttribute('data-pa-card-tool');
        if (action === 'collapse') {
          var body = card.querySelector('.pa-card-body');
          if (body) {
            var hidden = body.style.display === 'none';
            body.style.display = hidden ? '' : 'none';
            btn.innerHTML = PAdminLTE.icon(hidden ? 'minimize' : 'maximize', 16);
          }
        } else if (action === 'remove') {
          card.style.opacity = '0';
          card.style.transition = 'opacity .2s';
          setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 200);
        } else if (action === 'refresh') {
          btn.style.transform = 'rotate(360deg)';
          btn.style.transition = 'transform .6s';
          setTimeout(function () { btn.style.transform = ''; btn.style.transition = ''; }, 600);
          emit('pa:card:refresh', { card: card });
        }
      });
    });
  }

  /* ---------- Datatable (filter + sort + paginate) ---------- */
  function initDatatable(table, opts) {
    if (!table) return null;
    opts = opts || {};
    var tbody = table.querySelector('tbody');
    if (!tbody) return null;
    var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
    var state = { sort: null, dir: 'asc', page: 1, pageSize: opts.pageSize || 10, filter: '' };
    var paginationContainer = opts.pagination || table.parentElement.querySelector('[data-pa-pagination]');

    function render() {
      var filtered = rows.filter(function (r) {
        if (!state.filter) return true;
        return r.textContent.toLowerCase().indexOf(state.filter) !== -1;
      });
      if (state.sort) {
        var idx = state.sort;
        filtered.sort(function (a, b) {
          var av = a.children[idx] ? a.children[idx].textContent.trim() : '';
          var bv = b.children[idx] ? b.children[idx].textContent.trim() : '';
          var an = parseFloat(av.replace(/[^0-9.\-]/g, ''));
          var bn = parseFloat(bv.replace(/[^0-9.\-]/g, ''));
          if (!isNaN(an) && !isNaN(bn)) return state.dir === 'asc' ? an - bn : bn - an;
          return state.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }
      var total = filtered.length;
      var pages = Math.max(1, Math.ceil(total / state.pageSize));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * state.pageSize;
      var slice = filtered.slice(start, start + state.pageSize);
      rows.forEach(function (r) { r.style.display = 'none'; });
      slice.forEach(function (r) { r.style.display = ''; });
      if (paginationContainer) renderPagination(pages);
      emit('pa:datatable:render', { total: total, page: state.page, pages: pages });
    }

    function renderPagination(pages) {
      paginationContainer.innerHTML = '';
      if (pages <= 1) return;
      function make(label, page, disabled, active) {
        var b = document.createElement('button');
        b.className = 'pa-btn pa-btn-ghost pa-btn-sm' + (active ? ' pa-btn-primary' : '');
        b.textContent = label;
        b.disabled = !!disabled;
        b.addEventListener('click', function () { state.page = page; render(); });
        return b;
      }
      paginationContainer.appendChild(make('‹', state.page - 1, state.page === 1, false));
      for (var i = 1; i <= pages; i++) {
        paginationContainer.appendChild(make(String(i), i, false, i === state.page));
      }
      paginationContainer.appendChild(make('›', state.page + 1, state.page === pages, false));
    }

    // Sort headers
    table.querySelectorAll('thead th[data-pa-sort]').forEach(function (th) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
        if (state.sort === idx) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
        else { state.sort = idx; state.dir = 'asc'; }
        table.querySelectorAll('thead th[data-pa-sort]').forEach(function (h) {
          h.querySelector('[data-pa-sort-icon]') ? (h.querySelector('[data-pa-sort-icon]').innerHTML = '') : null;
        });
        var iconHolder = th.querySelector('[data-pa-sort-icon]') || (function () {
          var s = document.createElement('span'); s.setAttribute('data-pa-sort-icon', ''); s.style.marginLeft = '.25rem';
          th.appendChild(s); return s;
        })();
        iconHolder.innerHTML = PAdminLTE.icon(state.dir === 'asc' ? 'sort_asc' : 'sort_desc', 12);
        state.page = 1;
        render();
      });
    });

    // Filter input
    if (opts.filterInput) {
      var fi = typeof opts.filterInput === 'string' ? document.querySelector(opts.filterInput) : opts.filterInput;
      if (fi) fi.addEventListener('input', function () { state.filter = fi.value.toLowerCase(); state.page = 1; render(); });
    }

    render();
    return { state: state, render: render };
  }

  function initAllDatatables(root) {
    (root || document).querySelectorAll('[data-pa-datatable]').forEach(function (t) {
      var filterSel = t.getAttribute('data-pa-datatable-filter');
      initDatatable(t, {
        pageSize: parseInt(t.getAttribute('data-pa-datatable-pagesize') || '10', 10),
        filterInput: filterSel,
        pagination: t.parentElement.querySelector('[data-pa-pagination]')
      });
    });
  }

  /* ---------- Form validation ---------- */
  function validateForm(form) {
    var ok = true;
    form.querySelectorAll('[data-pa-validate]').forEach(function (field) {
      var rule = field.getAttribute('data-pa-validate');
      var val = (field.value || '').trim();
      var valid = true;
      var msg = '';
      if (rule === 'required' && !val) { valid = false; msg = 'این فیلد اجباری است.'; }
      else if (rule === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!valid && val) msg = 'ایمیل معتبر نیست.';
      } else if (rule === 'minlen') {
        var n = parseInt(field.getAttribute('data-pa-minlen') || '6', 10);
        valid = val.length >= n;
        if (!valid && val) msg = 'حداقل ' + n + ' کاراکتر لازم است.';
      } else if (rule === 'number') {
        valid = !val || !isNaN(parseFloat(val));
        if (!valid) msg = 'مقدار عددی وارد کنید.';
      }
      field.classList.toggle('is-invalid', !valid);
      field.classList.toggle('is-valid', valid && val);
      var fb = field.parentElement.querySelector('.pa-form-feedback') ||
               (field.closest('.pa-form-group') && field.closest('.pa-form-group').querySelector('.pa-form-feedback'));
      if (fb) {
        fb.classList.toggle('is-invalid', !valid);
        fb.classList.toggle('is-valid', valid && val);
        fb.textContent = msg;
      }
      if (!valid) ok = false;
    });
    return ok;
  }
  function initForms(root) {
    (root || document).querySelectorAll('form[data-pa-validate-form]').forEach(function (form) {
      if (form.__paBound) return;
      form.__paBound = true;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm(form)) {
          emit('pa:form:valid', { form: form });
          toast({ kind: 'success', title: 'موفق', message: 'فرم با موفقیت ارسال شد.' });
          form.reset();
          form.querySelectorAll('.is-valid, .is-invalid').forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
        } else {
          toast({ kind: 'danger', title: 'خطا', message: 'لطفاً خطاهای فرم را اصلاح کنید.' });
        }
      });
    });
  }

  /* ---------- Charts (vanilla canvas, no Chart.js) ---------- */
  function _getCtx(canvas) {
    var dpr = global.devicePixelRatio || 1;
    /* Freeze the CSS size ONCE. Measuring clientWidth of a canvas whose
       CSS width is auto, while its width attribute grows (w*dpr), feeds
       back into layout and doubles the size every animation frame. */
    if (!canvas.__paSized) {
      var parent = canvas.parentElement;
      canvas.style.width = '';
      canvas.style.height = '';
      var rect = canvas.getBoundingClientRect();
      var cssW = rect.width || (parent ? parent.clientWidth : 0) || 300;
      var cssH = rect.height || (parent ? parent.clientHeight : 0) || 200;
      canvas.style.width = Math.round(cssW) + 'px';
      canvas.style.height = Math.round(cssH) + 'px';
      canvas.__paSized = true;
    }
    var ctx = canvas.getContext('2d');
    var w = canvas.clientWidth || 300;
    var h = canvas.clientHeight || 200;
    var bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* =============================================================
     Chart engine v2 — animated (requestAnimationFrame) with hover
     tooltips, theme-aware re-render and resize handling.
     All charts store their config on the canvas so theme switches
     and resizes redraw them without losing state.
     ============================================================= */
  var CHART_DUR = 900;
  var CHART_COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#0dcaf0', '#fd7e14', '#20c997'];

  function _chartFont() { return '10px ' + getComputedStyle(document.body).fontFamily; }

  var _tipEl = null;
  function _chartTip() {
    if (!_tipEl || !document.body.contains(_tipEl)) {
      _tipEl = document.createElement('div');
      _tipEl.className = 'pa-chart-tooltip';
      document.body.appendChild(_tipEl);
    }
    return _tipEl;
  }
  function _tipShow(html, pageX, pageY) {
    var tip = _chartTip();
    tip.innerHTML = html;
    tip.classList.add('is-visible');
    var x = Math.max(70, Math.min(window.innerWidth - 70, pageX));
    tip.style.left = x + 'px';
    tip.style.top = Math.max(46, pageY) + 'px';
  }
  function _tipHide() { if (_tipEl) _tipEl.classList.remove('is-visible'); }

  function _easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function _animate(canvas, render) {
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / CHART_DUR, 1);
      render(_easeOut(p), null);
      if (p < 1) canvas.__paRAF = requestAnimationFrame(frame);
    }
    if (canvas.__paRAF) cancelAnimationFrame(canvas.__paRAF);
    canvas.__paRAF = requestAnimationFrame(frame);
  }

  function _bindChartHover(canvas) {
    if (canvas.__paHoverBound) return;
    canvas.__paHoverBound = true;
    var pending = null;
    canvas.addEventListener('mousemove', function (e) {
      pending = e;
      if (canvas.__paHoverRAF) return;
      canvas.__paHoverRAF = requestAnimationFrame(function () {
        canvas.__paHoverRAF = null;
        if (!pending || !canvas.__paHits) return;
        var rect = canvas.getBoundingClientRect();
        var mx = pending.clientX - rect.left, my = pending.clientY - rect.top;
        var hit = null;
        for (var i = 0; i < canvas.__paHits.length; i++) {
          var h = canvas.__paHits[i];
          if (h.kind === 'band') { if (mx >= h.x0 && mx <= h.x1) { hit = h; break; } }
          else if (h.kind === 'slice') {
            var dx = mx - h.cx, dy = my - h.cy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= h.innerR && dist <= h.r) {
              var a = Math.atan2(dy, dx);
              while (a < h.a0) a += Math.PI * 2;
              if (a >= h.a0 && a <= h.a0 + h.span) { hit = h; break; }
            }
          }
        }
        var idx = hit ? hit.index : null;
        if (canvas.__paHover !== idx) {
          canvas.__paHover = idx;
          if (canvas.__paRender) canvas.__paRender(1, idx);
        }
        if (hit) {
          _tipShow(hit.html, rect.left + (hit.tipX !== undefined ? hit.tipX : mx), rect.top + (hit.tipY !== undefined ? hit.tipY : my));
          canvas.style.cursor = 'pointer';
        } else {
          _tipHide();
          canvas.style.cursor = '';
        }
      });
    });
    canvas.addEventListener('mouseleave', function () {
      _tipHide();
      if (canvas.__paHover !== null && canvas.__paHover !== undefined) {
        canvas.__paHover = null;
        if (canvas.__paRender) canvas.__paRender(1, null);
      }
    });
  }

  // Re-render every registered chart (theme change / resize)
  function _refreshCharts(remeasure) {
    document.querySelectorAll('canvas').forEach(function (c) {
      if (typeof c.__paRender === 'function') {
        if (remeasure) c.__paSized = false; // re-measure CSS size
        c.__paHover = null;
        c.__paRender(1, null);
      }
    });
  }
  var _resizeTimer = null;
  global.addEventListener('resize', function () {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(function () { _refreshCharts(true); }, 180);
  });
  on('pa:theme', function () { _refreshCharts(false); });

  function _tipHtml(title, rows) {
    var h = '<div class="pa-ct-title">' + title + '</div>';
    rows.forEach(function (r) {
      h += '<div class="pa-ct-row"><span class="pa-ct-dot" style="background:' + r.color + '"></span>' +
           (r.name ? r.name + ': ' : '') + '<strong>' + r.value + '</strong></div>';
    });
    return h;
  }

  function lineChart(canvas, data, opts) {
    opts = opts || {};
    var colors = (opts.colors || CHART_COLORS);
    var padding = { top: 10, right: 10, bottom: 24, left: 36 };
    var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
    var axisColor = isDark ? '#adb5bd' : '#6c757d';
    var gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
    var labels = data.labels || [];
    var series = data.series || [];
    var allVals = series.reduce(function (a, s) { return a.concat(s.values || []); }, []);
    var maxV = Math.max.apply(null, allVals.concat([0]));
    var minV = Math.min.apply(null, allVals.concat([0]));
    if (minV > 0) minV = 0;
    if (maxV === minV) maxV = minV + 1;

    function render(progress, hoverIdx) {
      var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
      ctx.clearRect(0, 0, w, h);
      var chartW = w - padding.left - padding.right;
      var chartH = h - padding.top - padding.bottom;
      var stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW;
      function yFor(v) { return padding.top + chartH - ((v - minV) / (maxV - minV)) * chartH; }
      function xFor(i) { return padding.left + i * stepX; }

      // grid + axes
      ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
      ctx.font = _chartFont();
      ctx.fillStyle = axisColor;
      for (var g = 0; g <= 4; g++) {
        var yy = padding.top + (chartH / 4) * g;
        ctx.beginPath(); ctx.moveTo(padding.left, yy); ctx.lineTo(padding.left + chartW, yy); ctx.stroke();
        var lab = Math.round(maxV - ((maxV - minV) / 4) * g);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(String(lab), padding.left - 6, yy);
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      labels.forEach(function (l, i) {
        var bold = hoverIdx === i;
        ctx.font = bold ? 'bold ' + _chartFont() : _chartFont();
        ctx.fillStyle = bold ? (colors[0]) : axisColor;
        if (i % Math.ceil(labels.length / 8 || 1) === 0 || i === labels.length - 1) {
          ctx.fillText(String(l), xFor(i), padding.top + chartH + 4);
        }
      });

      // hover guide
      if (hoverIdx !== null && hoverIdx !== undefined) {
        ctx.save();
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.14)';
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(xFor(hoverIdx), padding.top); ctx.lineTo(xFor(hoverIdx), padding.top + chartH); ctx.stroke();
        ctx.restore();
      }

      // series (clip reveals left→right during animation)
      ctx.save();
      ctx.beginPath();
      ctx.rect(padding.left - 2, 0, (chartW + 4) * progress, h);
      ctx.clip();
      series.forEach(function (s, idx) {
        var color = colors[idx % colors.length];
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
        var vals = s.values || [];
        ctx.beginPath();
        vals.forEach(function (v, i) {
          var x = xFor(i), y = yFor(v);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        // area fill
        if (opts.area !== false) {
          ctx.save();
          ctx.lineTo(xFor(vals.length - 1), padding.top + chartH);
          ctx.lineTo(xFor(0), padding.top + chartH);
          ctx.closePath();
          var grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
          grad.addColorStop(0, color + '3d');
          grad.addColorStop(1, color + '05');
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
          ctx.beginPath();
          vals.forEach(function (v, i) {
            var x = xFor(i), y = yFor(v);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          });
        }
        ctx.stroke();
        // points
        if (opts.points !== false) {
          vals.forEach(function (v, i) {
            var isH = hoverIdx === i;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(xFor(i), yFor(v), isH ? 5 : 3, 0, Math.PI * 2);
            ctx.fill();
            if (isH) {
              ctx.beginPath();
              ctx.strokeStyle = color; ctx.lineWidth = 1.5;
              ctx.arc(xFor(i), yFor(v), 8, 0, Math.PI * 2);
              ctx.stroke();
            }
          });
        }
      });
      ctx.restore();

      // hit bands (label-index mode, like Chart.js)
      if (progress >= 1) {
        canvas.__paHits = labels.map(function (l, i) {
          var rows = series.map(function (s, si) {
            return { color: colors[si % colors.length], name: s.name || ('سری ' + (si + 1)), value: (s.values || [])[i] };
          });
          return {
            kind: 'band', index: i,
            x0: xFor(i) - stepX / 2, x1: xFor(i) + stepX / 2,
            tipX: xFor(i), tipY: yFor((series[0] && (series[0].values || [])[i]) || 0),
            html: _tipHtml(String(l), rows)
          };
        });
        _bindChartHover(canvas);
      }
    }
    canvas.__paRender = render;
    canvas.__paHover = null;
    if (opts.animate !== false) _animate(canvas, render);
    else render(1, null);
  }

  function barChart(canvas, data, opts) {
    opts = opts || {};
    var colors = opts.colors || CHART_COLORS;
    var padding = { top: 10, right: 10, bottom: 24, left: 36 };
    var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
    var axisColor = isDark ? '#adb5bd' : '#6c757d';
    var gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
    var labels = data.labels || [];
    var series = data.series || [];
    var allVals = series.reduce(function (a, s) { return a.concat(s.values || []); }, []);
    var maxV = Math.max.apply(null, allVals.concat([0]));
    if (maxV === 0) maxV = 1;
    var rounded = opts.rounded !== false;

    function render(progress, hoverIdx) {
      var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
      ctx.clearRect(0, 0, w, h);
      var chartW = w - padding.left - padding.right;
      var chartH = h - padding.top - padding.bottom;
      function yFor(v) { return padding.top + chartH - (v / maxV) * chartH; }
      // grid
      ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
      ctx.font = _chartFont();
      ctx.fillStyle = axisColor;
      for (var g = 0; g <= 4; g++) {
        var yy = padding.top + (chartH / 4) * g;
        ctx.beginPath(); ctx.moveTo(padding.left, yy); ctx.lineTo(padding.left + chartW, yy); ctx.stroke();
        var lab = Math.round(maxV - (maxV / 4) * g);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(String(lab), padding.left - 6, yy);
      }
      var groupCount = labels.length;
      var seriesCount = series.length;
      var groupW = chartW / groupCount;
      var barW = Math.min(28, (groupW - 8) / seriesCount);
      labels.forEach(function (l, gi) {
        series.forEach(function (s, si) {
          var v = (s.values || [])[gi] || 0;
          var fullH = padding.top + chartH - yFor(v);
          var curH = fullH * progress;
          var x = padding.left + gi * groupW + (groupW - barW * seriesCount) / 2 + si * barW;
          var y = padding.top + chartH - curH;
          var isH = hoverIdx === gi;
          ctx.fillStyle = colors[si % colors.length];
          ctx.globalAlpha = hoverIdx === null || hoverIdx === undefined || isH ? 1 : .45;
          if (rounded && ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, barW - 2, curH, [4, 4, 0, 0]);
            ctx.fill();
          } else {
            ctx.fillRect(x, y, barW - 2, curH);
          }
          ctx.globalAlpha = 1;
          // value label on hover
          if (isH && progress >= 1) {
            ctx.fillStyle = axisColor;
            ctx.font = 'bold ' + _chartFont();
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(String(v), x + (barW - 2) / 2, y - 3);
          }
        });
        ctx.fillStyle = hoverIdx === gi ? colors[0] : axisColor;
        ctx.font = hoverIdx === gi ? 'bold ' + _chartFont() : _chartFont();
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(String(l), padding.left + gi * groupW + groupW / 2, padding.top + chartH + 4);
      });
      if (progress >= 1) {
        canvas.__paHits = labels.map(function (l, i) {
          var rows = series.map(function (s, si) {
            return { color: colors[si % colors.length], name: s.name || ('سری ' + (si + 1)), value: (s.values || [])[i] };
          });
          return {
            kind: 'band', index: i,
            x0: padding.left + i * groupW, x1: padding.left + (i + 1) * groupW,
            tipX: padding.left + i * groupW + groupW / 2,
            tipY: yFor(Math.max.apply(null, series.map(function (s) { return (s.values || [])[i] || 0; }))),
            html: _tipHtml(String(l), rows)
          };
        });
        _bindChartHover(canvas);
      }
    }
    canvas.__paRender = render;
    canvas.__paHover = null;
    if (opts.animate !== false) _animate(canvas, render);
    else render(1, null);
  }

  function donutChart(canvas, data, opts) {
    opts = opts || {};
    var colors = opts.colors || CHART_COLORS;
    var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
    var total = data.reduce(function (a, d) { return a + (d.value || 0); }, 0) || 1;

    function render(progress, hoverIdx) {
      var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
      ctx.clearRect(0, 0, w, h);
      var cx = w / 2, cy = h / 2;
      var r = Math.min(w, h) / 2 - 6;
      var innerR = r * 0.6;
      var start = -Math.PI / 2;
      var slices = [];
      data.forEach(function (d, i) {
        var angle = ((d.value || 0) / total) * Math.PI * 2;
        var mid = start + angle / 2;
        var isH = hoverIdx === i;
        var expand = isH ? 5 : 0;
        var ex = Math.cos(mid) * expand, ey = Math.sin(mid) * expand;
        var end = start + angle * progress;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = hoverIdx === null || hoverIdx === undefined || isH ? 1 : .4;
        ctx.moveTo(cx + ex, cy + ey);
        ctx.arc(cx + ex, cy + ey, r, start, end, false);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        slices.push({
          kind: 'slice', index: i, a0: start, span: angle,
          cx: cx + ex, cy: cy + ey, r: r, innerR: innerR,
          tipX: cx + Math.cos(mid) * (innerR + (r - innerR) / 2),
          tipY: cy + Math.sin(mid) * (innerR + (r - innerR) / 2),
          html: _tipHtml(d.label || ('بخش ' + (i + 1)), [
            { color: colors[i % colors.length], name: '', value: (d.value || 0) + ' (' + Math.round((d.value || 0) / total * 100) + '٪)' }
          ])
        });
        start += angle;
      });
      // inner hole
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // center text
      ctx.fillStyle = isDark ? '#e9ecef' : '#212529';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px ' + getComputedStyle(document.body).fontFamily;
      ctx.globalAlpha = progress;
      ctx.fillText(String(Math.round(total * progress)), cx, cy - 6);
      ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillStyle = isDark ? '#adb5bd' : '#6c757d';
      ctx.fillText(opts.centerLabel || 'مجموع', cx, cy + 12);
      ctx.globalAlpha = 1;
      if (progress >= 1) {
        canvas.__paHits = slices;
        _bindChartHover(canvas);
      }
    }
    canvas.__paRender = render;
    canvas.__paHover = null;
    if (opts.animate !== false) _animate(canvas, render);
    else render(1, null);
  }

  function sparkline(canvas, values, color) {
    color = color || CHART_COLORS[0];
    function render(progress) {
      var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
      ctx.clearRect(0, 0, w, h);
      var max = Math.max.apply(null, values.concat([1]));
      var min = Math.min.apply(null, values.concat([0]));
      var stepX = w / (values.length - 1 || 1);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w * progress, h);
      ctx.clip();
      ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineJoin = 'round';
      ctx.beginPath();
      values.forEach(function (v, i) {
        var x = i * stepX;
        var y = h - ((v - min) / (max - min || 1)) * h;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = color + '22'; ctx.fill();
      ctx.restore();
    }
    canvas.__paRender = render;
    _animate(canvas, render);
  }

  /* ---------- Search (client-side filter for current page) ---------- */
  function initSearch(root) {
    (root || document).querySelectorAll('[data-pa-search]').forEach(function (input) {
      if (input.__paBound) return;
      input.__paBound = true;
      input.addEventListener('input', function () {
        var q = input.value.toLowerCase().trim();
        var target = input.getAttribute('data-pa-search');
        if (!target) return;
        document.querySelectorAll(target + ' [data-pa-searchable]').forEach(function (item) {
          item.style.display = item.textContent.toLowerCase().indexOf(q) === -1 ? 'none' : '';
        });
      });
    });
  }

  /* ---------- Active nav highlight (relative path) ---------- */
  function highlightActiveNav(root) {
    var path = location.pathname.split('/').pop() || 'index.html';
    (root || document).querySelectorAll('.pa-sidebar-link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var target = href.split('/').pop();
      if (target && target === path) link.classList.add('is-active');
    });
  }

  /* ---------- Boot ---------- */
  function boot(root) {
    root = root || document;
    applyTheme(getTheme());
    applySidebarState(getSidebarState());
    if (typeof PAdminLTE.injectIcons === 'function') PAdminLTE.injectIcons(root);
    initDropdowns(root);
    initSidebarTree(root);
    initModals(root);
    initAlerts(root);
    initTabs(root);
    initCardTools(root);
    initAllDatatables(root);
    initForms(root);
    initSearch(root);
    highlightActiveNav(root);

    root.querySelectorAll('[data-pa-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
    root.querySelectorAll('[data-pa-sidebar-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleSidebar);
    });
    root.querySelectorAll('[data-pa-dir-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleDir);
    });
    // Auto-init charts with data attributes
    root.querySelectorAll('canvas[data-pa-chart]').forEach(function (canvas) {
      try {
        var spec = JSON.parse(canvas.getAttribute('data-pa-chart-data') || '{}');
        var type = canvas.getAttribute('data-pa-chart');
        if (type === 'line') lineChart(canvas, spec.data || spec, spec.options || {});
        else if (type === 'bar') barChart(canvas, spec.data || spec, spec.options || {});
        else if (type === 'donut') donutChart(canvas, spec.data || spec, spec.options || {});
        else if (type === 'sparkline') sparkline(canvas, spec.values || [], spec.color);
      } catch (e) {
        console.warn('[PAdminLTE] chart init failed:', e);
      }
    });
    emit('pa:ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { fullBoot(document); });
  } else {
    setTimeout(function () { fullBoot(document); }, 0);
  }

  /* ---------- Public API ---------- */
  PAdminLTE.getTheme = getTheme;
  PAdminLTE.setTheme = setTheme;
  PAdminLTE.toggleTheme = toggleTheme;
  PAdminLTE.getDir = getDir;
  PAdminLTE.setDir = setDir;
  PAdminLTE.toggleDir = toggleDir;
  PAdminLTE.getSidebarState = getSidebarState;
  PAdminLTE.setSidebarState = setSidebarState;
  PAdminLTE.toggleSidebar = toggleSidebar;
  PAdminLTE.openModal = openModal;
  PAdminLTE.closeModal = closeModal;
  PAdminLTE.toast = toast;
  PAdminLTE.validateForm = validateForm;
  PAdminLTE.initDatatable = initDatatable;
  PAdminLTE.lineChart = lineChart;
  PAdminLTE.barChart = barChart;
  PAdminLTE.donutChart = donutChart;
  PAdminLTE.sparkline = sparkline;
  PAdminLTE.on = on;
  PAdminLTE.off = off;
  PAdminLTE.emit = emit;
  PAdminLTE.boot = boot;

  /* ---------- File upload with preview ---------- */
  function initFileUpload(root) {
    (root || document).querySelectorAll('[data-pa-file-upload]').forEach(function (drop) {
      if (drop.__paBound) return;
      drop.__paBound = true;
      var input = drop.querySelector('input[type="file"]');
      var target = drop.getAttribute('data-pa-file-upload');
      var listEl = target ? document.querySelector(target) : null;
      var multiple = input && input.hasAttribute('multiple');
      var maxFiles = parseInt(drop.getAttribute('data-pa-max-files') || '0', 10);
      var files = [];

      function makeThumb(file, cb) {
        if (file.type.startsWith('image/')) {
          var r = new FileReader();
          r.onload = function (e) { cb('<img src="' + e.target.result + '" alt="">'); };
          r.readAsDataURL(file);
        } else {
          var ext = (file.name.split('.').pop() || '').toLowerCase();
          var ic = { pdf: 'file_pdf', zip: 'file_archive', rar: 'file_archive', '7z': 'file_archive',
                     mp4: 'file_video', avi: 'file_video', mov: 'file_video',
                     mp3: 'file_audio', wav: 'file_audio', ogg: 'file_audio',
                     js: 'file_code', ts: 'file_code', html: 'file_code', css: 'file_code', json: 'file_code',
                     txt: 'file_text', md: 'file_text', doc: 'file_text', docx: 'file_text' }[ext] || 'file';
          cb(PAdminLTE.icon(ic, 22));
        }
      }
      function humanSize(n) {
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
        return (n / (1024 * 1024)).toFixed(1) + ' MB';
      }
      function render() {
        if (!listEl) return;
        listEl.innerHTML = '';
        if (!files.length) { listEl.style.display = 'none'; return; }
        listEl.style.display = '';
        files.forEach(function (f, idx) {
          var item = document.createElement('div');
          item.className = 'pa-file-item pa-anim-slide-up';
          item.innerHTML = '<div class="pa-file-thumb"></div>' +
            '<div class="pa-file-info"><div class="pa-file-name"></div>' +
            '<div class="pa-file-meta"></div>' +
            '<div class="pa-file-progress"><div class="pa-file-progress-bar" style="width:0%"></div></div></div>' +
            '<button class="pa-file-remove" aria-label="حذف">&times;</button>';
          item.querySelector('.pa-file-name').textContent = f.name;
          item.querySelector('.pa-file-meta').textContent = humanSize(f.size) + ' — ' + (f.type || 'نامشخص');
          makeThumb(f, function (html) { item.querySelector('.pa-file-thumb').innerHTML = html; });
          item.querySelector('.pa-file-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            files.splice(idx, 1);
            render();
            emit('pa:file:remove', { file: f });
          });
          listEl.appendChild(item);
          // Simulate progress
          var bar = item.querySelector('.pa-file-progress-bar');
          var pct = 0;
          var iv = setInterval(function () {
            pct += 18 + Math.random() * 25;
            if (pct >= 100) { pct = 100; clearInterval(iv); setTimeout(function () { bar.parentElement.style.display = 'none'; }, 300); }
            bar.style.width = pct + '%';
          }, 100);
        });
      }
      function addFiles(newFiles) {
        var arr = Array.prototype.slice.call(newFiles);
        if (!multiple) { files = arr.slice(0, 1); }
        else if (maxFiles > 0) { files = files.concat(arr).slice(0, maxFiles); }
        else { files = files.concat(arr); }
        render();
        emit('pa:file:add', { files: arr });
      }
      ['dragenter', 'dragover'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-dragging'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-dragging'); });
      });
      drop.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
      });
      if (input) input.addEventListener('change', function () { if (input.files) addFiles(input.files); });
    });
  }

  /* ---------- OTP input ---------- */
  function initOtpInputs(root) {
    (root || document).querySelectorAll('[data-pa-otp]').forEach(function (group) {
      if (group.__paBound) return;
      group.__paBound = true;
      var length = parseInt(group.getAttribute('data-pa-otp') || '6', 10);
      var inputName = group.getAttribute('data-pa-otp-name') || 'otp';
      var hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = inputName;
      group.appendChild(hidden);
      var inputs = [];
      for (var i = 0; i < length; i++) {
        (function (idx) {
          var inp = document.createElement('input');
          inp.type = 'text';
          inp.inputMode = 'numeric';
          inp.maxLength = 1;
          inp.className = 'pa-otp-input';
          inp.setAttribute('aria-label', 'رقم ' + (idx + 1));
          inp.addEventListener('input', function (e) {
            var v = (e.target.value || '').replace(/[^0-9]/g, '');
            e.target.value = v;
            if (v) { e.target.classList.add('is-filled'); if (idx < length - 1) inputs[idx + 1].focus(); }
            else e.target.classList.remove('is-filled');
            updateHidden();
            if (idx === length - 1 && v && getOtp().length === length) {
              emit('pa:otp:complete', { value: getOtp() });
            }
          });
          inp.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
              inputs[idx - 1].focus(); inputs[idx - 1].value = ''; inputs[idx - 1].classList.remove('is-filled'); updateHidden();
            } else if (e.key === 'ArrowLeft' && idx < length - 1) inputs[idx + 1].focus();
            else if (e.key === 'ArrowRight' && idx > 0) inputs[idx - 1].focus();
            else if (e.key === 'Enter' && getOtp().length === length) emit('pa:otp:complete', { value: getOtp() });
          });
          inp.addEventListener('paste', function (e) {
            e.preventDefault();
            var txt = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            txt.split('').slice(0, length - idx).forEach(function (ch, j) {
              if (inputs[idx + j]) { inputs[idx + j].value = ch; inputs[idx + j].classList.add('is-filled'); }
            });
            updateHidden();
            if (getOtp().length === length) { inputs[length - 1].focus(); emit('pa:otp:complete', { value: getOtp() }); }
          });
          group.insertBefore(inp, hidden);
          inputs.push(inp);
        })(i);
      }
      function getOtp() { return inputs.map(function (i) { return i.value; }).join(''); }
      function updateHidden() { hidden.value = getOtp(); emit('pa:otp:change', { value: getOtp() }); }
      group._getOtp = getOtp;
      group._clear = function () { inputs.forEach(function (i) { i.value = ''; i.classList.remove('is-filled'); }); updateHidden(); inputs[0].focus(); };
    });
  }

  /* ---------- Live editor ---------- */
  function initLiveEdit(root) {
    (root || document).querySelectorAll('[data-pa-liveedit]').forEach(function (container) {
      if (container.__paBound) return;
      container.__paBound = true;
      var htmlPane = container.querySelector('[data-pa-liveedit-html]');
      var cssPane = container.querySelector('[data-pa-liveedit-css]');
      var jsPane = container.querySelector('[data-pa-liveedit-js]');
      var preview = container.querySelector('[data-pa-liveedit-preview]');
      var runBtn = container.querySelector('[data-pa-liveedit-run]');
      var resetBtn = container.querySelector('[data-pa-liveedit-reset]');
      var infoEl = container.querySelector('[data-pa-liveedit-info]');
      var debounceTimer = null;
      var initialHtml = htmlPane ? htmlPane.value : '';
      var initialCss = cssPane ? cssPane.value : '';
      var initialJs = jsPane ? jsPane.value : '';

      function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      function render() {
        if (!preview) return;
        var html = htmlPane ? htmlPane.value : '';
        var css = cssPane ? cssPane.value : '';
        var js = jsPane ? jsPane.value : '';
        var doc = '<!doctype html><html><head><meta charset="utf-8"><style>' +
          'body{font-family:sans-serif;padding:1rem;color:#212529}' + css + '</style></head><body>' +
          html + '<scr' + 'ipt>try{' + js + '}catch(e){document.body.innerHTML+="<pre style=\\"color:#dc3545\\">'+escapeHtml('Error: ')+'"+e.message+"</pre>"}<' + '/script></body></html>';
        preview.srcdoc = doc;
        if (infoEl) {
          var now = new Date();
          infoEl.textContent = 'به‌روزرسانی شد در ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
        }
      }
      function debouncedRender() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(render, 350);
      }
      [htmlPane, cssPane, jsPane].forEach(function (p) { if (p) p.addEventListener('input', debouncedRender); });
      if (runBtn) runBtn.addEventListener('click', render);
      if (resetBtn) resetBtn.addEventListener('click', function () {
        if (htmlPane) htmlPane.value = initialHtml;
        if (cssPane) cssPane.value = initialCss;
        if (jsPane) jsPane.value = initialJs;
        render();
      });
      // Tab switching
      container.querySelectorAll('.pa-liveedit-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-pa-liveedit-tab');
          container.querySelectorAll('.pa-liveedit-tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
          container.querySelectorAll('.pa-liveedit-pane').forEach(function (p) {
            p.classList.toggle('is-active', p.getAttribute('data-pa-liveedit-pane') === target);
          });
        });
      });
      render();
    });
  }

  /* ---------- Countdown ---------- */
  function countdown(element, seconds, opts) {
    opts = opts || {};
    var onTick = opts.onTick;
    var onComplete = opts.onComplete;
    var remaining = seconds;
    function fmt(s) {
      var m = Math.floor(s / 60); var sec = s % 60;
      return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }
    function tick() {
      if (typeof element === 'string') element = document.querySelector(element);
      if (!element) return;
      element.textContent = fmt(remaining);
      if (onTick) onTick(remaining);
      if (remaining <= 0) { if (onComplete) onComplete(); return; }
      remaining--;
      setTimeout(tick, 1000);
    }
    tick();
  }

  /* ---------- Copy to clipboard ---------- */
  function copyToClipboard(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      function done(ok) {
        if (ok) { toast({ kind: 'success', title: opts.title || 'کپی شد', message: opts.message || 'متن در کلیپ‌بورد کپی شد.', duration: 2000 }); resolve(true); }
        else { toast({ kind: 'danger', title: 'خطا', message: 'کپی ناموفق بود.' }); reject(new Error('copy failed')); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }).catch(function () { fallback(); });
      } else fallback();
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
          document.body.appendChild(ta); ta.select();
          var ok = document.execCommand('copy');
          document.body.removeChild(ta);
          done(ok);
        } catch (e) { done(false); }
      }
    });
  }

  /* ---------- Notification helpers ---------- */
  function notify(opts) {
    opts = opts || {};
    var duration = opts.duration !== undefined ? opts.duration : 0;
    return toast({
      kind: opts.kind || 'info',
      title: opts.title || '',
      message: opts.message || '',
      duration: duration
    });
  }

  function markAllNotificationsRead(selector) {
    var scope = selector ? document.querySelector(selector) : document;
    if (!scope) scope = document;
    var targets = scope.classList && scope.classList.contains('pa-notification')
      ? [scope]
      : scope.querySelectorAll('.pa-notification.is-unread');
    targets.forEach(function (n) { n.classList.remove('is-unread'); });
    emit('pa:notifications:read', {});
  }

  /* ---------- Quantity stepper ---------- */
  function initQtySteppers(root) {
    (root || document).querySelectorAll('[data-pa-qty]').forEach(function (el) {
      if (el.__paBound) return;
      el.__paBound = true;
      var min = parseInt(el.getAttribute('data-pa-qty-min') || '1', 10);
      var max = parseInt(el.getAttribute('data-pa-qty-max') || '99', 10);
      var step = parseInt(el.getAttribute('data-pa-qty-step') || '1', 10);
      var input = el.querySelector('input');
      var dec = el.querySelector('[data-pa-qty-dec]');
      var inc = el.querySelector('[data-pa-qty-inc]');
      if (dec) dec.addEventListener('click', function () {
        var v = parseInt(input.value || '0', 10) - step;
        if (v < min) v = min;
        input.value = v; emit('pa:qty:change', { value: v, el: el });
      });
      if (inc) inc.addEventListener('click', function () {
        var v = parseInt(input.value || '0', 10) + step;
        if (v > max) v = max;
        input.value = v; emit('pa:qty:change', { value: v, el: el });
      });
      if (input) input.addEventListener('change', function () {
        var v = parseInt(input.value || '0', 10);
        if (isNaN(v) || v < min) v = min;
        if (v > max) v = max;
        input.value = v; emit('pa:qty:change', { value: v, el: el });
      });
    });
  }

  /* ---------- Kanban drag-and-drop ---------- */
  function initKanban(root) {
    (root || document).querySelectorAll('[data-pa-kanban]').forEach(function (board) {
      if (board.__paBound) return;
      board.__paBound = true;
      var dragging = null;
      board.querySelectorAll('.pa-kanban-card').forEach(function (card) {
        card.draggable = true;
        card.addEventListener('dragstart', function (e) {
          dragging = card;
          card.style.opacity = '.4';
          try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); } catch (er) {}
        });
        card.addEventListener('dragend', function () { card.style.opacity = ''; });
      });
      board.querySelectorAll('.pa-kanban-col').forEach(function (col) {
        col.addEventListener('dragover', function (e) { e.preventDefault(); col.style.background = 'var(--pa-primary-soft)'; });
        col.addEventListener('dragleave', function () { col.style.background = ''; });
        col.addEventListener('drop', function (e) {
          e.preventDefault();
          col.style.background = '';
          if (!dragging) return;
          var list = col.querySelector('.pa-kanban-col-header').nextElementSibling;
          if (list && list.classList.contains('pa-kanban-card')) list = col;
          col.appendChild(dragging);
          emit('pa:kanban:move', { card: dragging, column: col });
        });
      });
    });
  }

  /* ---------- Searchable list (instant filter on keyup) ---------- */
  function initSearchableLists(root) {
    (root || document).querySelectorAll('[data-pa-searchable-list]').forEach(function (input) {
      if (input.__paBound) return;
      input.__paBound = true;
      var target = input.getAttribute('data-pa-searchable-list');
      var list = target ? document.querySelector(target) : null;
      if (!list) return;
      input.addEventListener('input', function () {
        var q = input.value.toLowerCase().trim();
        list.querySelectorAll('[data-pa-search-item]').forEach(function (item) {
          var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* =============================================================
     v1.2 components — back-to-top, accordion, carousel, lightbox,
     rating, counters, reveal-on-scroll, progress rings, ripple
     ============================================================= */

  /* ---------- Back-to-top (auto-injected once per page) ---------- */
  function initBackToTop() {
    var btn = document.querySelector('.pa-back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pa-back-to-top';
      btn.setAttribute('aria-label', 'بازگشت به بالا');
      btn.title = 'بازگشت به بالا';
      btn.innerHTML = PAdminLTE.icon('arrow_up', 20);
      btn.addEventListener('click', function () {
        global.scrollTo({ top: 0, behavior: 'smooth' });
      });
      document.body.appendChild(btn);
    }
    function onScroll() {
      var y = global.scrollY || document.documentElement.scrollTop || 0;
      btn.classList.toggle('is-visible', y > 240);
    }
    global.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Accordion (data-pa-accordion, "multiple" allowed) ---------- */
  function initAccordions(root) {
    (root || document).querySelectorAll('[data-pa-accordion] > .pa-accordion-item > .pa-accordion-header').forEach(function (header) {
      if (header.__paBound) return;
      header.__paBound = true;
      header.addEventListener('click', function () {
        var item = header.parentElement;
        var acc = item.closest('[data-pa-accordion]');
        var single = acc && acc.getAttribute('data-pa-accordion') !== 'multiple';
        var isOpen = item.classList.contains('is-open');
        if (single) {
          acc.querySelectorAll('.pa-accordion-item.is-open').forEach(function (o) {
            o.classList.remove('is-open');
            var b = o.querySelector('.pa-accordion-body');
            if (b) b.style.maxHeight = '';
          });
        }
        if (!isOpen) {
          item.classList.add('is-open');
          var body = item.querySelector('.pa-accordion-body');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          item.classList.remove('is-open');
          var b2 = item.querySelector('.pa-accordion-body');
          if (b2) b2.style.maxHeight = '';
        }
        emit('pa:accordion:toggle', { item: item, open: !isOpen });
      });
    });
    // Sync any item opened server-side (class is-open in markup)
    (root || document).querySelectorAll('.pa-accordion-item.is-open .pa-accordion-body').forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + 'px';
    });
  }

  /* ---------- Carousel (data-pa-carousel, autoplay + swipe) ---------- */
  function initCarousels(root) {
    (root || document).querySelectorAll('[data-pa-carousel]').forEach(function (car) {
      if (car.__paBound) return;
      car.__paBound = true;
      var track = car.querySelector('.pa-carousel-track');
      if (!track) return;
      var slides = track.children;
      var count = slides.length;
      if (!count) return;
      var intervalMs = parseInt(car.getAttribute('data-pa-interval') || '5000', 10);
      var idx = 0, timer = null;

      var dots = document.createElement('div');
      dots.className = 'pa-carousel-controls';
      for (var i = 0; i < count; i++) {
        (function (n) {
          var d = document.createElement('button');
          d.type = 'button';
          d.className = 'pa-carousel-dot' + (n === 0 ? ' is-active' : '');
          d.setAttribute('aria-label', 'اسلاید ' + (n + 1));
          d.addEventListener('click', function () { go(n); restart(); });
          dots.appendChild(d);
        })(i);
      }
      car.appendChild(dots);

      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'pa-carousel-arrow pa-ca-prev';
      prev.setAttribute('aria-label', 'اسلاید قبلی');
      prev.innerHTML = PAdminLTE.icon('chevron_right', 18);
      prev.addEventListener('click', function () { go(idx - 1); restart(); });
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'pa-carousel-arrow pa-ca-next';
      next.setAttribute('aria-label', 'اسلاید بعدی');
      next.innerHTML = PAdminLTE.icon('chevron_left', 18);
      next.addEventListener('click', function () { go(idx + 1); restart(); });
      car.appendChild(prev);
      car.appendChild(next);

      function go(n) {
        idx = (n + count) % count;
        // In RTL the flex track overflows to the LEFT, so the sign flips.
        var rtl = (document.documentElement.dir || 'ltr') === 'rtl';
        var pct = idx * 100 / count;
        track.style.transform = 'translateX(' + (rtl ? pct : -pct) + '%)';
        dots.querySelectorAll('.pa-carousel-dot').forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
        emit('pa:carousel:change', { index: idx, el: car });
      }
      function restart() {
        if (timer) clearInterval(timer);
        if (intervalMs > 0) timer = setInterval(function () { go(idx + 1); }, intervalMs);
      }
      car.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
      car.addEventListener('mouseleave', restart);
      // Touch swipe
      var startX = null;
      car.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      car.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
        startX = null;
      }, { passive: true });
      go(0);
      restart();
    });
  }

  /* ---------- Lightbox (shared, keyboard + RTL aware) ---------- */
  var lbEl = null, lbItems = [], lbIndex = 0;
  function ensureLightbox() {
    if (lbEl && document.body.contains(lbEl)) return lbEl;
    lbEl = document.createElement('div');
    lbEl.className = 'pa-lightbox';
    lbEl.setAttribute('role', 'dialog');
    lbEl.setAttribute('aria-modal', 'true');
    lbEl.setAttribute('aria-label', 'نمایش تصویر');
    lbEl.innerHTML =
      '<button type="button" class="pa-lb-close" aria-label="بستن">' + PAdminLTE.icon('x', 20) + '</button>' +
      '<div class="pa-lb-figure">' +
        '<span class="pa-lb-counter"></span>' +
        '<div class="pa-lb-canvas"></div>' +
        '<div class="pa-lb-caption"></div>' +
        '<button type="button" class="pa-lb-btn pa-lb-prev" aria-label="قبلی">' + PAdminLTE.icon('chevron_right', 22) + '</button>' +
        '<button type="button" class="pa-lb-btn pa-lb-next" aria-label="بعدی">' + PAdminLTE.icon('chevron_left', 22) + '</button>' +
      '</div>';
    document.body.appendChild(lbEl);
    lbEl.querySelector('.pa-lb-close').addEventListener('click', closeLightbox);
    lbEl.querySelector('.pa-lb-prev').addEventListener('click', function () { lightboxGo(lbIndex - 1); });
    lbEl.querySelector('.pa-lb-next').addEventListener('click', function () { lightboxGo(lbIndex + 1); });
    lbEl.addEventListener('click', function (e) { if (e.target === lbEl) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lbEl.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') lightboxGo(lbIndex - 1);
      else if (e.key === 'ArrowLeft') lightboxGo(lbIndex + 1);
    });
    return lbEl;
  }
  function openLightbox(items, index) {
    lbItems = items || [];
    if (!lbItems.length) return;
    ensureLightbox().classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxGo(index || 0);
    emit('pa:lightbox:open', { index: index || 0, count: lbItems.length });
  }
  function lightboxGo(i) {
    if (!lbItems.length || !lbEl) return;
    lbIndex = (i + lbItems.length) % lbItems.length;
    var it = lbItems[lbIndex];
    var canvas = lbEl.querySelector('.pa-lb-canvas');
    canvas.style.background = it.gradient || 'linear-gradient(135deg, var(--pa-primary), var(--pa-info))';
    canvas.innerHTML = '<span style="position:absolute;inset:0;display:grid;place-items:center;color:rgba(255,255,255,.4);font-size:3.5rem;font-weight:800">' + (it.icon || '') + '</span>';
    lbEl.querySelector('.pa-lb-caption').textContent = it.title || '';
    lbEl.querySelector('.pa-lb-counter').textContent = (lbIndex + 1) + ' / ' + lbItems.length;
    var fig = lbEl.querySelector('.pa-lb-figure');
    fig.style.animation = 'none';
    void fig.offsetWidth;
    fig.style.animation = '';
  }
  function closeLightbox() {
    if (lbEl) lbEl.classList.remove('is-open');
    document.body.style.overflow = '';
    emit('pa:lightbox:close', {});
  }

  /* ---------- Star rating (data-pa-rating="5" data-pa-value="3") ---------- */
  function initRatings(root) {
    (root || document).querySelectorAll('[data-pa-rating]').forEach(function (r) {
      if (r.__paBound) return;
      r.__paBound = true;
      var stars = parseInt(r.getAttribute('data-pa-rating') || '5', 10);
      var current = parseFloat(r.getAttribute('data-pa-value') || '0');
      var readonly = r.hasAttribute('data-pa-readonly');
      if (readonly) r.classList.add('is-readonly');
      function paint(n) {
        r.querySelectorAll('.pa-star').forEach(function (s, i) {
          s.classList.toggle('is-on', i < Math.round(n));
        });
      }
      function render() {
        r.innerHTML = '';
        for (var i = 1; i <= stars; i++) {
          (function (n) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'pa-star' + (n <= Math.round(current) ? ' is-on' : '');
            b.setAttribute('aria-label', n + ' از ' + stars + ' ستاره');
            b.innerHTML = PAdminLTE.icon('star', 16);
            if (!readonly) {
              b.addEventListener('click', function () {
                current = n;
                r.setAttribute('data-pa-value', String(n));
                paint(current);
                emit('pa:rating:change', { value: n, el: r });
              });
              b.addEventListener('mouseenter', function () { paint(n); });
              b.addEventListener('mouseleave', function () { paint(current); });
            }
            r.appendChild(b);
          })(i);
        }
        if (r.hasAttribute('data-pa-show-value')) {
          var v = document.createElement('span');
          v.className = 'pa-rating-value';
          v.textContent = current + ' از ' + stars;
          r.appendChild(v);
        }
      }
      render();
    });
  }

  /* ---------- Animated counters (data-pa-counter="2500") ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-pa-counter') || '0');
    var dur = parseInt(el.getAttribute('data-pa-counter-duration') || '1400', 10);
    var suffix = el.getAttribute('data-pa-counter-suffix') || '';
    var sep = el.getAttribute('data-pa-counter-sep') !== 'off';
    var fa = el.hasAttribute('data-pa-counter-fa');
    function fmt(n) {
      var s = String(Math.round(n));
      if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
      if (fa) s = s.replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
      return s + suffix;
    }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * _easeOut(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function initCounters(root) {
    var els = (root || document).querySelectorAll('[data-pa-counter]');
    if (!('IntersectionObserver' in global)) {
      els.forEach(function (e) { e.textContent = e.getAttribute('data-pa-counter'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !en.target.__paCounted) {
          en.target.__paCounted = true;
          animateCount(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: .4 });
    els.forEach(function (e) {
      e.__paCounted = false;
      io.observe(e);
    });
  }

  /* ---------- Reveal on scroll (data-pa-reveal) ---------- */
  function initReveals(root) {
    var els = (root || document).querySelectorAll('[data-pa-reveal]');
    if (!('IntersectionObserver' in global)) {
      els.forEach(function (e) { e.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = parseInt(en.target.getAttribute('data-pa-delay') || '0', 10);
          setTimeout(function () { en.target.classList.add('is-revealed'); }, d);
          io.unobserve(en.target);
        }
      });
    }, { threshold: .12 });
    els.forEach(function (e) {
      if (!e.classList.contains('is-revealed')) io.observe(e);
    });
  }

  /* ---------- Progress rings (data-pa-ring="72") ---------- */
  function initRings(root) {
    (root || document).querySelectorAll('[data-pa-ring]').forEach(function (el) {
      if (el.__paBound) return;
      el.__paBound = true;
      var pct = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-pa-ring') || '0')));
      var size = parseInt(el.getAttribute('data-pa-size') || '96', 10);
      var stroke = parseInt(el.getAttribute('data-pa-stroke') || '8', 10);
      var color = el.getAttribute('data-pa-color') || 'var(--pa-primary)';
      var r = (size - stroke) / 2;
      var c = 2 * Math.PI * r;
      el.classList.add('pa-ring');
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.innerHTML =
        '<svg width="' + size + '" height="' + size + '">' +
          '<circle class="pa-ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"/>' +
          '<circle class="pa-ring-val" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" stroke="' + color + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + c + '"/>' +
        '</svg>' +
        '<span class="pa-ring-label">0٪</span>';
      var val = el.querySelector('.pa-ring-val');
      var lbl = el.querySelector('.pa-ring-label');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          val.style.strokeDashoffset = c * (1 - pct / 100);
        });
      });
      var start = null, dur = 1100;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        lbl.textContent = Math.round(pct * _easeOut(p)) + '٪';
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Ripple on buttons ---------- */
  function initRipples(root) {
    (root || document).querySelectorAll('.pa-btn, .pa-icon-btn').forEach(function (btn) {
      if (btn.__paRipple) return;
      btn.__paRipple = true;
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var r = document.createElement('span');
        r.className = 'pa-ripple';
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(r);
        setTimeout(function () { r.remove(); }, 620);
      });
    });
  }

  /* =============================================================
     v1.3 — Lazy loading, advanced animations, loaders, mock auth,
     content store (localStorage), typewriter
     ============================================================= */

  /* ---------- Lazy images (IntersectionObserver, fade-in) ----------
     Usage:
       <img data-pa-lazy data-pa-src="photo.jpg" alt="…">  → src set when visible
       <img data-pa-lazy src="photo.jpg">                  → fade-in only
     Optional: data-pa-lazy-class="pa-fade-up" (extra entrance)   */
  function initLazyImages(root) {
    var imgs = (root || document).querySelectorAll('img[data-pa-lazy]');
    if (!imgs.length) return;
    function reveal(img) {
      img.classList.add('is-lazy-loaded');
    }
    function load(img) {
      var src = img.getAttribute('data-pa-src');
      if (src && !img.getAttribute('src')) img.setAttribute('src', src);
      if (img.complete && img.naturalWidth) reveal(img);
      else img.addEventListener('load', function () { reveal(img); }, { once: true });
      img.addEventListener('error', function () { reveal(img); }, { once: true });
    }
    if (!('IntersectionObserver' in global)) {
      imgs.forEach(load);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          load(en.target);
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '120px 0px' });
    imgs.forEach(function (img) {
      if (img.__paLazy) return;
      img.__paLazy = true;
      io.observe(img);
    });
  }

  /* ---------- Stagger helper (data-pa-stagger on a container) ----------
     Children with [data-pa-reveal] receive incremental delays.       */
  function initStagger(root) {
    (root || document).querySelectorAll('[data-pa-stagger]').forEach(function (box) {
      if (box.__paStagger) return;
      box.__paStagger = true;
      var step = parseInt(box.getAttribute('data-pa-stagger') || '90', 10);
      var kids = box.querySelectorAll('[data-pa-reveal]');
      kids.forEach(function (k, i) {
        if (!k.getAttribute('data-pa-delay')) k.setAttribute('data-pa-delay', String(i * step));
      });
    });
  }

  /* ---------- Loader overlays (PAdminLTE.loader) ----------
     loader.show(target, opts)  → overlay with spinner on any block
     loader.hide(target)        → remove overlay
     target: element | selector. opts.label = optional text.      */
  var loader = {
    show: function (target, opts) {
      opts = opts || {};
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return null;
      if (el.__paLoader) return el.__paLoader;
      var ov = document.createElement('div');
      ov.className = 'pa-loader-overlay' + (opts.dark ? ' is-dark' : '');
      ov.innerHTML =
        '<span class="pa-spinner pa-spinner-border"></span>' +
        (opts.label ? '<span class="pa-loader-label"></span>' : '');
      if (opts.label) ov.querySelector('.pa-loader-label').textContent = opts.label;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(ov);
      el.__paLoader = ov;
      requestAnimationFrame(function () { ov.classList.add('is-visible'); });
      return ov;
    },
    hide: function (target) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el || !el.__paLoader) return;
      var ov = el.__paLoader;
      ov.classList.remove('is-visible');
      delete el.__paLoader;
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 240);
    }
  };

  /* ---------- Full-page preloader ----------
     Static markup: <div class="pa-preloader"><span class="pa-spinner pa-spinner-border"></span></div>
     Auto-hides after boot; or control via PAdminLTE.pageLoader.     */
  function pageLoaderShow(label) {
    var p = document.querySelector('.pa-preloader');
    if (!p) {
      p = document.createElement('div');
      p.className = 'pa-preloader';
      p.innerHTML =
        '<div class="pa-preloader-box">' +
          '<span class="pa-brand-mark pa-preloader-mark">P</span>' +
          '<span class="pa-spinner pa-spinner-border"></span>' +
          (label ? '<span class="pa-preloader-label"></span>' : '') +
        '</div>';
      if (label) p.querySelector('.pa-preloader-label').textContent = label;
      document.body.appendChild(p);
    }
    requestAnimationFrame(function () { p.classList.add('is-active'); });
    return p;
  }
  function pageLoaderHide() {
    var p = document.querySelector('.pa-preloader');
    if (!p) return;
    p.classList.remove('is-active');
    p.classList.add('is-done');
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 420);
  }
  function initPreloaders() {
    // Auto-dismiss any static preloader shortly after boot
    var p = document.querySelector('.pa-preloader');
    if (p) setTimeout(pageLoaderHide, 350);
  }

  /* ---------- Button loading state ----------
     btnLoading(btn, true [, label]) → spinner inside button       */
  function btnLoading(btn, on, label) {
    if (!btn) return;
    if (on) {
      if (btn.__paBusy) return;
      btn.__paBusy = true;
      btn.__paPrev = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('is-loading');
      var tmp = document.createElement('div');
      tmp.innerHTML = btn.__paPrev || '';
      var txt = (label !== undefined) ? label : tmp.textContent.trim();
      btn.innerHTML = '<span class="pa-spinner pa-spinner-border pa-spinner-sm"></span>' +
        (txt ? '<span>' + txt + '</span>' : '');
    } else {
      if (!btn.__paBusy) return;
      btn.__paBusy = false;
      btn.disabled = false;
      btn.classList.remove('is-loading');
      btn.innerHTML = btn.__paPrev || btn.innerHTML;
    }
  }

  /* ---------- Skeletons (data-pa-skeleton="ms") ----------
     <div data-pa-skeleton="1400">skeleton pieces…</div>
     <div data-pa-skeleton-content class="pa-hidden">real content</div>
     After the delay the skeleton fades out and the content shows. */
  function initSkeletons(root) {
    (root || document).querySelectorAll('[data-pa-skeleton]').forEach(function (sk) {
      if (sk.__paBound) return;
      sk.__paBound = true;
      var ms = parseInt(sk.getAttribute('data-pa-skeleton') || '1400', 10);
      var content = null;
      var sib = sk.nextElementSibling;
      while (sib) {
        if (sib.hasAttribute && sib.hasAttribute('data-pa-skeleton-content')) { content = sib; break; }
        sib = sib.nextElementSibling;
      }
      setTimeout(function () {
        sk.classList.add('is-done');
        setTimeout(function () { sk.classList.add('is-gone'); }, 320);
        if (content) {
          content.classList.remove('pa-hidden');
          content.classList.add('is-revealed');
          // re-run icons/bindings for revealed content
          if (PAdminLTE.injectIcons) PAdminLTE.injectIcons(content);
        }
      }, ms);
    });
  }

  /* ---------- Typewriter (data-pa-typewriter) ----------
     <span data-pa-typewriter data-pa-text="…|…|…" data-pa-speed="70"></span>
     data-pa-text: pipe-separated phrases looped forever.            */
  function initTypewriters(root) {
    (root || document).querySelectorAll('[data-pa-typewriter]').forEach(function (el) {
      if (el.__paBound) return;
      el.__paBound = true;
      var phrases = (el.getAttribute('data-pa-text') || el.textContent || '').split('|');
      var speed = parseInt(el.getAttribute('data-pa-speed') || '70', 10);
      var hold = parseInt(el.getAttribute('data-pa-hold') || '1600', 10);
      el.textContent = '';
      var caret = document.createElement('span');
      caret.className = 'pa-type-caret';
      el.appendChild(caret);
      var pi = 0;
      function type() {
        var word = phrases[pi % phrases.length] || '';
        var i = 0;
        (function tick() {
          if (i <= word.length) {
            caret.insertAdjacentText('beforebegin', word.charAt(i - 1) || '');
            var prev = caret.previousSibling;
            i++;
            if (i > word.length) {
              setTimeout(erase, hold);
            } else setTimeout(tick, speed);
          } else setTimeout(erase, hold);
        })();
      }
      function erase() {
        (function tick() {
          var prev = caret.previousSibling;
          if (prev && prev.nodeType === 3) {
            prev.textContent = prev.textContent.slice(0, -1);
            if (prev.textContent.length) setTimeout(tick, speed / 2);
            else { pi++; setTimeout(type, 240); }
          } else { pi++; setTimeout(type, 240); }
        })();
      }
      type();
    });
  }

  /* ---------- Mock auth (localStorage; demo only — NOT real security) ----------
     Accounts live in 'pa-users', the active session in 'pa-session'.
     A demo manager account is seeded on first run so every flow works
     offline out of the box.                                          */
  var STORAGE_USERS = 'pa-users';
  var STORAGE_SESSION = 'pa-session';
  function _seedUsers() {
    var users = _lsGet(STORAGE_USERS, null);
    if (!users || !users.length) {
      users = [{
        id: 'u-admin',
        name: 'امیر رضایی',
        email: 'admin@example.com',
        pass: 'admin123',
        role: 'مدیر',
        color: '#4f6df5',
        bio: 'مدیر سیستم PAdminLTE — عاشور کد تمیز و طراحی بی‌وابستگی.',
        joined: '۱۴۰۳/۰۱/۱۵'
      }];
      _lsSet(STORAGE_USERS, users);
    }
    return users;
  }
  function authUsers() { return _seedUsers(); }
  function authCurrentUser() {
    var id = _lsGet(STORAGE_SESSION, null);
    if (!id) return null;
    var u = authUsers().filter(function (x) { return x.id === id; })[0];
    return u || null;
  }
  function authLogin(email, pass, remember) {
    var users = authUsers();
    var u = users.filter(function (x) {
      return x.email.toLowerCase() === String(email || '').toLowerCase().trim();
    })[0];
    if (!u || u.pass !== pass) {
      emit('pa:auth:error', { reason: 'credentials' });
      return null;
    }
    _lsSet(STORAGE_SESSION, u.id);
    if (remember === false) { /* demo: session kept either way */ }
    emit('pa:auth:login', { user: u });
    return u;
  }
  function authRegister(o) {
    o = o || {};
    var users = authUsers();
    var exists = users.some(function (x) {
      return x.email.toLowerCase() === String(o.email || '').toLowerCase().trim();
    });
    if (exists) { emit('pa:auth:error', { reason: 'exists' }); return null; }
    var u = {
      id: 'u-' + Date.now(),
      name: o.name || 'کاربر جدید',
      email: String(o.email || '').toLowerCase().trim(),
      pass: o.pass || '',
      role: o.role || 'نویسنده',
      color: o.color || '#0aa6c2',
      bio: o.bio || '',
      joined: new Date().toLocaleDateString('fa-IR')
    };
    users.push(u);
    _lsSet(STORAGE_USERS, users);
    _lsSet(STORAGE_SESSION, u.id);
    emit('pa:auth:register', { user: u });
    return u;
  }
  function authLogout() {
    _lsSet(STORAGE_SESSION, null);
    emit('pa:auth:logout', {});
  }
  function authUpdateProfile(patch) {
    var id = _lsGet(STORAGE_SESSION, null);
    if (!id) return null;
    var users = authUsers();
    var u = users.filter(function (x) { return x.id === id; })[0];
    if (!u) return null;
    Object.keys(patch || {}).forEach(function (k) {
      if (k !== 'id' && k !== 'pass') u[k] = patch[k];
    });
    _lsSet(STORAGE_USERS, users);
    emit('pa:auth:update', { user: u });
    return u;
  }
  function authChangePassword(oldPass, newPass) {
    var id = _lsGet(STORAGE_SESSION, null);
    if (!id) return { ok: false, error: 'session' };
    var users = authUsers();
    var u = users.filter(function (x) { return x.id === id; })[0];
    if (!u) return { ok: false, error: 'session' };
    if (u.pass !== oldPass) return { ok: false, error: 'wrong' };
    if (!newPass || String(newPass).length < 6) return { ok: false, error: 'short' };
    u.pass = newPass;
    _lsSet(STORAGE_USERS, users);
    emit('pa:auth:password', {});
    return { ok: true };
  }

  /* ---------- Tiny content store (localStorage collections) ---------- */
  function _lsGet(k, fb) {
    try {
      var v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? fb : v;
    } catch (e) { return fb; }
  }
  function _lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function IN_PAGES_DIR() {
    var segs = (global.location && global.location.pathname || '').split('/');
    for (var i = 0; i < segs.length - 1; i++) if (segs[i] === 'pages') return true;
    return false;
  }
  var store = {
    get: function (key, seed) {
      var v = _lsGet(key, null);
      if (v === null) { v = seed || []; _lsSet(key, v); }
      return v;
    },
    save: function (key, val) { _lsSet(key, val); },
    find: function (key, id, seed) {
      return store.get(key, seed).filter(function (x) { return String(x.id) === String(id); })[0] || null;
    },
    add: function (key, item, seed) {
      var arr = store.get(key, seed);
      item.id = item.id || ('i-' + Date.now() + '-' + Math.floor(Math.random() * 999));
      arr.unshift(item);
      store.save(key, arr);
      return item;
    },
    update: function (key, id, patch, seed) {
      var arr = store.get(key, seed);
      var it = null;
      arr.forEach(function (x) {
        if (String(x.id) === String(id)) { Object.keys(patch).forEach(function (k) { x[k] = patch[k]; }); it = x; }
      });
      store.save(key, arr);
      return it;
    },
    remove: function (key, id, seed) {
      var arr = store.get(key, seed).filter(function (x) { return String(x.id) !== String(id); });
      store.save(key, arr);
      return arr;
    }
  };

  /* ---------- Mobile sidebar backdrop (v1.3.1) ----------
     Auto-injected overlay for the off-canvas sidebar on phones:
     tap outside or tap a nav link to close.                     */
  function initSidebarBackdrop() {
    var app = document.querySelector('.pa-app');
    if (!app || app.__paBackdrop) return;
    app.__paBackdrop = true;
    var bd = document.querySelector('.pa-sidebar-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.className = 'pa-sidebar-backdrop';
      document.body.appendChild(bd);
    }
    function sync() {
      var open = app.classList.contains('pa-sidebar-open');
      var mobile = global.innerWidth <= 992;
      bd.classList.toggle('is-visible', open && mobile);
      document.body.style.overflow = (open && mobile) ? 'hidden' : '';
    }
    bd.addEventListener('click', function () {
      app.classList.remove('pa-sidebar-open');
      sync();
    });
    app.addEventListener('click', function (e) {
      var link = e.target.closest('.pa-sidebar-link');
      if (link && !link.hasAttribute('data-pa-tree-toggle') && global.innerWidth <= 992) {
        app.classList.remove('pa-sidebar-open');
        sync();
      }
    });
    global.addEventListener('resize', sync);
    if (global.MutationObserver) {
      new MutationObserver(sync).observe(app, { attributes: true, attributeFilter: ['class'] });
    }
    sync();
  }

  /* ---------- Auto-init everything ---------- */
  var _origBoot = boot;
  function fullBoot(root) {
    _origBoot(root);
    initFileUpload(root);
    initOtpInputs(root);
    initLiveEdit(root);
    initQtySteppers(root);
    initKanban(root);
    initSearchableLists(root);
    initBackToTop();
    initAccordions(root);
    initCarousels(root);
    initRatings(root);
    initCounters(root);
    initReveals(root);
    initRings(root);
    initRipples(root);
    initLazyImages(root);
    initStagger(root);
    initSkeletons(root);
    initTypewriters(root);
    initPreloaders();
    initSidebarBackdrop();
    // Bind logout buttons (mock auth)
    (root || document).querySelectorAll('[data-pa-logout]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        PAdminLTE.auth.logout();
        toast({ kind: 'info', title: 'خروج', message: 'از حساب خود خارج شدید (نمونه).' });
        var login = IN_PAGES_DIR() ? 'login.html' : 'pages/login.html';
        setTimeout(function () { global.location.href = login; }, 650);
      });
    });
    // Bind copy buttons
    (root || document).querySelectorAll('[data-pa-copy]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-pa-copy');
        var text = '';
        if (target) {
          var el = document.querySelector(target);
          if (el) text = el.value || el.textContent;
        } else text = btn.getAttribute('data-pa-copy-text') || '';
        copyToClipboard(text);
      });
    });
    // Bind mark-all-read buttons
    (root || document).querySelectorAll('[data-pa-mark-all-read]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        markAllNotificationsRead(btn.getAttribute('data-pa-mark-all-read') || null);
        toast({ kind: 'success', message: 'همه اعلان‌ها خوانده شدند.' });
      });
    });
    // Bind OTP resend buttons
    (root || document).querySelectorAll('[data-pa-otp-resend]').forEach(function (btn) {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', function () {
        btn.disabled = true;
        countdown(btn, 30, {
          onTick: function (s) { btn.textContent = 'ارسال مجدد در ' + s + 's'; },
          onComplete: function () { btn.disabled = false; btn.textContent = 'ارسال مجدد کد'; }
        });
        toast({ kind: 'info', message: 'کد جدید ارسال شد (نمونه).' });
      });
    });
  }
  // Replace boot reference for auto-init
  PAdminLTE.boot = fullBoot;
  // Re-run boot on document if it was already done
  if (document.readyState !== 'loading') setTimeout(function () { fullBoot(document); }, 0);

  /* ---------- Public API additions (v1.1) ---------- */
  PAdminLTE.initFileUpload = initFileUpload;
  PAdminLTE.initOtpInputs = initOtpInputs;
  PAdminLTE.initLiveEdit = initLiveEdit;
  PAdminLTE.initQtySteppers = initQtySteppers;
  PAdminLTE.initKanban = initKanban;
  PAdminLTE.countdown = countdown;
  PAdminLTE.copyToClipboard = copyToClipboard;
  PAdminLTE.notify = notify;
  PAdminLTE.markAllNotificationsRead = markAllNotificationsRead;

  /* ---------- Public API additions (v1.2) ---------- */
  PAdminLTE.initBackToTop = initBackToTop;
  PAdminLTE.initAccordions = initAccordions;
  PAdminLTE.initCarousels = initCarousels;
  PAdminLTE.initRatings = initRatings;
  PAdminLTE.initCounters = initCounters;
  PAdminLTE.animateCount = animateCount;
  PAdminLTE.initReveals = initReveals;
  PAdminLTE.initRings = initRings;
  PAdminLTE.lightbox = {
    open: openLightbox,
    close: closeLightbox,
    go: function (i) { lightboxGo(i); }
  };

  /* ---------- Public API additions (v1.3) ---------- */
  PAdminLTE.initLazyImages = initLazyImages;
  PAdminLTE.initStagger = initStagger;
  PAdminLTE.loader = loader;
  PAdminLTE.pageLoader = {
    show: pageLoaderShow,
    hide: pageLoaderHide
  };
  PAdminLTE.btnLoading = btnLoading;
  PAdminLTE.initSkeletons = initSkeletons;
  PAdminLTE.initTypewriters = initTypewriters;
  PAdminLTE.store = store;
  PAdminLTE.auth = {
    users: authUsers,
    currentUser: authCurrentUser,
    login: authLogin,
    register: authRegister,
    logout: authLogout,
    updateProfile: authUpdateProfile,
    changePassword: authChangePassword
  };
})(typeof window !== 'undefined' ? window : this);
