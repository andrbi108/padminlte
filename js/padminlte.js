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
  function openModal(id) {
    var el = typeof id === 'string' ? document.getElementById(id) : id;
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var focusable = el.querySelector('input, button, select, textarea, a[href]');
    if (focusable) setTimeout(function () { focusable.focus(); }, 50);
    emit('pa:modal:open', { id: el.id });
  }
  function closeModal(id) {
    var el = typeof id === 'string' ? document.getElementById(id) : id;
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
    var ctx = canvas.getContext('2d');
    var dpr = global.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 300;
    var h = canvas.clientHeight || canvas.parentElement.clientHeight || 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    return { ctx: ctx, w: w, h: h };
  }

  function lineChart(canvas, data, opts) {
    opts = opts || {};
    var colors = (opts.colors || ['#0d6efd', '#198754', '#ffc107', '#dc3545']);
    var padding = { top: 10, right: 10, bottom: 24, left: 36 };
    var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
    ctx.clearRect(0, 0, w, h);
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
    var chartW = w - padding.left - padding.right;
    var chartH = h - padding.top - padding.bottom;
    var stepX = labels.length > 1 ? chartW / (labels.length - 1) : chartW;

    function yFor(v) { return padding.top + chartH - ((v - minV) / (maxV - minV)) * chartH; }
    function xFor(i) { return padding.left + i * stepX; }

    // grid
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    ctx.font = '10px ' + getComputedStyle(document.body).fontFamily;
    ctx.fillStyle = axisColor;
    for (var g = 0; g <= 4; g++) {
      var yy = padding.top + (chartH / 4) * g;
      ctx.beginPath(); ctx.moveTo(padding.left, yy); ctx.lineTo(padding.left + chartW, yy); ctx.stroke();
      var lab = Math.round(maxV - ((maxV - minV) / 4) * g);
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(String(lab), padding.left - 6, yy);
    }
    // x labels
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    labels.forEach(function (l, i) {
      if (i % Math.ceil(labels.length / 8 || 1) === 0 || i === labels.length - 1) {
        ctx.fillText(String(l), xFor(i), padding.top + chartH + 4);
      }
    });
    // series
    series.forEach(function (s, idx) {
      var color = colors[idx % colors.length];
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      ctx.fillStyle = color + '22';
      var vals = s.values || [];
      ctx.beginPath();
      vals.forEach(function (v, i) {
        var x = xFor(i), y = yFor(v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      // area
      if (opts.area !== false) {
        ctx.lineTo(xFor(vals.length - 1), padding.top + chartH);
        ctx.lineTo(xFor(0), padding.top + chartH);
        ctx.closePath();
        ctx.fill();
      }
      // points
      if (opts.points !== false) {
        vals.forEach(function (v, i) {
          ctx.beginPath(); ctx.fillStyle = color;
          ctx.arc(xFor(i), yFor(v), 3, 0, Math.PI * 2); ctx.fill();
        });
      }
    });
  }

  function barChart(canvas, data, opts) {
    opts = opts || {};
    var colors = opts.colors || ['#0d6efd', '#198754', '#ffc107', '#dc3545'];
    var padding = { top: 10, right: 10, bottom: 24, left: 36 };
    var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
    ctx.clearRect(0, 0, w, h);
    var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
    var axisColor = isDark ? '#adb5bd' : '#6c757d';
    var gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
    var labels = data.labels || [];
    var series = data.series || [];
    var allVals = series.reduce(function (a, s) { return a.concat(s.values || []); }, []);
    var maxV = Math.max.apply(null, allVals.concat([0]));
    if (maxV === 0) maxV = 1;
    var chartW = w - padding.left - padding.right;
    var chartH = h - padding.top - padding.bottom;
    function yFor(v) { return padding.top + chartH - (v / maxV) * chartH; }
    // grid
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    ctx.font = '10px ' + getComputedStyle(document.body).fontFamily;
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
        var x = padding.left + gi * groupW + (groupW - barW * seriesCount) / 2 + si * barW;
        var y = yFor(v);
        ctx.fillStyle = colors[si % colors.length];
        ctx.fillRect(x, y, barW - 2, padding.top + chartH - y);
      });
      ctx.fillStyle = axisColor;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(String(l), padding.left + gi * groupW + groupW / 2, padding.top + chartH + 4);
    });
  }

  function donutChart(canvas, data, opts) {
    opts = opts || {};
    var colors = opts.colors || ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6c757d', '#0dcaf0'];
    var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
    ctx.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2;
    var r = Math.min(w, h) / 2 - 6;
    var innerR = r * 0.6;
    var total = data.reduce(function (a, d) { return a + (d.value || 0); }, 0) || 1;
    var start = -Math.PI / 2;
    data.forEach(function (d, i) {
      var angle = ((d.value || 0) / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle, false);
      ctx.closePath();
      ctx.fill();
      start += angle;
    });
    // inner hole
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // center text
    var isDark = document.documentElement.getAttribute('data-pa-theme') === 'dark';
    ctx.fillStyle = isDark ? '#e9ecef' : '#212529';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px ' + getComputedStyle(document.body).fontFamily;
    ctx.fillText(String(total), cx, cy - 6);
    ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
    ctx.fillStyle = isDark ? '#adb5bd' : '#6c757d';
    ctx.fillText(opts.centerLabel || 'Total', cx, cy + 12);
  }

  function sparkline(canvas, values, color) {
    var _g = _getCtx(canvas), ctx = _g.ctx, w = _g.w, h = _g.h;
    ctx.clearRect(0, 0, w, h);
    color = color || '#0d6efd';
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    var stepX = w / (values.length - 1 || 1);
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
    document.addEventListener('DOMContentLoaded', function () { boot(document); });
  } else {
    boot(document);
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
})(typeof window !== 'undefined' ? window : this);
