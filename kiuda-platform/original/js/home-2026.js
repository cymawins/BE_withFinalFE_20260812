(function () {
  // Kinetic title entrance
  const title = document.querySelector('.kinetic-title');
  if (title) {
    requestAnimationFrame(() => title.classList.add('ready'));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Story scroll: update sticky title/desc + progress
  const panels = document.querySelectorAll('.story-panel');
  const storyTitle = document.getElementById('storyTitle');
  const storyDesc = document.getElementById('storyDesc');
  const storyBar = document.getElementById('storyBar');
  const storySection = document.querySelector('.story-section');

  if (!panels.length || !storyTitle) return;

  function updateStory() {
    if (!storySection) return;
    const rect = storySection.getBoundingClientRect();
    const total = storySection.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;
    if (storyBar) storyBar.style.width = (progress * 100).toFixed(1) + '%';

    // which panel is most visible
    let best = 0;
    let bestScore = -1;
    panels.forEach((panel, i) => {
      const r = panel.getBoundingClientRect();
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (visible > bestScore) {
        bestScore = visible;
        best = i;
      }
    });

    const active = panels[best];
    if (active) {
      const t = active.getAttribute('data-title') || '';
      const d = active.getAttribute('data-desc') || '';
      if (storyTitle.textContent !== t) {
        storyTitle.style.opacity = '0';
        storyDesc.style.opacity = '0';
        setTimeout(() => {
          storyTitle.textContent = t;
          storyDesc.textContent = d;
          storyTitle.style.opacity = '1';
          storyDesc.style.opacity = '0.9';
        }, 180);
      }
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateStory();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateStory();
})();
