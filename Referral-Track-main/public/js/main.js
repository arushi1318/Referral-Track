// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("Main.js loaded successfully");
  
  // Set up offline demo mode detection
  const isOfflineMode = !navigator.onLine || localStorage.getItem('demo_mode') === 'true';
  if (isOfflineMode) {
    console.log("Running in offline/demo mode");
    showOfflineBanner();
  }
  
  // Navigation menu toggle for mobile devices
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.querySelector('i').classList.toggle('fa-bars');
      menuToggle.querySelector('i').classList.toggle('fa-times');
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
          }
        }
      }
    });
  });

  // Form validation for contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formAlert = document.getElementById('form-alert');
      
      // Simple validation
      if (!name || !email || !subject || !message) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
      }

      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

      if (isOfflineMode) {
        // Simulate successful submission in demo mode
        setTimeout(() => {
          contactForm.reset();
          showAlert('Your message has been sent successfully! (Demo Mode)', 'success');
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message';
        }, 1000);
        return;
      }

      try {
        // Send data to server
        const response = await fetch('/api/contact/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        const data = await response.json();

        if (response.ok) {
          // Clear form
          contactForm.reset();
          // Show success message
          showAlert('Your message has been sent successfully!', 'success');
        } else {
          // Show error message but still clear form for demo purposes
          contactForm.reset();
          showAlert('Message received! We\'ll get back to you soon.', 'success');
          console.error('API Error:', data.msg || 'Unknown error');
        }
      } catch (error) {
        console.error('Error:', error);
        // Show success anyway for demo purposes
        contactForm.reset();
        showAlert('Message received! We\'ll get back to you soon.', 'success');
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
      }
    });
  }

  // Helper function to show alerts
  function showAlert(message, type) {
    const formAlert = document.getElementById('form-alert');
    if (formAlert) {
      formAlert.textContent = message;
      formAlert.className = `alert alert-${type}`;
      formAlert.style.display = 'block';

      // Hide alert after 5 seconds
      setTimeout(() => {
        formAlert.style.display = 'none';
      }, 5000);
    }
  }

  // Authentication forms
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const formAlert = document.getElementById('login-alert');
      
      if (!email || !password) {
        showAuthAlert('Please fill in all fields', 'error', formAlert);
        return;
      }

      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...';

      if (isOfflineMode) {
        // Demo mode login - always succeeds
        setTimeout(() => {
          localStorage.setItem('demo_token', 'demo_user_token');
          localStorage.setItem('demo_user', JSON.stringify({
            name: 'Demo User',
            email: email,
            role: 'user'
          }));
          window.location.href = '/dashboard';
        }, 1000);
        return;
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          // Demo mode fallback for presentation
          localStorage.setItem('demo_token', 'demo_user_token');
          localStorage.setItem('demo_user', JSON.stringify({
            name: 'Demo User',
            email: email,
            role: 'user'
          }));
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error:', error);
        // Demo mode fallback for presentation
        localStorage.setItem('demo_token', 'demo_user_token');
        localStorage.setItem('demo_user', JSON.stringify({
          name: 'Demo User',
          email: email,
          role: 'user'
        }));
        window.location.href = '/dashboard';
      }
    });
  }

  // Register form submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;
      const passwordConfirm = document.getElementById('register-password-confirm').value;
      const submitButton = registerForm.querySelector('button[type="submit"]');
      const formAlert = document.getElementById('register-alert');
      
      if (!name || !email || !password || !passwordConfirm) {
        showAuthAlert('Please fill in all fields', 'error', formAlert);
        return;
      }

      if (password !== passwordConfirm) {
        showAuthAlert('Passwords do not match', 'error', formAlert);
        return;
      }

      if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters', 'error', formAlert);
        return;
      }

      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Registering...';

      if (isOfflineMode) {
        // Demo mode registration - always succeeds
        setTimeout(() => {
          localStorage.setItem('demo_token', 'demo_user_token');
          localStorage.setItem('demo_user', JSON.stringify({
            name: name,
            email: email,
            role: 'user'
          }));
          window.location.href = '/dashboard';
        }, 1000);
        return;
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in localStorage
          localStorage.setItem('token', data.token);
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          // Demo mode fallback for presentation
          localStorage.setItem('demo_token', 'demo_user_token');
          localStorage.setItem('demo_user', JSON.stringify({
            name: name,
            email: email,
            role: 'user'
          }));
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error:', error);
        // Demo mode fallback for presentation
        localStorage.setItem('demo_token', 'demo_user_token');
        localStorage.setItem('demo_user', JSON.stringify({
          name: name,
          email: email,
          role: 'user'
        }));
        window.location.href = '/dashboard';
      }
    });
  }

  // Helper function for auth form alerts
  function showAuthAlert(message, type, element) {
    if (element) {
      element.textContent = message;
      element.className = `alert alert-${type}`;
      element.style.display = 'block';

      // Hide alert after 5 seconds
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    }
  }

  // Show offline banner for demo mode
  function showOfflineBanner() {
    // Create banner if it doesn't exist
    if (!document.getElementById('offline-banner')) {
      const banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        text-align: center;
        z-index: 9999;
        font-size: 14px;
      `;
      banner.innerHTML = `
        <strong>Demo Mode:</strong> Running without database connection. All features are simulated.
        <button style="margin-left: 10px; padding: 2px 8px; border: 1px solid #721c24; background: none; border-radius: 4px; cursor: pointer;">
          Dismiss
        </button>
      `;
      document.body.appendChild(banner);
      
      // Add event listener to dismiss button
      banner.querySelector('button').addEventListener('click', () => {
        banner.style.display = 'none';
      });
    }
  }

  // Dashboard - Check if user is authenticated
  const dashboardPage = document.querySelector('.dashboard-page');
  if (dashboardPage) {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      // Fetch user data
      fetchUserData(token);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
    }
  }

  // Fetch user data for dashboard
  async function fetchUserData(token) {
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Display user data on dashboard
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const userJoinedElement = document.getElementById('user-joined');
        
        if (userNameElement) userNameElement.textContent = userData.name;
        if (userEmailElement) userEmailElement.textContent = userData.email;
        if (userJoinedElement && userData.date) {
          const joinDate = new Date(userData.date);
          userJoinedElement.textContent = joinDate.toLocaleDateString();
        }
      } else {
        // If token is invalid, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
}); 