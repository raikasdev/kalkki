import type { fi } from './fi';

export const sv: typeof fi = {
  /** Welcome message */
  welcome: 'Välkommen! Kalkki är <a href="https://github.com/raikasdev/kalkki">öppen källkod</a>.',
  welcomeStart: 'Påbörja genom att skriva in ett uttryck i fältet nedan.',
  welcomePwaPrompt: 'För bästa upplevelse på datorn, <span id="pwa-install-prompt" hidden><a href="#" onclick="installPWA()">installera Kalkki som en PWA-applikation</a> eller </span><a href="/app">öppna i iframe-läge</a>.',
  /** Options */
  options: 'Inställningar',
  optionsSelected: '(valda)',
  optionsAngleUnit: 'Vinkelenheter',
  optionsAngleUnitDeg: 'Grader',
  optionsAngleUnitRad: 'Radian',
  optionsLanguage: 'Språk',
  optionsPrecision: 'Resultatprecision',
  optionsPrecisionNumber: 'siffror',
  optionsPreserveSession: 'Behåll session',
  optionsYes: 'Ja',
  optionsNo: 'Nej',
  /** Updater */
  updateAvailable: 'Ny version tillgänglig',
  updateAvailableDescription: 'Du använder en gammal version av Kalkki. Var vänlig och uppdatera appen genom att trycka på knappen nedan.',
  updateAvailableButton: 'Uppdatera',
  /** Misc / ARIA */
  ariaMathInput: 'Ange matematisk uttryck',
}