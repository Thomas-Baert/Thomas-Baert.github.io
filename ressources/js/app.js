document.addEventListener('DOMContentLoaded', () => {
    const glitchElement = document.querySelector('.glitch-text');
    if (!glitchElement) return;

    const originalText = glitchElement.getAttribute('data-text') || glitchElement.textContent;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@#$<>?&";

    // Hacker typer effect on load - preserving spaces
    let iterations = 0;
    const interval = setInterval(() => {
        glitchElement.textContent = originalText
            .split("")
            .map((letter, index) => {
                // If it's a space, always return space
                if (letter === " ") {
                    return " ";
                }

                // If we've revealed this character, show it
                if (index < iterations) {
                    return originalText[index];
                }

                // Otherwise show random character
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1 / 3;
    }, 40);

    // Console Easter Egg
    console.log("%c SYSTEM ONLINE ", "background: #fabd2f; color: #1d2021; font-weight: bold; padding: 4px; border: 2px solid #ebdbb2;");
});
