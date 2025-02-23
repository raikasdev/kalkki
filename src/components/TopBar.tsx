import { Language, translate } from "@/lang";
import { ReactNode } from "preact/compat";

export type Options = {
  language: Language;
  angleUnit: 'deg' | 'rad';
  resultAccuracy: number;
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
export function TopBar({ options, setOptions }: {
  options: Options,
  setOptions: (v: Partial<Options>) => void,
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
            {/*<li className="has-submenu">
              <span>Toiminta</span>
              <ul className="submenu">
                <li><button>Tallenna historia</button></li>
                <li><button>Kopioi vastaus automaattisesti</button></li>
              </ul>
            </li>*/}
          </ul>
        </li>
        {/*<li className="menu-item">
          <span>Ohje</span>
          <ul className="dropdown">
            <li><button>Avaa käyttöohje</button></li>
            <li><button>Versiotiedot</button></li>
          </ul>
        </li>*/}
      </ul>
    </nav>
  );
}
