import Logo from "@/components/Logo";
import { type Language, translate } from "@/lang";
import licenses from "@/util/licenses.json";
import { CircleX } from "lucide-react";

export default function CopyrightPage({
	language,
	visible,
	setVisible,
}: { language: Language; visible: boolean; setVisible: (v: boolean) => void }) {
	return (
		<div
			className={`page-overlay copyright-page${visible ? " visible" : ""}`}
			{...(!visible ? { "aria-hidden": true } : {})}
		>
			<button type="button" className="close" onClick={() => setVisible(false)}>
				<CircleX size={48} />
			</button>
			<div className="content">
				<div className="logo-container">
					<Logo height="196" width="196" />
				</div>
				<h2>{translate("copyrightOSS", language)}</h2>
				<div class="main-content">
					<p>{translate("copyrightKalkki", language)}</p>
					<code>
						Kalkki — scientific calculator for the web
						<br />
						Copyright (C) 2025 Roni Äikäs{" "}
						<a href="https://raikas.dev">(https://raikas.dev)</a>
						<br />
						<br />
						This program is free software: you can redistribute it and/or modify
						it under the terms of the GNU Affero General Public License as
						published by the Free Software Foundation, either version 3 of the
						License, or (at your option) any later version.
						<br />
						<br />
						This program is distributed in the hope that it will be useful, but
						WITHOUT ANY WARRANTY; without even the implied warranty of
						MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
						Affero General Public License for more details.
						<br />
						<br />
						You should have received a copy of the GNU Affero General Public
						License along with this program. If not, see{" "}
						<a href="https://www.gnu.org/licenses/" rel="nofollow">
							{"<https://www.gnu.org/licenses/>"}
						</a>
						.
					</code>
					<p>{translate("copyrightKalkkiUses", language)}</p>
					<ul>
						{licenses.map((dep) => (
							<li key={dep.name}>
								<h3>{dep.name}</h3>
								<p>
									{translate("copyrightLicense", language)} {dep.licenseType}
								</p>
								<p>
									{translate("copyrightAuthor", language)}{" "}
									{dep.author === "n/a"
										? translate("copyrightAuthorDefault", language).replace(
												"%s",
												dep.name,
											)
										: dep.author}
								</p>
								<p>
									<a
										href={(dep.link.startsWith("git+")
											? dep.link.substring(4)
											: dep.link
										).replace("ssh://git@github.com", "https://github.com")}
										rel="nofollow"
									>
										{dep.link}
									</a>
								</p>
							</li>
						))}
					</ul>
					<p
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Localisation
						dangerouslySetInnerHTML={{
							__html: translate("copyrightFullLicense", language),
						}}
					/>
				</div>
			</div>
		</div>
	);
}
