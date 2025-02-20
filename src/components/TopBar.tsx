import { ReactNode } from "preact/compat";

export type Options = {
  degreeUnit: 'deg' | 'rad';
  resultAccuracy: number;
}

function OptionButton({ currentValue, set, children }: {
  currentValue: boolean,
  set: () => void;
  children: ReactNode | ReactNode[];
}) {
  return (
    <li>
      <button onClick={set}>
        {children}{currentValue ? ' (valittu)' : ''}
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
          <span>Tiedosto</span>
          <ul className="dropdown">
            <li><button>Tallenna</button></li>
            <li><button>Tallenna nimellä</button></li>
          </ul>
        </li>*/}
        <li className="menu-item">
          <span>Asetukset</span>
          <ul className="dropdown">
            <li className="has-submenu">
              <span>Asteyksikkö</span>
              <ul className="submenu">
                <OptionButton currentValue={options.degreeUnit === 'deg'} set={() => setOptions({ degreeUnit: 'deg' })}>
                  Asteet
                </OptionButton>
                <OptionButton currentValue={options.degreeUnit === 'rad'} set={() => setOptions({ degreeUnit: 'rad' })}>
                  Radiaanit
                </OptionButton>
              </ul>
            </li>
            <li className="has-submenu">
              <span>Kieli</span>
              <ul className="submenu">
                <li><button>suomi</button></li>
                <li><button>svenska</button></li>
                <li><button>English</button></li>
              </ul>
            </li>
            <li className="has-submenu">
              <span>Tuloksen tarkkuus</span>
              <ul className="submenu">
                <OptionButton
                  currentValue={options.resultAccuracy === 2}
                  set={() => setOptions({ resultAccuracy: 2 })}
                >
                  2 numeroa
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 3}
                  set={() => setOptions({ resultAccuracy: 3 })}
                >
                  3 numeroa
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 8}
                  set={() => setOptions({ resultAccuracy: 8 })}
                >
                  8 numeroa
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 15}
                  set={() => setOptions({ resultAccuracy: 15 })}
                >
                  15 numeroa
                </OptionButton>
                <OptionButton
                  currentValue={options.resultAccuracy === 50}
                  set={() => setOptions({ resultAccuracy: 50 })}
                >
                  50 numeroa
                </OptionButton>
              </ul>
            </li>
            <li className="has-submenu">
              <span>Toiminta</span>
              <ul className="submenu">
                <li><button>Tallenna historia</button></li>
                <li><button>Kopioi vastaus automaattisesti</button></li>
              </ul>
            </li>
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
