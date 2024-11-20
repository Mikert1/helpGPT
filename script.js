async function getData(dataType) {
    const response = await fetch('http://127.0.0.1:8000/prompt_fragments/');
    const data = await response.json();
    return data;
}

const output = document.getElementById('output');

getData('prompt_fragments').then(data => {
    data.forEach(miniData => {
        const div = document.createElement('div');
        div.innerHTML = miniData.content;
        output.appendChild(div);
    });
});

const sidebar = document.getElementById('sidebar');
const insideToggleBtn = document.getElementById('insideToggleBtn');
const outsideToggleBtn = document.getElementById('outsideToggleBtn');
const content = document.getElementById('content');

// Function to show the sidebar
function showSidebar() {
    sidebar.classList.remove('hidden');
    content.classList.remove('collapsed');
    outsideToggleBtn.classList.remove('visible'); // Hide the outside button
}

// Function to hide the sidebar
function hideSidebar() {
    sidebar.classList.add('hidden');
    content.classList.add('collapsed');
    outsideToggleBtn.classList.add('visible'); // Show the outside button
}

// Event listeners for both buttons
insideToggleBtn.addEventListener('click', hideSidebar);
outsideToggleBtn.addEventListener('click', showSidebar);
