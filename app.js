// Placeholder for your JavaScript logic
console.log('Smart Dev Productivity Hub loaded!');

const navItems = document.querySelectorAll('.sidebar li');
const sections = [
  document.getElementById('home-section'),
  document.getElementById('snippets-section'),
  document.getElementById('standup-section'),
  document.getElementById('analytics-section'),
  document.getElementById('askai-section')
];

navItems.forEach((item, idx) => {
  item.addEventListener('click', () => {
    // Remove active class from all nav items
    navItems.forEach(nav => nav.classList.remove('active'));
    // Hide all sections
    sections.forEach(sec => sec.style.display = 'none');
    // Activate clicked nav and show corresponding section
    item.classList.add('active');
    sections[idx].style.display = 'block';
  });
});

// Snippet Manager Logic
const snippetForm = document.getElementById('snippet-form');
const snippetCode = document.getElementById('snippet-code');
const snippetTags = document.getElementById('snippet-tags');
const snippetList = document.getElementById('snippet-list');

// Load snippets from LocalStorage
function loadSnippets() {
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  snippetList.innerHTML = '';
  snippets.forEach((snip, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<pre>${snip.code}</pre>
      <small>Tags: ${snip.tags.join(', ')}</small>`;
    snippetList.appendChild(li);
  });
}

// Save a new snippet
snippetForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const code = snippetCode.value.trim();
  const tags = snippetTags.value.split(',').map(t => t.trim()).filter(Boolean);
  if (!code) return;
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  snippets.push({ code, tags });
  localStorage.setItem('snippets', JSON.stringify(snippets));
  snippetCode.value = '';
  snippetTags.value = '';
  loadSnippets();
});

// Initial load
loadSnippets();

// AI Stand-up Generator Logic
const generateStandupBtn = document.getElementById('generate-standup');
const standupResult = document.getElementById('standup-result');

function generateStandupSummary() {
  // Get today's snippets (simulate by using all snippets for now)
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  if (snippets.length === 0) {
    standupResult.textContent = "No coding activity found for today.";
    return;
  }

  // Simulate prompt engineering & LLM summary
  let summary = "📝 **Today's Stand-up Summary:**\n";
  summary += `• You worked on ${snippets.length} code snippet${snippets.length > 1 ? 's' : ''} today.\n`;
  const tags = [...new Set(snippets.flatMap(s => s.tags))].filter(Boolean);
  if (tags.length) {
    summary += `• Main topics: ${tags.join(', ')}.\n`;
  }
  summary += "• Keep up the great work! 🚀";

  // Display summary (formatting for HTML)
  standupResult.innerHTML = summary.replace(/\n/g, '<br>');
}

generateStandupBtn.addEventListener('click', generateStandupSummary);

// Code Explainer & Commenter Logic
const explainForm = document.getElementById('explain-form');
const explainCode = document.getElementById('explain-code');
const explainResult = document.getElementById('explain-result');

explainForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const code = explainCode.value.trim();
  if (!code) {
    explainResult.textContent = "Please paste some code to explain.";
    return;
  }

  // Simulate AI explanation (you can enhance this logic)
  let explanation = "🔍 **AI Explanation:**\n";
  if (code.includes('for') && code.includes('range')) {
    explanation += "This appears to be a Python for-loop iterating over a range of values.";
  } else if (code.includes('function') || code.includes('def')) {
    explanation += "This is a function definition. The code inside defines its behavior.";
  } else if (code.includes('if') && code.includes('else')) {
    explanation += "This code uses conditional logic to execute different branches.";
  } else {
    explanation += "This code snippet performs a specific task. Please provide more context for a detailed explanation.";
  }

  explainResult.innerHTML = explanation.replace(/\n/g, '<br>');
  explainCode.value = '';
});

// Productivity Tips & Learning Feed Logic
const tips = [
  "Break big tasks into smaller, manageable chunks.",
  "Use meaningful variable and function names for better readability.",
  "Regularly review and refactor your code to keep it clean.",
  "Automate repetitive tasks to save time and reduce errors.",
  "Document your code and workflows for future reference.",
  "Take regular breaks to maintain focus and avoid burnout.",
  "Leverage AI tools like Pieces Copilot to boost productivity.",
  "Stay updated with the latest trends in your tech stack.",
  "Practice prompt engineering to get better AI outputs.",
  "Collaborate and share knowledge with your peers."
];

let currentTip = 0;
const tipDiv = document.getElementById('productivity-tip');
const nextTipBtn = document.getElementById('next-tip');

function showTip(idx) {
  tipDiv.textContent = tips[idx];
}
showTip(currentTip);

nextTipBtn.addEventListener('click', () => {
  currentTip = (currentTip + 1) % tips.length;
  showTip(currentTip);
});

// Show recent snippets on Home
const recentSnippetsList = document.getElementById('recent-snippets');
function showRecentSnippets() {
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  recentSnippetsList.innerHTML = '';
  snippets.slice(-3).reverse().forEach(snip => {
    const li = document.createElement('li');
    li.innerHTML = `<pre>${snip.code}</pre><small>Tags: ${snip.tags.join(', ')}</small>`;
    recentSnippetsList.appendChild(li);
  });
}
showRecentSnippets();
window.addEventListener('storage', showRecentSnippets); // Update if LocalStorage changes

// Analytics (Charts/Visualization) Logic
function renderAnalytics() {
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  const tagCounts = {};
  snippets.forEach(snip => {
    snip.tags.forEach(tag => {
      if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Prepare data for Chart.js
  const ctx = document.getElementById('snippets-chart').getContext('2d');
  // Destroy previous chart if exists
  if (window.snippetsChart) window.snippetsChart.destroy();

  window.snippetsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(tagCounts),
      datasets: [{
        label: 'Tag Frequency',
        data: Object.values(tagCounts),
        backgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Analytics summary
  const summaryDiv = document.getElementById('analytics-summary');
  summaryDiv.innerHTML = `
    <strong>Total snippets:</strong> ${snippets.length}<br>
    <strong>Unique tags:</strong> ${Object.keys(tagCounts).length}<br>
    <strong>Most used tag:</strong> ${Object.entries(tagCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A'}
  `;
}

// Render analytics when Analytics section is shown
document.getElementById('nav-analytics').addEventListener('click', renderAnalytics);
