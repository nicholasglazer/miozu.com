// Theme Reactive State - Single source of truth for theme management
export class ThemeReactiveState {
  // State - synchronized with app.html inline script
  currentTheme = $state('miozu-light');
  isInitialized = $state(false);

  constructor(initialTheme = null) {
    // Always prefer localStorage over server theme
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved && (saved === 'miozu-light' || saved === 'miozu-dark')) {
        this.currentTheme = saved;
      } else if (
        initialTheme &&
        (initialTheme === 'miozu-light' || initialTheme === 'miozu-dark')
      ) {
        this.currentTheme = initialTheme;
      }
    } else if (initialTheme && (initialTheme === 'miozu-light' || initialTheme === 'miozu-dark')) {
      this.currentTheme = initialTheme;
    }
    this.isInitialized = true;
  }

  // Toggle between light and dark themes
  toggle() {
    this.currentTheme = this.currentTheme === 'miozu-light' ? 'miozu-dark' : 'miozu-light';
    this.apply();
    this.persist();
  }

  // Set a specific theme
  setTheme(theme) {
    if (theme === 'miozu-light' || theme === 'miozu-dark') {
      this.currentTheme = theme;
      this.apply();
      this.persist();
    }
  }

  // Apply theme to DOM and persist (single operation)
  apply() {
    if (typeof document !== 'undefined') {
      // Update DOM immediately
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      // Persist to localStorage (primary storage)
      localStorage.setItem('theme', this.currentTheme);
      // Also set a cookie for SSR (read-only, prevents flash)
      document.cookie = `theme=${this.currentTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  persist() {
    // Separate persist method for clarity
    if (typeof document !== 'undefined') {
      localStorage.setItem('theme', this.currentTheme);
      // Keep cookie in sync for SSR
      document.cookie = `theme=${this.currentTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }

  // Sync with app.html theme (no re-initialization needed)
  sync() {
    if (typeof document !== 'undefined') {
      // Get current theme from DOM (set by app.html inline script)
      const current = document.documentElement.getAttribute('data-theme');
      if (current && (current === 'miozu-light' || current === 'miozu-dark')) {
        this.currentTheme = current;
      }
    }
  }

  // Helper to get theme from localStorage
  getThemeFromStorage() {
    if (typeof window === 'undefined') return null;

    const theme = localStorage.getItem('theme');
    return theme === 'miozu-light' || theme === 'miozu-dark' ? theme : null;
  }

  // Get theme for SSR from cookie (prevents flash)
  static getThemeFromCookieString(cookieString) {
    if (!cookieString) return 'miozu-light';

    // Parse theme from cookie for SSR
    const match = cookieString.match(/theme=([^;]+)/);
    const theme = match ? match[1] : null;

    return theme === 'miozu-light' || theme === 'miozu-dark' ? theme : 'miozu-light';
  }

  // Derived getters for convenience - properly reactive
  isDark = $derived(this.currentTheme === 'miozu-dark');
  isLight = $derived(this.currentTheme === 'miozu-light');
}

// Create and export singleton instance
let themeState = null;

export function getThemeState(initialTheme = null) {
  if (!themeState) {
    themeState = new ThemeReactiveState(initialTheme);
  }
  return themeState;
}

// Export convenience functions that use the singleton
export function getTheme() {
  const state = getThemeState();
  return state.currentTheme;
}

export function toggleTheme() {
  const state = getThemeState();
  state.toggle();
}

export function syncTheme() {
  const state = getThemeState();
  state.sync();
}