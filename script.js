const users = {};

function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.innerText = "Fill all fields";
        return;
    }

    if (users[username]) {
        message.innerText = "User already exists";
        return;
    }

    users[username] = password;
    message.innerText = "Registered successfully";
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (users[username] !== password) {
        message.innerText = "Invalid credentials";
        return;
    }

    localStorage.setItem("currentUser", username);
    window.location.href = "home.html";
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.querySelector(".toggle-theme");
    if (!btn) return;

    const isDark = document.body.classList.contains("dark");
    btn.innerText = isDark ? "Light Mode" : "Dark Mode";
}

(function loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
    }
    updateThemeButton();
})();
