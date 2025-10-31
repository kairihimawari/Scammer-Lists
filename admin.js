const ADMIN_PASSWORD = 'qweqweewq123';
let isAdmin = false;

function promptAdmin() {
  const pass = prompt('Enter admin password to enable editing:');
  if (pass === ADMIN_PASSWORD) {
    isAdmin = true;
    document.getElementById('addBtn').disabled = false;
    document.getElementById('adminBar').style.display = 'inline';
  } else {
    alert('Incorrect password');
  }
}

window.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    promptAdmin();
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  isAdmin = false;
  document.getElementById('addBtn').disabled = true;
  document.getElementById('adminBar').style.display = 'none';
});
