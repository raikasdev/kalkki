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
  /** Help */
  help: 'Hjälp',  
  helpSendFeedback: 'Ge feedback',  
  helpInfo: 'Om Kalkki',  
  helpCopyrights: 'Licenser',  
  helpReset: 'Återställ appdata',  
  helpResetAreYouSure: 'Är du säker? (Vänta %ss)',  
  helpResetConfirm: 'Bekräfta återställning av data',  

  /** Updater */
  updateAvailable: 'Ny version tillgänglig',
  updateAvailableDescription: 'Du använder en gammal version av Kalkki. Var vänlig och uppdatera appen genom att trycka på knappen nedan.',
  updateAvailableButton: 'Uppdatera',
  /** Misc / ARIA */
  ariaMathInput: 'Ange matematisk uttryck',
  feedbackLink: 'https://docs.google.com/forms/d/e/1FAIpQLSd2_St9--RZk8zn2Q6JSoJw4G-_SUTskqr18XdiBHYL1gXohg/viewform',

  /** About page */
  aboutVersion: 'Version',  
  aboutFromStudents: 'En kalkylatorapp skapad av studenter för studenter. Kalkki skapades av Roni Äikäs under gymnasiet.',  
  aboutThanks: 'Särskilt tack',  
  aboutThanksTsry: 'Testausserveri ry och andra programvarutestare',  
  aboutThanksYTL: 'Studentexamensnämnden i Finland för att ha utvecklat matematikmotorn i Abicus',  
  aboutLicense: 'Licens',  
  aboutLicenseMit: 'Detta program är öppen källkod och licensierat under MIT-licensen utan någon garanti.',  

  /** Upphovsrättssida */  
  copyrightOSS: 'Licenser för öppen källkod',  
  copyrightKalkki: 'Kalkki är öppen källkod, och du har rätt att använda, modifiera och distribuera den enligt licensen nedan:',  
  copyrightKalkkiUses: 'Verktyg och bibliotek som används av Kalkki:',  
  copyrightLicense: 'Licens',  
  copyrightAuthor: 'Författare:',  
  copyrightAuthorDefault: 'Utvecklarna av \'%s\'',  
  copyrightFullLicense: 'Du hittar de fullständiga licenserna för de nämnda paketen <a href="/third-party-licenses.txt">här</a>.'  
}