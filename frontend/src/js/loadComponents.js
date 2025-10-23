function loadHeader() {
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            const userName = localStorage.getItem('userName') || 'Usuario';
            document.getElementById('userName').textContent = userName;
        })
        .catch(error => console.error('Error:', error));
}

function handleLogout() {
    localStorage.clear();
    window.location.href = '../pages/login_usuario.html';
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
});