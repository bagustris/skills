const el = {
  btnSettings: document.getElementById('btn-settings'),
  btnSettingsClose: document.getElementById('btn-settings-close'),
  settingsOverlay: document.getElementById('settings-overlay'),
  btnHomeTitle: document.getElementById('btn-home-title'),
  installButton: document.getElementById('btn-install'),
  installHint: document.getElementById('install-hint'),
  aboutVersion: document.getElementById('about-version'),
};

function openSettings() {
  el.settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
  el.settingsOverlay.classList.add('hidden');
}

el.btnHomeTitle.addEventListener('click', () => {
  // Navigate to the home screen — wire up to this app's screen state.
});

// --- PWA install prompt ---
// Chrome/Edge/Android fire `beforeinstallprompt`, which we capture and
// replay from the Settings panel's install button; other platforms
// (iOS Safari) never fire it, so the button stays hidden there.
let deferredInstallPrompt = null;

function renderInstallRow() {
  const installed = window.matchMedia('(display-mode: standalone)').matches;
  el.installButton.classList.toggle('hidden', installed || !deferredInstallPrompt);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  renderInstallRow();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  renderInstallRow();
});

function initSettingsPanel() {
  // Wire up each app-specific settings row here, following the pattern in
  // an existing app (e.g. kanji-drill/js/app.js's initSettingsPanel):
  //   el.settingFoo.checked = SettingsManager.get('foo');
  //   el.settingFoo.addEventListener('change', () => {
  //     SettingsManager.set('foo', el.settingFoo.checked);
  //   });

  el.btnSettings.addEventListener('click', openSettings);
  el.btnSettingsClose.addEventListener('click', closeSettings);
  el.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === el.settingsOverlay) closeSettings();
  });

  el.installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderInstallRow();
  });

  renderInstallRow();
}

// The About panel's version is read from CHANGELOG.md (the single source of
// truth — see its header) rather than duplicated here: parse the newest
// `## [x.y.z]` heading and show it.
async function loadAppVersion() {
  try {
    const res = await fetch('CHANGELOG.md');
    if (!res.ok) return;
    const text = await res.text();
    const match = text.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m);
    if (match) el.aboutVersion.textContent = `v${match[1]}`;
  } catch {
    // offline / fetch blocked — keep the static fallback, if any
  }
}

initSettingsPanel();
loadAppVersion();
