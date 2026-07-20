// Typing effect
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

// Active nav link
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

// -----------------------------------------------------------
// 🔥 NEW: Intercept form submission, send via fetch, show alert
// -----------------------------------------------------------
const form = document.querySelector("form");
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevents page reload

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(data).toString()
            });

            const text = await response.text(); // Get the HTML response from server

            // Show the response as an alert
            alert(text); // This will show the "Thank You" or error message

            // Optionally reset the form after successful submission
            if (response.ok) {
                form.reset();
            }
        } catch (err) {
            alert("Network error – please try again.");
        }
    });
}
// -----------------------------------------------------------

// Project card hover effects
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

// Skill bar animation
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

// Navbar background on scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.background = "#000";
    } else {
        navbar.style.background = "#222";
    }
});
