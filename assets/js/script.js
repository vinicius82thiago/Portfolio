const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".navbar nav");
const navLinks = document.querySelectorAll(".navbar nav a");

menuButton.addEventListener("click", () => {
    nav.classList.toggle("active");
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

const animatedElements = document.querySelectorAll(
    ".project-card, .about-content, .contact-box"
);

const observer = new IntersectionObserver(
    entries => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             entry.target.classList.add("show");
        }
        });
    },
    {
        threshold: 0.15
    }
);

animatedElements.forEach(element => {
    observer.observe(element);
});

const carousel = document.querySelector(".projects-grid");
const wrapper = document.querySelector(".projects-wrapper");
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");

const originalCards = [...carousel.querySelectorAll(".project-card")];





// Duplica os projetos para criar o loop contínuo
originalCards.forEach(card => {
    carousel.appendChild(card.cloneNode(true));
});

let position = 0;
let speed = 0.7;
let isPaused = false;

function getCardWidth() {
    const card = carousel.querySelector(".project-card");
    const gap = parseFloat(getComputedStyle(carousel).gap);

    return card.offsetWidth + gap;
}

function getOriginalWidth() {
    return getCardWidth() * originalCards.length;
}

function updatePosition() {
    carousel.style.transform = `translate3d(-${position}px, 0, 0)`;
}

function animate() {
    if (!isPaused) {
        position += speed;

        const originalWidth = getOriginalWidth();

        // Esse é pra manter o movimento contínuo
        if (position >= originalWidth) {
            position -= originalWidth;
        }

        updatePosition();
    }

    requestAnimationFrame(animate);
}

prevButton.addEventListener("click", () => {
    position -= getCardWidth();

    if (position < 0) {
        position += getOriginalWidth();
    }

    updatePosition();
});

nextButton.addEventListener("click", () => {
    position += getCardWidth();

    if (position >= getOriginalWidth()) {
        position -= getOriginalWidth();
    }

    updatePosition();
});

wrapper.addEventListener("mouseenter", () => {
    isPaused = true;
});

wrapper.addEventListener("mouseleave", () => {
    isPaused = false;
});

window.addEventListener("resize", () => {
    updatePosition();
});

animate();
