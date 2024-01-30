// Get the form element
const form = document.querySelector('#changingPasswordForm');

// Add a submit event listener to the form
form.addEventListener('submit', async (event) => {
    // Prevent the form from submitting
    event.preventDefault();

    // Get the input values
    const password = document.querySelector('#checkPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    // Check if all fields are filled
    if (password && newPassword && confirmPassword === false) {
        alert('모든 내용을 입력해주세요.');
        return;
    }
    
        // 입력한 password가 맞는지 API를 통해 확인
    const response = await fetch('/api/account/checkPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (data.success === false) {
        // Display an error message for password mismatch
        alert('기존 비밀번호가 일치하지 않습니다.');
        return;
    }
        // Check if the password and confirm password match   
    if(password === newPassword) {
        alert('기존 비밀번호와 새 비밀번호가 일치합니다.');
        return;
    }
    if (newPassword === confirmPassword) {
        // All validations passed, submit the form
        form.submit();
    } else {
        // Display an error message for password mismatch
        alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }    
});