const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();


function loadShiftFromDatabase() {
  const rawData = fs.readFileSync('stamplar.json');
  return JSON.parse(rawData);
}

function saveShiftToDatabase(shift) {
  const data = JSON.stringify(shift);
  fs.writeFileSync('stamplar.json', data);
}


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.json()); // för att tolka JSON-data i HTTP POST-förfrågan
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Visa login-sidan
app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/public/login.html');
});

// Visa stämplingsformuläret
app.get('/stampelklocka', (req,res)=>{
  res.sendFile(__dirname + '/public/stampelklocka.html');
});


// Punch-in route som spara tid och datum till databasen
app.post('/punch-in', (req, res) => {
  // Get the current time and date
  const now = new Date();
  
  // Create an object with the current time and date
  const punchInData = { type: "punchIn", time: now.toString()};
  // Save punch-in data to the stamplar.json file
  const shifts = loadShiftFromDatabase();
  shifts.push(punchInData);
  saveShiftToDatabase(shifts);
  // Redirect to the stampelklocka page with the success message as a query parameter
  res.redirect(`/stampelklocka?successMessage=${encodeURIComponent('Punch-in successful')}`);
});


// Punch-ut route som spara tid och datum till databasen
app.post('/punch-out', (req, res) => {
  // Get the current time and date
  const now = new Date();
  
  // Create an object with the current time and date
  const punchUtData = { type: "punch-out", time: now.toString()};
  // Save punch-in data to the stamplar.json file
  const shifts = loadShiftFromDatabase();
  shifts.push(punchUtData);
  saveShiftToDatabase(shifts);
  // Redirect to the stampelklocka page with the success message as a query parameter
  res.redirect(`/stampelklocka?successMessage=${encodeURIComponent('Punch-out successful')}`);
});


// Funktioner som läser och skriver till JSON-filen
app.get('/get-latest-shift', (req, res) => {
  const shifts = loadShiftFromDatabase();
  const latestShift = shifts[shifts.length - 1];
  res.json(latestShift);
});


/*
// Hämta alla stämplade tider för en användare
app.get('/shifts/:type', (req, res) => {
  const type = req.params.type;
  const shifts = loadShiftFromDatabase().filter(shift => shift.type === type);
  res.json(shifts);
});
*/


/*
// Break in processen
const stamps = {};

// Handle break-in request
app.post('/break-in', (req, res) => {
  const userId = req.body.userId;
  const timestamp = Date.now();
  
  if (!stamps[userId]) {
    stamps[userId] = [];
  }
  
  stamps[userId].push({ type: 'break-in', timestamp });
  res.sendStatus(200);
});



// Handle break-out request ----------------- kolla slutat på koden i SOF/Chat och försök att lösa detta!
app.post('/break-out', async (req, res) => {
  // Check if a break is currently in progress
  const breakInProgress = await checkBreakInProgress();

  if (breakInProgress) {
    // Load the shift from the database
    const shift = loadShiftFromDatabase();

    // Update the shift with the end time of the break
    shift.breakEnd = new Date();

    // Save the updated shift to the database
    saveShiftToDatabase(shift);

    // Send a success response
    res.status(200).send('Break ended successfully.');
  } else {
    // Send an error response if there's no break in progress
    res.status(400).send('No break currently in progress');
  }
});



app.post('/punch-out', (req, res) => {
    // Get the current time and date
    const now = new Date();

    // Load the employee's work shift from the database or file
    const shift = loadShiftFromDatabase(req.body.employeeId);

    // If the shift is null, the employee is not currently clocked in
    if (shift === null) {
    res.status(400).send('Employee is not currently clocked in');
    return;
    }

    // If the employee has already clocked out, return an error
    if (shift.punchOutTime !== null) {
    res.status(400).send('Employee has already clocked out');
    return;
    }

    // Update the work shift with the punch-out time
    shift.punchOutTime = now;

    // Save the updated work shift to the database or file
    saveShiftToDatabase(req.body.employeeId, shift);

    // Send a response back to the client indicating that the punch-out was successful
    res.send('Punch-out successful');
});

// Handle stamp list request
app.get('/stamplar', (req, res) => {
  const userId = req.query.userId;
  
  if (!stamps[userId]) {
    return res.status(404).send('No stamps found for user');
  }
  
  res.json(stamps[userId]);
});

// Endpoint för att hämta data från stamplar.json
app.get('/stamplar', (req, res) => {
  // Läs innehållet från stamplar.json-filen
  const fs = require('fs');
  const stamplar = JSON.parse(fs.readFileSync('./stamplar.json', 'utf8'));

  // Skicka tillbaka datan som JSON
  res.json(stamplar);
});

*/


const port = 3000;

app.listen(port, () =>{
    console.log(`Server is litening on port ${port}`);
})