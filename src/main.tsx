import { render } from "preact";
import "./styles/index.css";
import { App } from "./App.tsx";

const fullScreen =
	import.meta.env.VITE_DESKTOP_BUILD === "true" ||
	window.matchMedia("(display-mode: standalone)").matches ||
	JSON.parse(localStorage.getItem("kalkki-options") ?? "{}")?.fullScreen ===
		true;

if (!fullScreen) {
	document.body.classList.add("limit-size");
}
// biome-ignore lint/style/noNonNullAssertion: React
render(<App />, document.getElementById("app")!);

// Show tauri window after render
if ("__TAURI__" in window) {
	const tauri = window.__TAURI__ as {
		core: { invoke: (func: string) => void };
	};
	tauri.core.invoke("show_kalkki_window");
}
