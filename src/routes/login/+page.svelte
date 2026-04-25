<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { token, user } from '$lib/auth.js';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';

  const API = import.meta.env.VITE_API_URL;

  let mode = $state('login');
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  onMount(() => {
    const urlToken = $page.url.searchParams.get('token');
    if (urlToken) {
      token.set(urlToken);
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${urlToken}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.user) { user.set(data.user); goto('/dashboard'); }
          else token.set(null);
        })
        .catch(() => token.set(null));
      return;
    }
    if (get(token)) goto('/dashboard');
  });

  async function submit() {
    error = '';
    loading = true;
    try {
      const body = mode === 'register'
        ? { name, email, password }
        : { email, password };
      const res = await fetch(`${API}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { error = data.message; return; }
      token.set(data.token);
      user.set(data.user);
      goto('/dashboard');
    } catch {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }

  function switchMode() {
    mode = mode === 'login' ? 'register' : 'login';
    error = '';
  }
</script>

<div class="page">
  <div class="card">
    <div class="brand">App<span>Two</span></div>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
    <p class="sub">{mode === 'login' ? 'Sign in to continue' : 'Join to get started'}</p>
    <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
      {#if mode === 'register'}
        <div class="field">
          <label for="name">Name</label>
          <input id="name" type="text" bind:value={name} placeholder="Your name" required />
        </div>
      {/if}
      <div class="field">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} placeholder="you@example.com" required />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} placeholder="••••••••" required />
      </div>
      {#if error}<p class="error">{error}</p>{/if}
      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
    </form>
    <p class="switch">
      {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
      <button class="btn-link" onclick={switchMode}>
        {mode === 'login' ? 'Register' : 'Sign in'}
      </button>
    </p>
  </div>
</div>

<style>
.page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(ellipse 60% 50% at 80% 20%, rgba(232,132,90,0.1) 0%, transparent 70%), var(--bg); }
.card { width: 100%; max-width: 400px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 40px 36px; }
.brand { font-family: var(--font-display); font-size: 22px; margin-bottom: 28px; color: var(--muted); }
.brand span { color: var(--accent-light); }
h1 { font-family: var(--font-display); font-size: 28px; font-weight: 400; margin-bottom: 6px; }
.sub { color: var(--muted); font-size: 14px; margin-bottom: 28px; }
form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; color: var(--muted); font-weight: 500; }
.error { color: var(--danger); font-size: 13px; padding: 10px 14px; background: rgba(224,92,92,0.08); border-radius: 8px; border: 1px solid rgba(224,92,92,0.2); }
.btn-primary { width: 100%; padding: 13px; background: var(--accent); color: #fff; margin-top: 4px; }
.btn-primary:hover:not(:disabled) { opacity: 0.88; }
.switch { text-align: center; margin-top: 20px; font-size: 13px; color: var(--muted); }
.btn-link { background: none; color: var(--accent-light); font-size: 13px; padding: 0; margin-left: 4px; font-weight: 400; }
</style>
