// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorAlert = document.getElementById('errorAlert');
const successAlert = document.getElementById('successAlert');
const togglePasswordBtn = document.getElementById('togglePassword');
const menuItems = document.querySelectorAll('.menu-item');

// API endpoints
const API_URL = {
  login: '/api/users/login',
  register: '/api/users/register',
  logout: '/api/users/logout',
  profile: '/api/users/profile'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Initialize theme from localStorage
    initializeTheme();
    
    // Setup menu item clicks on dashboard
    setupMenuItems();
});

// Setup menu item clicks
function setupMenuItems() {
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all menu items
                menuItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get the menu item name from text content or data attribute
                const menuName = this.querySelector('span')?.textContent || 
                                 this.textContent?.trim() ||
                                 this.dataset.name;
                
                // Handle different menu actions
                handleMenuAction(menuName);
            });
        });
    }
}

// Handle menu item actions
function handleMenuAction(menuName) {
    // Log the action for debugging
    console.log(`Menu clicked: ${menuName}`);
    
    // Create a section to display when menu items are clicked
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Get content areas that should be shown/hidden
    const welcomeSection = document.querySelector('.welcome-section');
    const statsGrid = document.querySelector('.stats-grid');
    const actionCards = document.querySelector('.action-cards');
    const contentGrid = document.querySelector('.content-grid');
    
    // Create or get dynamic content section
    let dynamicContent = document.getElementById('dynamicContent');
    if (!dynamicContent) {
        dynamicContent = document.createElement('div');
        dynamicContent.id = 'dynamicContent';
        dynamicContent.className = 'dynamic-content';
        mainContent.appendChild(dynamicContent);
    }
    
    // Switch based on menu name
    switch(menuName?.toLowerCase()) {
        case 'dashboard':
            // Show dashboard components
            if (welcomeSection) welcomeSection.style.display = 'flex';
            if (statsGrid) statsGrid.style.display = 'grid';
            if (actionCards) actionCards.style.display = 'grid';
            if (contentGrid) contentGrid.style.display = 'grid';
            dynamicContent.style.display = 'none';
            break;
            
        case 'analytics':
            // Hide default components
            if (welcomeSection) welcomeSection.style.display = 'none';
            if (statsGrid) statsGrid.style.display = 'none';
            if (actionCards) actionCards.style.display = 'none';
            if (contentGrid) contentGrid.style.display = 'none';
            
            // Show analytics content
            dynamicContent.style.display = 'block';
            dynamicContent.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">Analytics</h1>
                    <p class="page-subtitle">View detailed analytics and metrics for your business</p>
                </div>
                
                <div class="analytics-dashboard">
                    <div class="analytics-card">
                        <h3>Visitors Overview</h3>
                        <div class="chart-placeholder">
                            <div class="chart-bars">
                                <div class="chart-bar" style="height: 60%;"></div>
                                <div class="chart-bar" style="height: 80%;"></div>
                                <div class="chart-bar" style="height: 40%;"></div>
                                <div class="chart-bar" style="height: 70%;"></div>
                                <div class="chart-bar" style="height: 90%;"></div>
                                <div class="chart-bar" style="height: 50%;"></div>
                                <div class="chart-bar" style="height: 75%;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="analytics-card">
                        <h3>Revenue Trends</h3>
                        <div class="chart-placeholder">
                            <div class="chart-line"></div>
                        </div>
                    </div>
                    <div class="analytics-card">
                        <h3>User Demographics</h3>
                        <div class="chart-placeholder">
                            <div class="chart-pie">
                                <div class="pie-segment"></div>
                            </div>
                        </div>
                    </div>
                    <div class="analytics-card">
                        <h3>Traffic Sources</h3>
                        <div class="chart-placeholder">
                            <div class="chart-doughnut"></div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'projects':
            // Hide default components
            if (welcomeSection) welcomeSection.style.display = 'none';
            if (statsGrid) statsGrid.style.display = 'none';
            if (actionCards) actionCards.style.display = 'none';
            if (contentGrid) contentGrid.style.display = 'none';
            
            // Show projects content
            dynamicContent.style.display = 'block';
            dynamicContent.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">Projects</h1>
                    <p class="page-subtitle">Manage and track your ongoing projects</p>
                </div>
                
                <div class="projects-header">
                    <div class="project-search">
                        <i class="fa-solid fa-search"></i>
                        <input type="text" placeholder="Search projects...">
                    </div>
                    <button class="btn btn-primary">
                        <i class="fa-solid fa-plus"></i>
                        <span>New Project</span>
                    </button>
                </div>
                
                <div class="projects-grid">
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Website Redesign</h3>
                            <span class="project-badge in-progress">In Progress</span>
                        </div>
                        <p>Modernizing the company website with updated design and improved user experience.</p>
                        <div class="project-meta">
                            <div class="project-team">
                                <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Team Member">
                                <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Team Member">
                                <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="Team Member">
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress" style="width: 65%"></div>
                                </div>
                                <span>65%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>Mobile App Development</h3>
                            <span class="project-badge on-hold">On Hold</span>
                        </div>
                        <p>Creating a native mobile application for iOS and Android platforms.</p>
                        <div class="project-meta">
                            <div class="project-team">
                                <img src="https://randomuser.me/api/portraits/women/47.jpg" alt="Team Member">
                                <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="Team Member">
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress" style="width: 30%"></div>
                                </div>
                                <span>30%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <div class="project-header">
                            <h3>E-commerce Platform</h3>
                            <span class="project-badge completed">Completed</span>
                        </div>
                        <p>Building an online store with shopping cart, payment processing, and inventory management.</p>
                        <div class="project-meta">
                            <div class="project-team">
                                <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Team Member">
                                <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Team Member">
                            </div>
                            <div class="project-progress">
                                <div class="progress-bar">
                                    <div class="progress" style="width: 100%"></div>
                                </div>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        // Add more cases for other menu items
        
        default:
            // Show a placeholder message if the section is not implemented
            // Hide default components
            if (welcomeSection) welcomeSection.style.display = 'none';
            if (statsGrid) statsGrid.style.display = 'none';
            if (actionCards) actionCards.style.display = 'none';
            if (contentGrid) contentGrid.style.display = 'none';
            
            dynamicContent.style.display = 'block';
            dynamicContent.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${menuName || 'Section'}</h1>
                    <p class="page-subtitle">This section is under development</p>
                </div>
                
                <div class="placeholder-content">
                    <div class="placeholder-icon">
                        <i class="fa-solid fa-code"></i>
                    </div>
                    <h2>Coming Soon</h2>
                    <p>We're working hard to bring you this feature. Check back soon!</p>
                    <button class="btn btn-primary" onclick="handleMenuAction('Dashboard')">
                        Back to Dashboard
                    </button>
                </div>
            `;
    }
}

// Check user authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('auth-token');
    const currentPage = window.location.pathname;
    
    // Extract the page name from the path
    const pageName = currentPage.split('/').pop();
    
    if (token) {
        // If user is logged in and tries to access login/register page, redirect to dashboard
        if (pageName === 'login.html' || pageName === 'register.html') {
            window.location.href = 'index.html';
        }
    } else {
        // If user is not logged in and tries to access dashboard, redirect to login
        // But allow access to home page
        if (pageName === 'index.html' && pageName !== 'home.html') {
            window.location.href = 'login.html';
        }
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.querySelector('.input-group input[type="password"]');
    const icon = togglePasswordBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    // Validate form
    if (!email || !password) {
        showAlert(errorAlert, 'Email and password are required');
        return;
    }
    
    // Simulate authentication (in a real app, this would make an API request)
    // For demo purposes, we'll use a hardcoded credential
    if (email === 'admin@example.com' && password === 'password123') {
        // Authentication successful
        const userData = {
            id: 1,
            name: 'Arushi Gupta',
            email: 'arushi.gupta@example.com',
            role: 'Admin'
        };
        
        // Store user data and token
        localStorage.setItem('auth-token', 'demo-token-12345');
        localStorage.setItem('user-data', JSON.stringify(userData));
        
        if (rememberMe) {
            // Set a longer expiration if "Remember Me" is checked
            localStorage.setItem('auth-remember', 'true');
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } else {
        // Authentication failed
        showAlert(errorAlert, 'Invalid email or password');
    }
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('terms')?.checked || false;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        showAlert(errorAlert, 'All fields are required');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert(errorAlert, 'Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        showAlert(errorAlert, 'Password must be at least 8 characters long');
        return;
    }
    
    if (!agreeTerms) {
        showAlert(errorAlert, 'You must agree to the Terms of Service and Privacy Policy');
        return;
    }
    
    // In a real app, this would make an API request to register the user
    // For demo purposes, we'll simulate successful registration
    
    // Show success message
    showAlert(successAlert, 'Registration successful! Redirecting to login...');
    
    // Redirect to login page after a delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Initialize theme from localStorage
function initializeTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Show alert message
function showAlert(alertElement, message) {
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Hide alert after 3 seconds
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000);
}

// Load user data for dashboard
async function loadUserData() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login.html';
      return;
    }
    
    const response = await fetch(API_URL.profile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Update user information on dashboard
      const userNameElement = document.getElementById('user-name');
      const userNameDisplayElement = document.getElementById('user-name-display');
      const userEmailElement = document.getElementById('user-email');
      const userJoinedElement = document.getElementById('user-joined');
      
      if (userNameElement) userNameElement.textContent = data.name;
      if (userNameDisplayElement) userNameDisplayElement.textContent = data.name;
      if (userEmailElement) userEmailElement.textContent = data.email;
      if (userJoinedElement) {
        const joinDate = new Date(data.createdAt);
        userJoinedElement.textContent = joinDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } else {
      // If token is invalid or expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Login Function
async function login(email, password) {
  try {
    const response = await fetch(API_URL.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save token and redirect to dashboard
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard.html';
    } else {
      // Show error message
      if (errorMsg) {
        errorMsg.textContent = data.message || 'Invalid credentials';
        errorMsg.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
          errorMsg.style.display = 'none';
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    if (errorMsg) {
      errorMsg.textContent = 'Server error. Please try again later.';
      errorMsg.style.display = 'block';
    }
  }
}

// Register Function
async function register(name, email, password) {
  try {
    const response = await fetch(API_URL.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Show success message
      if (successMsg) {
        successMsg.textContent = 'Registration successful! Redirecting to login...';
        successMsg.style.display = 'block';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 2000);
      } else {
        // Redirect to login immediately if success message element doesn't exist
        window.location.href = '/login.html';
      }
    } else {
      // Show error message
      if (errorMsg) {
        errorMsg.textContent = data.message || 'Registration failed';
        errorMsg.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
          errorMsg.style.display = 'none';
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (errorMsg) {
      errorMsg.textContent = 'Server error. Please try again later.';
      errorMsg.style.display = 'block';
    }
  }
}

// Logout Function
function logout() {
  // Remove token from local storage
  localStorage.removeItem('token');
  
  // Redirect to login page
  window.location.href = '/login.html';
}

// Expose logout function globally for use in HTML
window.logout = logout;
window.handleMenuAction = handleMenuAction; 