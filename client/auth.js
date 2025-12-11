const API_URL = "/api";

window.addEventListener("DOMContentLoaded", () => {
	// Check if already authenticated
	const token = localStorage.getItem("access_token");
	if (token) {
		redirectToApp();
		return;
	}

	initializeAuthListeners();
});

function initializeAuthListeners() {
	const loginForm = document.getElementById("login");
	const registerForm = document.getElementById("register");
	const showRegisterLink = document.getElementById("show-register");
	const showLoginLink = document.getElementById("show-login");

	loginForm.addEventListener("submit", handleLogin);
	registerForm.addEventListener("submit", handleRegister);
	showRegisterLink.addEventListener("click", showRegisterForm);
	showLoginLink.addEventListener("click", showLoginForm);
}

function showRegisterForm(e) {
	e.preventDefault();
	document.getElementById("login-form").classList.add("hidden");
	document.getElementById("register-form").classList.remove("hidden");
	hideError();
}

function showLoginForm(e) {
	e.preventDefault();
	document.getElementById("register-form").classList.add("hidden");
	document.getElementById("login-form").classList.remove("hidden");
	hideError();
}

async function handleLogin(e) {
	e.preventDefault();
	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;

	try {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Login failed");
		}

		const data = await response.json();
		localStorage.setItem("access_token", data.access_token);
		redirectToApp();
	} catch (error) {
		showError(error.message);
	}
}

async function handleRegister(e) {
	e.preventDefault();
	const email = document.getElementById("register-email").value;
	const password = document.getElementById("register-password").value;

	if (password.length < 6) {
		showError("Password must be at least 6 characters");
		return;
	}

	try {
		const response = await fetch(`${API_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Registration failed");
		}

		const data = await response.json();
		localStorage.setItem("access_token", data.access_token);
		redirectToApp();
	} catch (error) {
		showError(error.message);
	}
}

function showError(message) {
	const errorDiv = document.getElementById("auth-error");
	errorDiv.textContent = message;
	errorDiv.classList.remove("hidden");
}

function hideError() {
	const errorDiv = document.getElementById("auth-error");
	errorDiv.classList.add("hidden");
}

function redirectToApp() {
	const redirectPath = sessionStorage.getItem("redirect_after_auth") || "/";
	sessionStorage.removeItem("redirect_after_auth");
	window.location.href = redirectPath;
}
