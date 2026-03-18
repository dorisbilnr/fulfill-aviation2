/* ============================================================
   LANGUAGE SWITCHER — swaps text nodes in place, zero HTML changes
   ============================================================ */
(function () {
  var STORAGE_KEY = 'fa_lang';

  /* ── All translations ── */
  var T = {
    /* NAV */
    'Home':                   '首页',
    'News':                   '新闻',
    'Services':               '服务',
    'Charter & Ticketing':    '包机与机票',
    'About Us':               '关于我们',
    'Contact':                '联系我们',
    /* INDEX */
    'Trusted Since 2015':                     '自2015年起值得信赖',
    'Technology-Led,':                        '科技引领，',
    'Talent-Driven,':                         '人才驱动，',
    'World-Class Aviation':                   '世界级航空服务',
    'Professional. Reliable. Global.':        '专业 · 可靠 · 全球',
    'Learn More':                             '了解更多',
    'Expanding Horizons':                     '拓展视野',
    'Opening Skies,':                         '开拓天空，',
    'Enabling Journeys':                      '成就旅程',
    'Making flight better for everyone.':     '让每一次飞行都更美好。',
    'What We Do':                             '我们的服务',
    'Our Services':                           '服务项目',
    'Years Experience':                       '年经验',
    'Destinations':                           '目的地',
    'Partners':                               '合作伙伴',
    'Latest Updates':                         '最新动态',
    'Recent News':                            '近期新闻',
    /* NEWS */
    'News & Events':                          '新闻与活动',
    'Latest':                                 '最新',
    'Read More':                              '阅读更多',
    'All News':                               '全部新闻',
    /* SERVICES */
    'Flight Operations Support':              '航班运营支持',
    'Aviation Fuel Supply':                   '航空燃油供应',
    'Charter & Ticketing':                    '包机与机票',
    'Ground Handling':                        '地面保障',
    'Navigation & Data':                      '导航与数据',
    /* CHARTER */
    'Travel Solutions':                       '出行解决方案',
    'Tailored Aviation Travel Solutions':     '量身定制的航空出行方案',
    'Charter Types':                          '包机类型',
    'Group Charter':                          '团队包机',
    'Private Charter':                        '私人包机',
    'Cargo Charter':                          '货运包机',
    'Airline Ticketing':                      '航空机票',
    'Request Quote':                          '申请报价',
    'Book Now':                               '立即预订',
    'Ready to Book Your Flight?':             '准备好预订您的航班了吗？',
    'Get a Quote':                            '获取报价',
    /* ABOUT */
    'Our Story':                              '我们的故事',
    'About Us':                               '关于我们',
    'Flights Supported':                      '保障航班',
    'Our Team':                               '我们的团队',
    'Chief Executive Officer':                '首席执行官',
    'Operations Director':                    '运营总监',
    'Business Development':                   '业务拓展',
    'Team Member Name':                       '团队成员姓名',
    /* CONTACT */
    'Get In Touch':                           '联系我们',
    'Contact Us':                             '联络方式',
    'We would love to hear from you':         '期待您的来信',
    'Address':                                '地址',
    'Phone':                                  '电话',
    'Fax':                                    '传真',
    'Email':                                  '邮箱',
    'Business Hours':                         '营业时间',
    'Monday \u2013 Friday: 9:00 AM \u2013 6:00 PM': '周一至周五：9:00 – 18:00',
    'Saturday: 9:00 AM \u2013 12:00 PM':      '周六：9:00 – 12:00',
    'Send Us a Message':                      '发送消息',
    'First Name':                             '名',
    'Last Name':                              '姓',
    'Email Address':                          '电子邮箱',
    'Company':                                '公司名称',
    'Service of Interest':                    '感兴趣的服务',
    'Other':                                  '其他',
    'Message':                                '留言内容',
    'Send Message':                           '发送消息',
    /* FOOTER */
    '\u00a9 2026 Shanghai Fulfill Aviation Ground Service. All rights reserved.':
      '\u00a9 2026 上海丰盈航空地面服务有限公司 版权所有',
  };

  /* Build reverse map for EN restore */
  var R = {};
  Object.keys(T).forEach(function (k) { R[T[k]] = k; });

  var currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  var originalTexts = {}; /* nodeId -> original text */
  var nodeList = [];

  /* ── Walk every text node in the page body ── */
  function collectNodes() {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          var p = node.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          var tag = p.tagName ? p.tagName.toUpperCase() : '';
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
          if (node.nodeValue.trim().length === 0) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    nodeList = [];
    var n;
    while ((n = walker.nextNode())) {
      nodeList.push(n);
    }
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    nodeList.forEach(function (node, idx) {
      var orig = originalTexts[idx];
      if (!orig) return;
      var trimmed = orig.trim();
      if (lang === 'zh' && T[trimmed]) {
        node.nodeValue = node.nodeValue.replace(trimmed, T[trimmed]);
      } else {
        node.nodeValue = orig; /* restore original */
      }
    });

    /* Update placeholder attributes on inputs */
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
      var orig = el.getAttribute('data-ph-en') || el.getAttribute('placeholder');
      if (!el.getAttribute('data-ph-en')) el.setAttribute('data-ph-en', orig);
      if (lang === 'zh' && T[orig]) el.setAttribute('placeholder', T[orig]);
      else el.setAttribute('placeholder', el.getAttribute('data-ph-en'));
    });

    /* Update select options */
    document.querySelectorAll('option').forEach(function (el) {
      var orig = el.getAttribute('data-opt-en') || el.textContent.trim();
      if (!el.getAttribute('data-opt-en')) el.setAttribute('data-opt-en', orig);
      if (lang === 'zh' && T[orig]) el.textContent = T[orig];
      else el.textContent = el.getAttribute('data-opt-en');
    });

    /* Update page title */
    var titleMap = {
      'en': { 'index': 'Shanghai Fulfill Aviation Ground Service', 'news': 'News — Shanghai Fulfill Aviation', 'services': 'Services — Shanghai Fulfill Aviation', 'charter': 'Charter & Ticketing — Shanghai Fulfill Aviation', 'about': 'About Us — Shanghai Fulfill Aviation', 'contact': 'Contact — Shanghai Fulfill Aviation' },
      'zh': { 'index': '上海丰盈航空地面服务', 'news': '新闻 — 上海丰盈航空', 'services': '服务 — 上海丰盈航空', 'charter': '包机与机票 — 上海丰盈航空', 'about': '关于我们 — 上海丰盈航空', 'contact': '联系我们 — 上海丰盈航空' }
    };
    var page = window.FA_PAGE || 'index';
    if (titleMap[lang] && titleMap[lang][page]) document.title = titleMap[lang][page];

    /* Highlight active button */
    document.querySelectorAll('.gn-lang button').forEach(function (btn) {
      if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  /* ── Init on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', function () {
    collectNodes();
    /* Store originals */
    nodeList.forEach(function (n, i) { originalTexts[i] = n.nodeValue; });
    applyLang(currentLang);
  });

  /* ── Public API ── */
  window.setLang = applyLang;
})();
