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
