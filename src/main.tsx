import { render } from 'preact'
import './styles/index.css'
import { App } from './App.tsx'

const fullScreen =
  import.meta.env.VITE_ABITTI_BUILD === 'true'
  || (window.matchMedia('(display-mode: standalone)').matches)
  || JSON.parse(localStorage.getItem('kalkki-options') ?? '{}')?.fullScreen === true;

if (!fullScreen) {
  document.body.classList.add('limit-size');
}
render(<App />, document.getElementById('app')!)
