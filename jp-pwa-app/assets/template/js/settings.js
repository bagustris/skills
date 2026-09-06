// User preferences (as opposed to a progress/history module, if this app
// has one), saved to its own localStorage entry so resetting progress never
// wipes configured preferences and vice versa.

const SettingsManager = (() => {
  const STORAGE_KEY = '{{APP_NAME}}-settings';
  const DEFAULTS = {
    // Add app-specific preference defaults here.
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function save(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — fail silently
    }
  }

  function get(key) {
    return load()[key];
  }

  function set(key, value) {
    const settings = load();
    settings[key] = value;
    save(settings);
  }

  return { load, save, get, set };
})();
