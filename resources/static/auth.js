/* ============================================
   AUTH.JS — Login & Registration Actions
   ============================================ */

const API_BASE = "http://localhost:9099/api/auth";

// Show toast messages
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === "success" ? "✓" : type === "error" ? "✗" : "ℹ"}</span>
        <div>${message}</div>
    `;

    container.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = "toast-out 0.4s ease forwards";
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

// Handle Login Submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Login successful! Redirecting...", "success");
            // Save username to local storage for quick welcome display
            localStorage.setItem("userName", data.fullName || "User");
            localStorage.setItem("userEmail", data.email || "");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showToast(data.message || "Invalid credentials. Please try again.", "error");
        }
    } catch (err) {
        showToast("Server connection failed. Make sure Spring Boot is running.", "error");
    }
}

// Handle Signup Submission
async function handleSignup(event) {
    event.preventDefault();
    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Account created successfully! Redirecting to sign in...", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            showToast(data.message || "Registration failed.", "error");
        }
    } catch (err) {
        showToast("Server connection failed. Make sure Spring Boot is running.", "error");
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const eyeIcon = btn.querySelector('.eye-icon');
    const eyeSlashIcon = btn.querySelector('.eye-slash-icon');

    if (input.type === "password") {
        input.type = "text";
        if (eyeIcon) eyeIcon.style.display = "none";
        if (eyeSlashIcon) eyeSlashIcon.style.display = "block";
    } else {
        input.type = "password";
        if (eyeIcon) eyeIcon.style.display = "block";
        if (eyeSlashIcon) eyeSlashIcon.style.display = "none";
    }
}
