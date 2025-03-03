import type { fi } from "./fi";

export const de: typeof fi = {
	localeName: "Deutsch",

	/** Welcome message */
	welcome:
		'Willkommen! Kalkki ist <a href="https://github.com/raikasdev/kalkki">Open Source</a>.',
	welcomeStart:
		"Beginnen Sie, indem Sie in das Feld unten einen Ausdruck schreiben.",
	welcomePwaPrompt:
		'<span id="pwa-install-prompt" hidden>Für die beste Erfahrung auf dem Desktop, <a href="#" onclick="installPWA()">Installieren Sie Kalkki als PWA-Anwendung</a>.',
	/** Options */
	options: "Optionen",
	optionsSelected: "(ausgewählt)",
	optionsAngleUnit: "Winkeleinheit",
	optionsAngleUnitDeg: "Grad",
	optionsAngleUnitRad: "Radian",
	optionsLanguage: "Sprache",
	optionsPrecision: "Ergebnispräzision",
	optionsPrecisionNumber: "Ziffern",
	optionsPreserveSession: "Sitzung beibehalten",
	optionsFullScreen: "Vollbildmodus",
	optionsYes: "Ja",
	optionsNo: "Nein",
	optionsTheme: "Thema",

	/** Help menu */
	help: "Hilfe",
	helpSendFeedback: "Feedback geben",
	helpInfo: "Über Kalkki",
	helpCopyrights: "Lizenzen",
	helpReset: "Daten zurücksetzen",
	helpResetAreYouSure: "Bist du dir sicher? (Warte %ss)",
	helpResetConfirm: "Zurücksetzen aller Benutzerdaten bestätigen",
	/** Updater */
	updateAvailable: "Neue Version verfügbar",
	updateAvailableDescription:
		"Sie benutzen eine veraltete Version von Kalkki. Bitte aktualisiere die App, indem Sie auf den Knopf darunter drücken.",
	updateAvailableButton: "Aktualisiere",
	/** Misc / ARIA */
	ariaMathInput: "Gebe ein mathematischen Ausdruck ein",
	feedbackLink:
		"https://docs.google.com/forms/d/e/1FAIpQLSd2_St9--RZk8zn2Q6JSoJw4G-_SUTskqr18XdiBHYL1gXohg/viewform",

	/** About page */
	aboutVersion: "Version",
	aboutFromStudents:
		"Taschenrechner App von Studenten, für Studenten gemacht. Kalkki wurde von Roni Äikäs entwickelt, als er im Gymnasium war.",
	aboutThanks: "Besonderer Dank",
	aboutThanksTsry: "Testausserveri ry und andere software tester",
	aboutThanksYTL:
		"Abiturprüfungsausschuss von Finnland für die Entwicklung der Mathematik-Engine in Abicus",
	aboutLicense: "Lizenz",
	aboutLicenseGPL:
		"Dieses Programm ist Open Source, unter der AGPLv3-Lizenz lizenziert und wird ohne jegliche Gewährleistung bereitgestellt.",

	/** Copyright page */
	copyrightOSS: "Open-Source-Lizenzen",
	copyrightKalkki:
		"Kalkki ist Open Source und Sie haben das Recht, es gemäß der folgenden Lizenz zu verwenden, zu ändern und zu verteilen:",
	copyrightKalkkiUses: "Von Kalkki verwendete Tools und Bibliotheken:",
	copyrightLicense: "Lizenz",
	copyrightAuthor: "Autor:",
	copyrightAuthorDefault: "Entwickler von '%s'",
	copyrightFullLicense:
		'Die vollständigen Lizenzen der genannten Pakete finden Sie <a href="/third-party-licenses.txt">hier</a>.',

	/** Errors */
	errorUnknownSymbol: "unbekannter Symbol bei %s",
	errorInfinity: "zu groß oder unendliche Eingabe",
	errorInvalidArgCount:
		"Funktion hat eine ungültige Anzahl an Argumenten erhalten",
	errorNaN: "Die Antwort ist keine Zahl",
	errorNoLhsBracket: "linke Halterung fehlt",
	errorNoRhsBracket: "rechte Halterung fehlt",
	errorTrigPrecision: "trigonometrischer Präzisionsfehler",
	errorUnexpectedEOF: "unerwartetes Ende der Eingabe",
	errorUnexpectedToken: "unerwartetes Token",
	errorPrecisionOverflow: "Die Zahl ist zu groß zum Berechnen",
	errorTimeout: "Fehler: Zeitüberschreitung beim Vorgang",
	errorUnknownName: "%s: unbekannte Variable oder Funktion",
	errorReservedName: "%s ist ein reservierter Name",
	errorRecursion: "Endlosschleife",
	errorUnknown: "unbekannter Fehler",
};
