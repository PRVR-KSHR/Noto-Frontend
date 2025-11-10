// Silences console output (except errors) in production on notoapp.tech domains
// Works for: notoapp.tech, www.notoapp.tech, and any subdomain *.notoapp.tech

(function silenceConsoleForProdDomain() {
  try {
    const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';
    const isProdBuild = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD === true;
    if (!isBrowser || !isProdBuild) return;

    const host = window.location.hostname || '';
    const isNotoDomain = host === 'notoapp.tech' || host.endsWith('.notoapp.tech');
    if (!isNotoDomain) return;

    const noop = () => {};
    // Keep a reference just in case debugging is needed
    const originalConsole = {
      log: console.log,
      info: console.info,
      debug: console.debug,
      warn: console.warn,
      error: console.error,
      table: console.table,
      trace: console.trace,
    };

    // Silence non-error methods
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = noop;
    console.table = noop;
    console.trace = noop;

    // Do not silence console.error so real errors (e.g., network issues) remain visible
    // If needed for troubleshooting, you can temporarily re-enable by assigning back:
    // console.log = originalConsole.log; (not recommended in production)
  } catch (_) {
    // Failsafe: never break the app because of console silencing
  }
})();
