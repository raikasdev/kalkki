import Logo from "@/components/Logo";
import { type Language, translate } from "@/lang";
import { CircleX } from "lucide-react";

export default function AboutPage({
	visible,
	setVisible,
	language,
}: { language: Language; visible: boolean; setVisible: (v: boolean) => void }) {
	return (
		<div
			className={`page-overlay about-page${visible ? " visible" : ""}`}
			{...(!visible ? { "aria-hidden": true } : {})}
		>
			<button type="button" className="close" onClick={() => setVisible(false)}>
				<CircleX size={48} />
			</button>
			<div className="content">
				<div className="logo-container">
					<Logo height="196" width="196" />
				</div>
				<h1>Kalkki</h1>
				<p>
					{translate("aboutVersion", language)}{" "}
					{import.meta.env.VITE_APP_VERSION} (Git{" "}
					{import.meta.env.VITE_GIT_COMMIT})
				</p>
				<div class="main-content">
					<p>{translate("aboutFromStudents", language)}</p>
					<p
						/* biome-ignore lint/security/noDangerouslySetInnerHtml: Locale */
						dangerouslySetInnerHTML={{
							__html: translate("aboutOpenSource", language),
						}}
					/>
					<h2>{translate("aboutThanks", language)}</h2>
					<p>{translate("aboutThanksTsry", language)}</p>
					<p>{translate("aboutThanksYTL", language)}</p>

					<h2>{translate("aboutLicense", language)}</h2>
					<p>{translate("aboutLicenseGPL", language)}</p>
					<code>
						Copyright (C) 2025 Roni Äikäs{" "}
						<a href="https://raikas.dev">(https://raikas.dev)</a>
					</code>
				</div>
			</div>
		</div>
	);
}
