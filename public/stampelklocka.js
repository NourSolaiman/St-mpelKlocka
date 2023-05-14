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
      }
    } else {
      alert(data.message); // Visa ett felmeddelande om stämplingen misslyckas
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

/*
const correctStampButton = document.getElementById('correct-stamp');
correctStampButton.addEventListener('click', handleCorrectStampClick);
*/

// Lägg till en lyssnare för logga ut-knappen
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('userId');
  window.location.href = '/login.html';
});
