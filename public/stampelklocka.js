// Funktion för att stämpla in eller ut användaren
function stamp(action) {
  const id = localStorage.getItem('userId');

  // Gör en POST-förfrågan till '/stamp' för att stämpla in eller ut användaren
  fetch('/stamp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, action }),
  })
  .then(response => response.json()) // Konvertera svaret till JSON-format
  .then(data => {
    if (data.success) {
      const user = data.user;
      const welcomeText = `Välkommen, ${user.namn}!`; // Lägg till användarens namn här
      const timeStampText = `Du stämplade ${action === 'in' ? 'in' : 'ut'}.`;
      const table = createTable(user);
      document.getElementById('stamp-info').innerHTML = `${welcomeText} ${timeStampText}`;
      document.getElementById('stamp-info').appendChild(table);
      // Inaktivera stämpla in-knappen om användaren redan är instämplad
      if (user.inStamplad) {
        document.getElementById('stamp-in').disabled = true;
        document.getElementById('stamp-out').disabled = false; // Aktivera stämpla ut-knappen
      } else {
        document.getElementById('stamp-in').disabled = true; // Aktivera stämpla in-knappen
        document.getElementById('stamp-out').disabled = true;
      }
    } else {
      alert(data.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error); // Logga eventuella fel som uppstår
  });
}

function createTable(user) {
  const table = document.createElement('table');
  const headers = ['ID', 'Personnummer', 'Namn', 'Status', 'Time'];
  const row = document.createElement('tr');

  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    row.appendChild(th);
  });

  table.appendChild(row);

  const dataRow = document.createElement('tr');
  const idCell = document.createElement('td');
  idCell.textContent = user.id;
  dataRow.appendChild(idCell);

  const personnummerCell = document.createElement('td');
  personnummerCell.textContent = user.personnummer;
  dataRow.appendChild(personnummerCell);

  const namnCell = document.createElement('td');
  namnCell.textContent = user.namn;
  dataRow.appendChild(namnCell);

  const statusCell = document.createElement('td');
  statusCell.textContent = user.inStamplad ? 'In' : 'Ut';
  dataRow.appendChild(statusCell);

  const timestampCell = document.createElement('td');
  const timestamp = new Date(user.timestamp).toLocaleString('sv-SE', {
    timeZone: 'Europe/Stockholm',
  });
  timestampCell.textContent = timestamp;
  dataRow.appendChild(timestampCell);
  

  table.appendChild(dataRow);

  return table;
}

// Lägg till en lyssnare för stämpla in-knappen
document.getElementById('stamp-in').addEventListener('click', function() {
  stamp('in');
});

// Lägg till en lyssnare för stämpla ut-knappen
document.getElementById('stamp-out').addEventListener('click', function() {
  stamp('out');
});


// Hantera klick på korrigera-stämpling-knappen
document.getElementById('correct-stamp').addEventListener('click', function() {
  // Visa korrigera-stämpling-dialogrutan
  document.getElementById('correct-stamp-dialog').style.display = 'block';
});

// Hantera inlämning av korrigera-stämpling-formuläret
document.getElementById('correct-stamp-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Hämta värden från formuläret
  const userId = document.getElementById('user-id').value;
  const stampStatus = document.getElementById('stamp-status').value;
  const stampTimeInput = document.getElementById('stamp-time');
  const stampTime = new Date(stampTimeInput.value);

  // Skicka korrigeringen till servern
  fetch('/correct-stamp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, stampStatus, stampTime }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Uppdatera användargränssnittet eller visa en bekräftelsemeddelande
        alert('Stämplingen har korrigerats manuellt och sparats i databasen, tryck på OK för att avsluta processen!');

      } else {
        alert('Det uppstod ett fel. Försök igen.');
      }

      // Återställ formuläret och dölj dialogrutan
      document.getElementById('correct-stamp-form').reset();
      document.getElementById('correct-stamp-dialog').style.display = 'none';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});


// Lägg till en lyssnare för logga ut-knappen
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('userId');
  window.location.href = '/login.html';
});
