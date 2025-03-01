import { AppState } from "@/App";
import SelfDestructButton from "@/components/SelfDestructButton";
import { Language, translate } from "@/lang";
import { Copyright, Info, Smile } from "lucide-react";
import { ReactNode } from "preact/compat";

export type Options = {
  language: Language;
  angleUnit: 'deg' | 'rad';
  resultAccuracy: number;
  preserveSessions: boolean;
  fullScreen: boolean;
}

function OptionButton({ currentValue, set, children, lang }: {
  currentValue: boolean,
  set: () => void;
  children: ReactNode | ReactNode[];
  lang: Language;
}) {
  return (
    <li>
      <button onClick={set}>
        {children}{currentValue ? ' ' + translate("optionsSelected", lang) : ''}
      </button>
    </li>
  )
}
export function TopBar({ options, setOptions, setAppState }: {
  options: Options,
  setOptions: (v: Partial<Options>) => void,
  setAppState: (v: Partial<AppState>) => void,
}) {
  return (
    <nav className="top-bar">
      <ul className="menu-bar">
        {/*<li className="menu-item">
          <span>Istunto</span>
          <ul className="dropdown">
            <li><button>Avaa</button></li>
            <li><button>Tallenna</button></li>
            <li><button>Vie tekstitiedostona</button></li>
            <li><button>Tyhjennä istunto</button></li>
          </ul>
        </li>*/}
        <li className="menu-item">
          <span>{translate("options", options.language)}</span>
          <ul className="dropdown">
            <li className="has-submenu">
              <span>{translate("optionsAngleUnit", options.language)}</span>
              <ul className="submenu">
                <OptionButton currentValue={options.angleUnit === 'deg'} set={() => setOptions({ angleUnit: 'deg' })} lang={options.language}>
                  {translate("optionsAngleUnitDeg", options.language)}
                </OptionButton>
                <OptionButton currentValue={options.angleUnit === 'rad'} set={() => setOptions({ angleUnit: 'rad' })} lang={options.language}>
                  {translate("optionsAngleUnitRad", options.language)}
                </OptionButton>
              </ul>
            </li>
            {<li className="has-submenu">
              <span>{translate("optionsLanguage", options.language)}</span>
              <ul className="submenu">
                <OptionButton currentValue={options.language === 'fi'} set={() => setOptions({ language: 'fi' })} lang={options.language}>
                  suomi
                </OptionButton>
                <OptionButton currentValue={options.language === 'sv'} set={() => setOptions({ language: 'sv' })} lang={options.language}>
                  svenska
                </OptionButton>
                <OptionButton currentValue={options.language === 'en'} set={() => setOptions({ language: 'en' })} lang={options.language}>
                  English
                </OptionButton>
              </ul>
            </li>}
            <li className="has-submenu">
              <span>{translate("optionsPrecision", options.language)}</span>
              <ul className="submenu">
                <OptionButton
                  currentValue={options.resultAccuracy === 2}
                  set={() => setOptions({ resultAccuracy: 2 })}
                  lang={options.language}
                >
                  2 {translate("optionsPrecisionNumber", options.language)}
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 3}
                  set={() => setOptions({ resultAccuracy: 3 })}
                  lang={options.language}
                >
                  3 {translate("optionsPrecisionNumber", options.language)}
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 8}
                  set={() => setOptions({ resultAccuracy: 8 })}
                  lang={options.language}
                >
                  8 {translate("optionsPrecisionNumber", options.language)}
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 15}
                  set={() => setOptions({ resultAccuracy: 15 })}
                  lang={options.language}
                >
                  15 {translate("optionsPrecisionNumber", options.language)}
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 50}
                  set={() => setOptions({ resultAccuracy: 50 })}
                  lang={options.language}
                >
                  50 {translate("optionsPrecisionNumber", options.language)}
                </OptionButton>
              </ul>
            </li>
            <li className="has-submenu">
              <span>{translate("optionsPreserveSession", options.language)}</span>
              <ul className="submenu">
                <OptionButton
                  currentValue={options.preserveSessions === true}
                  set={() => setOptions({ preserveSessions: true })}
                  lang={options.language}
                >
                  {translate("optionsYes", options.language)}
                </OptionButton>
                <OptionButton
                  currentValue={options.preserveSessions === false}
                  set={() => setOptions({ preserveSessions: false })}
                  lang={options.language}
                >
                  {translate("optionsNo", options.language)}
                </OptionButton>
              </ul>
            </li>
            {(import.meta.env.VITE_ABITTI_BUILD !== 'true' && !window.matchMedia('(display-mode: standalone)').matches) && (
              <li className="has-submenu fullscreen-option">
                <span>{translate("optionsFullScreen", options.language)}</span>
                <ul className="submenu">
                  <OptionButton
                    currentValue={options.fullScreen === true}
                    set={() => setOptions({ fullScreen: true })}
                    lang={options.language}
                  >
                    {translate("optionsYes", options.language)}
                  </OptionButton>
                  <OptionButton
                    currentValue={options.fullScreen === false}
                    set={() => setOptions({ fullScreen: false })}
                    lang={options.language}
                  >
                    {translate("optionsNo", options.language)}
                  </OptionButton>
                </ul>
              </li>
            )}
            {/*<li className="has-submenu">
              <span>Toiminta</span>
              <ul className="submenu">
                <li><button>Tallenna historia</button></li>
                <li><button>Kopioi vastaus automaattisesti</button></li>
              </ul>
            </li>*/}
          </ul>
        </li>
        <li className="menu-item">
          <span>{translate('help', options.language)}</span>
          <ul className="dropdown">
            <li><a href={translate('feedbackLink', options.language)}><Smile size={'1.25rem'} /> {translate('helpSendFeedback', options.language)}</a></li>
            <li><button onClick={() => setAppState({ pageOpen: 'about' })}><Info size={'1.25rem'} /> {translate('helpInfo', options.language)}</button></li>
            <li><button onClick={() => setAppState({ pageOpen: 'copyright' })}><Copyright size={'1.25rem'} /> {translate('helpCopyrights', options.language)}</button></li>
            <SelfDestructButton language={options.language} />
          </ul>
        </li>
      </ul>
    </nav>
  );
}
