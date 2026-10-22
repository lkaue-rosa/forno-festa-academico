(function () {
  const FF = window.FornoFesta;
  if (!FF || !document.getElementById('visao-geral')) return;

  const menu = [
    { id: 'margherita', name: 'Margherita', description: 'Molho da casa, muçarela, tomate e manjericão.', price: 39.90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80' },
    { id: 'pepperoni', name: 'Pepperoni', description: 'Muçarela cremosa e pepperoni levemente picante.', price: 45.90, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80' },
    { id: 'quatro-queijos', name: 'Quatro Queijos', description: 'Mix de queijos selecionados.', price: 47.90, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80' },
    { id: 'calabresa', name: 'Calabresa', description: 'Calabresa, cebola e azeitonas.', price: 42.90, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
    { id: 'frango-catupiry', name: 'Frango com Catupiry', description: 'Frango temperado e creme de queijo.', price: 46.90, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' },
    { id: 'vegetariana', name: 'Vegetariana', description: 'Legumes frescos, muçarela e ervas.', price: 44.90, image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80' }
  ];
  const today = new Date();
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const dateOffset = (days) => { const d = new Date(); d.setDate(d.getDate() + days); return d; };
  const safeParse = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
  const readOrders = () => safeParse(FF.ORDERS_KEY) || [];
  const readReservations = () => safeParse(FF.RESERVATIONS_KEY) || [];
  const currentUser = FF.readCurrentUser();

  // Semeia dados fictícios uma única vez, para que o painel e o gráfico não comecem vazios.
  if (!currentUser) {
    window.location.replace('login.html');
    return;
  }
  if (!safeParse(FF.ORDERS_KEY)) {
    const seedOrders = [
      { id: '1048', customer: 'Mariana Costa', product: 'Margherita', price: 78.90, date: localDate(dateOffset(0)), time: '12:18', status: 'Concluído', demo: true },
      { id: '1047', customer: 'Lucas Mendes', product: 'Pepperoni', price: 45.90, date: localDate(dateOffset(0)), time: '13:05', status: 'Preparando', demo: true },
      { id: '1046', customer: 'Beatriz Lima', product: 'Quatro Queijos', price: 47.90, date: localDate(dateOffset(-1)), time: '19:24', status: 'Concluído', demo: true },
      { id: '1045', customer: 'Rafael Souza', product: 'Calabresa', price: 42.90, date: localDate(dateOffset(-2)), time: '20:10', status: 'Concluído', demo: true },
      { id: '1044', customer: 'Camila Alves', product: 'Frango com Catupiry', price: 46.90, date: localDate(dateOffset(-3)), time: '18:40', status: 'Concluído', demo: true },
      { id: '1043', customer: 'Pedro Martins', product: 'Margherita', price: 39.90, date: localDate(dateOffset(-5)), time: '19:15', status: 'Concluído', demo: true },
      { id: '1042', customer: 'Juliana Rocha', product: 'Calabresa', price: 42.90, date: localDate(dateOffset(-6)), time: '20:01', status: 'Concluído', demo: true }
    ];
    save(FF.ORDERS_KEY, seedOrders);
  }
  if (!safeParse(FF.RESERVATIONS_KEY)) {
    save(FF.RESERVATIONS_KEY, [
      { id: 'EV-101', event: 'Aniversário da Ana', customer: 'Ana Martins', date: localDate(dateOffset(3)), time: '18:30', guests: 25, type: 'Aniversário', notes: 'Mesa próxima à janela', status: 'A confirmar' },
      { id: 'EV-102', event: 'Confraternização da equipe', customer: 'Rafael Souza', date: localDate(dateOffset(5)), time: '20:00', guests: 40, type: 'Confraternização', notes: '', status: 'Confirmado' }
    ]);
  }

  const esc = FF.escapeHTML;
  const fmtDate = (dateString) => {
    if (!dateString) return '—';
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };
  const fmtLongDate = (dateString) => {
    if (!dateString) return '—';
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };
  const ordersNewestFirst = (orders) => [...orders].sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
  const reservationsSorted = (reservations) => [...reservations].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  function renderOrders() {
    const orders = ordersNewestFirst(readOrders());
    const rows = (items) => items.length ? items.map((order) => `<tr><td>#${esc(order.id)}</td><td>${esc(order.customer)}</td><td>${esc(order.product)}</td><td>${FF.money(order.price)}</td><td>${fmtDate(order.date)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty-state">Nenhuma venda registrada.</td></tr>';
    const recent = document.getElementById('recentOrders');
    const all = document.getElementById('allOrders');
    if (recent) recent.innerHTML = rows(orders.slice(0, 5));
    if (all) all.innerHTML = rows(orders);
  }

  function renderReservations() {
    const reservations = reservationsSorted(readReservations());
    const itemHTML = (r) => `<div class="event-item"><div class="event-date"><b>${esc(String(r.date.split('-')[2] || '').padStart(2, '0'))}</b><small>${esc(new Date(Number(r.date.slice(0,4)), Number(r.date.slice(5,7))-1, Number(r.date.slice(8,10))).toLocaleDateString('pt-BR',{month:'short'}).replace('.', '').toUpperCase())}</small></div><div class="event-description"><b>${esc(r.event)}</b><p>${esc(r.time)} · ${esc(r.guests)} convidados</p><small>${esc(r.customer)} · ${esc(r.type)}</small><div><span class="tag ${r.status === 'Confirmado' ? 'green' : 'yellow'}">${esc(r.status)}</span></div></div></div>`;
    const upcoming = reservations.filter((r) => r.date >= localDate(today)).slice(0, 3);
    const targetUpcoming = document.getElementById('upcomingEvents');
    const targetAll = document.getElementById('allReservations');
    if (targetUpcoming) targetUpcoming.innerHTML = upcoming.length ? upcoming.map(itemHTML).join('') : '<p class="empty-state">Nenhuma reserva futura. Cadastre seu próximo evento.</p>';
    if (targetAll) targetAll.innerHTML = reservations.length ? reservations.map((r) => `<article class="reservation-card"><div><b>${esc(r.event)}</b><p>${esc(r.customer)} · ${esc(r.type)}</p><p>${fmtLongDate(r.date)} às ${esc(r.time)} · ${esc(r.guests)} convidados</p>${r.notes ? `<p class="muted">${esc(r.notes)}</p>` : ''}</div><span class="tag ${r.status === 'Confirmado' ? 'green' : 'yellow'}">${esc(r.status)}</span></article>`).join('') : '<p class="empty-state">Nenhuma reserva cadastrada.</p>';
  }

  function renderMenu() {
    const target = document.getElementById('adminMenu');
    if (!target) return;
    target.innerHTML = menu.map((pizza) => `<article class="admin-pizza"><img src="${pizza.image}" alt="${esc(pizza.name)}"><div class="admin-pizza-info"><h3>${esc(pizza.name)}</h3><p>${esc(pizza.description)}</p><strong>${FF.money(pizza.price)}</strong><button type="button" class="btn btn-red full" data-sell="${pizza.id}">＋ Registrar venda</button></div></article>`).join('');
    target.querySelectorAll('[data-sell]').forEach((button) => button.addEventListener('click', () => {
      const pizza = menu.find((item) => item.id === button.dataset.sell);
      const user = FF.readCurrentUser();
      const orders = readOrders();
      const nextId = String(orders.reduce((max, order) => Math.max(max, Number(order.id) || 0), 1040) + 1);
      orders.push({ id: nextId, customer: user && !user.demo ? user.name : 'Cliente balcão', product: pizza.name, price: pizza.price, date: localDate(new Date()), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), status: 'Concluído', demo: false });
      save(FF.ORDERS_KEY, orders);
      refreshDashboard();
      button.textContent = '✓ Venda registrada';
      setTimeout(() => { if (button.isConnected) button.textContent = '＋ Registrar venda'; }, 1400);
    }));
  }

  function renderReports() {
    const orders = readOrders();
    const total = orders.reduce((sum, order) => sum + Number(order.price || 0), 0);
    const counts = orders.reduce((obj, order) => { obj[order.product] = (obj[order.product] || 0) + 1; return obj; }, {});
    const topPizza = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const future = readReservations().filter((r) => r.date >= localDate(today)).length;
    const values = [];
    for (let i = 6; i >= 0; i--) {
      const date = localDate(dateOffset(-i));
      values.push({ date, label: ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'][new Date(date + 'T12:00:00').getDay()], amount: orders.filter((o) => o.date === date).reduce((sum, o) => sum + Number(o.price || 0), 0) });
    }
    const max = Math.max(...values.map((v) => v.amount), 1);
    const chart = document.getElementById('salesChart');
    if (chart) chart.innerHTML = values.map((v) => `<div class="chart-column"><div class="chart-value">${v.amount ? FF.money(v.amount) : 'R$ 0'}</div><div class="chart-track"><div class="chart-bar" style="height:${Math.max(v.amount ? 7 : 1, (v.amount / max) * 100)}%"></div></div><small>${v.label}<br>${fmtDate(v.date)}</small></div>`).join('');
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    setText('statOrders', String(orders.length));
    setText('statRevenue', FF.money(total));
    setText('statReservations', String(readReservations().length));
    setText('statCustomers', String(FF.readUsers().length));
    setText('reportRevenue', FF.money(total));
    setText('averageTicket', FF.money(orders.length ? total / orders.length : 0));
    setText('topPizza', topPizza ? topPizza[0] : 'Sem vendas');
    setText('futureReservations', String(future));
    const summary = document.getElementById('reportSummary');
    if (summary) summary.innerHTML = `<div><span>Total de vendas registradas</span><b>${orders.length}</b></div><div><span>Faturamento acumulado</span><b>${FF.money(total)}</b></div><div><span>Produto com mais registros</span><b>${topPizza ? esc(topPizza[0]) + ' (' + topPizza[1] + ')' : 'Sem dados'}</b></div><div><span>Período do gráfico</span><b>${fmtDate(values[0].date)} a ${fmtDate(values[6].date)}</b></div>`;
  }

  function refreshDashboard() { renderOrders(); renderReservations(); renderReports(); }
  renderMenu();
  refreshDashboard();
  const name = document.getElementById('userName');
  if (name && currentUser) name.textContent = currentUser.name;

  // Navegação entre seções dentro do painel.
  const titles = { 'visao-geral': 'Visão geral', pedidos: 'Vendas e pedidos', 'cardapio-admin': 'Cardápio', 'eventos-admin': 'Reservas de eventos', relatorios: 'Relatórios de vendas' };
  function goToSection(id) {
    if (!titles[id]) return;
    document.querySelectorAll('.dash-section').forEach((section) => section.classList.toggle('active-section', section.id === id));
    document.querySelectorAll('[data-section]').forEach((link) => link.classList.toggle('active', link.dataset.section === id));
    const title = document.getElementById('pageTitle');
    if (title) title.textContent = titles[id];
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  }
  document.querySelectorAll('[data-section]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); goToSection(link.dataset.section); }));
  document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => goToSection(button.dataset.go)));
  const initialSection = location.hash.slice(1);
  if (titles[initialSection]) goToSection(initialSection);

  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    const dateInput = document.getElementById('eventDate');
    if (dateInput) dateInput.min = localDate(new Date());
    reservationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const date = document.getElementById('eventDate').value;
      if (date < localDate(new Date())) {
        const message = document.getElementById('reservationMessage');
        if (message) message.textContent = 'Escolha uma data de hoje em diante.';
        return;
      }
      const reservation = {
        id: 'EV-' + String(Date.now()).slice(-6),
        event: document.getElementById('eventName').value.trim(),
        customer: document.getElementById('eventCustomer').value.trim(),
        date,
        time: document.getElementById('eventTime').value,
        guests: Number(document.getElementById('eventGuests').value),
        type: document.getElementById('eventType').value,
        notes: document.getElementById('eventNotes').value.trim(),
        status: 'A confirmar'
      };
      const reservations = readReservations();
      reservations.push(reservation);
      save(FF.RESERVATIONS_KEY, reservations);
      reservationForm.reset();
      if (dateInput) dateInput.min = localDate(new Date());
      const message = document.getElementById('reservationMessage');
      if (message) { message.textContent = 'Reserva registrada com sucesso!'; message.style.color = '#28784e'; }
      refreshDashboard();
    });
  }

  const exportButton = document.getElementById('exportReport');
  if (exportButton) exportButton.addEventListener('click', () => {
    const rows = [['Pedido', 'Cliente', 'Produto', 'Valor (BRL)', 'Data', 'Horário', 'Status'], ...ordersNewestFirst(readOrders()).map((o) => [o.id, o.customer, o.product, Number(o.price).toFixed(2).replace('.', ','), o.date, o.time || '', o.status || ''])];
    const csv = '\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'relatorio-vendas-forno-e-festa.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  });
})();
