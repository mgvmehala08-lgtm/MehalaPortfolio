"use strict";

document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const navigationLinks = document.querySelectorAll(".nav-links a");
const pageSections = document.querySelectorAll("main section[id]");
const backToTop = document.querySelector(".back-to-top");

function closeNavigation() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
        navigation.classList.toggle("is-open", !isExpanded);
    });

    navigationLinks.forEach((link) => link.addEventListener("click", closeNavigation));

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 960) closeNavigation();
    });
}

let scrollUpdatePending = false;

function updateScrollUI() {
    const activeLine = window.scrollY + 150;
    let activeSection = "home";

    pageSections.forEach((section) => {
        if (section.offsetTop <= activeLine) activeSection = section.id;
    });

    navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeSection}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });

    if (backToTop) backToTop.hidden = window.scrollY < 480;
    scrollUpdatePending = false;
}

window.addEventListener("scroll", () => {
    if (!scrollUpdatePending) {
        window.requestAnimationFrame(updateScrollUI);
        scrollUpdatePending = true;
    }
}, { passive: true });

window.addEventListener("load", updateScrollUI);
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion.matches ? "auto" : "smooth"
        });
    });
}

const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const typingText = document.querySelector(".typing-text");
if (typingText && !reducedMotion.matches) {
    const roles = (typingText.dataset.roles || "").split("|").filter(Boolean);

    if (roles.length > 1) {
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let deleting = true;

        function typeNextCharacter() {
            const currentRole = roles[roleIndex];
            typingText.textContent = currentRole.slice(0, characterIndex);

            if (!deleting && characterIndex === currentRole.length) {
                deleting = true;
                window.setTimeout(typeNextCharacter, 1500);
                return;
            }

            if (deleting && characterIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            } else {
                characterIndex += deleting ? -1 : 1;
            }

            window.setTimeout(typeNextCharacter, deleting ? 48 : 82);
        }

        window.setTimeout(typeNextCharacter, 1600);
    }
}

const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .skill-card, .experience-card, .project-card, .education-card, .certificate-card, .additional-training, .contact-card"
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    if (element.matches(".skill-card, .certificate-card, .contact-card")) {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    }
});

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
}
