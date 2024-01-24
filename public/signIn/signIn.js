const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {
    const id = document.getElementById('idInput').value;
    const password = document.getElementById('passwordInput').value;

    const data = {
        id: id,
        password: password
    };

    fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        if (data.success) { // 서버에서 'success'라는 키로 true/false를 보내는 경우
            // Redirect to admin main page
            window.location.href = '/admin/main';
        } else {
            // Handle login error
            console.error('Login failed');
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
});
