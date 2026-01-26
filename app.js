// CONFIG & STATE
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vREjbeB6jNrU01kw1npVtFTvqGdP134ERjmyROoOYeYXbzjgL0ZCNK6KwF0VTk3c1yxZEZEUsJjy2Ur/pub?output=csv';
const TARGET_DATE = new Date("March 1, 2026 00:00:00").getTime();

// Глобальное состояние
const APP_STATE = {
  allPlayers: [],
  filteredPlayers: [],
  currentRoleFilter: 'Все',
  currentSort: { column: 'ovr', direction: 'desc' },
  isLoading: true,
  isStatsLoading: true,
  isRosterLoading: true
};

// DICTIONARY FOR UX
const STAT_DEFS = {
  'DRI': 'Техника контроля мяча и ведения дриблинга',
  'SPD': 'Стартовый рывок и скорость перемещения',
  'SHT': 'Мощность и точность завершающего удара',
  'PHY': 'Физическая мощь, борьба и атлетизм',
  'REF': 'Молниеносная реакция на удары в упор',
  'DIV': 'Дальность прыжка и охват створа ворот',
  'HAN': 'Надежность фиксации и отражения мяча',
  'POS': 'Грамотный выбор позиции в створе ворот'
};

// DOM Elements Cache
const DOM = {
  preloader: null,
  mainContent: null,
  toastContainer: null,
  rosterGrid: null,
  statsBody: null,
  playerSearch: null
};

// Инициализация приложения
export async function initApp() {
  try {
    cacheDOMElements();
    renderSkeletonContent();
    
    // Загружаем данные
    await loadData();
    
    // Инициализируем интерфейс
    initInterface();
    
    // Прячем прелоадер
    setTimeout(() => {
      DOM.preloader.classList.add('loaded');
      DOM.mainContent.classList.add('loaded');
      showToast('Данные загружены', 'success');
    }, 300);
    
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    showToast('Ошибка загрузки данных', 'error');
    renderErrorState();
    DOM.preloader.classList.add('loaded');
  }
}

// Кэширование DOM элементов
function cacheDOMElements() {
  DOM.preloader = document.getElementById('preloader');
  DOM.mainContent = document.getElementById('main-content');
  DOM.toastContainer = document.getElementById('toast-container');
  DOM.rosterGrid = document.getElementById('roster-grid');
  DOM.statsBody = document.getElementById('stats-body');
  DOM.playerSearch = document.getElementById('playerSearch');
}

// Рендеринг скелетон-контента
function renderSkeletonContent() {
  const mainContent = DOM.mainContent;
  
  // Главная страница
  const homeSection = `
    <section id="home" class="active">
      <div class="intro-block">
        <span class="skeleton skeleton-text" style="width: 200px; margin: 0 auto 20px;"></span>
        <h1 class="skeleton" style="width: 300px; height: 6rem; margin: 0 auto 24px;"></h1>
        <p class="skeleton skeleton-text" style="width: 400px; margin: 0 auto 40px;"></p>
        <div class="btn-group" style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
          <div class="btn btn-primary skeleton" style="width: 140px; height: 56px;"></div>
          <div class="btn btn-outline skeleton" style="width: 140px; height: 56px;"></div>
        </div>
        <div class="timer-context skeleton" style="margin-top: 60px; height: 120px;"></div>
      </div>
      <div class="bento-grid">
        <div class="card skeleton" style="grid-column: span 2; height: 200px;"></div>
        <div class="card skeleton" style="height: 200px;"></div>
        <div class="card skeleton" style="height: 200px;"></div>
      </div>
    </section>
  `;
  
  // Страница участников
  const rosterSection = `
    <section id="roster">
      <div style="margin-bottom: 60px;">
        <h1 class="skeleton" style="width: 300px; height: 5rem; margin-bottom: 20px;"></h1>
        <p class="skeleton skeleton-text" style="width: 400px;"></p>
      </div>
      <div class="controls-row" style="margin-bottom: 40px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
        <div class="search-input skeleton" style="height: 56px;"></div>
        <div class="filter-bar" style="display:flex; gap:8px;">
          <div class="filter-btn skeleton" style="width: 80px; height: 44px;"></div>
          <div class="filter-btn skeleton" style="width: 100px; height: 44px;"></div>
          <div class="filter-btn skeleton" style="width: 90px; height: 44px;"></div>
        </div>
      </div>
      <div class="bento-grid" id="roster-grid">
        ${Array(6).fill().map((_, i) => `
          <div class="card player-card skeleton" style="height: 420px; animation-delay: ${i * 0.1}s;"></div>
        `).join('')}
      </div>
    </section>
  `;
  
  // Страница рейтинга
  const statsSection = `
    <section id="stats">
      <h1 class="skeleton" style="width: 250px; height: 5rem; margin-bottom:40px;"></h1>
      <div class="table-wrapper skeleton" style="height: 500px;"></div>
    </section>
  `;
  
  mainContent.innerHTML = homeSection + rosterSection + statsSection;
}

// Загрузка данных
async function loadData() {
  APP_STATE.isLoading = true;
  
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const text = await response.text();
    APP_STATE.allPlayers = parseCSV(text);
    APP_STATE.filteredPlayers = [...APP_STATE.allPlayers];
    
    if (APP_STATE.allPlayers.length === 0) {
      showToast('Ростер временно пуст', 'info');
    }
    
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    throw error;
  } finally {
    APP_STATE.isLoading = false;
  }
}

// Парсинг CSV
function parseCSV(text) {
  const rows = text.replace(/\r/g, '').split('\n').filter(r => r.trim());
  
  return rows.slice(1).map(row => {
    const matches = row.match(/(".*?"|[^",\n]+)(?=\s*,|\s*$)/g);
    const columns = matches ? matches.map(m => m.replace(/^"|"$/g, '').trim()) : [];
    
    return {
      name: columns[0] || '',
      ovr: parseInt(columns[1]) || 0,
      role: columns[2] || 'Игрок',
      drib: parseInt(columns[3]) || 0,
      speed: parseInt(columns[4]) || 0,
      shot: parseInt(columns[5]) || 0,
      phys: parseInt(columns[6]) || 0,
      photo: columns[7] || 'https://via.placeholder.com/400x600?text=No+Photo',
      status: columns[8] || '',
      badges: columns[9] ? columns[9].split('|').map(b => b.trim()) : []
    };
  }).filter(p => p.name);
}

// Инициализация интерфейса
function initInterface() {
  // Рендерим реальный контент
  renderRealContent();
  
  // Настройка навигации
  initNavigation();
  
  // Настройка таймера
  initTimer();
  
  // Настройка поиска и фильтров
  initSearchAndFilters();
  
  // Обработка глубоких ссылок
  handleHashAndDeepLink();
  
  // Инициализация скролла
  initScrollHandler();
  
  // Периодическая проверка обновлений
  startUpdateChecker();
}

// Рендеринг реального контента
function renderRealContent() {
  const mainContent = DOM.mainContent;
  
  // Главная страница
  const homeSection = `
    <section id="home" class="active">
      <div class="intro-block">
        <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.4em; color:var(--accent); display:block; margin-bottom:20px;">The Next Gen Football</span>
        <h1>BOX1V1.</h1>
        <p>Решает не команда.<br>Решаешь ты.</p>
        <div class="btn-group" style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window.switchTab('roster')">Участники</button>
          <button class="btn btn-outline" onclick="window.openModal('applyModal')">Подать заявку</button>
        </div>
        <div class="timer-context" id="timer-container">
          <span class="timer-label" id="timer-status">До старта сезона:</span>
          <div class="countdown" id="timer">
            <div><div class="countdown-value" id="days">00</div><div class="countdown-label">дн</div></div>
            <div><div class="countdown-value" id="hours">00</div><div class="countdown-label">чс</div></div>
            <div><div class="countdown-value" id="mins">00</div><div class="countdown-label">мин</div></div>
            <div><div class="countdown-value" id="secs">00</div><div class="countdown-label">сек</div></div>
          </div>
        </div>
      </div>
      <div class="bento-grid">
        <div class="card" style="grid-column: span 2; background: var(--bg-alt);" onclick="window.openModal('rulesModal')" tabindex="0" role="button">
          <span style="font-size:11px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:0.1em;">Документация</span>
          <h2 style="font-size: 3.5rem; margin: 20px 0 15px; color: var(--text);">РЕГЛАМЕНТ.</h2>
          <p>Свод правил проведения матчей.</p>
          <div style="margin-top: auto; padding-top: 30px; font-weight: 800; font-size: 12px; text-transform: uppercase; color: var(--accent);">Изучить правила →</div>
        </div>
        <div class="card" onclick="window.open('https://t.me/streetbox1v1')" tabindex="0" role="button">
          <h3 style="font-size: 1.8rem; color: var(--text);">TELEGRAM</h3>
          <p style="font-size: 14px; margin-top: 8px; color: var(--text-dim);">Свежие новости и актуальная информация.</p>
        </div>
        <div class="card" onclick="window.open('https://instagram.com/box.1v1')" tabindex="0" role="button">
          <h3 style="font-size: 1.8rem; color: var(--text);">INSTAGRAM</h3>
          <p style="font-size: 14px; margin-top: 8px; color: var(--text-dim);">Главные новости в медиа формате.</p>
        </div>
      </div>
    </section>
  `;
  
  // Страница участников
  const rosterSection = `
    <section id="roster">
      <div style="margin-bottom: 60px;">
        <h1 style="font-size: clamp(3rem, 10vw, 8rem); color: var(--text);">УЧАСТНИКИ.</h1>
        <p style="font-size: 1.25rem; color: var(--text-dim);">Действующие участники BOX1V1.</p>
      </div>
      <div class="controls-row" style="margin-bottom: 40px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
        <input type="text" class="search-input" id="playerSearch" placeholder="Поиск по имени..." aria-label="Поиск игроков">
        <div class="filter-bar" style="display:flex; gap:8px;">
          <button class="filter-btn active" data-role="Все" aria-label="Показать всех игроков">Все</button>
          <button class="filter-btn" data-role="Игрок" aria-label="Показать полевых игроков">Полевые</button>
          <button class="filter-btn" data-role="Вратарь" aria-label="Показать вратарей">Вратари</button>
        </div>
      </div>
      <div class="bento-grid" id="roster-grid"></div>
    </section>
  `;
  
  // Страница рейтинга
  const statsSection = `
    <section id="stats">
      <h1 style="font-size: clamp(3rem, 10vw, 8rem); margin-bottom:40px; color: var(--text);">РЕЙТИНГ.</h1>
      <div class="table-wrapper">
        <table role="grid" aria-label="Рейтинг игроков">
          <thead>
            <tr>
              <th data-sort="rank" role="columnheader" aria-sort="none">#.</th>
              <th data-sort="name" role="columnheader" aria-sort="none">Игрок</th>
              <th data-sort="ovr" role="columnheader" aria-sort="descending" style="text-align:right;">OVR рейтинг</th>
            </tr>
          </thead>
          <tbody id="stats-body"></tbody>
        </table>
      </div>
    </section>
  `;
  
  mainContent.innerHTML = homeSection + rosterSection + statsSection;
  
  // Обновляем кэш DOM элементов
  cacheDOMElements();
  
  // Рендерим данные
  renderRoster();
  renderStats();
  
  // Настраиваем обработчики событий
  setupEventListeners();
}

// Рендеринг списка участников
function renderRoster() {
  if (APP_STATE.isLoading || !DOM.rosterGrid) return;
  
  APP_STATE.isRosterLoading = true;
  const searchTerm = DOM.playerSearch ? DOM.playerSearch.value.toLowerCase() : '';
  
  // Фильтрация
  APP_STATE.filteredPlayers = APP_STATE.allPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesRole = APP_STATE.currentRoleFilter === 'Все' || p.role === APP_STATE.currentRoleFilter;
    return matchesSearch && matchesRole;
  });
  
  // Очищаем предыдущие скелетоны
  DOM.rosterGrid.innerHTML = '';
  
  if (APP_STATE.filteredPlayers.length === 0) {
    DOM.rosterGrid.innerHTML = `
      <div class="empty-state" aria-live="polite">
        <h3>Атлеты не найдены</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>
    `;
    APP_STATE.isRosterLoading = false;
    return;
  }
  
  // Рендерим карточки
  DOM.rosterGrid.innerHTML = APP_STATE.filteredPlayers.map((p, i) => `
    <div class="card player-card"
         tabindex="0"
         role="button"
         aria-label="Профиль игрока ${p.name}, рейтинг ${p.ovr}, роль ${p.role}${p.badges[0] ? ', ' + p.badges[0] : ''}"
         style="animation: fadeInUp 0.6s var(--cubic) both ${i * 0.03}s"
         data-player-name="${p.name.replace(/"/g, '&quot;')}">
      <div class="player-img" style="background-image: url('${p.photo}')" aria-hidden="true"></div>
      ${p.status ? `<div style="position:absolute; top:32px; right:32px; z-index:3; background:var(--accent-light); color:#000; font-size:10px; font-weight:900; padding:6px 14px; border-radius:12px; text-transform:uppercase;">${p.status}</div>` : ''}
      <div class="player-info">
        <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--accent-light); letter-spacing:0.1em;">${p.role}</span>
        <h3 style="font-size:2.2rem; margin: 8px 0; color: #fff;">${p.name}</h3>
        ${p.badges.length > 0 ? `<div style="font-size:10px; color:rgba(255,255,255,0.7); margin-top:4px;">${p.badges[0]}</div>` : ''}
        <div class="ovr-badge" aria-label="Общий рейтинг ${p.ovr}">OVR ${p.ovr}</div>
      </div>
    </div>
  `).join('');
  
  // Добавляем обработчики кликов для карточек
  DOM.rosterGrid.querySelectorAll('.player-card').forEach(card => {
    const playerName = card.getAttribute('data-player-name');
    card.addEventListener('click', () => openPlayerModal(playerName));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPlayerModal(playerName);
      }
    });
  });
  
  APP_STATE.isRosterLoading = false;
}

// Рендеринг таблицы рейтинга с сортировкой
function renderStats() {
  if (APP_STATE.isLoading || !DOM.statsBody) return;
  
  APP_STATE.isStatsLoading = true;
  
  // Сортировка
  const sortedPlayers = [...APP_STATE.allPlayers].sort((a, b) => {
    const { column, direction } = APP_STATE.currentSort;
    const multiplier = direction === 'desc' ? -1 : 1;
    
    if (column === 'name') {
      return multiplier * a.name.localeCompare(b.name);
    } else if (column === 'ovr') {
      return multiplier * (b.ovr - a.ovr);
    } else if (column === 'rank') {
      return multiplier * (APP_STATE.allPlayers.indexOf(a) - APP_STATE.allPlayers.indexOf(b));
    }
    return 0;
  });
  
  // Рендерим строки таблицы
  DOM.statsBody.innerHTML = sortedPlayers.map((p, i) => {
    const rank = sortedPlayers.findIndex(player => player.name === p.name) + 1;
    
    return `
      <tr tabindex="0" 
          data-player-name="${p.name.replace(/"/g, '&quot;')}"
          aria-label="Рейтинг ${p.ovr}, ${p.name}, ${p.role}${p.badges[0] ? ', ' + p.badges[0] : ''}">
        <td style="font-weight:900; color:var(--text-dim)" aria-label="Место">${rank.toString().padStart(2, '0')}</td>
        <td>
          <div style="display:flex; align-items:center; gap:16px;">
            <img src="${p.photo}" 
                 style="width:48px; height:48px; border-radius:14px; object-fit:cover;" 
                 alt="Фото ${p.name}"
                 loading="lazy">
            <div>
              <div style="font-weight:900; text-transform:uppercase; font-style:italic; color: var(--text);">${p.name}</div>
              <div style="font-size:10px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">${p.role}</div>
            </div>
          </div>
        </td>
        <td style="text-align:right;">
          <span class="ovr-badge" aria-label="Общий рейтинг">${p.ovr}</span>
        </td>
      </tr>
    `;
  }).join('');
  
  // Добавляем обработчики кликов для строк таблицы
  DOM.statsBody.querySelectorAll('tr').forEach(row => {
    const playerName = row.getAttribute('data-player-name');
    row.addEventListener('click', () => openPlayerModal(playerName));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPlayerModal(playerName);
      }
    });
  });
  
  // Обновляем заголовки сортировки
  updateSortHeaders();
  
  APP_STATE.isStatsLoading = false;
}

// Обновление заголовков сортировки
function updateSortHeaders() {
  const headers = document.querySelectorAll('th[data-sort]');
  headers.forEach(header => {
    const sortColumn = header.getAttribute('data-sort');
    header.classList.remove('sort-asc', 'sort-desc');
    header.setAttribute('aria-sort', 'none');
    
    if (sortColumn === APP_STATE.currentSort.column) {
      header.classList.add(`sort-${APP_STATE.currentSort.direction}`);
      header.setAttribute('aria-sort', `${APP_STATE.currentSort.direction}ending`);
    }
  });
}

// Сортировка таблицы
function sortTable(column) {
  if (APP_STATE.isStatsLoading) return;
  
  if (APP_STATE.currentSort.column === column) {
    // Изменяем направление сортировки
    APP_STATE.currentSort.direction = APP_STATE.currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // Новая колонка для сортировки
    APP_STATE.currentSort = { column, direction: 'desc' };
  }
  
  renderStats();
}

// Инициализация навигации
function initNavigation() {
  // Обработчики для навигационных ссылок
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      switchTab(id);
    });
  });
  
  // Обработчик для бургер-меню
  const burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
  
  // Обработчик для мобильной навигации
  document.querySelectorAll('.mobile-drawer a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.textContent === 'Главная' ? 'home' : 
                 link.textContent === 'Список' ? 'roster' : 'stats';
      handleMobileNav(id);
    });
  });
}

// Переключение вкладок
function switchTab(id, updateHash = true) {
  if (APP_STATE.isLoading) return;
  
  const target = document.getElementById(id);
  if (!target) return;
  
  // Плавная прокрутка к началу
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Скрываем все секции
  document.querySelectorAll('section').forEach(s => {
    s.classList.remove('active');
  });
  
  // Убираем активный класс у всех ссылок
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
  });
  
  // Показываем целевую секцию
  target.classList.add('active');
  
  // Активируем соответствующую ссылку
  const btn = document.getElementById('btn-' + id);
  if (btn) btn.classList.add('active');
  
  // Обновляем URL
  if (updateHash) {
    window.history.pushState(null, '', `#${id}`);
  }
  
  // Если переключаемся на ростер или статистику, убедимся что данные отрендерены
  if (id === 'roster' && APP_STATE.filteredPlayers.length === 0) {
    renderRoster();
  } else if (id === 'stats') {
    renderStats();
  }
}

// Инициализация таймера
function initTimer() {
  updateTimer();
  setInterval(updateTimer, 1000);
}

// Обновление таймера
function updateTimer() {
  const now = Date.now();
  const diff = TARGET_DATE - now;
  
  if (diff <= 0) {
    const status = document.getElementById('timer-status');
    const timer = document.getElementById('timer');
    
    if (status) status.innerText = "Сезон открыт!";
    if (timer) timer.style.display = 'none';
    return;
  }
  
  const days = document.getElementById('days');
  const hours = document.getElementById('hours');
  const mins = document.getElementById('mins');
  const secs = document.getElementById('secs');
  
  if (days) days.innerText = Math.floor(diff / 864e5).toString().padStart(2, '0');
  if (hours) hours.innerText = Math.floor((diff % 864e5) / 36e5).toString().padStart(2, '0');
  if (mins) mins.innerText = Math.floor((diff % 36e5) / 6e4).toString().padStart(2, '0');
  if (secs) secs.innerText = Math.floor((diff % 6e4) / 1000).toString().padStart(2, '0');
}

// Инициализация поиска и фильтров
function initSearchAndFilters() {
  // Поиск с debounce
  if (DOM.playerSearch) {
    let searchTimeout;
    DOM.playerSearch.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        renderRoster();
      }, 150);
    });
  }
  
  // Фильтры по роли
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      setRoleFilter(role, btn);
    });
  });
}

// Установка фильтра по роли
function setRoleFilter(role, btn) {
  if (APP_STATE.isRosterLoading) return;
  
  APP_STATE.currentRoleFilter = role;
  
  // Обновляем активную кнопку
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
  });
  
  if (btn) btn.classList.add('active');
  
  // Рендерим отфильтрованный список
  renderRoster();
}

// Открытие модального окна игрока
function openPlayerModal(name) {
  const p = APP_STATE.allPlayers.find(x => 
    x.name.toLowerCase() === name.toLowerCase()
  );
  
  if (!p) {
    showToast("Игрок не найден", 'error');
    return;
  }
  
  // Убираем скелетоны
  const modal = document.getElementById('playerModal');
  modal.querySelectorAll('.skeleton').forEach(el => {
    el.classList.remove('skeleton');
  });
  
  // Заполняем данные
  document.getElementById('m-name').innerText = p.name;
  document.getElementById('m-role').innerText = p.role;
  document.getElementById('m-ovr').innerText = p.ovr;
  
  const img = document.getElementById('m-img');
  const imgContainer = document.getElementById('m-img-container');
  
  // Показываем скелетон пока грузится изображение
  if (img) {
    img.style.display = 'none';
    imgContainer.classList.add('skeleton');
    
    img.src = p.photo;
    img.alt = `Фото игрока ${p.name}`;
    
    img.onload = () => {
      img.style.display = 'block';
      imgContainer.classList.remove('skeleton');
      imgContainer.style.backgroundImage = 'none';
    };
    
    img.onerror = () => {
      imgContainer.classList.remove('skeleton');
      imgContainer.style.background = 'var(--bg-alt)';
      imgContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-dim);">Фото недоступно</div>';
    };
  }
  
  // Бейджи
  const badgesContainer = document.getElementById('m-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = p.badges.map(b => 
      `<span style="font-size:10px; background:var(--text); color:var(--bg); padding:4px 10px; border-radius:8px; font-weight:800;">${b}</span>`
    ).join('');
  }
  
  // Статистика
  const isGK = p.role === 'Вратарь';
  const stats = [
    { l: isGK ? 'REF' : 'DRI', v: p.drib },
    { l: isGK ? 'DIV' : 'SPD', v: p.speed },
    { l: isGK ? 'HAN' : 'SHT', v: p.shot },
    { l: isGK ? 'POS' : 'PHY', v: p.phys }
  ];
  
  const statsContainer = document.getElementById('m-stats');
  if (statsContainer) {
    statsContainer.innerHTML = stats.map(s => `
      <div class="stat-item">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <div class="stat-header" data-tip="${STAT_DEFS[s.l]}" aria-describedby="tooltip-${s.l}">
            <span style="font-size:12px; font-weight:900; color: var(--text);">${s.l}</span>
            <i class="info-icon" aria-hidden="true">?</i>
          </div>
          <span style="font-size:12px; font-weight:900; color: var(--text);">${s.v}</span>
        </div>
        <div style="height:4px; background:var(--bg-alt); border-radius:2px; overflow:hidden;" aria-hidden="true">
          <div style="width:0%; height:100%; background:var(--accent); transition:1.2s var(--cubic) 0.3s;" 
               id="bar-${s.l}" 
               aria-label="${s.l}: ${s.v}%"></div>
        </div>
      </div>
    `).join('');
  }
  
  // Открываем модальное окно
  openModal('playerModal');
  
  // Анимация прогресс-баров
  setTimeout(() => {
    stats.forEach(s => {
      const bar = document.getElementById(`bar-${s.l}`);
      if (bar) {
        bar.style.width = s.v + '%';
      }
    });
  }, 100);
  
  // Обновляем URL для глубокой ссылки
  const currentTab = document.querySelector('section.active').id;
  const playerSlug = p.name.replace(/\s+/g, '-').toLowerCase();
  window.history.replaceState(null, '', `#${currentTab}?player=${playerSlug}`);
}

// Открытие модального окна
function openModal(id) {
  const lastFocusedElement = document.activeElement;
  const modal = document.getElementById(id);
  
  if (!modal) return;
  
  // Сохраняем ссылку на элемент для возврата фокуса
  modal._lastFocusedElement = lastFocusedElement;
  
  // Показываем модальное окно
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Фокус на первом интерактивном элементе
  setTimeout(() => {
    const focusable = modal.querySelector('button, [href], input, [tabindex="0"]');
    if (focusable) focusable.focus();
  }, 100);
  
  // Добавляем обработчик для trap focus
  modal.addEventListener('keydown', trapFocus);
}

// Закрытие модального окна
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', trapFocus);
  
  // Возвращаем фокус
  if (modal._lastFocusedElement) {
    modal._lastFocusedElement.focus();
  }
  
  // Если закрываем модалку игрока, очищаем URL
  if (id === 'playerModal') {
    const currentTab = document.querySelector('section.active').id;
    window.history.replaceState(null, '', `#${currentTab}`);
  }
}

// Trap focus в модальном окне
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  
  const focusableEls = this.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];
  
  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
}

// Обработчик мобильной навигации
function toggleMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const burger = document.getElementById('burger');
  
  const isOpen = drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen.toString());
  
  // Trap focus в мобильном меню
  if (isOpen) {
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }
}

function handleMobileNav(id, isModal = false) {
  toggleMenu();
  setTimeout(() => {
    if (isModal) {
      openModal(id);
    } else {
      switchTab(id);
    }
  }, 400);
}

// Копирование ID игрока
function copyPlayerID() {
  const name = document.getElementById('m-name').innerText;
  navigator.clipboard.writeText(name).then(() => {
    showToast('ID игрока скопирован', 'success');
  }).catch(() => {
    showToast('Не удалось скопировать', 'error');
  });
}

// Поделиться игроком
function sharePlayer() {
  const name = document.getElementById('m-name').innerText;
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: `BOX1V1 | ${name}`,
      text: `Карточка атлета ${name} в системе BOX1V1! 🔥`,
      url: url
    }).catch(() => {
      // Пользователь отменил шаринг
    });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Ссылка скопирована в буфер', 'success');
    }).catch(() => {
      showToast('Не удалось скопировать ссылку', 'error');
    });
  }
}

// Система уведомлений
function showToast(message, type = 'info') {
  const container = DOM.toastContainer;
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  
  // Иконка в зависимости от типа
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  
  toast.innerHTML = `<span>${icon} ${message}</span>`;
  container.appendChild(toast);
  
  // Анимация появления
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  
  // Автоматическое скрытие
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 500);
  }, 3000);
}

// Обработка глубоких ссылок
function handleHashAndDeepLink() {
  const fullHash = window.location.hash;
  if (!fullHash) return;
  
  const [hashPart, queryPart] = fullHash.split('?');
  const cleanHash = hashPart.replace('#', '');
  
  // Переключение вкладки
  if (cleanHash && ['home', 'roster', 'stats'].includes(cleanHash)) {
    setTimeout(() => switchTab(cleanHash, false), 100);
  }
  
  // Открытие карточки игрока
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const playerNameFromUrl = params.get('player');
    
    if (playerNameFromUrl) {
      const playerName = playerNameFromUrl.replace(/-/g, ' ');
      const foundPlayer = APP_STATE.allPlayers.find(p => 
        p.name.toLowerCase() === playerName.toLowerCase()
      );
      
      if (foundPlayer) {
        setTimeout(() => openPlayerModal(foundPlayer.name), 300);
      }
    }
  }
}

// Инициализация обработчика скролла
function initScrollHandler() {
  window.addEventListener('scroll', () => {
    document.body.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Обработчики для сортировки таблицы
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.getAttribute('data-sort');
      sortTable(column);
    });
    
    // Поддержка клавиатуры
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const column = th.getAttribute('data-sort');
        sortTable(column);
      }
    });
  });
  
  // Глобальный обработчик Escape для модалок
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });
  
  // Клик по оверлею для закрытия модалок
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });
}

// Проверка обновлений данных
function startUpdateChecker() {
  let lastDataHash = '';
  
  async function checkForUpdates() {
    try {
      const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
      const text = await response.text();
      const currentHash = await hashString(text);
      
      if (currentHash !== lastDataHash && lastDataHash !== '') {
        // Данные изменились
        const newPlayers = parseCSV(text);
        
        // Проверяем изменения
        const changes = detectChanges(newPlayers);
        if (changes.length > 0) {
          APP_STATE.allPlayers = newPlayers;
          renderRoster();
          renderStats();
          showToast(`Данные обновлены: ${changes.join(', ')}`, 'info');
        }
      }
      
      lastDataHash = currentHash;
    } catch (error) {
      console.warn('Ошибка проверки обновлений:', error);
    }
  }
  
  // Первая проверка через 30 секунд, затем каждую минуту
  setTimeout(() => {
    checkForUpdates();
    setInterval(checkForUpdates, 60000);
  }, 30000);
}

// Хэширование строки для сравнения
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Обнаружение изменений в данных
function detectChanges(newPlayers) {
  const changes = [];
  const oldPlayers = APP_STATE.allPlayers;
  
  // Проверяем изменения рейтинга
  oldPlayers.forEach(oldPlayer => {
    const newPlayer = newPlayers.find(p => p.name === oldPlayer.name);
    if (newPlayer && oldPlayer.ovr !== newPlayer.ovr) {
      changes.push(`${oldPlayer.name}: ${oldPlayer.ovr}→${newPlayer.ovr}`);
    }
  });
  
  // Проверяем новых игроков
  if (newPlayers.length > oldPlayers.length) {
    const newCount = newPlayers.length - oldPlayers.length;
    changes.push(`+${newCount} игроков`);
  }
  
  return changes;
}

// Рендеринг состояния ошибки
function renderErrorState() {
  const mainContent = DOM.mainContent;
  
  mainContent.innerHTML = `
    <section id="error" class="active">
      <div class="intro-block">
        <h1 style="color: var(--text);">Ошибка загрузки</h1>
        <p style="color: var(--text-dim); margin-bottom: 40px;">
          Не удалось загрузить данные. Пожалуйста, проверьте подключение к интернету и обновите страницу.
        </p>
        <button class="btn btn-primary" onclick="location.reload()">Обновить страницу</button>
      </div>
    </section>
  `;
}

// Дебаунс для рендеринга
let renderTimeout;
function debouncedRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => {
    renderRoster();
  }, 150);
}

// Экспортируем функции для глобального использования
window.switchTab = switchTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.openPlayerModal = openPlayerModal;
window.toggleMenu = toggleMenu;
window.handleMobileNav = handleMobileNav;
window.setRoleFilter = setRoleFilter;
window.copyPlayerID = copyPlayerID;
window.sharePlayer = sharePlayer;
window.debouncedRender = debouncedRender;
