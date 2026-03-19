/* ============================================================
   LANGUAGE SWITCHER — two-way EN/ZH, zero HTML changes
   Uses WeakMap to store original text per node reference
   ============================================================ */
(function () {
  var STORAGE_KEY = 'fa_lang';

  var T = {
    'Home': '首页', 'News': '新闻', 'Services': '服务',
    'Charter & Ticketing': '包机与机票', 'About Us': '关于我们', 'Contact': '联系我们',
    'Trusted Since 2015': '自2015年起值得信赖',
    'Technology\u2011Led,': '科技引领，', 'Talent\u2011Driven,': '人才驱动，',
    'World-Class Aviation': '世界级航空服务',
    'Professional. Reliable. Global.': '专业 · 可靠 · 全球',
    'Learn More': '了解更多', 'Expanding Horizons': '拓展视野',
    'Opening Skies,': '开拓天空，', 'Enabling Journeys': '成就旅程',
    'Making flight better for everyone.': '让每一次飞行都更美好。',
    'What We Do': '我们的服务', 'Our Services': '服务项目',
    'Years Experience': '年经验', 'Destinations': '目的地', 'Partners': '合作伙伴',
    'Latest Updates': '最新动态', 'Recent News': '近期新闻',
    'News & Events': '新闻与活动', 'Latest': '最新',
    'Read More': '阅读更多', 'All News': '全部新闻',
    'Flight Operations Support': '航班运营支持',
    'Aviation Fuel Supply': '航空燃油供应',
    'Ground Handling': '地面保障', 'Navigation & Data': '导航与数据',
    'Travel Solutions': '出行解决方案',
    'Professional Charter Solutions': '专业包机解决方案',
    'Charter Types': '包机类型', 'Group Charter': '团队包机',
    'Private Charter': '私人包机', 'Cargo Charter': '货运包机',
    'Airline Ticketing': '航空机票', 'Request Quote': '申请报价',
    'Book Now': '立即预订', 'Ready to Charter Your Flight?': '准备好预订您的包机了吗？',
    'Get a Quote': '获取报价',
    'Our Story': '我们的故事', 'Flights Supported': '保障航班',
    'Our Team': '我们的团队', 'Our Office': '我们的办公室',
    'Chief Executive Officer': '首席执行官',
    'Operations Director': '运营总监', 'Business Development': '业务拓展',
    'Team Member Name': '团队成员姓名',
    'Get In Touch': '联系我们', 'Contact Us': '联络方式',
    'We would love to hear from you': '期待您的来信',
    'Address': '地址', 'Phone': '电话', 'Fax': '传真',
    'Email': '邮箱', 'Business Hours': '营业时间',
    'Monday \u2013 Friday: 9:00 AM \u2013 6:00 PM': '周一至周五：9:00 – 18:00',
    'Saturday: 9:00 AM \u2013 12:00 PM': '周六：9:00 – 12:00',
    'Mon \u2013 Fri: 9:00 AM \u2013 6:00 PM': '周一至周五：9:00 – 18:00',
    'Sat: 9:00 AM \u2013 12:00 PM': '周六：9:00 – 12:00',
    'Send Us a Message': '发送消息', 'First Name': '名', 'Last Name': '姓',
    'Email Address': '电子邮箱', 'Company': '公司名称',
    'Service of Interest': '感兴趣的服务', 'Other': '其他',
    'Message': '留言内容', 'Send Message': '发送消息',
    '\u00a9 2026 Shanghai Fulfill Aviation Ground Service. All rights reserved.':
      '\u00a9 2026 上海赋瞻航空地面服务有限公司 版权所有',
    'Office Photos': '办公室照片',
    'No photos yet. Upload office photos from the Admin \u2192 Company Photo Carousel': '暂无照片。请在管理后台 → 公司照片轮播图管理中上传。',
  };

  /* Build reverse lookup: zh → en */
  var R = {};
  Object.keys(T).forEach(function(en) { R[T[en]] = en; });

  var currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  /* Store original text keyed by node using a real Map (not WeakMap, need iteration) */
  var originals = new Map();
  var nodeList = [];
  var collected = false;
  /* Note: these are re-collected on each applyLang call to capture dynamic content */

  function collectOnce() {
    /* Initial collection at DOMContentLoaded — stores English originals */
    if (collected) return;
    collected = true;
    var walker = document.createTreeWalker(
      document.body, NodeFilter.SHOW_TEXT,
      { acceptNode: function(n) {
          var p = n.parentNode, tag = p && p.tagName ? p.tagName.toUpperCase() : '';
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
          if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
      }}, false
    );
    var n;
    while ((n = walker.nextNode())) {
      originals.set(n, n.nodeValue);
      nodeList.push(n);
    }
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    /* Re-walk DOM to pick up nodes added by nav-labels.js,
       but ONLY store originals for nodes we haven't seen before.
       Never overwrite originals — that would lose the English source text. */
    var walker = document.createTreeWalker(
      document.body, NodeFilter.SHOW_TEXT,
      { acceptNode: function(n) {
          var p = n.parentNode, tag = p && p.tagName ? p.tagName.toUpperCase() : '';
          if (tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT') return NodeFilter.FILTER_REJECT;
          if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
      }}, false
    );
    var n;
    while ((n = walker.nextNode())) {
      if (!originals.has(n)) {
        /* New node — store its current value as the English original */
        originals.set(n, n.nodeValue);
        nodeList.push(n);
      }
    }

    nodeList.forEach(function(node) {
      var orig = originals.get(node);
      if (!orig) return;
      var trimmed = orig.trim();
      if (lang === 'zh') {
        if (T[trimmed]) node.nodeValue = orig.replace(trimmed, T[trimmed]);
      } else {
        /* Restore English: always use the stored original */
        node.nodeValue = orig;
      }
    });

    /* Placeholders */
    document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(function(el) {
      if (!el.dataset.phEn) el.dataset.phEn = el.getAttribute('placeholder');
      el.setAttribute('placeholder', lang === 'zh' && T[el.dataset.phEn] ? T[el.dataset.phEn] : el.dataset.phEn);
    });

    /* Select options */
    document.querySelectorAll('option').forEach(function(el) {
      var txt = el.textContent.trim();
      if (!el.dataset.optEn) el.dataset.optEn = txt;
      el.textContent = lang === 'zh' && T[el.dataset.optEn] ? T[el.dataset.optEn] : el.dataset.optEn;
    });

    /* Page title */
    var titles = {
      en: { index:'Shanghai Fulfill Aviation Ground Service', news:'News \u2014 Shanghai Fulfill Aviation', services:'Services \u2014 Shanghai Fulfill Aviation', charter:'Charter \u2014 Shanghai Fulfill Aviation', about:'About Us \u2014 Shanghai Fulfill Aviation', contact:'Contact \u2014 Shanghai Fulfill Aviation' },
      zh: { index:'上海赋瞻航空地面服务', news:'新闻 \u2014 上海赋瞻航空', services:'服务 \u2014 上海赋瞻航空', charter:'包机与机票 \u2014 上海赋瞻航空', about:'关于我们 \u2014 上海赋瞻航空', contact:'联系我们 \u2014 上海赋瞻航空' }
    };
    var page = window.FA_PAGE || 'index';
    if (titles[lang] && titles[lang][page]) document.title = titles[lang][page];

    /* Lang button highlight */
    document.querySelectorAll('.gn-lang button').forEach(function(btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.style.borderColor = active ? '#c8a96e' : 'rgba(255,255,255,0.3)';
      btn.style.color = active ? '#c8a96e' : 'rgba(255,255,255,0.7)';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    collectOnce();
    applyLang(currentLang);
  });

  window.setLang = applyLang;
})();
