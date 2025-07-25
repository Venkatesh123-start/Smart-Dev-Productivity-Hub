// --- Navigation logic with section fade-in ---
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
    navItems.forEach(nav => nav.classList.remove('active'));
    sections.forEach(sec => {
      sec.style.display = 'none';
      sec.classList.remove('animate-fadein');
    });
    item.classList.add('active');
    sections[idx].style.display = 'block';
    // Animate section fade-in
    setTimeout(() => sections[idx].classList.add('animate-fadein'), 10);
    // Redraw chart if analytics
    if (idx === 3) drawAnalytics();
  });
});

// --- Productivity Tips & Home Feed ---
const tips = [
  "Break big tasks into smaller, manageable chunks.",
  "Use meaningful variable and function names for better readability.",
  "Regularly review and refactor your code to keep it clean.",
  "Automate repetitive tasks to save time and reduce errors.",
  "Document your code and workflows for future reference.",
  "Take regular breaks to maintain focus and avoid burnout.",
  "Stay updated with the latest trends in your tech stack.",
  "Practice prompt engineering to get better AI outputs.",
  "Collaborate and share knowledge with your peers.",
  "Leverage AI tools to boost your productivity and learning."
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
  tipDiv.classList.remove('animate-fadein');
  setTimeout(() => tipDiv.classList.add('animate-fadein'), 10);
});

// --- Show recent snippets on Home ---
const recentSnippetsList = document.getElementById('recent-snippets');
function showRecentSnippets() {
  const snippets = JSON.parse(localStorage.getItem('snippets')) || [];
  recentSnippetsList.innerHTML = '';
  snippets.slice(-3).reverse().forEach((snip) => {
    const li = document.createElement('li');
    li.innerHTML = `<pre>${snip.code}</pre><small>Tags: ${snip.tags.join(', ')}</small>`;
    recentSnippetsList.appendChild(li);
  });
}
showRecentSnippets();
window.addEventListener('storage', showRecentSnippets);

// --- Snippet Manager Logic ---
const snippetForm = document.getElementById('snippet-form');
const snippetCode = document.getElementById('snippet-code');
const snippetTags = document.getElementById('snippet-tags');
const snippetList = document.getElementById('snippet-list');
function loadSnippets() {
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  snippetList.innerHTML = '';
  snippets.forEach((snip, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<pre>${snip.code}</pre>
      <small>Tags: ${snip.tags.join(', ')}</small>`;
    snippetList.appendChild(li);
  });
  showRecentSnippets();
}
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
loadSnippets();

// --- AI Stand-up Generator Logic ---
const generateStandupBtn = document.getElementById('generate-standup');
const standupResult = document.getElementById('standup-result');
function generateStandupSummary() {
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  if (snippets.length === 0) {
    standupResult.innerHTML = "<span style='color:#e11d48;'>No coding activity found for today.</span>";
    return;
  }
  let summary = "📝 <b>Today's Stand-up Summary:</b><br>";
  summary += `• You worked on <b>${snippets.length}</b> code snippet${snippets.length > 1 ? 's' : ''} today.<br>`;
  const tags = [...new Set(snippets.flatMap(s => s.tags))].filter(Boolean);
  if (tags.length) {
    summary += `• Main topics: <b>${tags.join(', ')}</b>.<br>`;
  }
  summary += "• Keep up the great work! 🚀";
  standupResult.innerHTML = summary;
  standupResult.classList.remove('animate-fadein');
  setTimeout(() => standupResult.classList.add('animate-fadein'), 10);
}
generateStandupBtn.addEventListener('click', generateStandupSummary);

// --- Analytics Section (Chart.js) ---
let chart;
function drawAnalytics() {
  const ctx = document.getElementById('snippets-chart').getContext('2d');
  const snippets = JSON.parse(localStorage.getItem('snippets') || '[]');
  // Count tags
  const tagCounts = {};
  snippets.forEach(snip => {
    snip.tags.forEach(tag => {
      if (!tagCounts[tag]) tagCounts[tag] = 0;
      tagCounts[tag]++;
    });
  });
  const labels = Object.keys(tagCounts);
  const data = Object.values(tagCounts);
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['No tags'],
      datasets: [{
        label: 'Snippets per Tag',
        data: data.length ? data : [0],
        backgroundColor: [
          '#6366f1', '#38bdf8', '#fbc2eb', '#a1c4fd', '#10b981', '#f59e42', '#e11d48'
        ],
        borderRadius: 8
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
  document.getElementById('analytics-summary').innerHTML =
    `<b>Total snippets:</b> ${snippets.length}<br>` +
    `<b>Unique tags:</b> ${labels.length}<br>` +
    `<b>Most used tag:</b> ${Object.entries(tagCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'N/A'}`;
}

// --- Ask AI (Code Explainer & Commenter) ---
const explainForm = document.getElementById('explain-form');
const explainCode = document.getElementById('explain-code');
const explainResult = document.getElementById('explain-result');

explainForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const code = explainCode.value.trim();
  if (!code) {
    explainResult.innerHTML = "<span style='color:#e11d48;'>Please paste your code above.</span>";
    return;
  }
  explainResult.innerHTML = "<em><i class='fa-solid fa-spinner fa-spin'></i> Analyzing code with AI...</em>";
  setTimeout(() => {
    // Simulate more helpful, context-aware AI output
    let explanation = '';
    // Python function
    if (code.match(/def\s+\w+\(/)) {
      explanation = "This is a Python function definition. The function name and parameters are parsed, and the <code>return</code> statement outputs the result. Consider adding docstrings for clarity and handling edge cases.";
    }
    // JavaScript function
    else if (code.match(/function\s+\w+\(/)) {
      explanation = "This is a JavaScript function definition. The function encapsulates reusable logic. Make sure to handle input validation and edge cases.";
    }
    // For loop
    else if (code.match(/for\s*\(.*\)/) || code.match(/for\s+\w+\s+in/)) {
      explanation = "This code contains a loop. Ensure your loop variable is correctly initialized and that you avoid infinite loops. Loops are useful for iterating over arrays, lists, or ranges.";
    }
    // Print statement
    else if (code.includes('print')) {
      explanation = "This code uses the <code>print()</code> function to display output to the console. If you want to print a variable, make sure it's defined above.";
    }
    // If/else
    else if (code.match(/if\s*\(.*\)/) || code.match(/if\s+.*:/)) {
      explanation = "This code uses conditional logic to execute different branches based on a condition. Ensure your conditions are correct and cover all necessary cases.";
    }
    // Class
    else if (code.match(/class\s+\w+/)) {
      explanation = "This is a class definition, which is used to create objects with properties and methods. Classes help organize code and support object-oriented programming.";
    }
    // Default
    else {
      explanation = "This code snippet performs a specific task. For a more detailed explanation, please provide additional context or specify what you want to understand.";
    }
    explainResult.innerHTML = `<strong><i class="fa-solid fa-brain"></i> AI Explanation:</strong><br>${explanation}`;
    explainResult.classList.remove('animate-fadein');
    setTimeout(() => explainResult.classList.add('animate-fadein'), 10);
  }, 900);
});
