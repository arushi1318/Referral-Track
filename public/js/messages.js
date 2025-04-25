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

// Message Selection
const messageCheckboxes = document.querySelectorAll('.message-checkbox input');
const selectAllCheckbox = document.createElement('input');
selectAllCheckbox.type = 'checkbox';
document.querySelector('.message-checkbox').prepend(selectAllCheckbox);

selectAllCheckbox.addEventListener('change', () => {
  messageCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
});

// Message Actions
const replyButtons = document.querySelectorAll('.message-actions button:first-child');
const deleteButtons = document.querySelectorAll('.message-actions button:last-child');

replyButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const messageItem = button.closest('.message-item');
    const sender = messageItem.querySelector('.message-sender span').textContent;
    console.log(`Reply to ${sender}`);
  });
});

deleteButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const messageItem = button.closest('.message-item');
    messageItem.style.opacity = '0';
    setTimeout(() => {
      messageItem.remove();
    }, 300);
  });
});

// New Message Button
const newMessageBtn = document.querySelector('.new-message-btn');

newMessageBtn.addEventListener('click', () => {
  // Here you would typically show a modal or navigate to new message page
  console.log('Open new message form');
});

// Search Functionality
const searchInput = document.querySelector('.search-bar input');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const messageItems = document.querySelectorAll('.message-item');
  
  messageItems.forEach(item => {
    const sender = item.querySelector('.message-sender span').textContent.toLowerCase();
    const preview = item.querySelector('.message-preview').textContent.toLowerCase();
    
    if (sender.includes(searchTerm) || preview.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});

// Chat Navigation
const chatItems = document.querySelectorAll('.chat-item');

chatItems.forEach(item => {
  item.addEventListener('click', () => {
    chatItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    // Here you would typically load the chat history
    const chatName = item.querySelector('.chat-name').textContent;
    console.log(`Load chat with ${chatName}`);
  });
});

// Message Status Updates
const messageStatuses = document.querySelectorAll('.message-status');

messageStatuses.forEach(status => {
  status.addEventListener('click', () => {
    const currentStatus = status.getAttribute('data-status');
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    status.setAttribute('data-status', newStatus);
    status.className = `message-status ${newStatus}`;
  });
});

// Emoji Picker
const emojiButton = document.querySelector('.emoji-picker-button');
const emojiPicker = document.querySelector('.emoji-picker');

if (emojiButton && emojiPicker) {
  emojiButton.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
  });
}

// Message Input
const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');

if (messageInput && sendButton) {
  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      console.log('Sending message:', message);
      messageInput.value = '';
    }
  });

  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
} 