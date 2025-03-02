import { type Language, translate } from "@/lang";
import { TriangleAlert } from "lucide-react";
import { useCallback, useState } from "preact/hooks";

export default function SelfDestructButton({
	language,
}: { language: Language }) {
	const [confirm, setConfirm] = useState<number>(-1);

	const destruct = useCallback(() => {
		if (confirm === -1) {
			let confirm = 25;
			setConfirm(confirm);
			const interval = setInterval(() => {
				confirm -= 1;
				setConfirm(confirm);

				if (confirm <= 0) {
					clearInterval(interval);
					setTimeout(() => {
						if (confirm === 0) setConfirm(-1); // Cancel
					}, 5000);
				}
			}, 100);
			return;
		}
		if (confirm !== 0) return;
		localStorage.removeItem("kalkki-options");
		localStorage.removeItem("kalkki-history");

		window.location.reload();
	}, [confirm]);

	return (
		<li>
			<button
				type="button"
				className="destructive"
				onClick={destruct}
				style={{ width: confirm !== -1 ? "300px" : null }}
			>
				<TriangleAlert size={"1.25rem"} />{" "}
				{confirm === -1
					? translate("helpReset", language)
					: confirm !== 0
						? translate("helpResetAreYouSure", language).replace(
								"%s",
								(confirm / 10).toFixed(1),
							)
						: translate("helpResetConfirm", language)}
			</button>
		</li>
	);
}
