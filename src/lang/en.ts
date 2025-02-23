import type { fi } from './fi';

export const en: typeof fi = {
  /** Welcome message */
  welcome: 'Welcome! Kalkki is <a href="https://github.com/raikasdev/kalkki">open source</a>.',
  welcomeStart: 'Start by writing an expression in the field below.',
  welcomePwaPrompt: 'For the best experience on desktop, <span id="pwa-install-prompt" hidden><a href="#" onclick="installPWA()">install Kalkki as an PWA application</a> or </span><a href="/app">open in iframe mode</a>.',
  /** Options */
  options: 'Options',
  optionsSelected: '(selected)',
  optionsAngleUnit: 'Angle unit',
  optionsAngleUnitDeg: 'Degree',
  optionsAngleUnitRad: 'Radian',
  optionsLanguage: 'Language',
  optionsPrecision: 'Result precision',
  optionsPrecisionNumber: 'digits',
  optionsPreserveSession: 'Preserve session',
  optionsYes: 'Yes',
  optionsNo: 'No',
  /** Updater */
  updateAvailable: 'New version available',
  updateAvailableDescription: 'You are using an outdated version of Kalkki. Please update the app by pressing the button below.',
  updateAvailableButton: 'Update',
  /** Misc / ARIA */
  ariaMathInput: 'Input mathematical expression',
}