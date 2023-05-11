// Hämta DOM-element
const loginBtn = document.getElementById("personnummer");
const punchInBtn = document.getElementById("punch-in-btn");
const punchOutBtn = document.getElementById("punch-out-btn");
//const breakInBtn = document.getElementById("break-in-btn");
//const breakOutBtn = document.getElementById("break-out-btn");
const logOutBtn = document.getElementById("logout-btn");
const statusDiv = document.getElementById("punch-status");
const dateTimeSpan = document.getElementById("date-time");



// Definiera variabler för stämplingar
let isLoggedIn = false;
let isPunchedIn = false;
let isOnBreak = false;
let punchInTime = null;
let punchOutTime = null;
//let breakInTime = null;
//let breakOutTime = null;

let anstallda = [
  {id: 1, personnummer: "198701011234", namn: "Anna Andersson", inStamplad: false },
  { id: 2, personnummer: "199002022345", namn: "Bengt Bengtsson", inStamplad: false },
  { id: 3, personnummer: "199503033456", namn: "Carl Carlsson", inStamplad: false }
];




let session = {
  anstalld: null
};

// Funktion för att logga in användare
function loggaIn() {
  let personnummer = document.getElementById("personnummer").value;
  let anstalld = hittaAnstalld(personnummer);
  if (anstalld) {
    session.anstalld = anstalld;
    isLoggedIn = true;
    window.location.href = "stampelklocka.html";
  } else {
    alert("Felaktigt personnummer. Försök igen.");
  }
}

function hittaAnstalld(personnummer) {
  for (let i = 0; i < anstallda.length; i++) {
    if (anstallda[i].personnummer == personnummer) {
      return anstallda[i];
    }
  }
  return null;
}
// Uppdatera textinnehållet i välkomstmeddelandet med användarens namn
const anstalldElement = document.getElementById("anstalld-id-namn");
if (session.anstalld) {
  anstalldElement.textContent = session.anstalld.namn + "!";
} else {
  anstalldElement.textContent = "Välkommen!";
}

//Funktion för att visa datum


function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false // Visa tiden i 24-timmarsformat
  };
  dateTimeSpan.textContent = now.toLocaleDateString('sv-SE', options);
}

setInterval(updateDateTime, 1000);



// Funktion för att stämpla in
function punchIn() {
  if (isPunchedIn) {
    alert("Du har redan stämplat in!");
    return;
  }
  isPunchedIn = true;
  punchInTime = new Date();
  
  
  
  // Anropa servern med en GET-begäran för att hämta senaste stämplingsdata
  fetch('/get-latest-shift')
    .then(response => response.json())
    .then(data => {
      // Uppdatera stämpelstatusen på användarens skärm med den hämtade datan
      const punchStatus = document.getElementById('punch-status');
      punchStatus.innerHTML = `Senaste stämpel: ${data.type}, ${data.time}`;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }



    /*
  // Anropa servern med en POST-begäran för att skicka stämplingsdata
  fetch('/punch-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "punchIn" }),
  })
  .then(response => response.json())
  .then(data => {
    // Uppdatera stämpelstatusen på användarens skärm med den skickade datan
    const punchStatus = document.getElementById('punch-status');
    punchStatus.innerHTML = `Senaste stämpel: ${data.type}, ${data.time}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
*/

/*

$(document).ready(function() {
  $('#punch-in-btn').click(function() {
    // Gör en HTTP GET-förfrågan till servern
    $.ajax({
      url: '/get-latest-shift',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        // Uppdatera HTML-innehållet på sidan med de nya stämplingarna
        $('#latest-shift').text(data.time);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
  });
});

*/


// Funktion för att stämpla ut
function punchOut() {
  if (isPunchedIn) {
    alert("Du måste stämpla in först!");
    return;
  }

  punchOutTime = new Date();
  isPunchedIn = false;
// Anropa servern med en GET-begäran för att hämta senaste stämplingsdata
fetch('/get-latest-shift')
.then(response => response.json())
.then(data => {
  // Uppdatera stämpelstatusen på användarens skärm med den hämtade datan
  const punchStatus = document.getElementById('punch-status');
  punchStatus.innerHTML = `Senaste stämpel: ${data.type}, ${data.time}`;
})
.catch(error => {
  console.error('Error:', error);
});
}

  /*
  fetch('/punch-out', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: "punch-out" }),
  })
  .then(response => response.json())
  .then(data => {
    // Uppdatera stämpelstatusen på användarens skärm med den skickade datan
    const punchStatus = document.getElementById('punch-status');
    punchStatus.innerHTML = `Senaste stämpel: ${data.type}, ${data.time}`;
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */



/*
// Funktion för att ta en paus
function breakIn() {
  if (!isPunchedIn) {
    alert("Du måste stämpla in först!");
    return;
  }

  if (isOnBreak) {
    alert("Du har redan pågående paus!");
    return;
  }

  breakInTime = new Date();
  isOnBreak = true;
  updatePunchStatus();
}



// Funktion för att avsluta paus
function breakOut() {
  if (!isOnBreak) {
    alert("Du har ingen pågående paus!");
    return;
  }

  breakOutTime = new Date();
  isOnBreak = false;
  updatePunchStatus();
}

*/

/*

// Funktion för att uppdatera stämpelstatus

function updatePunchStatus() {

  let statusText = "Du är ";

  if (!isPunchedIn) {
    statusText += "utstämplad! " + punchOutTime.toLocaleTimeString();
  } else {
    statusText += "stämplad sedan " + punchInTime.toLocaleTimeString();

    if (isOnBreak) {
      statusText += ", din paus startade " + breakInTime.toLocaleTimeString();
    } else {
      statusText += ", du har ingen pågående paus.";
    }
  }
    statusDiv.innerHTML = statusText;
}

*/




/*
// Hämta stämplingar från servern och uppdatera tabellen på webbsidan
fetch('/stamplar')
  .then(response => response.json())
  .then(stamplingsData => {
    const table = document.getElementById('container');

    // Rensa befintliga rader i tabellen
    table.innerHTML = '';

    // Skapa nya rader för varje stämpling
    stamplingsData.forEach(stampling => {
      const row = table.insertRow();
      row.insertCell().textContent = stampling.userId;
      row.insertCell().textContent = stampling.type;
      row.insertCell().textContent = stampling.time;
    });
  });
*/



// Funktion för att logga ut
function logOut() {
  window.location.href = "login.html";
}

// Lägg till en lyssnare på klickhändelsen för knappen
loginBtn.addEventListener("click", function(event) {
  event.preventDefault();
  loggaIn();
});

punchInBtn.addEventListener("click", function(event) {
  event.preventDefault();
  punchIn();
});

punchOutBtn.addEventListener("click", function(event) {
  event.preventDefault();
  punchOut();
});
/*
breakInBtn.addEventListener("click", function(event) {
  event.preventDefault();
  punchIn();
});

breakOutBtn.addEventListener("click", function(event) {
    event.preventDefault();
    punchOut();
  });
*/
logOutBtn.addEventListener("click", function(event) {
  event.preventDefault();
  logOut();
});