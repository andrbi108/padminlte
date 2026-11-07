/* =============================================================
   PAdminLTE — Shop catalog (v1.7)
   ---------------------------------------------------------------
   Single source of truth for the public store demo. shop.html,
   product.html, cart.html and checkout.html all read from here,
   so every product has exactly one canonical record (name, price,
   icon, color, description, features).

   Works from file:// — no fetch, no server, pure JS data module.
   ============================================================= */

(function (global) {
  'use strict';
  var PAdminLTE = global.PAdminLTE || (global.PAdminLTE = {});

  /* Catalog: 14 demo products in 8 categories.
     badge: 'discount' | 'new' | null      old: price before discount */
  var CATALOG = [
    {
      id: 'p1', name: 'لپ‌تاپ گیمینگ ایسوس ROG Strix', cat: 'الکترونیک', brand: 'ایسوس',
      price: 25000000, old: 31000000, rating: 4.9, reviews: 248, badge: 'discount',
      icon: 'monitor', color: '#0d6efd', stock: 8, sold: 640, added: 11,
      desc: 'لپ‌تاپ گیمینگ قدرتمند با پردازنده نسل جدید، کارت گرافیک اختصاصی و نمایشگر ۱۴۴ هرتز؛ مناسب بازی، رندر و توسعهٔ نرم‌افزار.',
      features: ['پردازنده ۸ هسته‌ای نسل ۱۳', 'نمایشگر ۱۵.۶ اینچی ۱۴۴Hz', 'رم ۱۶ گیگابایت DDR5', 'SSD یک ترابایت', 'خنک‌کنندهٔ دو فنه']
    },
    {
      id: 'p2', name: 'گوشی سامسونگ Galaxy S24', cat: 'الکترونیک', brand: 'سامسونگ',
      price: 18000000, old: null, rating: 4.8, reviews: 189, badge: 'new',
      icon: 'smartphone', color: '#6610f2', stock: 15, sold: 920, added: 14,
      desc: 'پرچم‌دار سامسونگ با دوربین ۲۰۰ مگاپیکسل، نمایشگر Dynamic AMOLED و دستیار هوشمند داخلی؛ مناسب عکاسی و کارهای روزمره.',
      features: ['دوربین ۲۰۰ مگاپیکسل', 'نمایشگر ۶.۲ اینچی AMOLED', 'رم ۸ گیگابایت', 'باتری ۴۰۰۰ میلی‌آمپر', 'ضد آب IP68']
    },
    {
      id: 'p3', name: 'هدفون بلوتوث سونی WH-1000', cat: 'الکترونیک', brand: 'سونی',
      price: 4500000, old: 5800000, rating: 4.7, reviews: 156, badge: 'discount',
      icon: 'volume', color: '#0dcaf0', stock: 22, sold: 480, added: 9,
      desc: 'هدفون بی‌سیم با نویزکنسلینگ فعال، ۳۰ ساعت شارژدهی و کیفیت صدا Hi-Res؛ انتخاب اول برای موزیک و کار در محیط شلوغ.',
      features: ['نویزکنسلینگ فعال', '۳۰ ساعت پخش مداوم', 'بلوتوث ۵.۳', 'حالت شفاف صدا', 'تاشو با کیف حمل']
    },
    {
      id: 'p4', name: 'ساعت هوشمند اپل Watch Series 9', cat: 'الکترونیک', brand: 'اپل',
      price: 12500000, old: null, rating: 4.8, reviews: 203, badge: 'new',
      icon: 'watch', color: '#198754', stock: 11, sold: 350, added: 13,
      desc: 'ساعت هوشمند با پایش ضربان، اکسیژن خون و خواب؛ مقاوم در برابر آب و سازگار با صدها اپ ورزشی و سلامت.',
      features: ['نمایشگر Always-On', 'سنسور اکسیژن خون', 'ضد آب ۵۰ متر', '۱۸ ساعت شارژدهی', 'GPS داخلی']
    },
    {
      id: 'p5', name: 'مانیتور گیمینگ سامسونگ ۲۷ اینچ', cat: 'الکترونیک', brand: 'سامسونگ',
      price: 14200000, old: 16500000, rating: 4.6, reviews: 88, badge: 'discount',
      icon: 'tv', color: '#6f42c1', stock: 6, sold: 210, added: 8,
      desc: 'مانیتور QHD با نرخ نوسازی ۱۶۵ هرتز و پاسخ‌گویی ۱ms؛ لبه‌های باریک، پایهٔ ارگونومیک و پوشش ۹۹٪ sRGB.',
      features: ['رزولوشن ۲۵۶۰×۱۴۴۰', '۱۶۵ هرتز + FreeSync', 'پاسخ‌گویی ۱ms', 'پوشش ۹۹٪ sRGB', 'پایهٔ چرخشی و ارگونومیک']
    },
    {
      id: 'p6', name: 'دوربین بدون آینه کانن EOS R50', cat: 'الکترونیک', brand: 'کانن',
      price: 32000000, old: null, rating: 4.9, reviews: 97, badge: null,
      icon: 'camera', color: '#212529', stock: 4, sold: 130, added: 7,
      desc: 'دوربین میرورلس سبک با سنسور APS-C و ویدئوی 4K؛ مناسب عکاسی خیابانی، تولید محتوا و شروع عکاسی حرفه‌ای.',
      features: ['سنسور ۲۴.۲ مگاپیکسل APS-C', 'ویدئو 4K ۳۰fps', 'اتوفوکوس Dual Pixel', 'وای‌فای و انتقال به موبایل', 'لنز کیت ۱۸-۴۵mm']
    },
    {
      id: 'p7', name: 'پاوربانک شیائومی ۲۰۰۰۰ میلی‌آمپر', cat: 'الکترونیک', brand: 'شیائومی',
      price: 1200000, old: 1500000, rating: 4.5, reviews: 321, badge: 'discount',
      icon: 'battery_charging', color: '#ffc107', stock: 40, sold: 1500, added: 6,
      desc: 'پاوربانک پرظرفیت با شارژ سریع ۲۲.۵ وات و دو خروجی USB؛ سبک، ایمن و مناسب سفر.',
      features: ['ظرفیت ۲۰۰۰۰mAh', 'شارژ سریع ۲۲.۵W', 'دو خروجی USB-A + یک USB-C', 'محافظ حرارت و اتصال کوتاه', 'نمایشگر دیجیتال درصد']
    },
    {
      id: 'p8', name: 'کتاب مرجع جامع جاوااسکریپت', cat: 'کتاب', brand: 'دیباج',
      price: 480000, old: null, rating: 4.6, reviews: 412, badge: null,
      icon: 'book', color: '#0a58ca', stock: 30, sold: 860, added: 5,
      desc: 'ترجمهٔ روان و به‌روز مرجع کامل زبان جاوااسکریپت؛ از مبانی تا مفاهیم پیشرفتهٔ async و ماژول‌ها همراه با تمرین‌های عملی.',
      features: ['۷۲۰ صفحهٔ فارسی روان', 'پوشش ES2023', 'تمرین و پاسخ تشریحی', 'کاغذ باکیفیت بالک', 'ویرایش سوم']
    },
    {
      id: 'p9', name: 'تیشرت ورزشی خشک‌شو اورجینال', cat: 'لباس', brand: 'اورجینال',
      price: 850000, old: 1100000, rating: 4.4, reviews: 76, badge: 'discount',
      icon: 'sparkles', color: '#fd7e14', stock: 25, sold: 240, added: 10,
      desc: 'تیشرت رانینگ با پارچهٔ خشک‌شو، دوخت تقویتی و یقهٔ مقاوم؛ مناسب باشگاه، دویدن و ورزش‌های صبحگاهی.',
      features: ['پارچهٔ خشک‌شو PolyQuick', 'وزن سبک ۱۳۰ گرم', 'سایزبندی S تا XXL', 'قابل شست‌وشوی مکانیکی', 'چهار رنگ']
    },
    {
      id: 'p10', name: 'قهوه‌ساز اسپرسو فیلیپس نیمه‌صنعتی', cat: 'لوازم خانگی', brand: 'فیلیپس',
      price: 8900000, old: null, rating: 4.7, reviews: 134, badge: 'new',
      icon: 'coffee', color: '#a9714b', stock: 9, sold: 175, added: 12,
      desc: 'قهوه‌ساز اسپرسو با فشار ۱۵ بار، بخارده حرفه‌ای و مخزن ۱.۵ لیتری؛ کافهٔ خانگی‌تان را راه بیندازید.',
      features: ['پمپ ۱۵ بار', 'بخارده حرفه‌ای فوم شیر', 'مخزن جداشدنی ۱.۵ لیتر', 'گرم‌کن فنجان', 'سینی تخلیهٔ شناور']
    },
    {
      id: 'p11', name: 'ربات آموزشی برنامه‌نویسی کودکان', cat: 'اسباب‌بازی', brand: 'لگو',
      price: 2300000, old: 2800000, rating: 4.8, reviews: 58, badge: 'discount',
      icon: 'cpu', color: '#20c997', stock: 14, sold: 95, added: 4,
      desc: 'ربات مهربان و قطعه‌قطعه‌شونده برای آموزش منطق برنامه‌نویسی به کودکان ۷ سال به بالا؛ همراه اپلیکیشن فارسی.',
      features: ['قابل برنامه‌ریزی با بلوک‌ها', 'اپلیکیشن فارسی', '۴۰+ قطعهٔ مونتاژ', 'باتری قابل شارژ', 'موتور و سنسور برخورد']
    },
    {
      id: 'p12', name: 'توپ والیبال حرفه‌ای میکاسا', cat: 'ورزشی', brand: 'میکاسا',
      price: 690000, old: null, rating: 4.6, reviews: 41, badge: null,
      icon: 'target', color: '#dc3545', stock: 18, sold: 130, added: 3,
      desc: 'توپ والیبال استاندارد مسابقات با ۱۸ پنل دوخت ماشینی و پوستهٔ مقاوم چرم مصنوعی؛ مناسب سالن و خاکی.',
      features: ['استاندارد FIVB', '۱۸ پنل دوخت ماشینی', 'مقاوم در برابر سایش', 'داخل سالن و خاکی', 'دستهٔ ۵']
    },
    {
      id: 'p13', name: 'ادکلن رز و عود گلوریا ۱۰۰ml', cat: 'آرایشی', brand: 'گلوریا',
      price: 2900000, old: 3600000, rating: 4.7, reviews: 119, badge: 'discount',
      icon: 'gift', color: '#e83e8c', stock: 12, sold: 260, added: 2,
      desc: 'عطر unisex با نت رز، عود و وانیل؛ ماندگاری ۸ ساعته و پخش بوی متوسط تا قوی؛ مناسب هدیه و استفادهٔ روزانه.',
      features: ['ماندگاری ۸ ساعت', 'نت رز، عود و وانیل', 'مناسب خانم و آقا', 'جعبهٔ هدیهٔ شکیل', 'تولید فرانسه']
    },
    {
      id: 'p14', name: 'پیتزای ایتالیایی منجمد دوبل', cat: 'غذا', brand: 'سرآشپز',
      price: 320000, old: null, rating: 4.3, reviews: 64, badge: null,
      icon: 'pizza', color: '#fd7e14', stock: 50, sold: 410, added: 1,
      desc: 'پیتزای مارگاریتا با خمیر ایتالیایی و پنیر موزارلای واقعی؛ آماده در ۱۲ دقیقه، بدون نگهدارندهٔ مصنوعی.',
      features: ['خمیر تخمیر سرد ۴۸ ساعته', 'پنیر موزارلای واقعی', 'بدون نگهدارنده', 'زمان آماده‌سازی ۱۲ دقیقه', 'بستهٔ دوتایی']
    }
  ];

  function byId(id) {
    for (var i = 0; i < CATALOG.length; i++) {
      if (String(CATALOG[i].id) === String(id)) return CATALOG[i];
    }
    return null;
  }

  /* "۲۵٬۰۰۰٬۰۰۰ ت" — Persian digits + thousand separators (works offline) */
  function money(n, withUnit) {
    var s = String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
    if (PAdminLTE.faDigits) s = PAdminLTE.faDigits(s);
    return withUnit === false ? s : s + ' ت';
  }

  function discountPct(p) {
    if (!p.old || p.old <= p.price) return 0;
    return Math.round((1 - p.price / p.old) * 100);
  }

  /* Distinct categories / brands with product counts (for filter panels) */
  function distinct(key) {
    var map = {};
    CATALOG.forEach(function (p) {
      map[p[key]] = (map[p[key]] || 0) + 1;
    });
    return Object.keys(map).sort().map(function (name) {
      return { name: name, count: map[name] };
    });
  }

  /* ---------- Order rules (shared by cart.html and checkout.html) ---------- */
  var FREE_SHIP_FROM = 5000000;   /* free shipping above this subtotal */
  var SHIP_COST = 80000;          /* flat shipping below the threshold */
  var COUPONS = { 'PADMIN10': 10, 'WELCOME5': 5 }; /* code -> percent off */

  function shippingCost(subtotal) {
    return subtotal >= FREE_SHIP_FROM ? 0 : SHIP_COST;
  }
  function couponPct(code) {
    return COUPONS[String(code || '').trim().toUpperCase()] || 0;
  }

  /* Persian digits helper (independent, in case core did not load) */
  function faDigits(v) {
    return String(v).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; });
  }

  PAdminLTE.shop = {
    catalog: CATALOG,
    byId: byId,
    money: money,
    discountPct: discountPct,
    cats: function () { return distinct('cat'); },
    brands: function () { return distinct('brand'); },
    shippingCost: shippingCost,
    couponPct: couponPct,
    faDigits: faDigits
  };
})(typeof window !== 'undefined' ? window : this);
