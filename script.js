/* ==========================================================================
   TOTAL MOTOR MAINTENANCE — site behaviour
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    const closeNav = () => {
      navToggle.classList.remove('is-open');
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    const toggleNav = () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', toggleNav);

    // Close the menu once a link is tapped
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- copy GPS coordinates ---------- */
  const copyBtn = document.getElementById('copy-gps');
  const gpsValue = document.getElementById('gps-value');

  if (copyBtn && gpsValue) {
    copyBtn.addEventListener('click', async () => {
      const rawCoords = '-25.452189, 30.959144';
      try {
        await navigator.clipboard.writeText(rawCoords);
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = original; }, 1800);
      } catch (err) {
        // Clipboard API unavailable — fall back to a manual prompt
        window.prompt('Copy the GPS coordinates:', rawCoords);
      }
    });
  }

  /* ---------- contact form ---------- */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  if (form && formNote) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const vehicle = form.vehicle.value.trim();
      const message = form.message.value.trim();

      if (!name || !message) {
        formNote.textContent = 'Please fill in your name and what the vehicle needs.';
        formNote.removeAttribute('data-state');
        return;
      }

      const subject = encodeURIComponent(`Service enquiry from ${name}`);
      const bodyLines = [
        `Name: ${name}`,
        vehicle ? `Vehicle: ${vehicle}` : null,
        '',
        message
      ].filter(Boolean);
      const body = encodeURIComponent(bodyLines.join('\n'));

      window.location.href = `mailto:boschmad@mweb.co.za?subject=${subject}&body=${body}`;

      formNote.textContent = 'Opening your email app to send this through to the workshop…';
      formNote.setAttribute('data-state', 'sent');
    });
  }

});