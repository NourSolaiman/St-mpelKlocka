// Lägg till en lyssnare för formuläret och förhindra standardformulärhantering
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Hämta personnumret från formuläret
    const personnummer = event.target.personnummer.value;
  
    // Gör en POST-förfrågan till '/login' för att autentisera användaren
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personnummer }),
    })
    .then(response => response.json()) // Konvertera svaret till JSON-format
    .then(data => {
      if (data.success) {
        console.log('User ID:', data.user.id); // Lägg till denna rad för att logga användarens id
        localStorage.setItem('userId', data.user.id); // Spara användarens id i webblager (localStorage)
        window.location.href = '/stampelklocka.html'; // Omdirigera till stampelklocka.html om inloggningen lyckas
      } else {
        alert(data.message); // Visa ett felmeddelande om inloggningen misslyckas
      }
    })
    .catch((error) => {
      console.error('Error:', error); // Logga eventuella fel som uppstår
    });
  });
  