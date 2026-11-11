/* ============================================
   DASHBOARD.JS — Chess Analytics panel Engine
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    buildBoard();
});

// Toast notification helper
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
    setTimeout(() => {
        toast.style.animation = "toast-out 0.4s ease forwards";
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Switch between dashboard tabs
function switchTab(tabId) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    // Set active link style
    event.target.classList.add("active");

    if (tabId === "sandbox") {
        document.getElementById("sandboxTab").style.display = "block";
        document.getElementById("historyTab").style.display = "none";
    } else if (tabId === "history") {
        document.getElementById("sandboxTab").style.display = "none";
        document.getElementById("historyTab").style.display = "block";
        loadHistory();
    }
}

// Session Validation check
async function checkSession() {
    try {
        const response = await fetch("http://localhost:9099/api/auth/me", {
            credentials: "include"
        });
        if (!response.ok) {
            // Not authenticated, redirect to login
            window.location.href = "login.html";
            return;
        }

        const user = await response.json();
        
        // Update user profile sidebar
        const name = user.fullName || "Chess Challenger";
        document.getElementById("userNameLabel").innerText = name;
        document.getElementById("welcomeTitle").innerText = `Hello, ${name.split(" ")[0]}`;
        document.getElementById("avatarLetter").innerText = name.charAt(0).toUpperCase();
    } catch (err) {
        window.location.href = "login.html";
    }
}

// Build Interactive Chessboard
function buildBoard() {
    const board = document.getElementById("chessBoard");
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let selectedSquare = null;

    board.innerHTML = "";

    const pieceSymbols = {
        'KNIGHT': '♘', 'PAWN': '♙', 'ROOK': '♖',
        'BISHOP': '♗', 'QUEEN': '♕', 'KING': '♔'
    };

    for (let r = 8; r >= 1; r--) {
        for (let f = 0; f < 8; f++) {
            const sq = document.createElement("div");
            const isLight = (r + f) % 2 !== 0;
            const coord = `${files[f]}${r}`;
            sq.className = `dashboard-sq ${isLight ? 'light' : 'dark'}`;
            sq.setAttribute("data-coord", coord);

            // Print coordinate text subtly
            sq.innerHTML = `<span style="font-size:0.55rem; position:absolute; bottom:2px; right:4px; opacity:0.35;">${coord}</span>`;

            sq.addEventListener("click", () => {
                if (!selectedSquare) {
                    selectedSquare = coord;
                    sq.classList.add("selected");
                    document.getElementById("fromSquare").value = coord;
                } else {
                    document.querySelectorAll(".dashboard-sq").forEach(s => s.classList.remove("selected", "valid-move"));
                    sq.classList.add("valid-move");
                    document.getElementById("toSquare").value = coord;
                    selectedSquare = null;
                    testValidation();
                }
            });

            board.appendChild(sq);
        }
    }
}

// Validate Move query call
async function testValidation() {
    const piece = document.getElementById("piece").value;
    const fromSquare = document.getElementById("fromSquare").value.toLowerCase().trim();
    const toSquare = document.getElementById("toSquare").value.toLowerCase().trim();

    if (!fromSquare || !toSquare) {
        showToast("Please specify both From and To coordinate coordinates.", "error");
        return;
    }

    const payload = {
        gameId: "GAME-HIST",
        piece: piece,
        fromSquare: fromSquare,
        toSquare: toSquare,
        currentBoardStateFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    };

    const startTime = performance.now();

    try {
        const response = await fetch("http://localhost:9099/api/chess/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        if (response.status === 401) {
            showToast("Session expired. Please login again.", "error");
            window.location.href = "login.html";
            return;
        }

        const data = await response.json();
        const endTime = performance.now();
        updateDashboardUI(data, Math.round(endTime - startTime));
    } catch (err) {
        showToast("Server connection error during validation.", "error");
    }
}

function updateDashboardUI(data, latencyMs) {
    document.getElementById("latency").innerText = `${latencyMs} ms`;
    document.getElementById("qualityTitle").innerText = data.valid ? "Move Validated" : "Invalid Move";
    document.getElementById("ruleStatus").innerText = data.valid ? "PASSED" : "FAILED";
    document.getElementById("ruleStatus").style.color = data.valid ? "var(--accent-green)" : "var(--accent-red)";

    document.getElementById("evalScore").innerText = data.score;
    document.getElementById("bestMove").innerText = data.best;

    const badge = document.getElementById("badgeTag");
    badge.innerText = data.quality;
    badge.style.background = data.valid ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 82, 82, 0.15)";
    badge.style.color = data.valid ? "var(--accent-green)" : "var(--accent-red)";

    document.getElementById("aiText").innerText = data.aiText;

    // Trigger board pieces visual update (optionally render symbols)
    const fromSq = document.querySelector(`[data-coord='${document.getElementById("fromSquare").value.toLowerCase()}']`);
    const toSq = document.querySelector(`[data-coord='${document.getElementById("toSquare").value.toLowerCase()}']`);
}

// Fetch history records from MySQL
async function loadHistory() {
    const tableBody = document.getElementById("historyTableBody");
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px 0; color: var(--text-muted);">Fetching move logs...</td></tr>`;

    try {
        const response = await fetch("http://localhost:9099/api/chess/history", {
            credentials: "include"
        });
        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const historyList = await response.json();
        if (historyList.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No telemetry logs recorded yet. Run validations to populate.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        historyList.forEach(record => {
            const tr = document.createElement("tr");
            const date = new Date(record.timestamp).toLocaleString();
            tr.innerHTML = `
                <td style="font-weight:600;">${record.piece}</td>
                <td style="font-family:var(--font-mono);">${record.fromSquare} &rarr; ${record.toSquare}</td>
                <td><span class="${record.valid ? 'badge-valid' : 'badge-invalid'}">${record.valid ? 'PASSED' : 'FAILED'}</span></td>
                <td>${record.quality}</td>
                <td style="font-family:var(--font-mono); color:var(--accent-cyan);">${record.score}</td>
                <td style="color:var(--text-muted); font-size:0.8rem;">${date}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--accent-red); padding: 40px 0;">Failed to fetch history logs.</td></tr>`;
    }
}

// Handle Sign Out Action
async function handleLogout() {
    try {
        await fetch("http://localhost:9099/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    } catch (err) {
        window.location.href = "login.html";
    }
}

// Speech recognition voice control
let isListening = false;
function toggleVoiceRecognition() {
    const micBtn = document.getElementById("micBtn");
    const voiceStatus = document.getElementById("voiceStatus");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceStatus.innerText = "Speech API not supported in this browser.";
        return;
    }

    if (isListening) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
        isListening = true;
        micBtn.classList.add("listening");
        micBtn.innerHTML = "🔴 Listening...";
        voiceStatus.innerText = "Speak piece & squares (e.g. 'Knight g1 to f3')";
    };

    rec.onresult = (e) => {
        const text = e.results[0][0].transcript.toLowerCase();
        voiceStatus.innerText = `Heard: "${text}"`;
        parseVoiceInput(text);
    };

    rec.onend = () => {
        isListening = false;
        micBtn.classList.remove("listening");
        micBtn.innerHTML = "🎙️ Start Voice Control";
    };

    rec.start();
}

function parseVoiceInput(text) {
    const pieces = ["knight", "pawn", "rook", "bishop", "queen", "king"];
    let foundPiece = "KNIGHT";
    for (let p of pieces) {
        if (text.includes(p)) {
            foundPiece = p.toUpperCase();
            break;
        }
    }
    document.getElementById("piece").value = foundPiece;

    const squares = text.match(/[a-h][1-8]/g);
    if (squares && squares.length >= 2) {
        document.getElementById("fromSquare").value = squares[0];
        document.getElementById("toSquare").value = squares[1];
        testValidation();
    }
}
