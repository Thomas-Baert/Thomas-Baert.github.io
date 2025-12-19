document.addEventListener('DOMContentLoaded', () => {
    initHackerTyper();
    initLightbox();
    initProjectSummaryModal();
    initScrollReveal();
    initBurgerMenu();
    initWindowActions();
    initCVModal();

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

    // Keep track of any temporary object URLs we create for SVG diagrams
    let currentObjectURL = null;

    images.forEach(img => {
        // For regular images (img elements), src is available
        if (img.tagName && img.tagName.toLowerCase() === 'img') {
            img.onclick = function () {
                modal.style.display = "flex";
                modalImg.src = this.src;
                captionText.innerHTML = this.alt || this.getAttribute('data-caption') || '';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        }
    });

    // Also support Mermaid diagrams: mermaid renders an <svg> inside the mermaid container.
    const mermaidWrappers = document.querySelectorAll('.mermaid-wrapper');
    mermaidWrappers.forEach(wrapper => {
        wrapper.style.cursor = 'zoom-in';
        wrapper.addEventListener('click', () => {
            const svg = wrapper.querySelector('svg');
            if (!svg) return; // not rendered yet

            // Serialize SVG to a Blob and create an object URL so we can set it on the <img>
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svg);

            // Ensure xmlns attribute is present
            if (!svgString.includes('xmlns=')) {
                svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
            }

            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            if (currentObjectURL) URL.revokeObjectURL(currentObjectURL);
            currentObjectURL = URL.createObjectURL(blob);

            modal.style.display = "flex";
            modalImg.src = currentObjectURL;
            captionText.innerHTML = wrapper.parentElement.querySelector('.img-caption')?.textContent || '';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
        if (currentObjectURL) {
            URL.revokeObjectURL(currentObjectURL);
            currentObjectURL = null;
        }
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

function initBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger) return;

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('active');
        burger.classList.toggle('active');

        // Toggle scroll
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

function initWindowActions() {
    const cards = document.querySelectorAll('.card');
    const taskbar = document.getElementById('taskbar');
    if (!taskbar) return;

    const updateTaskbarVisibility = () => {
        if (taskbar.children.length > 0) {
            taskbar.style.display = 'flex';
            // Check for overflow to adjust alignment
            if (taskbar.scrollWidth > taskbar.clientWidth) {
                taskbar.style.justifyContent = 'flex-start';
            } else {
                taskbar.style.justifyContent = 'center';
            }
        } else {
            taskbar.style.display = 'none';
        }
    };

    cards.forEach((card, index) => {
        const closeBtn = card.querySelector('.window-btn.close');
        const minimizeBtn = card.querySelector('.window-btn.minimize');
        const projectTitle = card.querySelector('h3')?.textContent || `Projet ${index + 1}`;

        // Unique ID for restoration
        const cardId = `card-${index}`;
        card.setAttribute('id', cardId);

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                card.classList.add('closing');
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('closing');
                }, 400);
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                card.classList.add('minimizing');
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.remove('minimizing');

                    // Create taskbar tab
                    const tab = document.createElement('div');
                    tab.className = 'taskbar-tab';
                    tab.innerHTML = `<span><i class="fas fa-window-maximize"></i> ${projectTitle}</span>`;
                    tab.dataset.target = cardId;

                    tab.onclick = () => {
                        card.style.display = 'flex';
                        card.classList.add('restoring');
                        tab.remove();
                        updateTaskbarVisibility();

                        setTimeout(() => {
                            card.classList.remove('restoring');
                        }, 400);
                    };

                    taskbar.appendChild(tab);
                    updateTaskbarVisibility();
                }, 400);
            });
        }
    });

    window.addEventListener('resize', updateTaskbarVisibility);
}

function initCVModal() {
    const openBtn = document.getElementById('openCV');
    const modal = document.getElementById('cvModal');
    const closeBtn = document.querySelector('.cv-close');
    let cvRendered = false;

    if (!openBtn || !modal || !closeBtn) return;

    const renderCV = () => {
        if (cvRendered) return;

        const url = 'ressources/pdf/CV-Thomas BAERT.pdf';
        const container = document.getElementById('cv-viewer');
        if (!container) return;

        pdfjsLib.getDocument(url).promise.then(pdf => {
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    // Render at high quality, let CSS handle the width
                    const isMobile = window.innerWidth < 768;
                    const scale = isMobile ? 1.5 : 1.5;
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement('canvas');
                    canvas.className = 'cv-page';
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Allow native size for scrolling
                    canvas.style.height = 'auto';

                    // Add page canvas to container
                    container.appendChild(canvas);

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            }
            cvRendered = true;
        }).catch(err => {
            console.error('Error rendering CV:', err);
            container.innerHTML = '<p style="color:var(--amber); margin-top:50px;">Impossible de charger l\'aperçu. Veuillez télécharger le PDF.</p>';
            cvRendered = false; // Retry next time
        });
    };

    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderCV();
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}
