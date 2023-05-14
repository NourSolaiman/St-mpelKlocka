document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const personnummer = event.target.personnummer.value;
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personnummer }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('User ID:', data.user.id); // Lägg till denna rad för att logga användarens id
            localStorage.setItem('userId', data.user.id);
            window.location.href = '/stampelklocka.html';
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      });