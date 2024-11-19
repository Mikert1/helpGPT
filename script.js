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