import Logo from "@/components/Logo";
import { Language, translate } from "@/lang";
import { CircleX } from "lucide-react";

export default function AboutPage({ visible, setVisible, language }: { language: Language; visible: boolean; setVisible: (v: boolean) => void }) {
  return (
    <div className={`page-overlay about-page${visible ? ' visible' : ''}`} {...(!visible ? { "aria-hidden": true } : {})}>
      <button className="close" onClick={() => setVisible(false)}>
        <CircleX size={48} />
      </button>
      <div className="content">
        <div className="logo-container">
          <Logo height="196" width="196" />
        </div>
        <h1>Kalkki</h1>
        <p><i>”Calc is slang for calculator”</i></p>
        <p>{translate("aboutVersion", language)} {import.meta.env.VITE_APP_VERSION} (Git {import.meta.env.VITE_GIT_COMMIT})</p>
        <div class="main-content">
          <p>{translate("aboutFromStudents", language)}</p>
          <h2>{translate("aboutThanks", language)}</h2>
          <p>{translate("aboutThanksTsry", language)}</p>
          <p>{translate("aboutThanksYTL", language)}</p>

          <h2>{translate("aboutLicense", language)}</h2>
          <p>{translate("aboutLicenseMit", language)}</p>
        </div>
      </div>
    </div>
  )
}