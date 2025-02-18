import { useState } from 'preact/hooks'
import evaluate from './math-util';
import abikalkkiLogo from '/abikalkki.svg'
import './app.css'

export function App() {
  const [inputLine, setInputLine] = useState("");

  return (
    <>
      <div>
        <img src={abikalkkiLogo} class="logo" alt="Vite logo" />
      </div>
      <h1>Abikalkki</h1>
      <div class="card">
        <input name="math-line" value={inputLine} onChange={(e) => setInputLine(e.currentTarget.value)} />
        <button onClick={() => {
          setInputLine(evaluate(inputLine));
        }}>
          Kalkita
        </button>
      </div>
    </>
  )
}
