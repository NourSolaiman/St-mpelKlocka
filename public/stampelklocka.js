function stamp(action) {
  const id = localStorage.getItem('userId');

  fetch('/stamp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, action }),
  })
  .then(response => response.json())
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
      alert(data.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

document.getElementById('stamp-in').addEventListener('click', function() {
  stamp('in');
});

document.getElementById('stamp-out').addEventListener('click', function() {
  stamp('out');
});
/*
const correctStampButton = document.getElementById('correct-stamp');
correctStampButton.addEventListener('click', handleCorrectStampClick);
*/
// logga ut
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('userId');
  window.location.href = '/login.html';
});
