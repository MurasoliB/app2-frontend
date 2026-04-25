<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { token } from '$lib/auth.js';
  import { get } from 'svelte/store';

  if (browser) {
    if (get(token)) goto('/dashboard');
    else goto('/login');
  }
</script>
