/* nav-labels.js — fetches nav labels (EN+ZH) from settings and applies them */
(function(){
  var currentLang = localStorage.getItem('fa_lang') || 'en';

  var NAV_MAP = {
    'nav_home':    '/',
    'nav_news':    '/news.html',
    'nav_services':'/services.html',
    'nav_charter': '/charter.html',
    'nav_about':   '/about.html',
    'nav_contact': '/contact.html',
  };

  window.__navSettings = {};

  function applyNavLabels(settings, lang) {
    lang = lang || currentLang;
    Object.keys(NAV_MAP).forEach(function(key) {
      var href = NAV_MAP[key];
      var label = (lang === 'zh' && settings[key + '_zh']) ? settings[key + '_zh'] : (settings[key] || null);
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
    .catch(function(){});

  // Expose so lang.js can call this when language switches
  window.applyNavLabels = applyNavLabels;
})();
