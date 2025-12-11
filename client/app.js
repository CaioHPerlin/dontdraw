const API_URL = "/api";
let currentRoom = null;

window.addEventListener("DOMContentLoaded", async () => {
	currentRoom = getCurrentRoom();
	const roomData = await getOrCreateRoom(currentRoom);
	console.log({ roomData });
});

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
