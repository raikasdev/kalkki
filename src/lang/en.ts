import type { fi } from './fi';

export const en: typeof fi = {
  /** Welcome message */
  welcome: 'Welcome! Kalkki is <a href="https://github.com/raikasdev/kalkki">open source</a>.',
  welcomeStart: 'Start by writing an expression in the field below.',
  welcomePwaPrompt: '<span id="pwa-install-prompt" hidden>For the best experience on desktop, <a href="#" onclick="installPWA()">install Kalkki as a PWA application</a>.',
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
  optionsFullScreen: 'Full screen mode',
  optionsYes: 'Yes',
  optionsNo: 'No',
  /** Help menu */
  help: 'Help',
  helpSendFeedback: 'Give feedback',
  helpInfo: 'About Kalkki',
  helpCopyrights: 'Licenses',
  helpReset: 'Reset data',
  helpResetAreYouSure: 'Are you sure? (Wait %ss)',
  helpResetConfirm: 'Confirm reset of all user data',
  /** Updater */
  updateAvailable: 'New version available',
  updateAvailableDescription: 'You are using an outdated version of Kalkki. Please update the app by pressing the button below.',
  updateAvailableButton: 'Update',
  /** Misc / ARIA */
  ariaMathInput: 'Input mathematical expression',
  feedbackLink: 'https://docs.google.com/forms/d/e/1FAIpQLSd2_St9--RZk8zn2Q6JSoJw4G-_SUTskqr18XdiBHYL1gXohg/viewform',
  
  /** About page */
  aboutVersion: 'Version',
  aboutFromStudents: 'Calculator app created by students for students. Kalkki was created by Roni Äikäs while attending high school.',
  aboutThanks: 'Special thanks',
  aboutThanksTsry: 'Testausserveri ry and other software testers',
  aboutThanksYTL: 'Matriculation Examination Board of Finland for developing the math engine in Abicus',
  aboutLicense: 'License',
  aboutLicenseMit: 'This program is open source and licensed under the MIT license and provided without any warranty.',

  /** Copyright page */
  copyrightOSS: 'Open source licenses',
  copyrightKalkki: 'Kalkki is open source and you have the right to use, modify and distribute it as per the license below:',
  copyrightKalkkiUses: 'Tools and libraries used by Kalkki:',
  copyrightLicense: 'License',
  copyrightAuthor: 'Author:',
  copyrightAuthorDefault: 'Developers of \'%s\'',
  copyrightFullLicense: 'You can find the full licenses of packages mentioned <a href="/third-party-licenses.txt">here</a>.',

  /** Errors */
  errorUnknownSymbol: 'unknown symbol at %s',
  errorInfinity: 'too large or infinite value',
  errorInvalidArgCount: 'function received an invalid amount of arguments',
  errorNaN: 'answer is not a number',
  errorNoLhsBracket: 'left bracket missing',
  errorNoRhsBracket: 'right bracket missing',
  errorTrigPrecision: 'trigonomtric precision error',
  errorUnexpectedEOF: 'unexpected end of input',
  errorUnexpectedToken: 'unexpected token',
  errorPrecisionOverflow: 'number is too large to calculate',
  errorTimeout: 'error: operation timed out',
  errorUnknownName: '%s: unknown variable or function',
  errorReservedName: '%s is a reserved name',
  errorRecursion: 'infinite loop',
  errorUnknown: 'unknown error',
}