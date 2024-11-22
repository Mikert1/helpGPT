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
        output.innerHTML = `<div class="warning">
        <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" fill="red" class="bi bi-exclamation-triangle"
        viewBox="0 0 16 16">
        <path
            d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
        <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
    </svg>
    <h5>Instal Docker first see README for more info!</h5>
    </div>`;
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
            content.textContent = miniData.content.length > 10 ? miniData.content.substring(0, 45) +
            '...' : miniData.content;
            div.addEventListener('click', () => {
                textarea.value = miniData.content;
                checks();
            });
            deleteBtn.addEventListener('click', async () => {
                const response = await fetch(`http://127.0.0.1:8000/prompt_fragments/${miniData.id}/`,
                    {
                        method: 'DELETE',
                    });
                createCards();
            });
            output.appendChild(clone);
        });
    });
}
createCards();

const submit = document.getElementById('submit-btn');
const score = document.getElementById('display-text').querySelector('h2');

function checks() {
    let count = 3;
    const currentText = textarea.value.toLowerCase();

    if (containsLanguage(currentText, language.languages)) {
        check1.style.borderColor = 'green';
        check1.querySelector('svg').style.color = 'green';
        count--;
    } else {
        check1.style.borderColor = 'red';
        check1.querySelector('svg').style.color = 'red';
    }
    if (currentText.length >= 50) {
        check2.style.borderColor = 'green';
        check2.querySelector('svg').style.color = 'green';
        count--;
    } else {
        check2.style.borderColor = 'red';
        check2.querySelector('svg').style.color = 'red';
    }
    if (currentText.length >= 1) {
        submit.style.backgroundColor = 'white';
    } else {
        submit.style.backgroundColor = 'grey';
        check1.style.borderColor = '#2F2F2F';
        check2.style.borderColor = '#2F2F2F';
        check1.querySelector('svg').style.color = 'rgb(108, 113, 255)';
        check2.querySelector('svg').style.color = 'rgb(234, 132, 68)';
    }
    if (count === 1) {
        score.innerHTML = 'S1';
    } else if (count === 2) {
        score.innerText = 'S2';
    } else {
        score.innerText = 'S3';
    }
    console.log(score);
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
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

submit.addEventListener('click', send);
async function send() {
    const currentText = textarea.value;
    const data = {
        author_id: 1,
        content: currentText,
    };
    postData(data);
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

const texthoi = document.getElementById('input');
const searchBar = document.querySelector('.search-bar');

textarea.addEventListener('input', () => {
    // Reset the textarea's height to recalculate its scroll height
    texthoi.style.height = 'auto';
    // Adjust the height to fit the content
    texthoi.style.height = texthoi.scrollHeight + 'px';
    // Dynamically adjust the height of the search bar to match the textarea
    searchBar.style.height = texthoi.scrollHeight + 30 + 'px'; // Add padding/margin
});
