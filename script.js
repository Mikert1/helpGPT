async function getData(dataType) {
    const response = await fetch(`http://127.0.0.1:8000/${dataType}/`);
    const data = await response.json();
    return data;
}

const output = document.getElementById('output');
const template = document.querySelector('template');

getData('prompt_fragments').then(data => {
    data.forEach(miniData => {
        const clone = template.content.cloneNode(true);
        const content = clone.querySelector('p');
        const deleteBtn = clone.querySelector('button');
        content.textContent = miniData.description;
        deleteBtn.addEventListener('click', async () => {
        const response = await fetch(`http://127.0.0.1:8000/prompt_fragments/${miniData.id}/`,
            {
                method: 'DELETE'
            });
        });
        output.appendChild(clone);
    });
});




document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        const newData = {
            author_id: 1,
            content: "Sample content",
            description: "Sample description"
        };
        postData(newData).then(response => {
            console.log('Data posted:', response);
        }).catch(error => {
            console.error('Error posting data:', error);
        });
    } else if (event.key === 'd') {
        
    }
});

async function postData(data) {
    const response = await fetch('http://127.0.0.1:8000/prompt_fragments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}



const sidebar = document.getElementById('sidebar');
const insideToggleBtn = document.getElementById('insideToggleBtn');
const outsideToggleBtn = document.getElementById('outsideToggleBtn');
const content = document.getElementById('content');
const namemove = document.getElementById('name');

function showSidebar() {
    sidebar.classList.remove('hidden');
    content.classList.remove('collapsed');
    outsideToggleBtn.classList.remove('visible');
    namemove.classList.add('left');
}

function hideSidebar() {
    sidebar.classList.add('hidden');
    content.classList.add('collapsed');
    outsideToggleBtn.classList.add('visible');
    namemove.classList.remove('left');
}


insideToggleBtn.addEventListener('click', hideSidebar);
outsideToggleBtn.addEventListener('click', showSidebar);


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
const check1 = document.getElementById('check-1');
const check2 = document.getElementById('check-2');

textarea.addEventListener('input', (event) => {
    const currentText = event.target.value.toLowerCase();
    if (containsLanguage(currentText, language.languages)) {
        outputCheck.innerHTML = 'Language detected';
        check1.style.borderColor = 'green';
    } else {
        outputCheck.innerHTML = 'No language detected';
        check1.style.borderColor = 'red';
    }
    if (currentText.length >= 50) {
        console.log(`Text length is ${currentText.length} characters.`);
        check2.style.borderColor = 'green';
    } else {
        check2.style.borderColor = 'red';
    }
});
