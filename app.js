const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Så att servern kan servera mina HTML-filer

let stamplar = [];

// Funktion för att ladda data från databasen
function loadFromDatabase() {
  try {
    const data = fs.readFileSync('stamplar.json', 'utf8');
    stamplar = JSON.parse(data);
  } catch (error) {
    console.error('Fel vid inläsning av databasen:', error);
  }
}

// Funktion för att spara data till databasen
function saveToDatabase() {
  try {
    fs.writeFileSync('stamplar.json', JSON.stringify(stamplar));
  } catch (error) {
    console.error('Fel vid sparande till databasen:', error);
  }
}

// Ladda data från databasen vid start
loadFromDatabase();

// Visa login-sidan
app.get('/', (req, res) => {
  res.sendFile('login.html', { root: __dirname + '/public' });
});

app.post('/login', (req, res) => {
  const personnummer = req.body.personnummer;
  const user = stamplar.find(u => u.personnummer === personnummer);

  if (user) {
    res.cookie('personnummer', personnummer); // Lagra personnumret som en cookie
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: 'Användare hittades inte.' });
  }
});


app.post('/stamp', (req, res) => {
  const personnummer = req.cookies.personnummer; // Hämta personnumret från cookien
  const user = stamplar.find(u => u.personnummer === personnummer);
  
  const id = req.body.id;
  console.log('Recived ID:', id); // för att logga användarens id i servern
  const action = req.body.action;
  const timestamp = new Date();

  const foundUser = stamplar.find(u => u.id === parseInt(id));
  console.log('Found User:', foundUser); // för att logga användarobjektet

  if (foundUser) {
    if (action === 'in' && foundUser.inStamplad) {
      res.json({ success: false, message: 'Du är redan in-stämplad.' });
      return;
    }
    
  
    foundUser.inStamplad = action === 'in';
    foundUser.action = action;
    foundUser.timestamp = timestamp;
    console.log('Updated User:', foundUser); // för att logga uppdaterade användarobjektet

    fs.writeFile('stamplar.json', JSON.stringify(stamplar), (err) => {
      if (err) {
        console.error(err);
        res.json({ success: false, message: 'Ett fel inträffade när användardata sparades.' });
        return;
      }
      console.log('Användardata sparades korrekt.');
      res.json({ success: true, user: foundUser });
    });
  } else {
    console.log('User not found');

    res.json({ success: false, message: 'Användare hittades inte.' });
  }
});



app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
