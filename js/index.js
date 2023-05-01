document.getElementById('copyButton').addEventListener('click', copyText);
document.getElementById('saveButton').addEventListener('click', saveText);

function copyText() {
    const textToCopy = document.getElementById('textInput');
    textToCopy.select();
    document.execCommand('copy');
    //alert('Text copied to clipboard!');
}

function saveText() {
    const textInput = document.getElementById('textInput').value;
    fetch('/save_text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput, text_name: 'index.txt' }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert('Text saved!');
            } else {
                alert('Error: Unable to save text.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function loadText() {
    fetch(`/get_text/index.txt`)
        .then((response) => response.text())
        .then((data) => {
            document.getElementById('textInput').value = data;
        });
}

// Call loadText when the page is loaded
loadText();
