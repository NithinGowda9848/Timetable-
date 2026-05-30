import { register, login } from '../services/authService.js';
import { navigate }        from '../router.js';
import { showToast }       from '../utils/toast.js';

export function AuthPage(container) {
  let mode = 'login'; // 'login' | 'register'

  function render() {
    container.innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h1>TaskFlow</h1>
              <span>Daily Task Manager</span>
            </div>
          </div>

          <div id="auth-error" class="auth-error" style="display:none;"></div>

          ${mode === 'register' ? `
            <h2 class="auth-title">Create account</h2>
            <p class="auth-subtitle">Start managing your tasks today.</p>
            <form id="auth-form">
              <div class="form-group">
                <label class="form-label" for="auth-name">Full Name</label>
                <input id="auth-name" class="form-input" type="text" placeholder="Your name" required autocomplete="name"/>
              </div>
              <div class="form-group">
                <label class="form-label" for="auth-email">Email</label>
                <input id="auth-email" class="form-input" type="email" placeholder="you@example.com" required autocomplete="email"/>
              </div>
              <div class="form-group">
                <label class="form-label" for="auth-password">Password</label>
                <input id="auth-password" class="form-input" type="password" placeholder="Min. 6 characters" required autocomplete="new-password" minlength="6"/>
              </div>
              <button id="auth-submit" type="submit" class="btn btn-primary btn-full">Create Account</button>
            </form>
            <div class="auth-switch">Already have an account? <button id="mode-switch">Sign in</button></div>
          ` : `
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Sign in to continue with your tasks.</p>
            <form id="auth-form">
              <div class="form-group">
                <label class="form-label" for="auth-email">Email</label>
                <input id="auth-email" class="form-input" type="email" placeholder="you@example.com" required autocomplete="email"/>
              </div>
              <div class="form-group">
                <label class="form-label" for="auth-password">Password</label>
                <input id="auth-password" class="form-input" type="password" placeholder="Your password" required autocomplete="current-password"/>
              </div>
              <button id="auth-submit" type="submit" class="btn btn-primary btn-full">Sign In</button>
            </form>
            <div class="auth-switch">Don't have an account? <button id="mode-switch">Create one</button></div>
          `}
        </div>
      </div>
    `;

    bindEvents();
  }

  function showError(msg) {
    const el = document.getElementById('auth-error');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function setLoading(isLoading) {
    const btn = document.getElementById('auth-submit');
    if (!btn) return;
    btn.disabled    = isLoading;
    btn.textContent = isLoading
      ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
      : (mode === 'login' ? 'Sign In'      : 'Create Account');
  }

  function bindEvents() {
    document.getElementById('mode-switch')?.addEventListener('click', () => {
      mode = mode === 'login' ? 'register' : 'login';
      render();
    });

    document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;
      const name     = document.getElementById('auth-name')?.value.trim() || '';

      setLoading(true);
      try {
        if (mode === 'register') {
          await register(name, email, password);
          showToast('Account created! Welcome 🎉', 'success');
        } else {
          await login(email, password);
          showToast('Welcome back!', 'success');
        }
        navigate('#/dashboard');
      } catch (err) {
        showError(friendlyError(err.message));
      } finally {
        setLoading(false);
      }
    });
  }

  function friendlyError(msg) {
    if (msg.includes('email-already-in-use')) return 'This email is already registered.';
    if (msg.includes('user-not-found'))       return 'No account found with this email.';
    if (msg.includes('wrong-password'))       return 'Incorrect password. Try again.';
    if (msg.includes('invalid-email'))        return 'Please enter a valid email address.';
    if (msg.includes('weak-password'))        return 'Password must be at least 6 characters.';
    return msg;
  }

  render();
}
