const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

console.log('Server starting...')

function createDirectories() {
  const directories = ['txt', 'json', 'characters'];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory '${dir}' created.`);
    } else {
      //console.log(`Directory '${dir}' already exists.`);
    }
  });
}

createDirectories();

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/save_text', (req, res) => {
  const textData = req.body.text
  fs.writeFileSync("txt/" + req.body.text_name, textData)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

app.get('/get_text/:name', (req, res) => {
  const fileName = "txt/" + req.params.name;
  if (fs.existsSync(fileName)) {
    const textData = fs.readFileSync(fileName, 'utf-8');
    res.send(textData);
  } else {
    fs.writeFileSync(fileName, '');
    res.send('');
  }
});

app.get('/characters/:name', (req, res) => {
  const characterName = req.params.name
  const characterData = fs.readFileSync(
    `./characters/${characterName}.json`,
    'utf-8'
  )
  res.send(characterData)
})

app.get('/characters_list', (req, res) => {
  const files = fs.readdirSync('./characters')
  const characterFiles = files.filter(file => file.endsWith('.json'))
  const characterList = characterFiles.map(file => {
    const characterData = JSON.parse(
      fs.readFileSync(`./characters/${file}`, 'utf-8')
    )
    return { name: characterData.name, image: characterData.image }
  })
  res.send(characterList)
})

app.post('/api/characters/:name/add_prompt', (req, res) => {
  const characterName = req.params.name
  const promptTitle = req.body.title
  const promptDescription = req.body.description
  const deviantartTags = req.body.deviantartTags

  const characterFilePath = `./characters/${characterName}.json`
  const characterData = JSON.parse(fs.readFileSync(characterFilePath, 'utf-8'))

  characterData.prompts.push({
    title: promptTitle,
    description: promptDescription,
    deviantartTags: deviantartTags
  })

  fs.writeFileSync(characterFilePath, JSON.stringify(characterData, null, 2))
  res.sendStatus(200)
})

app.put('/characters/:name/edit_prompt', (req, res) => {
  const characterName = req.params.name;
  const { index, title, description, deviantartTags } = req.body;

  const characterFilePath = `./characters/${characterName}.json`;
  const characterData = JSON.parse(fs.readFileSync(characterFilePath, 'utf-8'));

  characterData.prompts[index].title = title;
  characterData.prompts[index].description = description;
  characterData.prompts[index].deviantartTags = deviantartTags;

  fs.writeFileSync(characterFilePath, JSON.stringify(characterData, null, 2));
  res.sendStatus(200);
});

app.delete('/characters/:name/delete_prompt', (req, res) => {
  const characterName = req.params.name
  const index = req.body.index

  const characterFilePath = `./characters/${characterName}.json`
  const characterData = JSON.parse(fs.readFileSync(characterFilePath, 'utf-8'))

  characterData.prompts.splice(index, 1)

  fs.writeFileSync(characterFilePath, JSON.stringify(characterData, null, 2))
  res.sendStatus(200)
})

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './characters')
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.name}.png`)
  }
})
const upload = multer({ storage: storage })

app.post('/add_character', upload.single('image'), (req, res) => {
  const characterName = req.body.name
  const characterData = {
    name: characterName,
    image: `${characterName}.png`,
    prompts: []
  }

  const characterFilePath = `./characters/${characterName}.json`
  fs.writeFileSync(characterFilePath, JSON.stringify(characterData, null, 2))

  res.sendStatus(200)
})

app.post('/save_pixiv_tag', (req, res) => {
  const newTag = req.body;
  const filePath = './json/pixiv_tags.json';
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading tags file');
    } else {
      const tags = JSON.parse(data);
      tags.push(newTag);
      fs.writeFile(filePath, JSON.stringify(tags), err => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing tags file');
        } else {
          res.status(200).send('Tag saved successfully');
        }
      });
    }
  });
});
