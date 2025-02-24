import Logo from "@/components/Logo";
import { CircleX } from "lucide-react";
import licenses from '@/util/licenses.json';
import { Language, translate } from "@/lang";

export default function CopyrightPage({ language, visible, setVisible }: { language: Language; visible: boolean; setVisible: (v: boolean) => void }) {
  return (
    <div className={`page-overlay copyright-page${visible ? ' visible' : ''}`} {...(!visible ? { "aria-hidden": true } : {})}>
      <button className="close" onClick={() => setVisible(false)}>
        <CircleX size={48} />
      </button>
      <div className="content">
        <div className="logo-container">
          <Logo height="196" width="196" />
        </div>
        <h2>{translate("copyrightOSS", language)}</h2>
        <div class="main-content">
          <p>{translate("copyrightKalkki", language)}</p>
          <code>
            Copyright 2025 Roni Äikäs
            <br /><br />
            Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            <br /><br />
            The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
            <br /><br />
            THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </code>
          <p>{translate("copyrightKalkkiUses", language)}</p>
          <ul>
            {licenses.map((dep) => (
              <li>
                <h3>{dep.name}</h3>
                <p>{translate("copyrightLicense", language)} {dep.licenseType}</p>
                <p>{translate("copyrightAuthor", language)} {dep.author === 'n/a' ? translate("copyrightAuthorDefault", language).replace('%s', dep.name) : dep.author}</p>
                <p>
                  <a
                    href={
                      (dep.link.startsWith('git+') ? dep.link.substring(4) : dep.link)
                        .replace('ssh://github.com', 'https://github.com')
                    }
                    rel="nofollow"
                  >
                    {dep.link}
                  </a>
                </p>
              </li>
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: translate('copyrightFullLicense', language) }} />
        </div>
      </div>
    </div>
  )
}