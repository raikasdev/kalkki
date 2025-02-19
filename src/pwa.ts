window.addEventListener("appinstalled", () => {
  window.resizeTo(500, 640);
  window.moveTo(
    Math.round((screen.width - 500) / 2),
    Math.round((screen.height - 640) / 2)
  )
});

let install: (() => void) | null = null;
window.addEventListener('beforeinstallprompt', (ev) => {
  install = (ev as any).prompt;
  const prompt = document.querySelector('#pwa-install-prompt') as HTMLSpanElement;
  if (prompt) {
    prompt.hidden = false;
  }
});

function installPWA() {
  if (install !== null) {
    install();
  }
}