/* ============================================
   INTERFACIAL INTEGRITY BLOG - JAVASCRIPT
   Sidebar Navigation & Interactive Features
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".blog-sidebar-link");
  const sidebar = document.querySelector(".blog-sidebar");
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");

  // ============================================
  // READING PROGRESS INDICATOR
  // ============================================
  const createProgressBar = () => {
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #bf3425, #47577c);
      z-index: 9999;
      transition: width 0.1s linear;
      width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", function () {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + "%";
    });
  };

  createProgressBar();

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const createBackToTop = () => {
    const button = document.createElement("button");
    button.innerHTML = "↑";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Back to top");
    button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #bf3425 0%, #9d2a1e 100%);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(191, 52, 37, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 8px 25px rgba(191, 52, 37, 0.4)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 15px rgba(191, 52, 37, 0.3)";
    });

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    document.body.appendChild(button);

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 500) {
        button.style.opacity = "1";
        button.style.visibility = "visible";
      } else {
        button.style.opacity = "0";
        button.style.visibility = "hidden";
      }
    });
  };

  createBackToTop();

  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================
  if (mobileNavToggle && sidebar) {
    mobileNavToggle.addEventListener("click", function () {
      sidebar.classList.toggle("active");

      // Toggle icon between hamburger and X
      const isActive = sidebar.classList.contains("active");
      if (isActive) {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    });

    // Close sidebar when clicking a link on mobile
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          mobileNavToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          `;
        }
      });
    });
  }

  // ============================================
  // ACTIVE SECTION HIGHLIGHTING
  // ============================================
  function highlightActiveSection() {
    let scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Throttle scroll events for better performance
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function () {
      highlightActiveSection();
    });
  });

  // Initial highlight on page load
  highlightActiveSection();

  // ============================================
  // SMOOTH SCROLLING FOR SIDEBAR LINKS
  // ============================================
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const headerOffset = 40;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update active state immediately
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });

  // ============================================
  // SCROLL ANIMATIONS FOR CARDS
  // ============================================
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Animate cards and other elements
  const animatedElements = document.querySelectorAll(
    ".stat-card, .conclusion-card, .learn-more-card, .feature-item, .highlight-box",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

  // ============================================
  // IMAGE HOVER EFFECTS
  // ============================================
  const images = document.querySelectorAll(
    ".full-width-image, .split-image img",
  );
  images.forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      this.style.transform = "scale(1.01)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    });
    img.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
    });
  });

  // ============================================
  // TABLE ROW HOVER HIGHLIGHT
  // ============================================
  const tableRows = document.querySelectorAll(".data-table tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      this.style.backgroundColor = "#f1f5f9";
    });
    row.addEventListener("mouseleave", function () {
      this.style.backgroundColor = "";
    });
  });

  // ============================================
  // STAT NUMBER ANIMATION
  // ============================================
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number");
          if (statNumber) {
            animateStatNumber(statNumber);
          }
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  function animateStatNumber(element) {
    const finalValue = element.textContent;
    const hasMultiplier = finalValue.includes("×");
    const hasDash = finalValue.includes("-");

    // Skip animation for complex values
    if (hasDash) return;

    const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    const suffix = hasMultiplier ? "×" : "";
    const duration = 1500;
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = numericValue * easeOutQuart;

      if (Number.isInteger(numericValue)) {
        element.textContent = Math.round(currentValue) + suffix;
      } else {
        element.textContent = currentValue.toFixed(1) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = finalValue;
      }
    }

    requestAnimationFrame(updateNumber);
  }

  document.querySelectorAll(".stat-card").forEach((card) => {
    statObserver.observe(card);
  });

  // ============================================
  // CONCLUSION CARD STAGGER ANIMATION
  // ============================================
  const conclusionCards = document.querySelectorAll(".conclusion-card");
  const conclusionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
          conclusionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  conclusionCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    conclusionObserver.observe(card);
  });

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" },
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // ============================================
  // KEYBOARD NAVIGATION FOR SIDEBAR
  // ============================================
  navLinks.forEach((link, index) => {
    link.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && index < navLinks.length - 1) {
        e.preventDefault();
        navLinks[index + 1].focus();
      } else if (e.key === "ArrowUp" && index > 0) {
        e.preventDefault();
        navLinks[index - 1].focus();
      }
    });
  });

  // ============================================
  // CLOSE MOBILE SIDEBAR ON OUTSIDE CLICK
  // ============================================
  document.addEventListener("click", function (e) {
    if (
      window.innerWidth <= 768 &&
      sidebar &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !mobileNavToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active");
      if (mobileNavToggle) {
        mobileNavToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    }
  });

  // ============================================
  // CLOSE MOBILE SIDEBAR ON ESCAPE KEY
  // ============================================
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      window.innerWidth <= 768 &&
      sidebar &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active");
      if (mobileNavToggle) {
        mobileNavToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
        mobileNavToggle.focus();
      }
    }
  });

  // ============================================
  // WINDOW RESIZE HANDLER
  // ============================================
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Reset sidebar state on larger screens
      if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove("active");
        if (mobileNavToggle) {
          mobileNavToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          `;
        }
      }
    }, 100);
  });

  // ============================================
  // PRINT BUTTON (Optional)
  // ============================================
  const printButton = document.querySelector(".print-article");
  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }

  console.log("Interfacial Integrity Blog JS loaded successfully");
});
//    <!-- Infographic Placeholder 1 -->
(function () {
  const tooltipData = {
    roller: {
      title: "Compaction Roller",
      temp: "Controlled",
      desc: "Applies consolidation pressure to bond incoming tape with substrate. Temperature-controlled to optimize bonding.",
    },
    tape: {
      title: "Incoming Tape",
      temp: "~350°C",
      desc: "Pre-heated thermoplastic tape in molten state, ready for consolidation with the substrate layers.",
    },
    nip: {
      title: "Nip Point",
      temp: "~350°C",
      desc: "Highest temperature zone where molten tape contacts substrate. Critical for achieving intimate contact and bonding.",
    },
    interface: {
      title: "Interface Zone",
      temp: "180-250°C",
      desc: "Bonding region where molecular interdiffusion occurs. Temperature must exceed glass transition for proper adhesion.",
    },
    surface: {
      title: "Liner Surface",
      temp: "Consolidated",
      desc: "Previously laid and consolidated tape layers. Surface reheated during new tape placement for bonding.",
    },
    bulk: {
      title: "Liner Bulk",
      temp: "25-80°C",
      desc: "Inner laminate layers that have cooled and crystallized. Provides structural support during layup.",
    },
    mandrel: {
      title: "Mandrel/Support",
      temp: "Ambient",
      desc: "Tooling surface that defines part geometry. May be heated or cooled to control process temperatures.",
    },
  };

  const diagram = document.getElementById("compactionDiagram");
  const tooltip = document.getElementById("processTooltip");
  const zones = diagram.querySelectorAll("[data-zone]");

  zones.forEach((zone) => {
    zone.addEventListener("mouseenter", (e) => {
      const zoneId = zone.dataset.zone;
      const data = tooltipData[zoneId];

      if (data) {
        tooltip.querySelector(".tooltip-title").textContent = data.title;
        tooltip.querySelector(".tooltip-temp").textContent = data.temp;
        tooltip.querySelector(".tooltip-desc").textContent = data.desc;

        const rect = zone.getBoundingClientRect();
        const diagramRect = diagram.getBoundingClientRect();

        let left = rect.left - diagramRect.left + rect.width / 2;
        let top = rect.top - diagramRect.top - 10;

        // Adjust position to keep tooltip in view
        if (left > diagramRect.width - 120) {
          left = diagramRect.width - 240;
        }
        if (left < 120) {
          left = 20;
        }

        tooltip.style.left = left + "px";
        tooltip.style.top = top - 100 + "px";
        tooltip.classList.add("visible");
      }
    });

    zone.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
})();
// <!-- Infographic Placeholder 3 -->
(function () {
  // Add hover interactions for parameter cards
  const paramCards = document.querySelectorAll(".param-card");

  paramCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Highlight corresponding element in the diagram
      const type = card.classList.contains("depth")
        ? "depth"
        : card.classList.contains("spacing")
          ? "spacing"
          : "roughness";

      // Add visual feedback
      card.style.transform = "translateX(8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Add hover effect for grooves in SVG
  const grooveSvg = document.querySelector(".groove-svg");
  if (grooveSvg) {
    const grooveWalls = grooveSvg.querySelectorAll(".groove-wall");

    grooveWalls.forEach((wall) => {
      wall.style.cursor = "pointer";
      wall.style.transition = "all 0.3s ease";

      wall.addEventListener("mouseenter", () => {
        wall.style.fill = "#5a6b8a";
        wall.style.filter = "drop-shadow(0 0 6px rgba(71, 87, 124, 0.5))";
      });

      wall.addEventListener("mouseleave", () => {
        wall.style.fill = "";
        wall.style.filter = "";
      });
    });
  }
})();
//    <!-- Infographic Placeholder 4 -->
(function () {
  const chart = document.getElementById("processChart");
  const tooltip = document.getElementById("zoneTooltip");
  const crosshairH = document.getElementById("crosshairH");
  const crosshairV = document.getElementById("crosshairV");
  const coordDisplay = document.getElementById("coordDisplay");

  const tooltipData = {
    collapse: {
      title: "Liner Collapse Zone",
      indicator: "collapse",
      params: "T > 280°C at low speeds",
      desc: "Excessive thermal input causes the PA6 liner to soften beyond its structural capacity, leading to deformation and potential failure.",
    },
    optimal: {
      title: "Optimal Process Window",
      indicator: "optimal",
      params: "T: 240-275°C, v: 0.8-2.0 m/min",
      desc: "Balanced heat input enables proper polymer chain interdiffusion while maintaining liner integrity for strong interfacial bonding.",
    },
    insufficient: {
      title: "Insufficient Bonding Zone",
      indicator: "insufficient",
      params: "T < 230°C or v > 2.0 m/min",
      desc: "Inadequate thermal energy prevents complete polymer melting and molecular diffusion, resulting in weak adhesion.",
    },
    point: {
      title: "Optimal Operating Point",
      indicator: "optimal",
      params: "~260°C @ 1.2 m/min",
      desc: "Center of the process window providing maximum margin from failure boundaries with excellent bond quality.",
    },
  };

  // Zone hover interactions
  const zones = chart.querySelectorAll("[data-zone]");

  zones.forEach((zone) => {
    zone.addEventListener("mouseenter", (e) => {
      const zoneId = zone.dataset.zone;
      const data = tooltipData[zoneId];

      if (data) {
        tooltip.querySelector(".tooltip-title").textContent = data.title;
        tooltip.querySelector(".tooltip-indicator").className =
          "tooltip-indicator " + data.indicator;
        tooltip.querySelector(".tooltip-params").textContent = data.params;
        tooltip.querySelector(".tooltip-desc").textContent = data.desc;

        const rect = zone.getBoundingClientRect();
        const chartRect = chart.getBoundingClientRect();

        tooltip.style.left = e.clientX - chartRect.left + 15 + "px";
        tooltip.style.top = e.clientY - chartRect.top - 80 + "px";
        tooltip.classList.add("visible");
      }
    });

    zone.addEventListener("mousemove", (e) => {
      const chartRect = chart.getBoundingClientRect();
      tooltip.style.left = e.clientX - chartRect.left + 15 + "px";
      tooltip.style.top = e.clientY - chartRect.top - 80 + "px";
    });

    zone.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  // Crosshair and coordinate tracking
  chart.addEventListener("mousemove", (e) => {
    const rect = chart.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    crosshairH.style.top = y + "px";
    crosshairV.style.left = x + "px";

    // Calculate actual values
    const speed = ((x / rect.width) * 2.5).toFixed(2);
    const temp = (300 - (y / rect.height) * 100).toFixed(0);

    coordDisplay.textContent = `T: ${temp}°C | v: ${speed} m/min`;
  });

  // Card highlight interactions
  const cards = document.querySelectorAll("[data-highlight]");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const zoneType = card.dataset.highlight;
      const targetZone = chart.querySelector(`.${zoneType}-zone`);
      if (targetZone) {
        targetZone.style.filter = "brightness(1.2)";
        targetZone.style.transform = "scale(1.01)";
      }
    });

    card.addEventListener("mouseleave", () => {
      const zoneType = card.dataset.highlight;
      const targetZone = chart.querySelector(`.${zoneType}-zone`);
      if (targetZone) {
        targetZone.style.filter = "";
        targetZone.style.transform = "";
      }
    });
  });
})();
//    <!-- Infographic Placeholder 5 -->
(function () {
  const chart = document.getElementById("stressChart");
  const tooltip = document.getElementById("chartTooltip");
  const hoverPoints = chart.querySelectorAll(".hover-point");

  // Hover point interactions
  hoverPoints.forEach((point) => {
    point.addEventListener("mouseenter", (e) => {
      const info = point.dataset.info;
      tooltip.textContent = info;
      tooltip.classList.add("visible");

      const rect = point.getBoundingClientRect();
      const chartRect = chart.getBoundingClientRect();

      tooltip.style.left = rect.left - chartRect.left + 20 + "px";
      tooltip.style.top = rect.top - chartRect.top - 30 + "px";
    });

    point.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  // Insight card interactions
  const insightCards = document.querySelectorAll(".insight-card");

  insightCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Add visual feedback
      const type = card.classList.contains("shear")
        ? "shear"
        : card.classList.contains("compression")
          ? "compression"
          : "edge";

      if (type === "shear") {
        // Highlight the stress curve
        const curve = document.querySelector(
          ".stress-curve path:not(.stress-area)",
        );
        if (curve) {
          curve.style.strokeWidth = "4";
          curve.style.filter = "drop-shadow(0 0 4px rgba(191, 52, 37, 0.5))";
        }
      }
    });

    card.addEventListener("mouseleave", () => {
      // Reset visual feedback
      const curve = document.querySelector(
        ".stress-curve path:not(.stress-area)",
      );
      if (curve) {
        curve.style.strokeWidth = "";
        curve.style.filter = "";
      }
    });
  });

  // State card hover effects
  const stateCards = document.querySelectorAll(".state-card");

  stateCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.02)";
      card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
})();
// <!-- Infographic Placeholder 6 -->
(function () {
  const tooltip = document.getElementById("copvTooltip");

  const layerData = {
    boss: {
      title: "Metallic Boss",
      color: "boss",
      desc: "Aluminum or steel end fitting providing interface for valve and piping connections. Critical sealing surface for hydrogen containment.",
    },
    composite: {
      title: "CFRP Composite Overwrap",
      color: "composite",
      desc: "Carbon fiber reinforced polymer providing structural strength. Carries majority of pressure load (hoop and axial stress).",
    },
    liner: {
      title: "Polymer Liner",
      color: "liner",
      desc: "Gas barrier layer (HDPE, PA6, or PA11) preventing hydrogen permeation. Surface treatment enhances bonding to composite.",
    },
    storage: {
      title: "H₂ Storage Chamber",
      color: "storage",
      desc: "High-pressure hydrogen storage at 350-700 bar. Type IV vessels achieve gravimetric efficiency of 5-6 wt% H₂.",
    },
  };

  // Cross-section layer interactions
  const layers = document.querySelectorAll("[data-layer]");

  layers.forEach((layer) => {
    layer.addEventListener("mouseenter", (e) => {
      const layerId = layer.dataset.layer;
      const data = layerData[layerId];

      if (data) {
        tooltip.querySelector(".tooltip-title").textContent = data.title;
        tooltip.querySelector(".tooltip-dot").className =
          "tooltip-dot " + data.color;
        tooltip.querySelector(".tooltip-desc").textContent = data.desc;

        tooltip.style.left = e.clientX + 15 + "px";
        tooltip.style.top = e.clientY - 60 + "px";
        tooltip.classList.add("visible");

        // Show corresponding labels
        const labelClass = "label-" + layerId;
        const label = document.querySelector("." + labelClass);
        if (label) label.classList.add("visible");

        const connClass = "conn-" + layerId;
        const conn = document.querySelector("." + connClass);
        if (conn) conn.classList.add("visible");
      }
    });

    layer.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY - 60 + "px";
    });

    layer.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");

      document
        .querySelectorAll(".layer-label")
        .forEach((l) => l.classList.remove("visible"));
      document
        .querySelectorAll(".connector-line")
        .forEach((c) => c.classList.remove("visible"));
    });
  });

  // Interface layer interactions
  const interfaceData = {
    cfrp: {
      title: "CFRP Matrix",
      color: "composite",
      desc: "Thermoset or thermoplastic resin system infiltrates laser-created surface features during consolidation.",
    },
    infiltration: {
      title: "Infiltration Zone",
      color: "boss",
      desc: "Matrix material penetrates into microgrooves creating mechanical interlocking for enhanced interfacial strength.",
    },
    liner: {
      title: "PA11 Liner Surface",
      color: "liner",
      desc: "Nanosecond laser treatment creates periodic groove structures (10-30 μm depth, 50-100 μm spacing).",
    },
  };

  const interfaceLayers = document.querySelectorAll("[data-interface]");

  interfaceLayers.forEach((layer) => {
    layer.addEventListener("mouseenter", (e) => {
      const layerId = layer.dataset.interface;
      const data = interfaceData[layerId];

      if (data) {
        tooltip.querySelector(".tooltip-title").textContent = data.title;
        tooltip.querySelector(".tooltip-dot").className =
          "tooltip-dot " + data.color;
        tooltip.querySelector(".tooltip-desc").textContent = data.desc;

        tooltip.style.left = e.clientX + 15 + "px";
        tooltip.style.top = e.clientY - 60 + "px";
        tooltip.classList.add("visible");
      }
    });

    layer.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY - 60 + "px";
    });

    layer.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  // Groove interactions
  const grooves = document.querySelectorAll(".groove");

  grooves.forEach((groove) => {
    groove.addEventListener("mouseenter", (e) => {
      tooltip.querySelector(".tooltip-title").textContent =
        "Laser-Machined Groove";
      tooltip.querySelector(".tooltip-dot").className = "tooltip-dot boss";
      tooltip.querySelector(".tooltip-desc").textContent =
        "Controlled surface texture providing mechanical interlocking. Resin infiltration creates positive engagement between liner and composite.";

      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY - 60 + "px";
      tooltip.classList.add("visible");
    });

    groove.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
})();
//  <!-- Infographic Placeholder 7 -->
(function () {
  const panel3d = document.getElementById("panel3d");
  const explodeToggle = document.getElementById("explodeToggle");
  const tooltip = document.getElementById("hybridTooltip");

  let isExploded = false;

  // Explode view toggle
  explodeToggle.addEventListener("click", () => {
    isExploded = !isExploded;
    panel3d.classList.toggle("exploded", isExploded);
    explodeToggle.innerHTML = isExploded
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 14h6v6M14 4h6v6M20 10l-7 7M4 20l7-7"/>
      </svg> Collapse View`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg> Explode View`;
  });

  // Tooltip data
  const layerData = {
    steel: {
      title: "Steel Outer Panel",
      desc: "Provides Class A surface finish, corrosion protection, and maintains vehicle aesthetics. Acts as the external structural member.",
    },
    adhesive: {
      title: "Expanding Adhesive",
      desc: "Heat-activated adhesive that expands during e-coat oven cure (180°C). Fills manufacturing gaps and creates strong bond between steel and composite.",
    },
    organosheet: {
      title: "GF/PA6 Organosheet",
      desc: "Continuous glass fiber reinforced PA6 sheet, compression molded to shape. Provides base stiffness and serves as substrate for over-molding.",
    },
    ribs: {
      title: "Over-molded Ribs (30% GF/PA6/6)",
      desc: "Injection molded short fiber reinforced ribs providing local stiffness, load distribution, and attachment features. Molecularly bonded to organosheet.",
    },
  };

  // Layer hover interactions
  const layers = document.querySelectorAll("[data-layer]");

  layers.forEach((layer) => {
    layer.addEventListener("mouseenter", (e) => {
      const layerId = layer.dataset.layer;
      const data = layerData[layerId];

      if (data) {
        tooltip.querySelector(".tooltip-title").textContent = data.title;
        tooltip.querySelector(".tooltip-desc").textContent = data.desc;

        tooltip.style.left = e.clientX + 15 + "px";
        tooltip.style.top = e.clientY - 60 + "px";
        tooltip.classList.add("visible");
      }
    });

    layer.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY - 60 + "px";
    });

    layer.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  // Card highlight interactions
  const cards = document.querySelectorAll("[data-highlight]");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const layerType = card.dataset.highlight;
      const targetLayer = document.querySelector(
        `.layer-${layerType}, .layer-${layerType}-container`,
      );
      if (targetLayer) {
        targetLayer.style.boxShadow = "0 0 20px rgba(191, 52, 37, 0.5)";
        targetLayer.style.zIndex = "20";
      }
    });

    card.addEventListener("mouseleave", () => {
      const layerType = card.dataset.highlight;
      const targetLayer = document.querySelector(
        `.layer-${layerType}, .layer-${layerType}-container`,
      );
      if (targetLayer) {
        targetLayer.style.boxShadow = "";
        targetLayer.style.zIndex = "";
      }
    });
  });

  // Animate weight comparison bars on load
  setTimeout(() => {
    document.querySelectorAll(".comparison-fill").forEach((bar) => {
      bar.style.transition = "width 1s ease";
    });
  }, 500);
})();
