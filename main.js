/* ==========================================================================
   FATONI & LIA — Wedding Invitation
   Main script: loader, guest name, smooth scroll, GSAP reveals,
   countdown, gift copy, music player.

   Each feature block is wrapped in safe() so that if one block throws
   (e.g. a missing element, or an external font/lib hiccup), it cannot
   silently take the rest of the page's interactivity down with it —
   this is what caused the "Buka Undangan" button to stop responding
   before.
   ========================================================================== */
(function () {
  'use strict';

  function safe(label, fn) {
    try { fn(); }
    catch (err) { console.error('[undangan] ' + label + ' failed:', err); }
  }

  var scroller = document.querySelector('.frame__scroll');
  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && typeof window.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ scroller: scroller });
  }

  /* ------------------------------------------------------------------
     1. Guest name from ?to= param
     ------------------------------------------------------------------ */
  safe('guest name', function () {
    var params = new URLSearchParams(window.location.search);
    var name = params.get('to');
    var guest = name && name.trim() ? name.trim() : 'Tamu Undangan';
    document.querySelectorAll('[data-guest-name]').forEach(function (el) {
      el.textContent = guest;
    });
  });

  /* ------------------------------------------------------------------
     2. Smooth scroll — native, scoped to the phone-frame scroller.
        Locked until "Buka Undangan" is pressed.
     ------------------------------------------------------------------ */
  safe('scroll setup', function () {
    scroller.style.scrollBehavior = 'smooth';
    scroller.classList.add('is-locked');

    var progressFill = document.querySelector('.progress-fill');
    scroller.addEventListener('scroll', function () {
      if (hasGsap) ScrollTrigger.update();
      var max = scroller.scrollHeight - scroller.clientHeight;
      var pct = max > 0 ? (scroller.scrollTop / max) * 100 : 0;
      if (progressFill) progressFill.style.width = pct + '%';
    });
  });

  /* ------------------------------------------------------------------
     3. Loading screen → reveal cover
     ------------------------------------------------------------------ */
  safe('loader', function () {
    var loader = document.querySelector('.loader');
    if (!loader) return;
    var loaderBar = document.querySelector('.loader__bar span');
    var loaderPct = document.querySelector('.loader__pct');

    function finishLoader() {
      loader.style.transition = 'opacity .6s ease';
      loader.style.opacity = '0';
      setTimeout(function () {
        loader.style.display = 'none';
        revealCover();
      }, 620);
    }

    if (hasGsap) {
      var progress = { v: 0 };
      gsap.to(progress, {
        v: 100, duration: 1.6, ease: 'power1.inOut',
        onUpdate: function () {
          var val = Math.round(progress.v);
          if (loaderBar) loaderBar.style.width = val + '%';
          if (loaderPct) loaderPct.textContent = val + '%';
        },
        onComplete: finishLoader
      });
    } else {
      setTimeout(finishLoader, 1200);
    }
  });

  function revealCover() {
    safe('cover reveal', function () {
      var targets = ['.cover__eyebrow', '.cover__names', '.cover__date',
        '.cover__guest-label', '.cover__guest-name', '.btn-open'];
      if (hasGsap) {
        var tl = gsap.timeline();
        targets.forEach(function (sel, i) {
          tl.fromTo(sel, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, i === 0 ? 0 : '-=.5');
        });
      } else {
        targets.forEach(function (sel) {
          document.querySelectorAll(sel).forEach(function (el) { el.style.opacity = '1'; });
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     3b. "Ngunduh Mantu Fatoni & Lia ... Save The Date" text reveal —
         plays once, right after the cover closes (not scroll-based,
         since this panel is already on screen the instant the
         invitation opens).
     ------------------------------------------------------------------ */
  function revealNamesPanel() {
    safe('names panel reveal', function () {
      var targets = document.querySelectorAll('.names-open-reveal');
      if (!targets.length) return;

      if (hasGsap) {
        var tl = gsap.timeline({ delay: .15 });
        targets.forEach(function (el, i) {
          var isNames = el.classList.contains('names-panel__names');
          tl.fromTo(el, {
            opacity: 0,
            y: isNames ? 34 : 22,
            scale: isNames ? .92 : 1,
            filter: 'blur(6px)'
          }, {
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            duration: isNames ? 1.1 : .8,
            ease: 'power3.out'
          }, i === 0 ? 0 : '-=.45');
        });
      } else {
        targets.forEach(function (el) { el.style.opacity = '1'; });
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Open invitation — the single most important interaction.
        Bound early, defensively, and does not depend on GSAP to work.
     ------------------------------------------------------------------ */
  var cover = document.querySelector('.cover');
  var openBtn = document.querySelector('.btn-open');

  function createRipple(e, el) {
    try {
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(span);
      setTimeout(function () { span.remove(); }, 700);
    } catch (err) { /* purely cosmetic — ignore failures */ }
  }

  function openInvitation(e) {
    safe('open invitation', function () {
      if (openBtn) createRipple(e, openBtn);

      var music = document.getElementById('bg-music');
      var musicFab = document.querySelector('.music-fab');
      if (music) { music.play().catch(function () {}); }
      if (musicFab) { musicFab.classList.add('is-active', 'is-playing'); }

      function finish() {
        cover.style.display = 'none';
        scroller.classList.remove('is-locked');
        scroller.scrollTop = 0;
        if (hasGsap) ScrollTrigger.refresh();
        revealNamesPanel();
      }

      if (hasGsap && cover) {
        gsap.to(cover, {
          autoAlpha: 0, scale: 1.04, duration: 1, ease: 'power3.inOut',
          onComplete: finish
        });
      } else if (cover) {
        cover.style.transition = 'opacity .5s ease';
        cover.style.opacity = '0';
        setTimeout(finish, 520);
      }
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }

  /* ------------------------------------------------------------------
     5. Music toggle
     ------------------------------------------------------------------ */
  safe('music toggle', function () {
    var music = document.getElementById('bg-music');
    var musicFab = document.querySelector('.music-fab');
    if (!musicFab || !music) return;
    musicFab.addEventListener('click', function () {
      if (music.paused) {
        music.play().catch(function () {});
        musicFab.classList.add('is-playing');
      } else {
        music.pause();
        musicFab.classList.remove('is-playing');
      }
    });
  });

  /* ------------------------------------------------------------------
     6. Generic scroll reveal system (GSAP only — degrades gracefully)
     ------------------------------------------------------------------ */
  safe('scroll reveals', function () {
    if (!hasGsap) {
      // No GSAP: just make sure content is visible rather than stuck at opacity:0
      document.querySelectorAll('.reveal, .fade-up, .fade-down, .fade-left, .fade-right, .zoom-in, .zoom-out')
        .forEach(function (el) { el.style.opacity = '1'; });
      return;
    }

    function revealGroup(selector, opts) {
      var els = gsap.utils.toArray(selector);
      els.forEach(function (el, i) {
        var from = Object.assign({ opacity: 0, y: 40, filter: 'blur(6px)' }, opts.from || {});
        gsap.fromTo(el, from, {
          opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)',
          duration: opts.duration || 1,
          delay: (opts.stagger || 0) * i,
          ease: opts.ease || 'power3.out',
          scrollTrigger: { trigger: el, scroller: scroller, start: opts.start || 'top 88%' }
        });
      });
    }

    revealGroup('.fade-up', { from: { opacity: 0, y: 46 } });
    revealGroup('.fade-down', { from: { opacity: 0, y: -46 } });
    revealGroup('.fade-left', { from: { opacity: 0, x: 46 } });
    revealGroup('.fade-right', { from: { opacity: 0, x: -46 } });
    revealGroup('.zoom-in', { from: { opacity: 0, scale: .88 } });
    revealGroup('.zoom-out', { from: { opacity: 0, scale: 1.12 } });
    revealGroup('.couple__card', { from: { opacity: 0, y: 50 }, stagger: .22 });
    revealGroup('.love__item', { from: { opacity: 0, y: 50 }, stagger: .16 });
    revealGroup('.gift__card', { from: { opacity: 0, y: 50 }, stagger: .16 });

    gsap.utils.toArray('.img-reveal').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: el, scroller: scroller, start: 'top 80%' }
      });
    });

    gsap.utils.toArray('.parallax-bg').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.section') || el, scroller: scroller,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });

    gsap.utils.toArray('.float-ornament').forEach(function (el, i) {
      gsap.to(el, { y: i % 2 === 0 ? -12 : 12, duration: 3 + (i % 3), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    gsap.utils.toArray('.couple__photo img').forEach(function (img, i) {
      gsap.to(img, { scale: 1.3, duration: 9 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    var imgs = document.querySelectorAll('.frame__content img');
    imgs.forEach(function (img) {
      if (!img.complete) {
        img.addEventListener('load', function () { ScrollTrigger.refresh(); });
      }
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });

  /* ------------------------------------------------------------------
     7. Countdown — fully independent of GSAP/scroll.
     ------------------------------------------------------------------ */
  safe('countdown', function () {
    var target = new Date('2026-09-13T08:00:00+07:00').getTime();
    var elD = document.querySelector('[data-cd="d"]');
    var elH = document.querySelector('[data-cd="h"]');
    var elM = document.querySelector('[data-cd="m"]');
    var elS = document.querySelector('[data-cd="s"]');
    if (!elD && !elH && !elM && !elS) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = target - Date.now();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (elD) elD.textContent = pad(d);
      if (elH) elH.textContent = pad(h);
      if (elM) elM.textContent = pad(m);
      if (elS) elS.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ------------------------------------------------------------------
     8. Wedding gift — copy account number
     ------------------------------------------------------------------ */
  safe('gift copy buttons', function () {
    document.querySelectorAll('.btn-copy').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        createRipple(e, btn);
        var num = btn.getAttribute('data-account');
        if (num && navigator.clipboard) {
          navigator.clipboard.writeText(num).then(function () {
            var original = btn.textContent;
            btn.textContent = 'Tersalin';
            btn.classList.add('is-copied');
            setTimeout(function () {
              btn.textContent = original;
              btn.classList.remove('is-copied');
            }, 1800);
          }).catch(function () {});
        }
      });
    });
  });

  /* ------------------------------------------------------------------
     8b. Wedding gift — reveal cards only after "Kirim Hadiah" is pressed
     ------------------------------------------------------------------ */
  safe('gift toggle', function () {
    var giftCta = document.getElementById('giftToggle');
    var giftCards = document.getElementById('giftCards');
    if (!giftCta || !giftCards) return;

    giftCta.addEventListener('click', function (e) {
      createRipple(e, giftCta);
      var isOpen = giftCta.getAttribute('aria-expanded') === 'true';

      if (!isOpen) {
        giftCards.hidden = false;
        giftCta.setAttribute('aria-expanded', 'true');
        giftCta.textContent = 'Sembunyikan Rekening';
        if (hasGsap) {
          gsap.fromTo(giftCards, { opacity: 0, y: 24, height: 0 }, {
            opacity: 1, y: 0, height: 'auto', duration: .7, ease: 'power3.out',
            onComplete: function () { ScrollTrigger.refresh(); }
          });
        }
      } else {
        giftCta.setAttribute('aria-expanded', 'false');
        giftCta.textContent = 'Kirim Hadiah';
        if (hasGsap) {
          gsap.to(giftCards, {
            opacity: 0, y: 16, height: 0, duration: .5, ease: 'power2.in',
            onComplete: function () { giftCards.hidden = true; ScrollTrigger.refresh(); }
          });
        } else {
          giftCards.hidden = true;
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     9. Hover micro-interaction on buttons
     ------------------------------------------------------------------ */
  safe('hover effects', function () {
    if (!hasGsap) return;
    document.querySelectorAll('.btn-open, .btn-solid, .btn-ghost, .gift__cta').forEach(function (el) {
      el.addEventListener('mouseenter', function () { gsap.to(el, { scale: 1.035, duration: .3, ease: 'power2.out' }); });
      el.addEventListener('mouseleave', function () { gsap.to(el, { scale: 1, duration: .3, ease: 'power2.out' }); });
    });
  });

})();
