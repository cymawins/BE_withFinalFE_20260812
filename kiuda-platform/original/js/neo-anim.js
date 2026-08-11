(function () {
  // Scroll reveal
  var reveals = document.querySelectorAll('.neo-reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Soft page transition on internal links
  var overlay = document.createElement('div');
  overlay.className = 'neo-page-transition';
  document.body.appendChild(overlay);

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
    if (a.target === '_blank') return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(function () {
      window.location.href = href;
    }, 280);
  });

  // Fade in on load
  window.addEventListener('pageshow', function () {
    overlay.classList.remove('active');
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.45s ease';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });
  });
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.45s ease';
  requestAnimationFrame(function () {
    document.body.style.opacity = '1';
  });
})();



// Progressive white mask — smooth continuous gradient (no hard bands)
(function () {
  var fade = document.querySelector('.page-neo .neo-bg-fade');
  if (!fade) return;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function updateMask() {
    var max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var p = Math.min(Math.max(window.scrollY / max, 0), 1);
    p = easeInOut(p);

    // Single soft white wash: intensity grows smoothly with scroll
    // No stacked hard color stops — one continuous veil
    var a0 = (0.00 + p * 0.18).toFixed(3);
    var a1 = (0.02 + p * 0.32).toFixed(3);
    var a2 = (0.04 + p * 0.48).toFixed(3);
    var a3 = (0.06 + p * 0.62).toFixed(3);
    var a4 = (0.08 + p * 0.72).toFixed(3);

    // base 0 at hero for full photo clarity; grows on scroll for readability
    var b = 0;
    fade.style.background =
      'linear-gradient(180deg,' +
      'rgba(255,255,255,' + (b + p * 0.12).toFixed(3) + ') 0%,' +
      'rgba(255,255,255,' + (b + p * 0.22).toFixed(3) + ') 25%,' +
      'rgba(255,255,255,' + (b + p * 0.32).toFixed(3) + ') 50%,' +
      'rgba(255,255,255,' + (b + p * 0.40).toFixed(3) + ') 75%,' +
      'rgba(255,255,255,' + Math.min(b + p * 0.48, 0.88).toFixed(3) + ') 100%)';
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateMask();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateMask, { passive: true });
  updateMask();
})();


// Seedling-grow hero message (ref: 장난감수정.html + grow feel)
(function () {
  var title = document.getElementById('grow-title');
  var lines = document.querySelectorAll('#grow-lines .grow-line');
  if (!title || typeof anime === 'undefined') return;

  // Split title into words, preserving <br> line breaks
  var lineTexts = title.innerHTML.split(/<br\s*\/?>/i);
  title.innerHTML = '';
  lineTexts.forEach(function (lineText, li) {
    lineText.trim().split(/\s+/).forEach(function (w) {
      if (!w) return;
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      title.appendChild(span);
      title.appendChild(document.createTextNode(' '));
    });
    if (li < lineTexts.length - 1) title.appendChild(document.createElement('br'));
  });

  function runGrow() {
    anime.remove('#grow-title .word, #grow-lines .grow-line');

    // Title sprouts first — like a shoot pushing up
    anime({
      targets: '#grow-title .word',
      opacity: [0, 1],
      translateY: [36, 0],
      scale: [0.7, 1],
      rotateZ: [-4, 0],
      delay: anime.stagger(140, { start: 200 }),
      duration: 1100,
      easing: 'easeOutElastic(1, 0.65)'
    });

    // Lines unfold one by one — like leaves opening
    anime({
      targets: '#grow-lines .grow-line',
      opacity: [0, 1],
      translateY: [24, 0],
      scale: [0.92, 1],
      delay: anime.stagger(180, { start: 700 }),
      duration: 900,
      easing: 'easeOutCubic'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGrow);
  } else {
    runGrow();
  }
})();

// Second bg photo (hero-bg-source.jpg): starts at the same opacity the first
// bg layer has by Core Values, then sharpens to full hero-level clarity by Invitation
(function () {
  var img2 = document.querySelector('.neo-bg-img2');
  var pain = document.getElementById('pain');
  var values = document.getElementById('values');
  var services = document.getElementById('services');
  var why = document.getElementById('why');
  var invite = document.getElementById('invite');
  if (!img2 || !pain || !values || !services || !why || !invite) return;

  // Constant: value of the first fade curve at Core Values' top (doesn't depend on scroll)
  function startOpacity() {
    var painBottomY = window.scrollY + pain.getBoundingClientRect().bottom;
    var servicesTopY = window.scrollY + services.getBoundingClientRect().top;
    var valuesTopY = window.scrollY + values.getBoundingClientRect().top;
    var span = Math.max(servicesTopY - painBottomY, 1);
    var p = Math.min(Math.max((valuesTopY - painBottomY) / span, 0), 1);
    return 0.3 * (1 - p);
  }

  function update() {
    var y = window.scrollY;
    var whyTop = y + why.getBoundingClientRect().top;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var inviteTop = Math.min(y + invite.getBoundingClientRect().top, maxScroll);
    var base = startOpacity();
    var fadeInStart = whyTop - window.innerHeight * 0.8;
    var opacity, blur;
    if (y < fadeInStart) {
      opacity = 0;
      blur = 6;
    } else if (y < whyTop) {
      var p0 = (y - fadeInStart) / Math.max(whyTop - fadeInStart, 1);
      opacity = base * p0;
      blur = 6;
    } else if (y < inviteTop) {
      var p = (y - whyTop) / Math.max(inviteTop - whyTop, 1);
      opacity = base + (1 - base) * p;
      blur = 6 * (1 - p);
    } else {
      opacity = 1;
      blur = 0;
    }
    img2.style.opacity = opacity.toFixed(3);
    img2.style.filter = 'blur(' + blur.toFixed(2) + 'px)';
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
// tapering to 0 by the time Core Services fills the screen, then stays hidden
(function () {
  var img = document.querySelector('.page-neo .neo-bg-img');
  var pain = document.getElementById('pain');
  var services = document.getElementById('services');
  if (!img || !pain || !services) return;

  function update() {
    var y = window.scrollY;
    var painTop = y + pain.getBoundingClientRect().top;
    var painBottom = y + pain.getBoundingClientRect().bottom;
    var servicesTop = y + services.getBoundingClientRect().top;
    var opacity;
    if (y < painTop) {
      opacity = 1;
    } else if (y < painBottom) {
      opacity = 0.3;
    } else if (y < servicesTop) {
      var p = (y - painBottom) / Math.max(servicesTop - painBottom, 1);
      opacity = 0.3 * (1 - p);
    } else {
      opacity = 0;
    }
    img.style.setProperty('opacity', opacity.toFixed(3), 'important');
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
