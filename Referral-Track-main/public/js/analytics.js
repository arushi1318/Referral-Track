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

// Chart Configurations
const referralGrowthChart = new Chart(
  document.getElementById('referralGrowthChart'),
  {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Referrals',
        data: [65, 78, 90, 85, 99, 112, 120],
        borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  }
);

const conversionFunnelChart = new Chart(
  document.getElementById('conversionFunnelChart'),
  {
    type: 'bar',
    data: {
      labels: ['Visits', 'Signups', 'Referrals', 'Conversions'],
      datasets: [{
        data: [1000, 750, 500, 250],
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  }
);

// Chart Filter Buttons
document.querySelectorAll('.chart-filter').forEach(button => {
  button.addEventListener('click', (e) => {
    const filterGroup = e.target.parentElement;
    filterGroup.querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    
    // Here you would typically update the chart data based on the selected filter
    // For demo purposes, we'll just simulate a data update
    if (e.target.textContent === 'Weekly') {
      referralGrowthChart.data.datasets[0].data = [45, 52, 60, 65, 72, 80, 85];
    } else if (e.target.textContent === 'Monthly') {
      referralGrowthChart.data.datasets[0].data = [120, 145, 165, 180, 200, 220, 240];
    } else {
      referralGrowthChart.data.datasets[0].data = [65, 78, 90, 85, 99, 112, 120];
    }
    referralGrowthChart.update();
  });
});

// Date Range Picker
const dateRangePicker = document.querySelector('.date-range-picker');
dateRangePicker.addEventListener('click', () => {
  // Here you would typically show a date range picker
  // For demo purposes, we'll just toggle some preset ranges
  const currentText = dateRangePicker.querySelector('span').textContent;
  if (currentText === 'Last 30 Days') {
    dateRangePicker.querySelector('span').textContent = 'Last 7 Days';
  } else if (currentText === 'Last 7 Days') {
    dateRangePicker.querySelector('span').textContent = 'This Month';
  } else {
    dateRangePicker.querySelector('span').textContent = 'Last 30 Days';
  }
}); 