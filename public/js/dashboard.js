// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const notificationBtn = document.querySelector('.notification-button');
const messageBtn = document.querySelector('.message-button');
const searchInput = document.getElementById('dashboardSearch');
const currentDateElement = document.getElementById('currentDate');
const activityList = document.getElementById('activityList');
const notificationList = document.getElementById('notificationList');
const progressBar = document.getElementById('progressBar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileSidebarClose = document.getElementById('mobileSidebarClose');
const actionCards = document.querySelectorAll('.action-card');
const viewAllLinks = document.querySelectorAll('.view-all');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Clear any existing user data
    localStorage.removeItem('user-data');
    
    initializeDashboard();
    setupEventListeners();
    loadUserData();
    updateDateTime();
    populateActivityList();
    populateNotificationList();
    setupActionCards();
    setupViewAllLinks();
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Check if sidebar should be collapsed based on screen size
    if (window.innerWidth < 768) {
        sidebar.classList.add('collapsed');
    }
    
    // Set theme toggle based on localStorage
    const savedTheme = localStorage.getItem('dashboard-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Set up interval to update date and time
    setInterval(updateDateTime, 60000); // Update every minute
}

// Setup all event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile sidebar close
    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', closeMobileMenu);
    }

    // Sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Notification button
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }
    
    // Message button
    if (messageBtn) {
        messageBtn.addEventListener('click', toggleMessages);
    }
    
    // Menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => handleMenuItemClick(item));
    });
    
    // Add resize listener for responsive sidebar
    window.addEventListener('resize', handleResize);
    
    // Initialize tooltips
    initializeTooltips();

    // Setup action cards
    setupActionCards();
    
    // Add event listener for logout button
    const logoutButton = document.querySelector('.menu-item:has(.fa-right-from-bracket)');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

// Update date and time in the header
function updateDateTime() {
    if (currentDateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    sidebar.classList.toggle('open');
}

// Close mobile menu
function closeMobileMenu() {
    sidebar.classList.remove('open');
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('user-data');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            // Update user name in the header
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement && user.name) {
                userNameElement.textContent = user.name;
            }
            
            // Update user role in the header
            const userRoleElement = document.querySelector('.user-role');
            if (userRoleElement && user.role) {
                userRoleElement.textContent = user.role;
            }
            
            // Update welcome message
            const welcomeTitleElement = document.querySelector('.welcome-title');
            if (welcomeTitleElement && user.name) {
                welcomeTitleElement.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
            }
            
            // Update user avatar if needed
            const userAvatar = document.querySelector('.user-avatar');
            if (userAvatar && user.avatar) {
                userAvatar.src = user.avatar;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // Demo data if no user is logged in
        const demoUser = {
            name: 'Arushi Gupta',
            role: 'Admin',
            avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
        };
        localStorage.setItem('user-data', JSON.stringify(demoUser));
        loadUserData();
    }
}

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    
    // Save sidebar state to localStorage
    localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
}

// Toggle theme (light/dark)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Toggle icon
    if (themeIcon) {
        themeIcon.classList.toggle('fa-sun');
        themeIcon.classList.toggle('fa-moon');
    }
    
    // Save theme preference to localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('dashboard-theme', isDarkTheme ? 'dark' : 'light');
}

// Handle menu item click
function handleMenuItemClick(item) {
    // Get the menu text
    const menuText = item.querySelector('span')?.textContent || '';
    
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(i => i.classList.remove('active'));
    
    // Add active class to clicked item
    item.classList.add('active');
    
    // Handle different menu items
    switch(menuText.toLowerCase()) {
        case 'dashboard':
            // Already on dashboard
            break;
        case 'analytics':
            showSection('analytics');
            break;
        case 'reports':
            showSection('reports');
            break;
        case 'calendar':
            showSection('calendar');
            break;
        case 'tasks':
            showSection('tasks');
            break;
        case 'projects':
            showSection('projects');
            break;
        case 'team':
            showSection('team');
            break;
        case 'messages':
            showSection('messages');
            break;
        case 'settings':
            showSection('settings');
            break;
        case 'profile':
            showSection('profile');
            break;
        case 'help':
            showSection('help');
            break;
        case 'logout':
            handleLogout();
            break;
    }
    
    // On mobile, close the sidebar after clicking
    if (window.innerWidth < 768) {
        closeMobileMenu();
    }
}

// Show section based on menu item
function showSection(sectionName) {
    // Create a dynamic content section if it doesn't exist
    let dynamicContent = document.getElementById('dynamicContent');
    if (!dynamicContent) {
        dynamicContent = document.createElement('div');
        dynamicContent.id = 'dynamicContent';
        dynamicContent.className = 'dynamic-content';
        document.querySelector('.main-content').appendChild(dynamicContent);
    }
    
    // Hide default dashboard sections
    const welcomeSection = document.querySelector('.welcome-section');
    const statsGrid = document.querySelector('.stats-grid');
    const actionCards = document.querySelector('.action-cards');
    const contentGrid = document.querySelector('.content-grid');
    
    if (welcomeSection) welcomeSection.style.display = 'none';
    if (statsGrid) statsGrid.style.display = 'none';
    if (actionCards) actionCards.style.display = 'none';
    if (contentGrid) contentGrid.style.display = 'none';
    
    // Show dynamic content
    dynamicContent.style.display = 'block';
    
    // Update content based on section
    dynamicContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h1>
            <p class="page-subtitle">This section is currently under development</p>
        </div>
        
        <div class="placeholder-content">
            <div class="placeholder-icon">
                <i class="fa-solid fa-code"></i>
            </div>
            <h2>Coming Soon</h2>
            <p>We're working hard to bring you this feature. Check back soon!</p>
            <button class="btn btn-primary" onclick="resetDashboard()">
                Back to Dashboard
            </button>
        </div>
    `;
}

// Reset dashboard to default view
function resetDashboard() {
    // Show default dashboard sections
    const welcomeSection = document.querySelector('.welcome-section');
    const statsGrid = document.querySelector('.stats-grid');
    const actionCards = document.querySelector('.action-cards');
    const contentGrid = document.querySelector('.content-grid');
    
    if (welcomeSection) welcomeSection.style.display = 'flex';
    if (statsGrid) statsGrid.style.display = 'grid';
    if (actionCards) actionCards.style.display = 'grid';
    if (contentGrid) contentGrid.style.display = 'grid';
    
    // Hide dynamic content
    const dynamicContent = document.getElementById('dynamicContent');
    if (dynamicContent) {
        dynamicContent.style.display = 'none';
    }
    
    // Set dashboard menu item as active
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    const dashboardMenuItem = Array.from(menuItems).find(item => 
        item.querySelector('span')?.textContent.toLowerCase() === 'dashboard'
    );
    
    if (dashboardMenuItem) {
        dashboardMenuItem.classList.add('active');
    }
}

// Toggle notifications dropdown
function toggleNotifications() {
    // Create notifications dropdown if it doesn't exist
    let notificationsDropdown = document.querySelector('.notifications-dropdown');
    
    if (!notificationsDropdown) {
        notificationsDropdown = document.createElement('div');
        notificationsDropdown.className = 'notifications-dropdown';
        
        // Get notifications from the list
        const notifications = Array.from(document.querySelectorAll('.notification-item')).slice(0, 3);
        
        // Create dropdown content
        let dropdownContent = `
            <div class="dropdown-header">
                <h3 class="dropdown-title">Notifications</h3>
                <span class="dropdown-action">Mark all as read</span>
            </div>
            <div class="dropdown-items">
        `;
        
        // Add notifications to dropdown
        notifications.forEach(notification => {
            const title = notification.querySelector('.notification-title').textContent;
            const message = notification.querySelector('.notification-message').textContent;
            const icon = notification.querySelector('.notification-icon i').className;
            const iconClass = notification.querySelector('.notification-icon').className.split(' ').find(c => c.startsWith('bg-'));
            
            dropdownContent += `
                <div class="dropdown-item">
                    <div class="dropdown-item-icon ${iconClass}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="dropdown-item-content">
                        <div class="dropdown-item-title">${title}</div>
                        <div class="dropdown-item-subtitle">${message}</div>
                    </div>
                </div>
            `;
        });
        
        dropdownContent += `
            </div>
            <div class="dropdown-footer">
                <a href="#" onclick="showSection('notifications'); return false;">View all notifications</a>
            </div>
        `;
        
        notificationsDropdown.innerHTML = dropdownContent;
        document.body.appendChild(notificationsDropdown);
    }
    
    // Toggle dropdown visibility
    notificationsDropdown.classList.toggle('show');
    
    // Position dropdown
    if (notificationsDropdown.classList.contains('show')) {
        const buttonRect = notificationBtn.getBoundingClientRect();
        notificationsDropdown.style.top = buttonRect.bottom + 10 + 'px';
        notificationsDropdown.style.right = window.innerWidth - buttonRect.right + 'px';
    }
    
    // Close other dropdowns
    const messagesDropdown = document.querySelector('.messages-dropdown');
    if (messagesDropdown && messagesDropdown.classList.contains('show')) {
        messagesDropdown.classList.remove('show');
    }
}

// Toggle messages dropdown
function toggleMessages() {
    // Create messages dropdown if it doesn't exist
    let messagesDropdown = document.querySelector('.messages-dropdown');
    
    if (!messagesDropdown) {
        messagesDropdown = document.createElement('div');
        messagesDropdown.className = 'messages-dropdown';
        
        // Create sample messages
        const messages = [
            {
                avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
                name: 'Sarah Johnson',
                message: 'Hey, just wanted to check on the project status.',
                time: '5 min ago'
            },
            {
                avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
                name: 'Michael Brown',
                message: 'The client approved the design, we can move forward.',
                time: '1 hour ago'
            },
            {
                avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
                name: 'Emily Davis',
                message: 'Don\'t forget about the team meeting at 3 PM today.',
                time: '2 hours ago'
            }
        ];
        
        // Create dropdown content
        let dropdownContent = `
            <div class="dropdown-header">
                <h3 class="dropdown-title">Messages</h3>
                <span class="dropdown-action">Mark all as read</span>
            </div>
            <div class="dropdown-items">
        `;
        
        // Add messages to dropdown
        messages.forEach(message => {
            dropdownContent += `
                <div class="dropdown-item">
                    <img src="${message.avatar}" alt="${message.name}" class="dropdown-item-avatar">
                    <div class="dropdown-item-content">
                        <div class="dropdown-item-title">${message.name}</div>
                        <div class="dropdown-item-subtitle">${message.message}</div>
                        <div class="dropdown-item-time">${message.time}</div>
                    </div>
                </div>
            `;
        });
        
        dropdownContent += `
            </div>
            <div class="dropdown-footer">
                <a href="#" onclick="showSection('messages'); return false;">View all messages</a>
            </div>
        `;
        
        messagesDropdown.innerHTML = dropdownContent;
        document.body.appendChild(messagesDropdown);
    }
    
    // Toggle dropdown visibility
    messagesDropdown.classList.toggle('show');
    
    // Position dropdown
    if (messagesDropdown.classList.contains('show')) {
        const buttonRect = messageBtn.getBoundingClientRect();
        messagesDropdown.style.top = buttonRect.bottom + 10 + 'px';
        messagesDropdown.style.right = window.innerWidth - buttonRect.right + 'px';
    }
    
    // Close other dropdowns
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    if (notificationsDropdown && notificationsDropdown.classList.contains('show')) {
        notificationsDropdown.classList.remove('show');
    }
}

// Handle window resize
function handleResize() {
    if (window.innerWidth < 768 && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
    }
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        element.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.top = rect.bottom + 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            
            if (tooltip) {
                tooltip.classList.remove('show');
                
                setTimeout(() => {
                    tooltip.remove();
                }, 200);
            }
        });
    });
}

// Populate activity list with demo data
function populateActivityList() {
    if (!activityList) return;
    
    const activities = [
        {
            user: 'Alex Johnson',
            action: 'completed task',
            target: 'Website Redesign',
            time: '2 hours ago',
            icon: 'fa-check-circle',
            iconClass: 'bg-success'
        },
        {
            user: 'Sarah Williams',
            action: 'commented on',
            target: 'Mobile App Design',
            time: '5 hours ago',
            icon: 'fa-comment',
            iconClass: 'bg-primary'
        },
        {
            user: 'David Miller',
            action: 'started',
            target: 'API Integration',
            time: 'Yesterday',
            icon: 'fa-play-circle',
            iconClass: 'bg-warning'
        },
        {
            user: 'Jennifer Lee',
            action: 'uploaded',
            target: 'Project Documentation',
            time: 'Yesterday',
            icon: 'fa-file-upload',
            iconClass: 'bg-info'
        },
        {
            user: 'Michael Brown',
            action: 'created',
            target: 'New Marketing Campaign',
            time: '2 days ago',
            icon: 'fa-plus-circle',
            iconClass: 'bg-primary'
        }
    ];
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.iconClass}">
                <i class="fa-solid ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-user">${activity.user}</span>
                    <span class="activity-action">${activity.action}</span>
                    <span class="activity-target">${activity.target}</span>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Populate notification list with demo data
function populateNotificationList() {
    if (!notificationList) return;
    
    const notifications = [
        {
            title: 'New Comment',
            message: 'Sarah commented on your post',
            time: '5 min ago',
            icon: 'fa-comment',
            iconClass: 'bg-primary',
            unread: true
        },
        {
            title: 'Task Completed',
            message: 'Project milestone achieved',
            time: '1 hour ago',
            icon: 'fa-check-circle',
            iconClass: 'bg-success',
            unread: true
        },
        {
            title: 'Meeting Reminder',
            message: 'Team call in 30 minutes',
            time: '2 hours ago',
            icon: 'fa-calendar',
            iconClass: 'bg-warning',
            unread: false
        },
        {
            title: 'New User Registered',
            message: 'New user joined the platform',
            time: 'Yesterday',
            icon: 'fa-user-plus',
            iconClass: 'bg-info',
            unread: false
        },
        {
            title: 'System Update',
            message: 'System will be updated on Friday',
            time: '2 days ago',
            icon: 'fa-sync',
            iconClass: 'bg-danger',
            unread: false
        }
    ];
    
    notificationList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = notification.unread 
            ? 'notification-item unread' 
            : 'notification-item';
        
        notificationItem.innerHTML = `
            <div class="notification-icon ${notification.iconClass}">
                <i class="fa-solid ${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <div class="notification-message">${notification.message}</div>
            </div>
            ${notification.unread ? '<div class="unread-indicator"></div>' : ''}
        `;
        
        notificationList.appendChild(notificationItem);
    });
    
    // Update notification badge count
    const unreadCount = notifications.filter(n => n.unread).length;
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge && unreadCount > 0) {
        notificationBadge.style.display = 'flex';
        notificationBadge.textContent = unreadCount;
    }
    
    // Update message badge
    const messageBadge = document.querySelector('.message-badge');
    if (messageBadge) {
        messageBadge.style.display = 'flex';
        messageBadge.textContent = '3'; // Demo data
    }
}

// Setup action cards
function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Add pulse animation
            card.classList.add('pulse');
            setTimeout(() => {
                card.classList.remove('pulse');
            }, 500);
            
            // Handle different action cards
            const actionTitle = card.querySelector('.action-title')?.textContent || '';
            
            switch(actionTitle) {
                case 'New Project':
                    showSection('new-project');
                    break;
                case 'Task Manager':
                    showSection('tasks');
                    break;  
                case 'Reports':
                    showSection('reports');
                    break;
                case 'Settings':
                    showSection('settings');
                    break;
                default:
                    showSection(actionTitle.toLowerCase().replace(/\s+/g, '-'));
            }
        });
    });
}

// Setup View All links
function setupViewAllLinks() {
    const viewAllLinks = document.querySelectorAll('.view-all');
    
    viewAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the parent card to determine which section to show
            const parentCard = link.closest('.content-card');
            const cardTitle = parentCard.querySelector('.content-card-title')?.textContent || '';
            
            if (cardTitle.toLowerCase().includes('activity')) {
                showSection('activity');
            } else if (cardTitle.toLowerCase().includes('notification')) {
                showSection('notifications');
            }
        });
    });
}

// Handle logout
function handleLogout() {
    // Clear user data from localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    
    // Redirect to login page
    window.location.href = '/login';
}

// Expose necessary functions globally
window.resetDashboard = resetDashboard;
window.showSection = showSection;