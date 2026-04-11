/* nav-labels.js — fetches nav labels (EN+ZH) from settings and applies them */
(function(){
  var currentLang = localStorage.getItem('fa_lang') || 'en';

  // Map of settings key → href
  var NAV_MAP = {
    'nav_home':    '/',
    'nav_news':    '/news.html',
    'nav_services':'/services.html',
    'nav_charter': '/charter.html',
    'nav_about':   '/about.html',
    'nav_contact': '/contact.html',
  };

  // Chinese fallbacks — used when API doesn't return a zh value
  var ZH_FALLBACKS = {
    'nav_home':     '首页',
    'nav_news':     '新闻',
    'nav_services': '服务',
    'nav_charter':  '定班和包机',
    'nav_about':    '关于我们',
    'nav_contact':  '联系我们',
  };

  // English fallbacks — used when API returns empty for EN
  var EN_FALLBACKS = {
    'nav_home':     'Home',
    'nav_news':     'News',
    'nav_services': 'Services',
    'nav_charter':  'Scheduled & Charter',
    'nav_about':    'About Us',
    'nav_contact':  'Contact',
  };

  window.__navSettings = {};

  function applyNavLabels(settings, lang) {
    lang = lang || currentLang;
    Object.keys(NAV_MAP).forEach(function(key) {
      var href = NAV_MAP[key];

      var label;
      if (lang === 'zh') {
        // Prefer DB zh value, fall back to hardcoded Chinese
        label = (settings[key + '_zh'] && settings[key + '_zh'].trim())
          ? settings[key + '_zh'].trim()
          : ZH_FALLBACKS[key];
      } else {
        // Prefer DB EN value, fall back to hardcoded English
        label = (settings[key] && settings[key].trim())
          ? settings[key].trim()
          : EN_FALLBACKS[key];
      }

      if (!label) return;

      document.querySelectorAll('nav.gn .gn-links a, .gn-mobile a').forEach(function(a) {
        if (a.getAttribute('href') === href) a.textContent = label;
      });
    });
  }

  fetch('/api/settings/public')
    .then(function(r){ return r.json(); })
    .then(function(settings) {
      window.__navSettings = settings;
      applyNavLabels(settings, currentLang);
    })
    .catch(function(){
      // API failed — still apply hardcoded fallbacks
      applyNavLabels({}, currentLang);
    });

  // Expose so lang.js can call this when language switches
  window.applyNavLabels = applyNavLabels;
})();
