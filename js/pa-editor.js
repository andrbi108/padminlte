/* =============================================================
   PAdminLTE — WYSIWYG rich-text editor (v2.1, zero-dependency)
   ---------------------------------------------------------------
   A complete local rich-text editor built on the native
   contenteditable + document.execCommand stack. No library, no
   CDN, works offline from file:// like the rest of PAdminLTE.

   Usage (declarative):
     <textarea data-pa-editor></textarea>                     → full toolbar
     <textarea data-pa-editor="basic"></textarea>             → basic toolbar
     <textarea data-pa-editor="minimal"></textarea>           → inline toolbar
   Options (attributes on the backing field):
     data-pa-editor-height="300"        min-height of the editor body (px)
     data-pa-editor-placeholder="…"     placeholder text
     data-pa-editor-no-source           hide the HTML source button
   The original <textarea> stays in the form (visually hidden) and is
   kept in sync on every input, so normal form submission, the
   validator (data-pa-validate) and the draft autosaver
   (data-pa-autosave) keep working unchanged.

   API (imperative):
     PAdminLTE.editor.create(el, opts) -> instance
     PAdminLTE.editor.scan(root?)      -> init every [data-pa-editor]
     PAdminLTE.editor.get(id)          -> instance by backing-field id
     instance.getHTML()/setHTML()/getText()/insertHTML()
     instance.focus()/clear()/toggleSource()/toggleFullscreen()/destroy()
   Events (CustomEvent, bubbles, on the editor root):
     pa:editor:input | pa:editor:focus | pa:editor:blur
     pa:editor:source {on} | pa:editor:fullscreen {on} | pa:editor:command {cmd}

   Note: document.execCommand is marked deprecated by specs but remains
   the only browser-native way to drive a contenteditable rich-text
   surface and is universally implemented — the pragmatic zero-dependency
   choice. Always sanitize submitted HTML server-side.
   ============================================================= */

(function (global) {
  'use strict';

  var P = global.PAdminLTE || (global.PAdminLTE = {});
  var doc = global.document;
  var EDITOR_SEQ = 0;

  function icon(name, size) {
    return P.icon ? P.icon(name, size) : '';
  }

  /* ---------------- toolbar presets & button catalogue ---------------- */

  var PRESETS = {
    full: ['undo', 'redo', '|', 'block', '|', 'bold', 'italic', 'underline', 'strike', '|',
           'align_start', 'align_center', 'align_end', 'align_justify', '|',
           'ul', 'ol', 'outdent', 'indent', '|',
           'link', 'unlink', 'image', 'hr', 'table', '|', 'color', '|',
           'eraser', 'dir', '|', 'source', 'fullscreen'],
    basic: ['bold', 'italic', 'underline', 'strike', '|', 'block', '|',
            'ul', 'ol', '|', 'link', 'image', '|', 'eraser', '|', 'source'],
    minimal: ['bold', 'italic', 'underline', '|', 'link']
  };

  var BUTTONS = {
    undo:          { icon: 'undo',            title: 'واگرد (Ctrl+Z)',            cmd: 'undo' },
    redo:          { icon: 'redo',            title: 'انجام دوباره (Ctrl+Y)',     cmd: 'redo' },
    block:         { icon: 'heading',         title: 'سبک پاراگراف',              pop: 'block' },
    bold:          { icon: 'bold',            title: 'ضخیم (Ctrl+B)',             cmd: 'bold',       state: true },
    italic:        { icon: 'italic',          title: 'مورب (Ctrl+I)',             cmd: 'italic',     state: true },
    underline:     { icon: 'underline',       title: 'زیرخط (Ctrl+U)',            cmd: 'underline',  state: true },
    strike:        { icon: 'strikethrough',   title: 'خط خورده',                  cmd: 'strikeThrough', state: true },
    align_start:   { icon: 'align_left',      title: 'هم‌ترازی آغاز سطر',          dyn: 'start' },
    align_center:  { icon: 'align_center',    title: 'وسط‌چین',                    cmd: 'justifyCenter', state: true },
    align_end:     { icon: 'align_right',     title: 'هم‌ترازی پایان سطر',         dyn: 'end' },
    align_justify: { icon: 'align_justify',   title: 'هم‌ترازی کامل',              cmd: 'justifyFull', state: true },
    ul:            { icon: 'list',            title: 'فهرست نقطه‌ای',              cmd: 'insertUnorderedList', state: true },
    ol:            { icon: 'list_ordered',    title: 'فهرست شماره‌ای',             cmd: 'insertOrderedList', state: true },
    outdent:       { icon: 'chevron_left',    title: 'کاهش تودرتویی',              cmd: 'outdent' },
    indent:        { icon: 'chevron_right',   title: 'افزایش تودرتویی',            cmd: 'indent' },
    link:          { icon: 'link',            title: 'درج پیوند (Ctrl+K)',         pop: 'link' },
    unlink:        { icon: 'unlink',          title: 'حذف پیوند',                  cmd: 'unlink' },
    image:         { icon: 'image',           title: 'درج تصویر (URL یا فایل محلی)', pop: 'image' },
    hr:            { icon: 'minus',           title: 'خط افقی',                    cmd: 'insertHorizontalRule' },
    table:         { icon: 'table',           title: 'درج جدول',                   pop: 'table' },
    color:         { icon: 'palette',         title: 'رنگ متن و پس‌زمینه',          pop: 'color' },
    eraser:        { icon: 'eraser',          title: 'پاک کردن قالب‌بندی',          action: 'removeFormat' },
    dir:           { icon: 'arrow_left_right', title: 'تغییر جهت نوشتار (RTL/LTR)', action: 'toggleDir' },
    source:        { icon: 'code',            title: 'مشاهده کد HTML',             action: 'toggleSource' },
    fullscreen:    { icon: 'maximize',        title: 'تمام‌صفحه',                   action: 'toggleFullscreen' }
  };

  var BLOCKS = [
    { v: 'p',           label: 'پاراگراف' },
    { v: 'h1',          label: 'عنوان ۱' },
    { v: 'h2',          label: 'عنوان ۲' },
    { v: 'h3',          label: 'عنوان ۳' },
    { v: 'h4',          label: 'عنوان ۴' },
    { v: 'blockquote',  label: 'نقل قول' },
    { v: 'pre',         label: 'بلوک کد' }
  ];

  function faNum(n) {
    var s = String(n);
    if ((doc.documentElement.getAttribute('dir') || 'ltr').toLowerCase() === 'rtl') {
      return s.replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
    }
    return s;
  }

  function emit(el, type, detail) {
    var ev;
    try { ev = new CustomEvent(type, { bubbles: true, cancelable: false, detail: detail || {} }); }
    catch (e) { ev = doc.createEvent('CustomEvent'); ev.initCustomEvent(type, true, false, detail || {}); }
    el.dispatchEvent(ev);
  }

  /* ---------------- paste sanitizer (light, client-side) ---------------- */

  function sanitizeHTML(html) {
    var t = doc.createElement('template');
    t.innerHTML = String(html || '');
    var banned = /^(script|style|meta|link|iframe|object|embed|base|form|input|button|select|textarea)$/i;
    (function walk(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.nodeType === 1) {
          if (banned.test(n.tagName)) { n.parentNode.removeChild(n); continue; }
          var attrs = Array.prototype.slice.call(n.attributes);
          for (var j = 0; j < attrs.length; j++) {
            var a = attrs[j];
            var lname = a.name.toLowerCase();
            if (lname.indexOf('on') === 0) { n.removeAttribute(a.name); continue; }
            if ((lname === 'href' || lname === 'src') && /^\s*javascript:/i.test(a.value)) { n.removeAttribute(a.name); }
          }
          walk(n);
        }
      }
    })(t.content || t);
    return t.innerHTML;
  }

  /* ---------------- editor factory ---------------- */

  function create(el, opts) {
    if (!el || el.__paEditor) return el && el.__paEditor;
    opts = opts || {};

    var isTextarea = (el.tagName || '').toUpperCase() === 'TEXTAREA';
    var presetName = opts.preset || el.getAttribute('data-pa-editor') || 'full';
    if (!PRESETS[presetName]) presetName = 'full';
    var preset = PRESETS[presetName].slice();

    if (opts.noSource || el.hasAttribute('data-pa-editor-no-source')) {
      preset = preset.filter(function (b) { return b !== 'source'; });
    }

    var defaultH = presetName === 'minimal' ? 90 : (presetName === 'basic' ? 170 : 230);
    var height = opts.height || parseInt(el.getAttribute('data-pa-editor-height'), 10) || defaultH;
    var placeholder = opts.placeholder || el.getAttribute('data-pa-editor-placeholder') ||
                      el.getAttribute('placeholder') || 'متن خود را بنویسید…';

    var root = doc.createElement('div');
    root.className = 'pa-editor pa-ed-' + presetName;
    root.setAttribute('data-pa-editor-root', presetName);

    var id = el.id || ('pa-editor-' + (++EDITOR_SEQ));

    /* ---- toolbar ---- */
    var toolbar = doc.createElement('div');
    toolbar.className = 'pa-editor-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'ویرایشگر متن');
    var html = '';
    preset.forEach(function (b) {
      if (b === '|') { html += '<span class="pa-ed-sep"></span>'; return; }
      var def = BUTTONS[b];
      if (!def) return;
      html += '<button type="button" class="pa-ed-btn" data-ed="' + b + '" title="' + def.title + '" aria-label="' + def.title + '">' + icon(def.icon, 16) + '</button>';
    });
    html += '<span class="pa-editor-count" aria-live="polite"></span>';
    toolbar.innerHTML = html;

    /* ---- body: editable + source textarea ---- */
    var body = doc.createElement('div');
    body.className = 'pa-editor-body';
    var content = doc.createElement('div');
    content.className = 'pa-editor-content';
    content.setAttribute('contenteditable', 'true');
    content.setAttribute('data-placeholder', placeholder);
    content.setAttribute('spellcheck', 'false');
    content.setAttribute('aria-label', 'ناحیه ویرایش');
    body.appendChild(content);

    var source = doc.createElement('textarea');
    source.className = 'pa-editor-source-input';
    source.setAttribute('spellcheck', 'false');
    source.setAttribute('aria-label', 'کد HTML');
    body.appendChild(source);

    root.appendChild(toolbar);
    root.appendChild(body);

    /* ---- initial content + insert into DOM ---- */
    var initial = isTextarea ? (el.value || '') : (el.innerHTML || '');
    content.innerHTML = sanitizeHTML(initial);
    if (isTextarea && el.hasAttribute('required') && !el.getAttribute('data-pa-validate')) {
      el.setAttribute('data-pa-validate', 'required');
    }
    el.classList.add('pa-editor-backing');
    el.removeAttribute('placeholder');
    el.parentNode.insertBefore(root, el.nextSibling);

    /* ---- internals ---- */
    var savedRange = null;
    var fullRestore = null;
    var pop = doc.createElement('div');
    pop.className = 'pa-ed-pop';
    pop.hidden = true;
    root.appendChild(pop);

    function contentDir() {
      return (content.getAttribute('dir') ||
              doc.documentElement.getAttribute('dir') || 'ltr').toLowerCase();
    }

    function isEmpty() {
      var t = (content.textContent || '').replace(/[\u200c\u200f\u200e]/g, '').trim();
      return !t && !content.querySelector('img,hr,table,ul,ol,blockquote,pre');
    }

    function saveRange() {
      var s = doc.getSelection();
      if (s && s.rangeCount && content.contains(s.anchorNode)) {
        savedRange = s.getRangeAt(0).cloneRange();
      }
    }

    function restoreRange() {
      content.focus();
      var s = doc.getSelection();
      if (!s) return;
      s.removeAllRanges();
      if (savedRange) s.addRange(savedRange);
    }

    function sync() {
      var htmlOut = isEmpty() ? '' : content.innerHTML;
      if (isTextarea) el.value = htmlOut; else el.innerHTML = htmlOut;
      try { el.dispatchEvent(new global.Event('input', { bubbles: true })); } catch (e) {}
      updateCounter();
      emit(root, 'pa:editor:input', { html: htmlOut });
    }

    function updateCounter() {
      var text = (content.textContent || '').replace(/\u200c/g, ' ').trim();
      var words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      var chars = (content.textContent || '').length;
      countEl.textContent = faNum(words) + ' واژه · ' + faNum(chars) + ' نویسه';
    }

    function exec(cmd, arg) {
      if (root.classList.contains('is-source')) return;
      /* semantic <b>/<i>/<u> output for structure commands; only colors need
         styleWithCSS to avoid legacy <font> tags */
      var cssMode = cmd === 'foreColor' || cmd === 'hiliteColor';
      try { doc.execCommand('styleWithCSS', false, cssMode); } catch (e) {}
      try { doc.execCommand(cmd, false, arg || null); } catch (e) {}
      saveRange();
      sync();
      markActive();
      emit(root, 'pa:editor:command', { cmd: cmd, arg: arg || null });
    }

    function markActive() {
      var states = {};
      ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList',
       'insertOrderedList', 'justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight'].forEach(function (c) {
        try { states[c] = doc.queryCommandState(c); } catch (e) { states[c] = false; }
      });
      var d = contentDir();
      toolbar.querySelectorAll('.pa-ed-btn[data-ed]').forEach(function (btn) {
        var b = BUTTONS[btn.getAttribute('data-ed')];
        if (!b) return;
        var on = false;
        if (b.cmd && b.state) on = !!states[b.cmd];
        else if (b.dyn === 'start') on = d === 'rtl' ? !!states.justifyRight : !!states.justifyLeft;
        else if (b.dyn === 'end') on = d === 'rtl' ? !!states.justifyLeft : !!states.justifyRight;
        btn.classList.toggle('is-active', on);
      });
      if (!pop.hidden && pop.getAttribute('data-pop') === 'block') highlightBlockItem();
    }

    /* ---- popovers ---- */

    function closePop() {
      pop.hidden = true;
      pop.innerHTML = '';
      pop.removeAttribute('data-pop');
      root.classList.remove('has-pop');
    }

    function openPop(kind, anchor, build) {
      if (!pop.hidden && pop.getAttribute('data-pop') === kind) { closePop(); return; }
      closePop();
      pop.setAttribute('data-pop', kind);
      build(pop);
      pop.hidden = false;
      root.classList.add('has-pop');
      /* position: below the toolbar button, kept inside the editor and
         direction-aware via the logical inset-inline-start */
      var rw = root.clientWidth, pw = pop.offsetWidth;
      var btn = anchor, inset;
      pop.style.top = (btn.offsetTop + btn.offsetHeight + 6) + 'px';
      if (contentDir() === 'rtl') {
        /* inline-start = right side */
        var fromRight = rw - (btn.offsetLeft + btn.offsetWidth);
        inset = Math.max(0, Math.min(fromRight, rw - pw - 4));
      } else {
        inset = Math.max(0, Math.min(btn.offsetLeft, rw - pw - 4));
      }
      pop.style.insetInlineStart = inset + 'px';
      var inp = pop.querySelector('input');
      if (inp) setTimeout(function () { inp.focus(); }, 0);
    }

    function highlightBlockItem() {
      var block = null;
      var s = doc.getSelection();
      if (s && s.anchorNode) {
        var n = s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentNode;
        while (n && n !== content) {
          var tag = (n.tagName || '').toLowerCase();
          if (/^(p|h1|h2|h3|h4|h5|h6|blockquote|pre|div)$/.test(tag)) { block = tag === 'div' ? 'p' : tag; break; }
          n = n.parentNode;
        }
      }
      pop.querySelectorAll('[data-block]').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-block') === block);
      });
    }

    function popBlock() {
      saveRange();
      openPop('block', toolbar.querySelector('[data-ed="block"]'), function (p) {
        var h = '<div class="pa-ed-pop-title">سبک پاراگراف</div>';
        BLOCKS.forEach(function (b) {
          h += '<button type="button" class="pa-ed-pop-item" data-block="' + b.v + '">' + b.label + '</button>';
        });
        p.innerHTML = h;
        highlightBlockItem();
        p.addEventListener('click', function (e) {
          var item = e.target.closest('[data-block]');
          if (!item) return;
          restoreRange();
          exec('formatBlock', '<' + item.getAttribute('data-block') + '>');
          closePop();
        });
      });
    }

    function popLink() {
      saveRange();
      openPop('link', toolbar.querySelector('[data-ed="link"]'), function (p) {
        p.innerHTML =
          '<div class="pa-ed-pop-title">درج پیوند</div>' +
          '<input type="text" class="pa-input pa-ed-pop-input" placeholder="https://example.com">' +
          '<label class="pa-ed-pop-check"><input type="checkbox" checked> در تب جدید باز شود</label>' +
          '<div class="pa-ed-pop-actions">' +
            '<button type="button" class="pa-btn pa-btn-primary pa-btn-sm" data-ed-link-ok>درج</button>' +
            '<button type="button" class="pa-btn pa-btn-secondary pa-btn-sm" data-ed-link-cancel>انصراف</button>' +
          '</div>';
        var url = p.querySelector('input[type="text"]');
        var newTab = p.querySelector('input[type="checkbox"]');
        function insert() {
          var u = (url.value || '').trim();
          if (!u) { url.classList.add('is-invalid'); url.focus(); return; }
          if (!/^(https?:|mailto:|tel:|#|\/|data:)/i.test(u)) u = 'https://' + u;
          restoreRange();
          var s = doc.getSelection();
          if (savedRange && savedRange.collapsed) {
            exec('insertHTML', '<a href="' + u + '">' + u.replace(/</g, '&lt;') + '</a>');
          } else {
            exec('createLink', u);
          }
          /* apply target/rel if requested */
          var sel2 = doc.getSelection();
          if (sel2 && sel2.anchorNode) {
            var node = sel2.anchorNode.nodeType === 1 ? sel2.anchorNode : sel2.anchorNode.parentNode;
            var a = node && node.closest ? node.closest('a') : null;
            if (a && newTab.checked) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
          }
          closePop();
        }
        p.querySelector('[data-ed-link-ok]').addEventListener('click', insert);
        p.querySelector('[data-ed-link-cancel]').addEventListener('click', closePop);
        url.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); insert(); } });
      });
    }

    function popImage() {
      saveRange();
      openPop('image', toolbar.querySelector('[data-ed="image"]'), function (p) {
        p.innerHTML =
          '<div class="pa-ed-pop-title">درج تصویر</div>' +
          '<input type="text" class="pa-input pa-ed-pop-input" placeholder="آدرس تصویر (https://…)">' +
          '<div class="pa-ed-pop-or">یا انتخاب فایل محلی (به base64 تبدیل می‌شود — بدون سرور)</div>' +
          '<input type="file" class="pa-ed-pop-file" accept="image/*">' +
          '<div class="pa-ed-pop-actions">' +
            '<button type="button" class="pa-btn pa-btn-primary pa-btn-sm" data-ed-img-ok>درج</button>' +
            '<button type="button" class="pa-btn pa-btn-secondary pa-btn-sm" data-ed-img-cancel>انصراف</button>' +
          '</div>';
        var url = p.querySelector('input[type="text"]');
        var file = p.querySelector('input[type="file"]');
        function insert(src) {
          if (!src) return;
          restoreRange();
          exec('insertHTML', '<img src="' + src + '" alt="">');
          closePop();
        }
        p.querySelector('[data-ed-img-ok]').addEventListener('click', function () { insert((url.value || '').trim()); });
        p.querySelector('[data-ed-img-cancel]').addEventListener('click', closePop);
        url.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); insert((url.value || '').trim()); } });
        file.addEventListener('change', function () {
          var f = file.files && file.files[0];
          if (!f) return;
          if (f.size > 1.5 * 1024 * 1024) {
            if (P.toast) P.toast({ kind: 'warning', title: 'تصویر حجیم است', message: 'حجم فایل بیش از ۱٫۵ مگابایت است؛ درج به base64 می‌تواند ذخیره‌سازی را سنگین کند.' });
          }
          var r = new global.FileReader();
          r.onload = function () { insert(r.result); };
          r.readAsDataURL(f);
        });
      });
    }

    function popTable() {
      saveRange();
      openPop('table', toolbar.querySelector('[data-ed="table"]'), function (p) {
        p.innerHTML =
          '<div class="pa-ed-pop-title">درج جدول</div>' +
          '<div class="pa-ed-pop-row">' +
            '<label class="pa-ed-pop-field">ردیف <input type="number" class="pa-input" data-ed-rows value="3" min="1" max="10"></label>' +
            '<label class="pa-ed-pop-field">ستون <input type="number" class="pa-input" data-ed-cols value="3" min="1" max="8"></label>' +
          '</div>' +
          '<div class="pa-ed-pop-actions">' +
            '<button type="button" class="pa-btn pa-btn-primary pa-btn-sm" data-ed-table-ok>درج</button>' +
            '<button type="button" class="pa-btn pa-btn-secondary pa-btn-sm" data-ed-table-cancel>انصراف</button>' +
          '</div>';
        function insert() {
          var r = Math.max(1, Math.min(10, parseInt(p.querySelector('[data-ed-rows]').value, 10) || 3));
          var c = Math.max(1, Math.min(8, parseInt(p.querySelector('[data-ed-cols]').value, 10) || 3));
          var t = '<table class="pa-ed-table"><tbody>';
          for (var i = 0; i < r; i++) {
            t += '<tr>';
            for (var j = 0; j < c; j++) t += (i === 0 ? '<th>عنوان</th>' : '<td>…</td>');
            t += '</tr>';
          }
          t += '</tbody></table><p><br></p>';
          restoreRange();
          exec('insertHTML', t);
          closePop();
        }
        p.querySelector('[data-ed-table-ok]').addEventListener('click', insert);
        p.querySelector('[data-ed-table-cancel]').addEventListener('click', closePop);
      });
    }

    function popColor() {
      saveRange();
      openPop('color', toolbar.querySelector('[data-ed="color"]'), function (p) {
        p.innerHTML =
          '<div class="pa-ed-pop-title">رنگ متن و پس‌زمینه</div>' +
          '<div class="pa-ed-pop-row">' +
            '<label class="pa-ed-pop-field">متن <input type="color" data-ed-fore value="#212529"></label>' +
            '<label class="pa-ed-pop-field">پس‌زمینه <input type="color" data-ed-back value="#fff3cd"></label>' +
          '</div>' +
          '<div class="pa-ed-pop-or">با انتخاب، بلافاصله اعمال می‌شود.</div>';
        p.querySelector('[data-ed-fore]').addEventListener('input', function () { restoreRange(); exec('foreColor', this.value); });
        p.querySelector('[data-ed-back]').addEventListener('input', function () { restoreRange(); exec('hiliteColor', this.value); });
      });
    }

    /* ---- actions ---- */

    function toggleDir() {
      var cur = content.getAttribute('dir') || contentDir();
      var next = cur === 'rtl' ? 'ltr' : 'rtl';
      content.setAttribute('dir', next);
      markActive();
      emit(root, 'pa:editor:command', { cmd: 'dir', arg: next });
      sync();
    }

    function toggleSource(force) {
      var on = typeof force === 'boolean' ? force : !root.classList.contains('is-source');
      if (on) {
        source.value = content.innerHTML;
        root.classList.add('is-source');
      } else {
        content.innerHTML = sanitizeHTML(source.value);
        root.classList.remove('is-source');
        sync();
      }
      emit(root, 'pa:editor:source', { on: on });
    }

    function toggleFullscreen(force) {
      var on = typeof force === 'boolean' ? force : !root.classList.contains('is-fullscreen');
      /* a transformed ancestor (reveal animations, sticky cards) would turn
         position:fixed into a containing-block trap — hoist to <body> while
         fullscreen and restore the original spot on exit */
      if (on && root.parentNode !== doc.body) {
        fullRestore = { parent: root.parentNode, next: root.nextSibling };
        doc.body.appendChild(root);
      } else if (!on && fullRestore) {
        fullRestore.parent.insertBefore(root, fullRestore.next || null);
        fullRestore = null;
      }
      root.classList.toggle('is-fullscreen', on);
      doc.body.classList.toggle('pa-editor-lock', on);
      var fb = toolbar.querySelector('[data-ed="fullscreen"]');
      if (fb) fb.innerHTML = icon(on ? 'minimize' : 'maximize', 16);
      emit(root, 'pa:editor:fullscreen', { on: on });
    }

    /* ---- toolbar events ---- */

    toolbar.addEventListener('mousedown', function (e) {
      /* keep the selection alive: a mousedown on a button would blur the
         contenteditable and drop the user's selection before the click runs */
      if (e.target.closest('.pa-ed-btn')) e.preventDefault();
    });

    toolbar.addEventListener('click', function (e) {
      var btn = e.target.closest('.pa-ed-btn');
      if (!btn) return;
      var b = BUTTONS[btn.getAttribute('data-ed')];
      if (!b) return;
      if (root.classList.contains('is-source') && !b.action) return;
      if (b.cmd) { exec(b.cmd); return; }
      if (b.dyn) {
        var d = contentDir();
        var cmd;
        if (b.dyn === 'start') cmd = d === 'rtl' ? 'justifyRight' : 'justifyLeft';
        else cmd = d === 'rtl' ? 'justifyLeft' : 'justifyRight';
        exec(cmd);
        return;
      }
      if (b.pop === 'block') popBlock();
      else if (b.pop === 'link') popLink();
      else if (b.pop === 'image') popImage();
      else if (b.pop === 'table') popTable();
      else if (b.pop === 'color') popColor();
      else if (b.action === 'removeFormat') { exec('removeFormat'); exec('unlink'); }
      else if (b.action === 'toggleDir') toggleDir();
      else if (b.action === 'toggleSource') toggleSource();
      else if (b.action === 'toggleFullscreen') toggleFullscreen();
    });

    /* ---- content events ---- */

    content.addEventListener('input', function () { sync(); markActive(); });
    content.addEventListener('focus', function () { emit(root, 'pa:editor:focus'); markActive(); });
    content.addEventListener('blur', function () { saveRange(); emit(root, 'pa:editor:blur'); });
    content.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!pop.hidden) { closePop(); e.preventDefault(); return; }
        if (root.classList.contains('is-fullscreen')) { toggleFullscreen(false); e.preventDefault(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        popLink();
      }
    });

    /* paste: light client-side cleanup (strip scripts/styles/handlers) */
    content.addEventListener('paste', function (e) {
      try {
        var dt = e.clipboardData;
        if (!dt) return;
        var html = dt.getData('text/html');
        var text = dt.getData('text/plain');
        if (html) {
          e.preventDefault();
          exec('insertHTML', sanitizeHTML(html));
        } else if (text && /\n/.test(text)) {
          e.preventDefault();
          var parts = text.split(/\n{2,}/).map(function (p) {
            return '<p>' + p.split('\n').map(function (l) { return l.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }).join('<br>') + '</p>';
          });
          exec('insertHTML', parts.join(''));
        }
      } catch (err) { /* fall back to browser default paste */ }
    });

    /* selection tracking for active states */
    function onSelectionChange() {
      var s = doc.getSelection();
      if (s && s.anchorNode && content.contains(s.anchorNode)) {
        saveRange();
        markActive();
      }
    }
    doc.addEventListener('selectionchange', onSelectionChange);

    /* close popover on outside click */
    function onDocMousedown(e) {
      if (pop.hidden) return;
      if (root.contains(e.target)) return;
      closePop();
    }
    doc.addEventListener('mousedown', onDocMousedown);

    /* source textarea edits are not live-synced (apply happens on exit) */
    source.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { toggleSource(false); }
    });

    /* forward label-for clicks on the hidden backing field into the editor */
    el.addEventListener('focus', function () { content.focus(); });

    /* keep in sync when the surrounding form resets */
    var form = el.closest ? el.closest('form') : null;
    function onFormReset() {
      setTimeout(function () {
        content.innerHTML = sanitizeHTML(isTextarea ? (el.value || el.defaultValue || '') : (el.innerHTML || ''));
        if (!root.classList.contains('is-source')) sync(); else source.value = content.innerHTML;
      }, 0);
    }
    if (form) form.addEventListener('reset', onFormReset);

    /* height */
    content.style.minHeight = height + 'px';

    var countEl = toolbar.querySelector('.pa-editor-count');
    updateCounter();
    markActive();
    sync();

    /* ---- instance API ---- */
    var api = {
      root: root,
      field: el,
      id: id,
      content: content,
      getHTML: function () { return isEmpty() ? '' : content.innerHTML; },
      setHTML: function (html) {
        content.innerHTML = sanitizeHTML(html);
        if (root.classList.contains('is-source')) source.value = content.innerHTML;
        sync();
      },
      getText: function () { return (content.textContent || '').trim(); },
      insertHTML: function (html) { saveRange(); exec('insertHTML', sanitizeHTML(html)); },
      focus: function () { content.focus(); },
      clear: function () { content.innerHTML = ''; sync(); markActive(); },
      isSource: function () { return root.classList.contains('is-source'); },
      toggleSource: toggleSource,
      toggleFullscreen: toggleFullscreen,
      toggleDir: toggleDir,
      destroy: function () {
        doc.removeEventListener('selectionchange', onSelectionChange);
        doc.removeEventListener('mousedown', onDocMousedown);
        if (form) form.removeEventListener('reset', onFormReset);
        if (root.classList.contains('is-fullscreen')) doc.body.classList.remove('pa-editor-lock');
        root.parentNode && root.parentNode.removeChild(root);
        el.classList.remove('pa-editor-backing');
        delete registry[id];
        delete el.__paEditor;
      }
    };

    el.__paEditor = api;
    registry[id] = api;
    emit(root, 'pa:editor:init', { id: id });
    return api;
  }

  /* ---------------- registry & scan ---------------- */

  var registry = {};

  function scan(root) {
    var scope = root || doc;
    var nodes = scope.querySelectorAll ? scope.querySelectorAll('[data-pa-editor]') : [];
    var made = [];
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.__paEditor) return;
      made.push(create(el));
    });
    return made;
  }

  function get(id) {
    if (!id) return null;
    if (typeof id === 'string') return registry[id] || null;
    return id.__paEditor || null;
  }

  P.editor = {
    version: '2.1.0',
    create: create,
    scan: scan,
    get: get,
    instances: registry,
    sanitizeHTML: sanitizeHTML
  };

  /* self-scan when loaded after DOMContentLoaded (lazy script injection) */
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', function () { scan(doc); });
  } else {
    setTimeout(function () { scan(doc); }, 0);
  }
})(typeof window !== 'undefined' ? window : this);
