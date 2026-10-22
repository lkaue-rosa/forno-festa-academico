/* Forno & Festa — demonstração front-end para trabalho acadêmico.
   Não use este mecanismo local para guardar credenciais reais. */
(function () {
  const USERS_KEY = 'fornoFestaUsersV2';
  const CURRENT_KEY = 'fornoFestaCurrentUserV2';
  const readUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch { return []; }
  };
  const showMessage = (id, text, success = false) => {
    const el = document.getElementById(id);
    if (el) { el.textContent = text; el.style.color = success ? '#28784e' : '#c9342d'; }
  };

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    if (password.length < 6) return showMessage('message', 'A senha precisa ter pelo menos 6 caracteres.');
    if (password !== confirm) return showMessage('message', 'As senhas não conferem. Digite novamente.');
    const users = readUsers();
    if (users.some((user) => user.email === email)) return showMessage('message', 'Este e-mail já está cadastrado neste navegador.');
    users.push({ name, email, phone, password, createdAt: new Date().toISOString() });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    showMessage('message', 'Cadastro realizado! Abrindo a tela de login…', true);
    setTimeout(() => { window.location.href = 'login.html'; }, 900);
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const user = readUsers().find((item) => item.email === email && item.password === password);
    if (!user) return showMessage('message', 'Não encontramos essa combinação de e-mail e senha. Confira os dados ou cadastre-se.');
    sessionStorage.setItem(CURRENT_KEY, JSON.stringify({ name: user.name, email: user.email, demo: false }));
    window.location.href = 'sistema.html';
  });

  const demoLogin = document.getElementById('demoLogin');
  if (demoLogin) demoLogin.addEventListener('click', () => {
    sessionStorage.setItem(CURRENT_KEY, JSON.stringify({ name: 'Administrador (demonstração)', email: 'demo@fornoefesta.local', demo: true }));
    window.location.href = 'sistema.html';
  });

  const logout = document.getElementById('logoutBtn');
  if (logout) logout.addEventListener('click', () => {
    sessionStorage.removeItem(CURRENT_KEY);
    window.location.href = 'login.html';
  });

  // Helpers compartilhados pelo painel.
  window.FornoFesta = {
    USERS_KEY,
    CURRENT_KEY,
    readUsers,
    readCurrentUser() {
      try { return JSON.parse(sessionStorage.getItem(CURRENT_KEY) || 'null'); }
      catch { return null; }
    },
    money(value) {
      return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },
    escapeHTML(value) {
      return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    },
    ORDERS_KEY: 'fornoFestaOrdersV2',
    RESERVATIONS_KEY: 'fornoFestaReservationsV2',
    CURRENT_KEY
  };
})();
