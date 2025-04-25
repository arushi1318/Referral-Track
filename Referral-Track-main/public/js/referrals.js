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

// Select All Checkbox
const selectAllCheckbox = document.getElementById('selectAll');
const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');

selectAllCheckbox.addEventListener('change', () => {
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
});

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
const tableRows = document.querySelectorAll('.referrals-table tbody tr');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  
  tableRows.forEach(row => {
    const name = row.querySelector('.referral-name span').textContent.toLowerCase();
    const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
    const source = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
    
    if (name.includes(searchTerm) || email.includes(searchTerm) || source.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Filter Dropdown
const filterBtn = document.querySelector('.filter-btn');
let filterDropdown = null;

filterBtn.addEventListener('click', () => {
  if (filterDropdown) {
    filterDropdown.remove();
    filterDropdown = null;
    return;
  }

  filterDropdown = document.createElement('div');
  filterDropdown.className = 'filter-dropdown-content';
  filterDropdown.innerHTML = `
    <div class="filter-section">
      <h4>Status</h4>
      <label><input type="checkbox" value="converted"> Converted</label>
      <label><input type="checkbox" value="pending"> Pending</label>
      <label><input type="checkbox" value="in-progress"> In Progress</label>
    </div>
    <div class="filter-section">
      <h4>Source</h4>
      <label><input type="checkbox" value="direct-link"> Direct Link</label>
      <label><input type="checkbox" value="email"> Email Campaign</label>
      <label><input type="checkbox" value="social"> Social Media</label>
    </div>
    <div class="filter-actions">
      <button class="apply-filter">Apply</button>
      <button class="reset-filter">Reset</button>
    </div>
  `;

  filterBtn.parentElement.appendChild(filterDropdown);

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
      filterDropdown.remove();
      filterDropdown = null;
    }
  });
});

// Action Buttons
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const action = e.currentTarget.querySelector('i').className;
    const row = e.currentTarget.closest('tr');
    const name = row.querySelector('.referral-name span').textContent;

    if (action.includes('edit')) {
      // Handle edit action
      console.log(`Edit ${name}`);
    } else if (action.includes('envelope')) {
      // Handle email action
      console.log(`Email ${name}`);
    } else if (action.includes('ellipsis')) {
      // Handle more options
      console.log(`More options for ${name}`);
    }
  });
});

// Pagination
const paginationBtns = document.querySelectorAll('.pagination-btn');

paginationBtns.forEach(btn => {
  if (!btn.disabled) {
    btn.addEventListener('click', () => {
      document.querySelector('.pagination-btn.active')?.classList.remove('active');
      if (!btn.querySelector('i')) {
        btn.classList.add('active');
      }
      // Here you would typically fetch and display the next page of results
      console.log(`Navigate to page ${btn.textContent}`);
    });
  }
});

// New Referral Button
const newReferralBtn = document.querySelector('.new-referral-btn');

newReferralBtn.addEventListener('click', () => {
  // Here you would typically show a modal or navigate to a new referral form
  console.log('Add new referral');
}); 