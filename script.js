async function getData(dataType) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/${dataType}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        output.innerHTML = 'To see the cards, please use docker as described in the README.md.';
        return null;
    }
}

const output = document.getElementById('output');
const template = document.querySelector('template');

function createCards() {
    output.innerHTML = '';
    getData('prompt_fragments').then(data => {
        data.forEach(miniData => {
            const clone = template.content.cloneNode(true);
            const content = clone.querySelector('p');
            const deleteBtn = clone.querySelector('button');
            const div = clone.querySelector('div');
            content.textContent = miniData.content.length > 10 ? miniData.content.substring(0, 45) + '...' : miniData.content;
            div.addEventListener('click', () => {
                textarea.value = miniData.content;
                checks();
            });
            deleteBtn.addEventListener('click', async () => {
            const response = await fetch(`http://127.0.0.1:8000/prompt_fragments/${miniData.id}/`,
                {
                    method: 'DELETE'
                });
                createCards();
            });
            output.appendChild(clone);
        });
    });
}
createCards();

function checks() {
    const currentText = textarea.value.toLowerCase();
    
    if (containsLanguage(currentText, language.languages)) {
        outputCheck.innerHTML = 'Language detected';
        check1.style.borderColor = 'green';
    } else {
        outputCheck.innerHTML = 'No language detected';
        check1.style.borderColor = 'red';
    }
    if (currentText.length >= 50) {
        check2.style.borderColor = 'green';
    } else {
        check2.style.borderColor = 'red';
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'a') {
        const newData = {
            author_id: 1,
            content: "Sample content",
        };
        postData(newData).then(response => {
            console.log('Data posted:', response);
        }).catch(error => {
            console.error('Error posting data:', error);
        });
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

textarea.addEventListener('input', () => {
    checks();
});

const submit = document.getElementById('submit-btn');
submit.addEventListener('click', send);
async function send() {
    const currentText = textarea.value;
    data = {
        author_id: 1,
        content: currentText,
    };
    postData(data)
    createCards();
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(currentText)}`, '_blank');
}

// JavaScript to handle the dropdown toggle on click (if you want to allow toggling)
document.querySelector('.profile-dropdown').addEventListener('click', function (e) {
    const dropdown = this.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    // Prevent click event from propagating to body to avoid immediate closing when clicking inside dropdown
    e.stopPropagation();
});

// Close dropdown if clicked outside
document.addEventListener('click', function () {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.style.display = 'none';
});
