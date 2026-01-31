(() => {
    const counters = document.querySelectorAll(".js-count");
    if (!counters.length) return;
  
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    // Repeat settings
    const REPEAT_EVERY_MS = 7000;   // every 7 seconds
    const DEFAULT_DURATION = 2800;  // slower animation (ms)
  
    let intervalId = null;
    let isInView = false;
  
    function animateCounter(el, duration = DEFAULT_DURATION) {
      const target = parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.suffix || "";
      const start = 0;
  
      if (prefersReduced) {
        el.textContent = `${target}${suffix}`;
        return;
      }
  
      const startTime = performance.now();
  
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  
      function tick(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
  
        const value = Math.round(start + (target - start) * eased);
        el.textContent = `${value}${suffix}`;
  
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = `${target}${suffix}`;
      }
  
      requestAnimationFrame(tick);
    }
  
    function runAllCounters() {
      // restart from 0 each cycle
      counters.forEach((el) => {
        const suffix = el.dataset.suffix || "";
        el.textContent = `0${suffix}`;
      });
  
      // small delay feels nicer after reset
      setTimeout(() => {
        counters.forEach((el) => {
          const duration = parseInt(el.dataset.duration || `${DEFAULT_DURATION}`, 10);
          animateCounter(el, duration);
        });
      }, 150);
    }
  
    function startRepeating() {
      if (intervalId) return;
      runAllCounters(); // run immediately
      intervalId = setInterval(() => {
        if (isInView) runAllCounters();
      }, REPEAT_EVERY_MS);
    }
  
    function stopRepeating() {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    }
  
    const experienceSection =
      document.querySelector("#experience") ||
      counters[0].closest("section") ||
      document.body;
  
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
  
          if (isInView) startRepeating();
          else stopRepeating();
        });
      },
      { threshold: 0.35 }
    );
  
    io.observe(experienceSection);
  })();
  