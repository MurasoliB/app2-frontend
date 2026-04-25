<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { token, user, logout } from '$lib/auth.js';
  import { get } from 'svelte/store';

  const APP1_URL = import.meta.env.VITE_APP1_URL;

  if (browser && !get(token)) goto('/login');

  function goToApp1() {
    window.location.href = `${APP1_URL}/login?token=${get(token)}`;
  }

  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<div class="page">
  <div class="card">
    <div class="top-bar">
      <div class="brand">App<span>Two</span></div>
      <button class="btn-ghost" onclick={handleLogout}>Sign out</button>
    </div>
    <div class="welcome">
      <p class="label">Logged in as</p>
      <p class="email">{$user?.email ?? '—'}</p>
      <h1>Welcome to App Two</h1>
    </div>
    <div class="divider"></div>
    <div class="app1-section">
      <p class="hint">Go to App One without logging in again</p>
      <button class="btn-primary" onclick={goToApp1}>Open App One →</button>
    </div>
  </div>
</div>

<style>
.page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(ellipse 60% 50% at 20% 80%, rgba(232,132,90,0.1) 0%, transparent 70%), var(--bg); }
.card { width: 100%; max-width: 480px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px; }
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.brand { font-family: var(--font-display); font-size: 20px; color: var(--muted); }
.brand span { color: var(--accent-light); }
.btn-ghost { background: none; color: var(--muted); font-size: 13px; padding: 6px 12px; border: 1px solid var(--border); border-radius: 8px; }
.welcome { margin-bottom: 32px; }
.label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
.email { font-size: 14px; color: var(--accent-light); margin-bottom: 16px; }
h1 { font-family: var(--font-display); font-size: 36px; font-weight: 400; line-height: 1.15; }
.divider { height: 1px; background: var(--border); margin-bottom: 28px; }
.app1-section { display: flex; flex-direction: column; gap: 14px; }
.hint { font-size: 13px; color: var(--muted); }
.btn-primary { padding: 13px 20px; background: var(--accent); color: #fff; width: 100%; }
</style>
