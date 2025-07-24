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