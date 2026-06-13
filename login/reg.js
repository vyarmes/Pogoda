document.getElementById('regForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const captcha = document.getElementById('captcha').checked;

  if (!username || !email || !password) {
    alert('Будь ласка, заповніть усі поля');
    return;
  }

  if (!captcha) {
    alert('Будь ласка, підтвердіть, що ви не робот');
    return;
  }

  if (password.length < 6) {
    alert('Пароль повинен мати мінімум 6 символів');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error(`Сервер повернув помилку: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();

    if (data.success) {
      alert('Реєстрація успішна!');
      document.getElementById('regForm').reset();
      window.location.href = '/login.html';
    } else {
      alert('Помилка: ' + (data.error || 'Невідома помилка'));
    }
  } catch (error) {
    alert('Помилка при відправленні: ' + error.message);
    console.error('Помилка:', error);
  }
});
