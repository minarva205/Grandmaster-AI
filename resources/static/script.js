/* ============================================
   SCRIPT.JS — Landing Page Counter Animations
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Run stats animation on landing load
    animateValue("movesCount", 0, 12500, 2000, "+");
    animateValue("usersCount", 0, 3400, 2000, "+");
    animateValue("latencyCount", 20, 8, 1500, "ms");
});

function animateValue(id, start, end, duration, suffix = "") {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        let value = 0;
        if (start < end) {
            value = Math.floor(progress * (end - start) + start);
        } else {
            value = Math.floor(start - progress * (start - end));
        }

        // Format commas for large numbers
        obj.innerHTML = value.toLocaleString() + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}