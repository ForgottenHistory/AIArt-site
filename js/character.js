function loadCharacter () {
  const urlParams = new URLSearchParams(window.location.search)
  const characterName = urlParams.get('name')

  fetch(`/characters/${characterName}`)
    .then(response => response.json())
    .then(character => {
      document.getElementById('characterName').textContent = character.name

      const promptsContainer = document.getElementById('prompts-container')
      character.prompts.forEach((prompt, index) => {
        const promptDiv = document.createElement('div')
        promptDiv.classList.add('prompt')
        promptDiv.innerHTML = `
        <h2>${prompt.title}</h2>
        <p>${prompt.description}</p>
        <p class="deviantart-tags">DeviantArt Tags: ${prompt.deviantartTags}</p>
        <button onclick="copyPrompt('${prompt.description}')">Copy Prompt</button>
        <button onclick="copyDeviantartTags('${prompt.deviantartTags}')">Copy DeviantArt Tags</button>
        <button onclick="editPrompt(${index})">Edit</button>
        <button onclick="deletePrompt(${index})">Delete</button>
        `

        promptsContainer.appendChild(promptDiv)
      })
    })
}

function copyDeviantartTags(tags) {
    const textArea = document.createElement('textarea');
    textArea.value = tags;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

function copyPrompt (promptText) {
  const textArea = document.createElement('textarea')
  textArea.value = promptText
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
  //alert('Prompt copied to clipboard');
}

function showDialog () {
  document.getElementById('addPromptDialog').style.display = 'block'
}

function hideDialog () {
  document.getElementById('addPromptDialog').style.display = 'none'
}

document.getElementById('addPromptButton').addEventListener('click', showDialog)
document
  .getElementById('savePromptButton')
  .addEventListener('click', savePrompt)
document
  .getElementById('cancelPromptButton')
  .addEventListener('click', hideDialog)

function savePrompt () {
  const title = document.getElementById('promptTitle').value
  const description = document.getElementById('promptDescription').value
  const deviantartTags = document.getElementById('deviantartTags').value
  const characterName = document.getElementById('characterName').textContent

  fetch(`/api/characters/${characterName}/add_prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      description: description,
      deviantartTags: deviantartTags
    })
  })
    .then(response => {
      if (response.ok) {
        // alert('Prompt saved successfully');
        // Optionally, you can reload the character page to show the new prompt:
        location.reload()
      } else {
        alert('Error saving prompt')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error saving prompt')
    })

  hideDialog()
}

function editPrompt (index) {
  const characterName = document.getElementById('characterName').textContent

  fetch(`/characters/${characterName}`)
    .then(response => response.json())
    .then(character => {
      const characterPrompts = character.prompts

      const title = prompt(
        'Enter the new title:',
        characterPrompts[index].title
      )
      const description = prompt(
        'Enter the new description:',
        characterPrompts[index].description
      )
      const deviantartTags = prompt(
        'Enter the new DeviantArt tags:',
        characterPrompts[index].deviantartTags
      )

      if (title && description && deviantartTags) {
        fetch(`/characters/${characterName}/edit_prompt`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            index: index,
            title: title,
            description: description,
            deviantartTags: deviantartTags
          })
        }).then(() => {
          window.location.reload()
        })
      }
    })
}

function deletePrompt (index) {
  const characterName = document.getElementById('characterName').textContent

  if (confirm('Are you sure you want to delete this prompt?')) {
    fetch(`/characters/${characterName}/delete_prompt`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index
      })
    }).then(() => {
      window.location.reload()
    })
  }
}

loadCharacter()
