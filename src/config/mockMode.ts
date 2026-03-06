/**
 * Shared mock-mode configuration.
 * Services (non-React) read this to decide between mock data vs real API.
 * AppContext syncs the React state ↔ this module + localStorage.
 */

const MOCK_MODE_KEY = 'dev-mock-mode';

let _useMock: boolean = (() => {
  try {
    const v = localStorage.getItem(MOCK_MODE_KEY);
    return v === null ? true : v === 'true'; // default ON
  } catch {
    return true;
  }
})();

export const isMockMode = () => _useMock;

export const setMockMode = (value: boolean) => {
  _useMock = value;
  try {
    localStorage.setItem(MOCK_MODE_KEY, String(value));
  } catch {}
};
