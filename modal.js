(() => {
    const cards = Array.from(document.querySelectorAll(".project-card"));
    const modal = document.getElementById("projectModal");
    const overlay = modal.querySelector(".modal-overlay");
    const closeBtns = modal.querySelectorAll("[data-modal-close]");
  
    const imgEl = document.getElementById("modalImage");
    const titleEl = document.getElementById("modalTitle");
    const descEl = document.getElementById("modalDesc");
    const counterEl = document.getElementById("imgCounter");
    const thumbsEl = document.getElementById("thumbs");
  
    const prevBtn = document.getElementById("imgPrev");
    const nextBtn = document.getElementById("imgNext");
  
    let images = [];
    let imgIndex = 0;
  
    const parseImages = (raw) => {
      if (!raw) return [];
      return raw
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 6); // limit to 6
    };
  
    const openModal = (card) => {
      const title = card.getAttribute("data-title") || "";
      const desc = card.getAttribute("data-desc") || "";
      images = parseImages(card.getAttribute("data-images"));
  
      // fallback: if no data-images, try the card img src
      if (images.length === 0) {
        const firstImg = card.querySelector("img")?.getAttribute("src");
        if (firstImg) images = [firstImg];
      }
  
      imgIndex = 0;
  
      titleEl.textContent = title;
      descEl.textContent = desc;
  
      render();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
  
    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
  
    const render = () => {
      const total = images.length || 1;
      const safeIndex = Math.min(Math.max(imgIndex, 0), total - 1);
      imgIndex = safeIndex;
  
      const src = images[imgIndex];
      imgEl.src = src;
      imgEl.alt = `${titleEl.textContent} — Image ${imgIndex + 1}`;
  
      // counter
      counterEl.textContent = `${imgIndex + 1} / ${total}`;
  
      // hide arrows at ends
      if (imgIndex === 0) prevBtn.classList.add("is-hidden");
      else prevBtn.classList.remove("is-hidden");
  
      if (imgIndex === total - 1) nextBtn.classList.add("is-hidden");
      else nextBtn.classList.remove("is-hidden");
  
      // thumbnails
      thumbsEl.innerHTML = "";
      images.forEach((thumbSrc, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "modal-thumb" + (i === imgIndex ? " is-active" : "");
        btn.setAttribute("aria-label", `Open image ${i + 1}`);
  
        const img = document.createElement("img");
        img.src = thumbSrc;
        img.alt = `Thumbnail ${i + 1}`;
        btn.appendChild(img);
  
        btn.addEventListener("click", () => {
          imgIndex = i;
          render();
        });
  
        thumbsEl.appendChild(btn);
      });
    };
  
    const goPrev = () => {
      if (imgIndex > 0) {
        imgIndex -= 1;
        render();
      }
    };
  
    const goNext = () => {
      if (imgIndex < images.length - 1) {
        imgIndex += 1;
        render();
      }
    };
  
    // Card handlers
    cards.forEach((card) => {
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", () => openModal(card));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openModal(card);
      });
    });
  
    // Close handlers
    closeBtns.forEach(btn => btn.addEventListener("click", closeModal));
    overlay.addEventListener("click", closeModal);
  
    // Arrow handlers
    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);
  
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
  
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    });
  })();
  

  // Projects List Modal (Experience link)
(() => {
    const openBtn = document.getElementById("openProjectsList");
    const listModal = document.getElementById("projectsListModal");
    if (!openBtn || !listModal) return;
  
    const overlay = listModal.querySelector(".modal-overlay");
    const closeBtns = listModal.querySelectorAll("[data-list-close]");
  
    const openListModal = () => {
      listModal.classList.add("is-open");
      listModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
  
    const closeListModal = () => {
      listModal.classList.remove("is-open");
      listModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
  
    openBtn.addEventListener("click", openListModal);
    overlay.addEventListener("click", closeListModal);
    closeBtns.forEach(btn => btn.addEventListener("click", closeListModal));
  
    // ESC key closes list modal
    document.addEventListener("keydown", (e) => {
      if (!listModal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeListModal();
    });
  })();
  