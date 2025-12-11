const API_URL = "/api";
let currentRoom = null;
let canvas = null;
let ctx = null;
let isDrawing = false;

window.addEventListener("DOMContentLoaded", async () => {
	currentRoom = getCurrentRoom();
	const roomData = await getOrCreateRoom(currentRoom);
	console.log({ roomData });

	initializeCanvas();
	initializeEventListeners();

	// Update room name in header
	document.getElementById("current-room-name").textContent = currentRoom;
});

function initializeEventListeners() {
	// Canvas controls
	document.getElementById("leave-room-btn").addEventListener("click", () => {
		window.location.href = "/";
	});
	document.getElementById("clear-canvas-btn").addEventListener("click", clearCanvas);

	// Canvas drawing
	const canvasElement = document.getElementById("drawing-canvas");
	canvasElement.addEventListener("mousedown", startDrawing);
	canvasElement.addEventListener("mousemove", draw);
	canvasElement.addEventListener("mouseup", stopDrawing);
	canvasElement.addEventListener("mouseout", stopDrawing);

	// Touch support for mobile
	canvasElement.addEventListener("touchstart", handleTouchStart);
	canvasElement.addEventListener("touchmove", handleTouchMove);
	canvasElement.addEventListener("touchend", stopDrawing);
}

function getCurrentRoom() {
	const path = window.location.pathname;

	if (path === "/" || path === "") {
		return "_index";
	}

	// Remove leading slash and split on first slash only
	const pathWithoutLeadingSlash = path.substring(1);
	const firstSlashIndex = pathWithoutLeadingSlash.indexOf("/");

	if (firstSlashIndex === -1) {
		// No additional slashes, entire path is the room slug
		return pathWithoutLeadingSlash;
	}

	// Return everything up to the first slash as the room slug
	return pathWithoutLeadingSlash.substring(0, firstSlashIndex);
}

async function getOrCreateRoom(slug) {
	const response = await fetch(`${API_URL}/rooms/${slug}`);
	return response.json();
}

function initializeCanvas() {
	canvas = document.getElementById("drawing-canvas");
	ctx = canvas.getContext("2d");

	canvas.width = 4096;
	canvas.height = 4096;

	ctx.lineCap = "round";
	ctx.lineJoin = "round";

	clearCanvas();
}

function startDrawing(e) {
	isDrawing = true;
	const rect = canvas.getBoundingClientRect();
	const x = (e.clientX - rect.left) * (canvas.width / rect.width);
	const y = (e.clientY - rect.top) * (canvas.height / rect.height);

	ctx.beginPath();
	ctx.moveTo(x, y);
}

function draw(e) {
	if (!isDrawing) return;

	const rect = canvas.getBoundingClientRect();
	const x = (e.clientX - rect.left) * (canvas.width / rect.width);
	const y = (e.clientY - rect.top) * (canvas.height / rect.height);

	const color = document.getElementById("color-picker").value;
	const brushSize = document.getElementById("brush-size").value;

	ctx.strokeStyle = color;
	ctx.lineWidth = brushSize;

	ctx.lineTo(x, y);
	ctx.stroke();
}

function stopDrawing() {
	if (isDrawing) {
		isDrawing = false;
		ctx.beginPath();
	}
}

function clearCanvas() {
	if (!ctx || !canvas) return;
	ctx.fillStyle = "#0f1116";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleTouchStart(e) {
	e.preventDefault();
	const touch = e.touches[0];
	const mouseEvent = new MouseEvent("mousedown", {
		clientX: touch.clientX,
		clientY: touch.clientY,
	});
	canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
	e.preventDefault();
	const touch = e.touches[0];
	const mouseEvent = new MouseEvent("mousemove", {
		clientX: touch.clientX,
		clientY: touch.clientY,
	});
	canvas.dispatchEvent(mouseEvent);
}
