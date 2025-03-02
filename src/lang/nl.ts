import type { fi } from "./fi";

export const nl: typeof fi = {
	localeName: "Nederlands",

	/** Welcome message */
	welcome:
		'Welkom! Kalkki is <a href="https://github.com/raikasdev/kalkki">open source</a>.',
	welcomeStart:
		"Begin met het schrijven van een uitdrukking in het veld hieronder.",
	welcomePwaPrompt:
		'<span id="pwa-install-prompt" hidden>Voor de beste ervaring op desktop <a href="#" onclick="installPWA()">installeert u kalkki als een PWA-toepassing</a>.',
	/** Options */
	options: "Opties",
	optionsSelected: "(geselecteerd)",
	optionsAngleUnit: "Hoekeenheid",
	optionsAngleUnitDeg: "Graad",
	optionsAngleUnitRad: "Radiaal",
	optionsLanguage: "Taal",
	optionsPrecision: "Resultaat nauwkeurigheid",
	optionsPrecisionNumber: "cijfers",
	optionsPreserveSession: "Sessie bewaren",
	optionsFullScreen: "Volledige schermmodus",
	optionsYes: "Ja",
	optionsNo: "Nee",
	/** Help menu */
	help: "Help",
	helpSendFeedback: "Feedback geven",
	helpInfo: "Over Kalkki",
	helpCopyrights: "Licenties",
	helpReset: "Gegevens resetten",
	helpResetAreYouSure: "Weet je het zeker? (Wacht %ss)",
	helpResetConfirm: "Bevestig reset van alle gebruikersgegevens",
	/** Updater */
	updateAvailable: "Nieuwe versie beschikbaar",
	updateAvailableDescription:
		"U gebruikt een verouderde versie van Kalkki. Update de app bij door op de onderstaande knop te drukken.",
	updateAvailableButton: "Update",
	/** Misc / ARIA */
	ariaMathInput: "Wiskundige uitdrukking invoeren",
	feedbackLink:
		"https://docs.google.com/forms/d/e/1FAIpQLSd2_St9--RZk8zn2Q6JSoJw4G-_SUTskqr18XdiBHYL1gXohg/viewform",

	/** About page */
	aboutVersion: "Versie",
	aboutFromStudents:
		"Rekenmachine-app gemaakt door studenten voor studenten. Kalkki is gemaakt door Roni Äikäs toen hij op de middelbare school zat.",
	aboutThanks: "Speciale dank",
	aboutThanksTsry: "Testausserveri ry en andere software testers",
	aboutThanksYTL:
		"Toelatingsexamenraad van Finland voor het ontwikkelen van de wiskunde-engine in Abicus",
	aboutLicense: "Licentie",
	aboutLicenseMit:
		"Dit programma is open source en gelicentieerd onder de MIT-licentie en wordt geleverd zonder enige garantie.",

	/** Copyright page */
	copyrightOSS: "Open source licenties",
	copyrightKalkki:
		"Kalkki is open source en u hebt het recht om het te gebruiken, aan te passen en te verspreiden volgens de onderstaande licentie:",
	copyrightKalkkiUses: "Tools en bibliotheken gebruikt door Kalkki:",
	copyrightLicense: "Licentie",
	copyrightAuthor: "Auteur:",
	copyrightAuthorDefault: "Ontwikkelaars van '%s'",
	copyrightFullLicense:
		'Je kunt de volledige licenties van de vermelde pakketten vinden <a href="/third-party-licenses.txt">hier</a>.',

	/** Errors */
	errorUnknownSymbol: "onbekend symbool bij %s",
	errorInfinity: "te grote of oneindige waarde",
	errorInvalidArgCount: "functie ontving een ongeldig aantal argumenten",
	errorNaN: "antwoord is geen getal",
	errorNoLhsBracket: "linker haakje ontbreekt",
	errorNoRhsBracket: "rechter haakje ontbreekt",
	errorTrigPrecision: "trigonomtrische precisiefout",
	errorUnexpectedEOF: "onverwacht einde van invoer",
	errorUnexpectedToken: "onverwachte token",
	errorPrecisionOverflow: "getal te groot is om te berekenen",
	errorTimeout: "fout: bewerking is een time-out opgetreden",
	errorUnknownName: "%s: onbekende variabele of functie",
	errorReservedName: "%s is een gereserveerde naam",
	errorRecursion: "oneindige lus",
	errorUnknown: "onbekende fout",
};
