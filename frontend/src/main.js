import * as router from './router.js';
import { AuthPage } from './pages/AuthPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { onAuthChange } from './services/authService.js';

// Register routes
router.register('#/auth', AuthPage);
router.register('#/dashboard', DashboardPage);
router.register('#/tasks', TasksPage);

// Initial auth check
onAuthChange((user) => {
  const currentHash = window.location.hash;
  
  if (user) {
    // If on auth page, redirect to dashboard
    if (currentHash === '#/auth' || !currentHash || currentHash === '#/') {
      router.navigate('#/dashboard');
    }
  } else {
    // If not on auth page, redirect to auth
    if (currentHash !== '#/auth') {
      router.navigate('#/auth');
    }
  }
  
  // Start the router (or re-render if already started)
  router.start();
});
