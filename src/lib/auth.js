import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('token') : null;

export const token = writable(stored);
export const user = writable(browser && localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null);

token.subscribe(val => {
  if (browser) {
    if (val) localStorage.setItem('token', val);
    else localStorage.removeItem('token');
  }
});

user.subscribe(val => {
  if (browser) {
    if (val) localStorage.setItem('user', JSON.stringify(val));
    else localStorage.removeItem('user');
  }
});

export function logout() {
  token.set(null);
  user.set(null);
}
