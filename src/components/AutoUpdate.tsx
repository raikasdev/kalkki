import { type Language, translate } from "@/lang";
import { useCallback, useEffect, useState } from "preact/hooks";

const GIT_HASH = import.meta.env.VITE_GIT_COMMIT;

/**
 * The web app might be cached, so users don't get the latest version
 */
export function AutoUpdate({ language }: { language: Language }) {
	const [updated, setUpdated] = useState(false);
	useEffect(() => {
		let fetchLoop: Timer | null = null;
		async function fetchVersion() {
			try {
				const res = await fetch("/manifest.json", {
					cache: "no-store",
				});
				const json = await res.json();
				if (!json.gitHash || json.gitHash.length !== 7) return; // Invalid hash/response
				if (json.gitHash === GIT_HASH) return;

				// It's updated
				setUpdated(true);
				if (fetchLoop) clearInterval(fetchLoop);
			} catch (e) {
				// Likely development environment
			}
		}
		fetchVersion();
		fetchLoop = setInterval(fetchVersion, 5 * 60 * 1000); // Some may keep the tab open for long time periods...
	}, []);

	const update = useCallback(() => {
		if ("caches" in window) {
			caches.keys().then((names) => {
				for (const name of names) {
					caches.delete(name);
				}
			});
		}
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				for (const registration of registrations) {
					registration.update();
				}
			});
		}
		window.location.reload();
	}, []);

	return updated ? (
		<div className="auto-update-toast">
			<div className="auto-update-toast-container">
				<h2 className="auto-update-toast-title">
					{translate("updateAvailable", language)}
				</h2>
				<p className="auto-update-toast-message">
					{translate("updateAvailableDescription", language)}
				</p>
				<div className="auto-update-toast-actions">
					<button
						type="button"
						onClick={update}
						className="auto-update-toast-button"
					>
						{translate("updateAvailableButton", language)}
					</button>
				</div>
			</div>
		</div>
	) : null;
}
