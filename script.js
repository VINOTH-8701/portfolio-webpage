const words = [
    "Frontend Developer",
    "Web Designer",
    "Java Programmer",
    "UI/UX Designer"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingText = document.getElementById("typing");

function typeEffect() {

    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex--);
    } else {
        typingText.textContent = currentWord.substring(0, charIndex++);
    }

    let speed = 150;

    if (!isDeleting && charIndex === currentWord.length + 1) {
        speed = 1500;
        isDeleting = true;
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;

        if (wordIndex === words.length) {
            wordIndex = 0;
        }
    }

    setTimeout(typeEffect, isDeleting ? 80 : speed);
}

typeEffect();

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("Thank you! Your message has been sent.");

        form.reset();
    });
}

const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
        card.style.transition = "0.3s";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
    });

});

const skillBars = document.querySelectorAll(".progress-bar");

window.addEventListener("load", () => {

    skillBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {
            bar.style.width = width;
            bar.style.transition = "2s";
        }, 300);

    });

});

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.background = "#000";
    } else {
        navbar.style.background = "#222";
    }

});