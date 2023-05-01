const charactersGrid = document.getElementById('charactersGrid');
let storedCharacters = [];

function loadCharacters() {
  fetch('/characters_list')
    .then((response) => response.json())
    .then((characters) => {
      storedCharacters = characters;
      characters.forEach((character, index) => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.id = `image-container-${index}`;
        imageContainer.innerHTML = `
          <img src="../characters/${character.name}.png" alt="${character.name}">
          <div class="character-name">${character.name}</div>
        `;
        imageContainer.addEventListener('click', () => {
          window.location.href = `character.html?name=${character.name}`;
        });
        charactersGrid.appendChild(imageContainer);
      });
    });
}

function showDialog() {
  document.getElementById('addCharacterDialog').style.display = 'block';
}

function hideDialog() {
  document.getElementById('addCharacterDialog').style.display = 'none';
}

function saveCharacter() {
  const characterName = document.getElementById('characterNameInput').value;
  const characterImageInput = document.getElementById('characterImageInput');
  const characterImageFile = characterImageInput.files[0];

  if (!characterName || !characterImageFile) {
      alert('Please enter a name and select an image.');
      return;
  }

  const formData = new FormData();
  formData.append('name', characterName);
  formData.append('image', characterImageFile);

  fetch('/add_character', {
      method: 'POST',
      body: formData,
  })
      .then((response) => {
          if (response.ok) {
              location.reload();
          } else {
              alert('Error adding character');
          }
      })
      .catch((error) => {
          console.error('Error:', error);
          alert('Error adding character');
      });

  hideDialog();
}

function filterCharacters(searchText) {
  storedCharacters.forEach((character, index) => {
    const imageContainer = document.getElementById(`image-container-${index}`);
    if (character.name.toLowerCase().includes(searchText.toLowerCase())) {
      imageContainer.style.display = 'inline-block';
    } else {
      imageContainer.style.display = 'none';
    }
  });
}

function setupSearchBar() {
  const searchBar = document.getElementById('character-searchBar');
  searchBar.addEventListener('input', (event) => {
    const searchText = event.target.value;
    filterCharacters(searchText);
  });
}

document.getElementById('addCharacterButton').addEventListener('click', showDialog);
document.getElementById('saveCharacterButton').addEventListener('click', saveCharacter);
document.getElementById('cancelCharacterButton').addEventListener('click', hideDialog);

loadCharacters()
setupSearchBar();