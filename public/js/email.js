// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
  themeIcon.className = 'fas fa-moon';
}

// Email Star Toggle
const starButtons = document.querySelectorAll('.email-star i');

starButtons.forEach(star => {
  star.addEventListener('click', () => {
    star.classList.toggle('far');
    star.classList.toggle('fas');
  });
});

// Email Selection
const emailCheckboxes = document.querySelectorAll('.email-checkbox input');
const selectAllCheckbox = document.createElement('input');
selectAllCheckbox.type = 'checkbox';
document.querySelector('.email-checkbox').prepend(selectAllCheckbox);

selectAllCheckbox.addEventListener('change', () => {
  emailCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
});

// Email Actions
const replyButtons = document.querySelectorAll('.email-actions button:first-child');
const deleteButtons = document.querySelectorAll('.email-actions button:last-child');

replyButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const emailItem = button.closest('.email-item');
    const sender = emailItem.querySelector('.email-sender span').textContent;
    const subject = emailItem.querySelector('.email-subject').textContent;
    console.log(`Reply to ${sender} about "${subject}"`);
  });
});

deleteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const emailItem = button.closest('.email-item');
    emailItem.style.opacity = '0';
    setTimeout(() => {
      emailItem.remove();
    }, 300);
  });
});

// Compose Button
const composeBtn = document.querySelector('.compose-btn');

composeBtn.addEventListener('click', () => {
  // Here you would typically show a modal or navigate to compose page
  console.log('Open compose email form');
});

// Search Functionality
const searchInput = document.querySelector('.search-bar input');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const emailItems = document.querySelectorAll('.email-item');
  
  emailItems.forEach(item => {
    const sender = item.querySelector('.email-sender span').textContent.toLowerCase();
    const subject = item.querySelector('.email-subject').textContent.toLowerCase();
    const preview = item.querySelector('.email-preview').textContent.toLowerCase();
    
    if (sender.includes(searchTerm) || subject.includes(searchTerm) || preview.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});

// Folder Navigation
const folderItems = document.querySelectorAll('.folder-item');

folderItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    folderItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    // Here you would typically load emails for the selected folder
    console.log(`Load ${item.querySelector('span').textContent} folder`);
  });
});

// Label Filtering
const labelItems = document.querySelectorAll('.label-item');

labelItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const label = item.querySelector('span:last-child').textContent;
    // Here you would typically filter emails by label
    console.log(`Filter by ${label} label`);
  });
}); 