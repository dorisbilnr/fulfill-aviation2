/* nav-labels.js — fetches tab names from admin settings and applies them */
(function(){
  var NAV_KEYS = {
    'nav_home':    { en: 'Home',               href: '/' },
    'nav_news':    { en: 'News',               href: '/news.html' },
    'nav_services':{ en: 'Services',           href: '/services.html' },
    'nav_charter': { en: 'Charter & Ticketing',href: '/charter.html' },
    'nav_about':   { en: 'About Us',           href: '/about.html' },
    'nav_contact': { en: 'Contact',            href: '/contact.html' },
  };

  function applyLabels(settings) {
    // Update desktop nav links
    document.querySelectorAll('nav.gn .gn-links a').forEach(function(a) {
      var href = a.getAttribute('href');
      Object.keys(NAV_KEYS).forEach(function(key) {
        if (NAV_KEYS[key].href === href && settings[key]) {
          a.textContent = settings[key];
        }
      });
    });
    // Update mobile nav links
    document.querySelectorAll('.gn-mobile a').forEach(function(a) {
      var href = a.getAttribute('href');
      Object.keys(NAV_KEYS).forEach(function(key) {
        if (NAV_KEYS[key].href === href && settings[key]) {
          a.textContent = settings[key];
        }
      });
    });
  }

  fetch('/api/settings/public')
    .then(function(r){ return r.json(); })
    .then(applyLabels)
    .catch(function(){});  // fail silently — defaults remain
})();
