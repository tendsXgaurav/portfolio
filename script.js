document.addEventListener("DOMContentLoaded", function () {
  // --- Elements ---
  const loadingScreen = document.getElementById("loading-screen");
  const homePage = document.getElementById("home-page");
  const infoPage = document.getElementById("info-page");
  const chatPage = document.getElementById("chat-page");
  const projectPage = document.getElementById("project-page");
  const allProjectsPage = document.getElementById("all-projects-page");
  const pages = [homePage, infoPage, chatPage, projectPage, allProjectsPage];

  const homeLink = document.getElementById("home-link");
  const workLink = document.getElementById("work-link");
  const infoLink = document.getElementById("info-link");
  const chatLink = document.getElementById("chat-link");
  const backArrow = document.getElementById("back-arrow");

  const header = document.getElementById("header");
  const body = document.body;
  const typingText = document.getElementById("typing-text");
  const headlineText = document.getElementById("headline-text");

  // --- Loading Screen ---
  window.addEventListener("load", function () {
    setTimeout(() => {
      loadingScreen.classList.add("loaded");
      setTimeout(() => {
        if (loadingScreen) loadingScreen.remove();
      }, 500);
    }, 1000);
  });

  // --- Typing Animation ---
  const mainTexts = [
    "I am soo happy",
    "Lets Begin",
    "This is Gaurav and you?",
    "Welcome to my portfolio",
    "Let's create something amazing",
    "Big Thoughts",
    "Code is poetry",
    "Building dreams with code",
  ];
  const headlineTexts = [
    "You are here ♥",
    "Nice to meet you!",
    "Discover my work",
    "I can turn your imagination into reality",
    "You too! ♥",
    "Ready to collaborate",
    "One line at a time",
    "Crafting code with imagination",
  ];
  let isTyping = false;
  let animationShouldStop = false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function typeEffect(element, text, speed = 100) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (animationShouldStop) return;
      element.textContent += text.charAt(i);
      await sleep(speed);
    }
  }

  async function deleteEffect(element, speed = 50) {
    const text = element.textContent;
    for (let i = text.length; i > 0; i--) {
      if (animationShouldStop) return;
      element.textContent = text.substring(0, i - 1);
      await sleep(speed);
    }
  }

  async function startTypingAnimation() {
    if (isTyping || !typingText || !headlineText) return;
    isTyping = true;
    animationShouldStop = false;

    let mainIndex = 0;
    let headlineIndex = 0;

    while (!animationShouldStop) {
      await typeEffect(typingText, mainTexts[mainIndex]);
      await sleep(2000);
      await deleteEffect(typingText);

      if (animationShouldStop) break;

      await typeEffect(headlineText, headlineTexts[headlineIndex]);
      await sleep(2000);
      await deleteEffect(headlineText);

      mainIndex = (mainIndex + 1) % mainTexts.length;
      headlineIndex = (headlineIndex + 1) % headlineTexts.length;
      await sleep(500);
    }
    isTyping = false;
  }

  function stopTypingAnimation() {
    animationShouldStop = true;
  }

  setTimeout(startTypingAnimation, 500); // Initial start

  // Text Zoom on Scroll Effect
  // Desktop-only: toggle the `.zoom-in` class on the typing container while the hero is in view
  function initTextZoomEffect() {
    // Only enable on wider screens
    if (window.innerWidth < 1024) return;

    const heroSection = document.querySelector('[data-section="hero"]');
    const typingContainer = document.querySelector(".typing-container");
    if (!heroSection || !typingContainer) return;

    let isZoomed = false;
    let scrollTimeout = null;

    function removeZoom() {
      if (isZoomed) {
        isZoomed = false;
        typingContainer.classList.remove("zoom-in");
      }
    }

    window.addEventListener(
      "scroll",
      () => {
        if (
          window.innerWidth < 1024 ||
          !homePage ||
          !homePage.classList.contains("visible")
        )
          return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (!isZoomed) {
            isZoomed = true;
            typingContainer.classList.add("zoom-in");
          }

          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            removeZoom();
          }, 300);
        } else {
          removeZoom();
        }
      },
      { passive: true }
    );

    heroSection.addEventListener(
      "wheel",
      (e) => {
        if (
          window.innerWidth < 1024 ||
          !homePage ||
          !homePage.classList.contains("visible")
        )
          return;
        if (e.deltaY > 0) {
          typingContainer.classList.add("zoom-in");
          setTimeout(() => typingContainer.classList.remove("zoom-in"), 600);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      if (window.innerWidth < 1024) {
        typingContainer.classList.remove("zoom-in");
        isZoomed = false;
      }
    });
  }

  // Initialize the zoom effect
  initTextZoomEffect();
  // --- Image protection (Level 2) ---
  // Disable context menu on protected images and prevent dragging/saving
  function initImageProtection() {
    document.addEventListener('contextmenu', function (e) {
      const el = e.target;
      if (el && (el.classList && el.closest && el.closest('.protected-image'))) {
        e.preventDefault();
      }
    });

    document.addEventListener('dragstart', function (e) {
      const el = e.target;
      if (el && el.closest && el.closest('.protected-image')) {
        e.preventDefault();
      }
    });

    // Prevent Ctrl+S / Cmd+S when focusing the page while hovering image
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        const selection = document.activeElement;
        if (selection && selection.closest && selection.closest('.protected-image')) {
          e.preventDefault();
        }
      }
    });
  }

  initImageProtection();

  // Load large base64 profile image from external file to avoid inlining huge data URI
  (function loadProfileBase64(){
    const img = document.getElementById('profile-img');
    if(!img) return;
    fetch('profile_base64.txt')
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(txt => {
        const b64 = txt.replace(/\s+/g, '');
        if(b64.startsWith('/9j/')) { // rudimentary JPEG signature check
          img.src = 'data:image/jpeg;base64,' + b64;
        }
      })
      .catch(()=>{/* silent */});
  })();

  // --- Scroll Effects (Color Change) ---
  function setupScrollColorEffects() {
    const sections = [
      {
        element: document.querySelector('[data-section="hero"]'),
        colors: { bg: "#F3F3F1", text: "#1a1a1a", header: "#F3F3F1" },
      },
      {
        element: document.querySelector('[data-section="recognition"]'),
        colors: { bg: "#F3F3F1", text: "#1a1a1a", header: "#F3F3F1" },
      },
      {
        element: document.querySelector('[data-section="footer-contact"]'),
        colors: { bg: "#000000", text: "#ffffff", header: "#000000" },
      },
    ];

    let currentSection = null;

    function updateColors(targetColors) {
      body.style.backgroundColor = targetColors.bg;
      if (header) {
        header.style.backgroundColor = targetColors.header;
        header.style.color = targetColors.text;
        header
          .querySelectorAll("a")
          .forEach((link) => (link.style.color = targetColors.text));
      }
    }

    function handleScroll() {
      if (!homePage.classList.contains("visible")) return;

      let activeSection = null;
      let maxVisibility = 0;

      sections.forEach((section) => {
        if (!section.element) return;
        const rect = section.element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const visibleHeight =
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibility = visibleHeight / rect.height;
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            activeSection = section;
          }
        }
      });

      if (activeSection && activeSection !== currentSection) {
        currentSection = activeSection;
        updateColors(activeSection.colors);
      }
    }

    const throttledHandler = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandler);
  }

  let scrollEffectsCleanup = setupScrollColorEffects();

  // --- Page Navigation ---
  function showPage(pageToShow) {
    stopTypingAnimation();

    if (scrollEffectsCleanup) {
      scrollEffectsCleanup();
      scrollEffectsCleanup = null;
    }

    pages.forEach((page) => page.classList.remove("visible"));
    pageToShow.classList.add("visible");

    window.scrollTo(0, 0);

    const isHomePage = pageToShow === homePage;
    const isChatPage = pageToShow === chatPage;

    header.classList.toggle("hidden", isChatPage);
    body.style.backgroundColor = isChatPage ? "#000" : "#F3F3F1";

    if (isHomePage) {
      setTimeout(() => {
        startTypingAnimation();
        scrollEffectsCleanup = setupScrollColorEffects();
        // Force initial color check
        if (scrollEffectsCleanup) {
          document.dispatchEvent(new Event("scroll"));
        }
      }, 300);
    }
  }

  // --- Event Listeners for Navigation ---
  infoLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(infoPage);
  });
  chatLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(chatPage);
  });
  backArrow.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(homePage);
  });
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(homePage);
  });
  workLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (!homePage.classList.contains("visible")) {
      showPage(homePage);
      setTimeout(
        () =>
          document
            .getElementById("projects-section")
            .scrollIntoView({ behavior: "smooth" }),
        500
      );
    } else {
      document
        .getElementById("projects-section")
        .scrollIntoView({ behavior: "smooth" });
    }
  });

  // --- Contribution Calendar ---
  function getConsistentContribution(date) {
    const dayOfYear =
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      86400000;
    // A pseudo-random formula to create a plausible but consistent pattern
    const sinWave = Math.sin(dayOfYear / 10 + date.getFullYear()) * 5 + 5;
    const noise = Math.sin(dayOfYear / 3) * 2;
    let count = Math.round(sinWave + noise);
    // Make weekends less active
    if (date.getDay() === 0 || date.getDay() === 6) {
      count = Math.floor(count / 3);
    }
    return Math.max(0, Math.min(10, count)); // Clamp between 0 and 10
  }

  function generateContributionCalendar() {
    const grid = document.getElementById("contribution-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const today = new Date();
    for (let i = 370; i >= 0; i--) {
      // 53 weeks * 7 days
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const count = getConsistentContribution(date);

      const square = document.createElement("div");
      square.className =
        "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125";
      square.title = `${count} contributions on ${date.toDateString()}`;

      let colorClass = "bg-gray-800"; // 0 contributions
  if (count > 0 && count <= 2) colorClass = "bg-[#475a6a]"; // darker mid
  else if (count > 2 && count <= 4) colorClass = "bg-[#2c3e50]"; // primary dark
  else if (count > 4 && count <= 6) colorClass = "bg-[#88979f]"; // lighter mid
  else if (count > 6) colorClass = "bg-[#EFBF04]"; // light accent from gradient

      square.classList.add(colorClass);
      grid.appendChild(square);
    }
  }

  generateContributionCalendar();

  // --- Appreciation Button ---
  const appreciateBtn = document.getElementById("appreciate-btn");
  const appreciationCountEl = document.getElementById("appreciation-count");

  let hasAppreciated = localStorage.getItem("hasAppreciated") === "true";
  let appreciationCount = parseInt(
    localStorage.getItem("appreciationCount") || appreciationCountEl.textContent
  );
  appreciationCountEl.textContent = appreciationCount;

  function updateAppreciationButton() {
    if (hasAppreciated) {
      appreciateBtn.innerHTML = `<span>✔️</span><span>Appreciated!</span>`;
      appreciateBtn.disabled = true;
      appreciateBtn.classList.add("bg-gray-700", "cursor-not-allowed");
  appreciateBtn.classList.remove("bg-[#2c3e50]", "hover:bg-[#475a6a]");
    }
  }
  updateAppreciationButton();

  appreciateBtn.addEventListener("click", () => {
    if (hasAppreciated) return;

    appreciationCount++;
    appreciationCountEl.textContent = appreciationCount;
    hasAppreciated = true;

    localStorage.setItem("hasAppreciated", "true");
    localStorage.setItem("appreciationCount", appreciationCount);

    updateAppreciationButton();
  });

  const projectData = {
    "codvan": {
      title: "Codvan",
      subtitle: "Learn Coding on the Go",
      category: "EdTech Platform",
      heroImage: "codvan.png",
      overview:
        "Codvan is an innovative educational platform designed to make coding accessible anywhere, anytime. Whether you're commuting, waiting in line, or taking a break, Codvan transforms idle moments into productive learning sessions. The platform offers bite-sized coding lessons, interactive challenges, and hands-on projects that adapt to your schedule and learning pace.",
      role: "Full Stack Developer & UI/UX Designer",
      duration: "6 months",
      tech: "React Native, Node.js, Express, MongoDB, WebRTC",
      year: "2024",
      challenge:
        "The main challenge was creating an engaging mobile-first learning experience that works seamlessly across different devices and network conditions. Traditional coding education platforms weren't optimized for mobile learning, making it difficult for users to practice coding on-the-go.",
      solution:
        "We developed a progressive web application with offline capabilities, adaptive UI that works on any screen size, and a unique micro-learning approach. The platform features interactive code editors, real-time feedback, and gamified learning paths that keep users engaged during short learning sessions.",
      link: "https://codvan.com",
      gallery: ["codvan.png"],
    },
    "glimpseio": {
      title: "Glimpseio",
      subtitle: "Skip the Guess, Skip the Line",
      category: "Location Intelligence",
      heroImage: "glimpseio.png",
      overview:
        "Glimpseio is a revolutionary platform that eliminates the uncertainty of visiting physical locations. Before you step out, know whether that coffee shop is open, if the restaurant has seating, or if the store you need is currently operating. Perfect for college students planning study sessions, locals discovering new spots, and anyone who values their time and wants to make informed decisions about where to go.",
      role: "Product Designer & Lead Developer",
      duration: "4 months",
      tech: "React, Firebase, Google Maps API, Real-time Database",
      year: "2024",
      challenge:
        "Creating a reliable, real-time system that aggregates location data from multiple sources while ensuring accuracy and timeliness. The challenge was building trust with users who need dependable information to make location-based decisions.",
      solution:
        "We implemented a crowd-sourced verification system combined with automated data collection from official sources. The platform uses machine learning to predict location status based on historical patterns and real-time indicators, providing users with confidence scores for each location update.",
      link: "https://glimpseio.tech",
      gallery: ["glimpseio.png"],
    },
    "hello-03": {
      title: "Aiethic",
      subtitle: "AI That Feels Human",
      category: "Artificial Intelligence",
      heroImage: "aiethic.jpg",
      overview:
        "Aiethic represents the next evolution in conversational AI – a chatbot that doesn't just process language, but understands emotion, context, and human nuance. Unlike traditional chatbots that feel robotic and scripted, Aiethic creates genuine connections through empathetic responses, adaptive personality, and meaningful conversations that feel surprisingly human.",
      role: "AI Engineer & UX Designer",
      duration: "8 months",
      tech: "Python, TensorFlow, Natural Language Processing, React, WebSocket",
      year: "2024",
      challenge:
        "The biggest challenge was bridging the gap between artificial intelligence and human emotional intelligence. Creating an AI that can understand context, remember conversations, and respond with appropriate emotional intelligence while maintaining ethical boundaries.",
      solution:
        "We developed a sophisticated neural network architecture that combines sentiment analysis, contextual memory, and ethical reasoning. The AI learns from each interaction while respecting privacy, creating personalized experiences that feel authentic and emotionally intelligent.",
      link: "https://aiethic.me",
      gallery: ["aiethic.jpg"],
    },
    "portfolio-website": {
      title: "Hello",
      subtitle: "Coming Soon",
      category: "Mobile App",
      heroImage: "hello.png",
      overview:
        "An exciting new project in development that will revolutionize how people connect and communicate. While we can't reveal all the details yet, Hello promises to bring fresh innovation to digital interaction. Stay tuned for something amazing that will change the way you think about mobile communication.",
      role: "Product Lead",
      duration: "In Development",
      tech: "React Native, Advanced AI, Real-time Communication",
      year: "2025",
      challenge:
        "Creating something entirely new in a crowded digital landscape while ensuring it serves a genuine human need.",
      solution:
        "Focusing on user-centered design and cutting-edge technology to solve real communication challenges.",
      link: "#",
      gallery: ["hello.png"],
    },
    "e-commerce-platform": {
      title: "E-commerce Platform",
      subtitle: "Next-Generation Shopping Experience",
      category: "E-commerce",
      heroImage: "aiethic.jpg",
      overview:
        "A cutting-edge e-commerce platform built with modern technologies to provide sellers and buyers with an exceptional online shopping experience. Features include AI-powered recommendations and advanced analytics.",
      role: "Lead Developer",
      duration: "8 months",
      tech: "Next.js, Stripe, MongoDB, AWS, Docker",
      year: "2024",
      challenge:
        "Building a scalable platform that can handle high traffic while providing personalized experiences and maintaining security standards.",
      solution:
        "Implemented a microservices architecture with advanced caching strategies, AI-powered personalization, and robust security measures.",
      link: "#",
      gallery: ["hello.png"],
    },
  };

  // Get next project in sequence
  function getNextProject(currentProjectId) {
    const projectKeys = Object.keys(projectData);
    const currentIndex = projectKeys.indexOf(currentProjectId);
    const nextIndex = (currentIndex + 1) % projectKeys.length;
    return projectKeys[nextIndex];
  }

  function showProjectPage(projectId) {
    const project = projectData[projectId];
    if (!project) return;

    // Stop animations
    stopTypingAnimation();

    // Populate fields
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "";
    };

    setText("project-title", project.title);
    setText("project-subtitle", project.subtitle);
    const heroImg = document.getElementById("project-hero-image");
    if (heroImg) {
      heroImg.src = project.heroImage || "";
      heroImg.alt = project.title || "";
    }
    setText("project-overview", project.overview);
    setText("project-role", project.role);
    setText("project-duration", project.duration);
    setText("project-year", project.year);
    setText("project-challenge", project.challenge);
    setText("project-solution", project.solution);
    const metaEl = document.getElementById("project-meta");
    if (metaEl)
      metaEl.textContent = `${project.category || "Web"} / ${
        project.year || ""
      }`;

    // tech tags
    const techContainer = document.getElementById("project-tech-tags");
    if (techContainer) {
      techContainer.innerHTML = "";
      (project.tech || "").split(",").forEach((t) => {
        if (!t) return;
        const span = document.createElement("span");
        span.className =
          "px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full";
        span.textContent = t.trim();
        techContainer.appendChild(span);
      });
    }

    // gallery
    const gallery = document.getElementById("project-gallery");
    if (gallery) {
      gallery.innerHTML = "";
      (project.gallery || []).forEach((img, idx) => {
        const imgEl = document.createElement("img");
        imgEl.src = img;
        imgEl.alt = `${project.title} - ${idx + 1}`;
        imgEl.className =
          "w-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity";
        imgEl.addEventListener("click", () => window.open(img, "_blank"));
        gallery.appendChild(imgEl);
      });
    }

    // link
    const linkEl = document.getElementById("project-link");
    if (linkEl) linkEl.href = project.link || "#";

    // Setup next project
    const nextProjectId = getNextProject(projectId);
    const nextProject = projectData[nextProjectId];
    if (nextProject) {
      setText("next-project-title", nextProject.title);
      setText("next-project-subtitle", nextProject.subtitle);
      
      // Store next project ID for the button click
      const viewNextBtn = document.getElementById("view-next-btn");
      if (viewNextBtn) {
        viewNextBtn.setAttribute("data-next-project", nextProjectId);
      }
    }

    // show project page
    body.style.backgroundColor = "#fff";
    if (header) header.classList.add("hidden");

    pages.forEach((p) => {
      if (p !== projectPage) {
        p.classList.add("hidden");
        p.classList.remove("visible");
      }
    });

    projectPage.classList.remove("hidden");
    projectPage.classList.add("visible");
    projectPage.style.position = "fixed";
    projectPage.style.top = "0";
    projectPage.style.left = "0";
    projectPage.style.right = "0";
    projectPage.style.bottom = "0";
    projectPage.style.zIndex = "1000";
    projectPage.style.overflowY = "auto"; // Ensure scrolling works
    projectPage.style.height = "100vh"; // Ensure full height

    setTimeout(() => projectPage.classList.add("project-page-active"), 50);
    window.scrollTo(0, 0);
  }

  function closeProjectPage() {
    projectPage.classList.remove("project-page-active");
    setTimeout(() => {
      projectPage.style.position = "";
      projectPage.style.top = "";
      projectPage.style.left = "";
      projectPage.style.right = "";
      projectPage.style.bottom = "";
      projectPage.style.zIndex = "";
      projectPage.style.overflowY = "";
      projectPage.style.height = "";
      showPage(homePage);
    }, 300);
  }

  // wire up click handlers
  setTimeout(() => {
    const projectItems = document.querySelectorAll(
      ".project-card, .all-project-card"
    );
    projectItems.forEach((item) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const id = item.getAttribute("data-project");
        if (id) showProjectPage(id);
      });
    });

    const closeBtn = document.getElementById("close-project");
    if (closeBtn)
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeProjectPage();
      });

    // Add click handler for "View Next" button
    const viewNextBtn = document.getElementById("view-next-btn");
    if (viewNextBtn) {
      viewNextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const nextProjectId = viewNextBtn.getAttribute("data-next-project");
        if (nextProjectId) {
          showProjectPage(nextProjectId);
        }
      });
    }
  }, 100);
});
