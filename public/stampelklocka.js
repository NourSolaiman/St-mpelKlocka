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
      const timeStampText = `Du stämplade ${action === 'in' ? 'in' : 'ut'} kl ${new Date(user.timestamp).toLocaleTimeString()}.`;
      document.getElementById('stamp-info').innerText = `${welcomeText} ${timeStampText}`;

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
  const stampTime = document.getElementById('stamp-time').value;
  
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
      alert('Stämplingen har korrigerats!');
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
