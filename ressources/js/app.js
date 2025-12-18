document.addEventListener('DOMContentLoaded', () => {
    initHackerTyper();
    initLightbox();
    initProjectSummaryModal();
    initScrollReveal();

    // Console Easter Egg
    console.log("%c SYSTEM ONLINE ", "background: #5ec9a5; color: #1a1a1a; font-weight: bold; padding: 4px; border: 2px solid #e6e1cf;");
});


function initHackerTyper() {
    const glitchElement = document.querySelector('.glitch-text');
    if (!glitchElement) return;

    const originalText = glitchElement.getAttribute('data-text') || glitchElement.textContent;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@#$<>?&";

    let iterations = 0;
    const duration = 1200; // Targeted duration in ms
    const intervalTime = 30; // ms between frames
    const step = originalText.length / (duration / intervalTime);

    const interval = setInterval(() => {
        glitchElement.textContent = originalText
            .split("")
            .map((letter, index) => {
                if (/\s/.test(letter)) return letter;
                if (index < iterations) return originalText[index];
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= originalText.length) clearInterval(interval);
        iterations += step;
    }, intervalTime);
}

function initLightbox() {
    const images = document.querySelectorAll('.project-img');
    const modal = document.getElementById('imageModal');
    if (!modal) return;

    const modalImg = document.getElementById('modalImg');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');

    images.forEach(img => {
        // Don't add lightbox to images inside crop containers if you want, 
        // but here we allow all for best visibility.
        img.onclick = function () {
            modal.style.display = "flex";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeModal();
    });
}

function initProjectSummaryModal() {
    const maximizeButtons = document.querySelectorAll('.card .window-btn.maximize');
    const modal = document.getElementById('summaryModal');
    if (!modal) return;

    const modalImg = document.getElementById('summaryImage');
    const modalTitle = document.getElementById('summaryTitle');
    const modalDesc = document.getElementById('summaryDescription');
    const modalLink = document.getElementById('summaryLink');
    const closeBtn = document.querySelector('.summary-close');

    maximizeButtons.forEach(btn => {
        btn.onclick = function (e) {
            e.stopPropagation(); // Prevent card click if any
            const card = this.closest('.card');
            if (!card) return;

            // Extract data
            const title = card.querySelector('h3')?.textContent || "Projet";
            const desc = card.getAttribute('data-summary') || card.querySelector('p')?.textContent || "";
            const theme = card.getAttribute('data-theme');
            const img = card.querySelector('.card-decor-img')?.src || "";
            const link = card.querySelector('.card-content .btn')?.href || "#";

            // Populate modal
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalImg.src = img;
            modalLink.href = link;

            // Apply Theme
            const container = modal.querySelector('.summary-container');
            container.className = 'summary-container'; // Reset
            if (theme) {
                container.classList.add('theme-' + theme);
            }

            // Show modal
            modal.style.display = "flex";
            document.body.style.overflow = 'hidden';

            // Scroll to top of content
            const content = modal.querySelector('.summary-content');
            if (content) content.scrollTop = 0;
        }
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
        // Cleanup theme on close
        const container = modal.querySelector('.summary-container');
        if (container) container.className = 'summary-container';
    };

    if (closeBtn) closeBtn.onclick = closeModal;

    // Close on click outside container
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeModal();
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}
