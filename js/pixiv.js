function loadTags() {
  fetch('/json/pixiv_tags.json')
    .then((response) => response.json())
    .then((tags) => {
      const tagsContainer = document.getElementById('tags-container');
      tags.forEach((tag, index) => {
        const tagItem = document.createElement('div');
        tagItem.classList.add('tag-item'); 
        tagItem.innerHTML = `
          <div class="tag-item-text">
            <div class="japanese">${tag.japanese}</div>
            <div class="english">${tag.english}</div>
          </div>
          <div class="tag-item-buttons">
            <button onclick="copyTag('${tag.japanese}')">Copy JP</button>
            <button onclick="copyTag('${tag.english}')">Copy EN</button>
          </div>
        `;
        tagsContainer.appendChild(tagItem);
      });
    });
}

function copyTag (tagText) {
  const textArea = document.createElement('textarea')
  textArea.value = tagText
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

function showDialog () {
  document.getElementById('addTagDialog').style.display = 'block'
}

function hideDialog () {
  document.getElementById('addTagDialog').style.display = 'none'
}

function saveTag () {
  const japaneseTag = document.getElementById('japaneseTag').value
  const englishTag = document.getElementById('englishTag').value

  fetch('/save_pixiv_tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      japanese: japaneseTag,
      english: englishTag
    })
  })
    .then(response => {
      if (response.ok) {
        location.reload()
      } else {
        alert('Error saving tag')
      }
    })
    .catch(error => {
      console.error('Error:', error)
      alert('Error saving tag')
    })

  hideDialog()
}

document.getElementById('addTagButton').addEventListener('click', showDialog)
document.getElementById('saveTagButton').addEventListener('click', saveTag)
document.getElementById('cancelTagButton').addEventListener('click', hideDialog)

loadTags()
