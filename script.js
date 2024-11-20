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

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    content.classList.toggle('collapsed');
    toggleBtn.classList.toggle('collapsed');
});

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsLanguage(str, languages) {
    const validLanguages = languages
        .filter(lang => lang && typeof lang === 'string')
        .map(lang => escapeRegex(lang));

    
    const pattern = new RegExp(`\\b(${validLanguages.join('|')})\\b`, 'i');
    return pattern.test(str);
}

let language = {};
fetch("languages.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        language = data;
    });
const textarea = document.getElementById('input');
const outputCheck = document.getElementById('outputCheck');

textarea.addEventListener('input', (event) => {
    const currentText = event.target.value.toLowerCase();
    if (containsLanguage(currentText, language.languages)) {
        outputCheck.innerHTML = 'Language detected';
    } else {
        outputCheck.innerHTML = 'No language detected';
    }
});
