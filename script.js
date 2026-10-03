/* =========================================================
   vibe_coder.kg landing — script.js
   1) Конфигурация (номер, Telegram)
   2) Тил которгуч KG / RU
   3) Мобилдик меню
   4) Көрүнүү анимациясы
   5) Форма: валидация + «Рахмат» + WhatsApp
   ========================================================= */

/* ---------- 0. КООПСУЗДУК ---------- */
/* Clickjacking: башка сайттын iframe'инин ичинде ачылса, баракчаны жашырабыз (толук коргоо — frame-ancestors баш, _headers) */
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location.href = window.self.location.href; } catch (e) { /* cross-origin: жашыруу жетиштүү */ }
}

/* Колдонуучу киргизген текстти тазалайбыз: башкаруучу белгилер жана ашыкча боштуктар алынат, узундугу чектелет */
const clean = (v, max) => String(v).replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/* ---------- 1. КОНФИГУРАЦИЯ ---------- */
const CONFIG = {
  whatsapp: '996700516888',   // халкаралык формат, "+" жок
  telegramUser: 'N1kto01',    // Telegram username ('@' жок). Бош болсо, Telegram көрүнбөйт
  collectUrl: 'https://script.google.com/macros/s/AKfycbwLj3zee8LQfD3JA0alG_9ttWYliCSgEbwDnIrIeHFXfaCWlC-hNIZFQAndLeC4QB9-/exec',             // Google Apps Script Web App URL (заявкалар базасы + статистика). Бош болсо — өчүк. README.md → "Заявкалар базасы"
  siteKey: 'vc-kg-2026'       // backend/Code.gs ичиндеги SITE_KEY менен бирдей болушу керек (жашыруун эмес, жөн гана таштанды чыпкалоо)
};

/* ---------- 2. ТИЛДЕР ----------
   Кыргызча текст index.html ичинде жазылган (баштапкы тил, SEO үчүн).
   Төмөндө орусча котормолор. Ачкыч = data-i18n атрибуту. */
const PH = '<span class="ph">[ОРУН АЛМАШТЫР]</span>';

const RU = {
  'nav.services': 'Услуги', 'nav.course': 'Курс', 'nav.works': 'Работы', 'nav.pricing': 'Цены', 'nav.contact': 'Контакты',
  'tab.adv': 'Преимущества',

  'hero.eyebrow': 'AI-чат-боты, сайты и автоматизация',
  'hero.title': 'От идеи до работающего сайта — <span class="text-gold">быстро, с AI</span>',
  'hero.sub': 'Чат-боты, автоматизация, сайты и приложения для вашего бизнеса. На курсе по vibe coding вы научитесь делать это сами.',
  'hero.priceLabel': 'Цена',
  'hero.price': 'Услуги — от $150 · Курс — от $50',
  'hero.cta': 'Написать в WhatsApp',
  'hero.link': 'О курсе',

  'prob.title': 'Заказать сайт не должно быть сложно',
  'prob.tag1': 'Проблема', 'prob.tag2': 'Решение',
  'prob.1': 'Сайты делают долго, а цена непонятна',
  'prob.2': 'В курсах много теории, но нет собственного результата',
  'prob.3': 'Среди AI-инструментов непонятно, с чего начать',
  'sol.1': 'Быстрый прототип с помощью AI и прозрачная цена',
  'sol.2': 'Практика: к концу курса у вас готов собственный проект',
  'sol.3': 'Сопровождение от начала до конца — прямая связь в WhatsApp',

  'adv.title': 'С нами удобно работать',
  'adv.1.t': 'Быстро с AI', 'adv.1.d': 'Прототип вы увидите быстро, правки вносим оперативно.',
  'adv.2.t': 'Понятный процесс', 'adv.2.d': 'Каждый этап и цена согласуются заранее.',
  'adv.3.t': 'Адаптация под телефон', 'adv.3.d': 'Страницы корректно выглядят начиная с экрана 375px.',
  'adv.4.t': 'Прямая связь в WhatsApp', 'adv.4.d': 'Вопросы и правки — напрямую, без посредников.',

  'srv.sub': 'Выберите то, что нужно вашему бизнесу',
  'srv.cta': 'Уточнить стоимость',
  'srv.ex': 'Пример:',
  'srv.1.t': 'AI-чат-бот',
  'srv.1.d': '<b class="text-white">Чат-бот</b> — программа, которая отвечает клиентам вместо вас. Работает в Instagram, WhatsApp и Telegram днём и ночью.',
  'srv.1.x': 'Кофейне в 2 часа ночи пишут «сколько стоит капучино?». Бот сразу называет цену и принимает заказ. Вы в это время спите.',
  'srv.1.n': 'Простой бот с готовыми ответами — дешевле. Бот, который сам думает над ответом, — дороже.',
  'srv.2.t': 'Список заявок (CRM)',
  'srv.2.d': '<b class="text-white">CRM</b> — это «электронная тетрадь» ваших клиентов. Кто написал, кто оплатил, кому позвонить — всё в одном месте.',
  'srv.2.x': 'Человек оставил заявку через рекламу. Она сама попадает в тетрадь, а ему в WhatsApp приходит «Мы получили вашу заявку». Копировать вручную не нужно.',
  'srv.2.n': 'Зависит от того, сколько программ нужно связать между собой.',
  'srv.3.t': 'Сайт и лендинг',
  'srv.3.d': '<b class="text-white">Лендинг</b> — сайт из одной страницы. На нём написано, что вы продаёте, а клиент пишет вам одной кнопкой. Срок: 2–3 дня.',
  'srv.3.x': 'Вы открыли новый ресторан. За три дня готов сайт с меню, фото и кнопкой «Забронировать стол».',
  'srv.3.n': 'Одна страница — дешевле. Много страниц и анимация — дороже.',
  'srv.4.t': 'Приложение для вашего дела',
  'srv.4.d': 'Отдельная программа для работы внутри вашей компании. Открывается и на телефоне, и на компьютере, заменяет бумаги и Excel. Срок: 1–2 недели.',
  'srv.4.x': 'В транспортной компании водитель нажимает на телефоне «доставил», и вы сразу это видите. Звонки и бумаги не нужны.',
  'srv.4.n': 'Если заказать у программиста — от $5 000. Здесь дешевле и быстрее.',

  'crs.title': 'Курс по vibe coding',
  'crs.sub': 'Научитесь создавать сайты, чат-ботов и автоматизации с помощью AI',
  'crs.soon': 'Курс скоро стартует', 'crs.fmt': 'Формат', 'crs.start': 'Старт', 'crs.start.v': 'Скоро',
  'crs.fmt.v': 'Видеоуроки, Telegram-чат, Zoom',
  'crs.prog': 'Программа',
  'm.1': 'Концепция vibe coding и работа с AI (ChatGPT, Claude): промпты',
  'm.2': 'Базовые уроки по Tilda и ManyChat',
  'm.3': 'Алгоритмы сборки простых проектов',
  'm.4': 'Углублённые модули по Make.com, Webflow, Bubble (Стандарт и VIP)',
  'm.5': 'Поиск клиентов, фриланс-биржи и продажа услуг (Стандарт и VIP)',
  'm.6': 'VIP: реальный проект клиента вместе с автором',
  'crs.cta2': 'Выбрать тариф',

  'wk.title': 'Наши работы',
  'wk.soon.t': 'Первые проекты скоро появятся здесь',
  'wk.soon.d': 'Мы будем добавлять в этот раздел выполненные работы. Станьте одним из первых клиентов и начните свой проект.',
  'wk.cta': 'Обсудить проект',

  'rev.title': 'Отзывы клиентов', 'rev.q': 'настоящий отзыв клиента', 'rev.n': 'имя и фамилия',

  'pr.title': 'Тарифы курса', 'pr.note': 'Цены на услуги указаны в разделе «Услуги».',
  't.badge': 'Основной тариф', 't.cta': 'Записаться заранее',
  't.b.n': 'Базовый', 't.b.s': '«Самостоятельно»', 't.b.a': 'Для студентов и новичков',
  't.b.f1': 'Концепция vibe coding, промпты для работы с AI (ChatGPT, Claude)',
  't.b.f2': 'Видеоуроки по Tilda и ManyChat',
  't.b.f3': 'Алгоритмы сборки простых проектов',
  't.b.f4': 'Нет куратора и проверки домашних заданий',
  't.s.n': 'Стандарт', 't.s.s': '«С куратором»', 't.s.a': 'Для тех, кто хочет полностью освоить новую профессию и зарабатывать',
  't.s.f1': 'Все уроки базового тарифа',
  't.s.f2': 'Углублённые модули по Make.com, Webflow, Bubble',
  't.s.f3': 'Модуль о поиске клиентов, фриланс-биржах и продаже услуг',
  't.s.f4': 'Куратор проверяет домашние задания',
  't.s.f5': 'Закрытый Telegram-чат (комьюнити)',
  't.s.f6': 'Еженедельные сессии вопросов и ответов с автором в Zoom',
  't.v.n': 'Премиум VIP', 't.v.s': '«Менторство»', 't.v.a': 'Для готовых предпринимателей и тех, кто планирует открыть своё IT-агентство',
  't.v.f1': 'Все возможности тарифа «Стандарт»',
  't.v.f2': 'Индивидуальные консультации (1-on-1) с автором в Zoom',
  't.v.f3': 'Реальный проект клиента вместе с автором',
  't.v.f4': 'Помощь в поиске первого коммерческого заказа',
  't.v.f5': 'Мастермайнд по договорам, юридическим вопросам и продажам high-ticket',
  't.v.f6': 'Офлайн-встречи в Бишкеке',
  'faq.title': 'Частые вопросы',
  'faq.1.q': 'Для кого этот курс?', 'faq.1.a': 'Для тех, кто хочет зарабатывать дополнительно; для тех, кто никогда не писал код, но хочет делать сайты; для тех, у кого есть 2 свободных часа в день; и для тех, у кого есть компьютер.',
  'faq.2.q': 'За какое время будет готова работа?', 'faq.2.a': 'Быстрый лендинг — за 2–3 дня, внутреннее приложение — за 1–2 недели. Точные сроки обсудим в WhatsApp и согласуем заранее.',
  'faq.3.q': 'Как проходит оплата?', 'faq.3.a': 'За услуги вносится предоплата (залог), а полная оплата — когда вы принимаете готовый проект. Курс оплачивается заранее.',
  'faq.4.q': 'Есть ли поддержка после сдачи работы?', 'faq.4.a': 'Да, поддержка после сдачи работы, конечно, есть. Формат поддержки зависит от вида покупки: услуги или курса.',
  'faq.5.q': 'Как начать?', 'faq.5.a': 'Напишите в WhatsApp — ответим на вопросы и предложим следующий шаг.',

  'ct.title': 'Оставьте сообщение',
  'ct.sub': 'После заполнения формы готовое сообщение откроется в WhatsApp — отправите его оттуда.',
  'ct.direct': 'Или напишите напрямую:',
  'ct.name': 'Ваше имя', 'ct.namePh': 'Например, Айбек',
  'ct.phone': 'Телефон',
  'ct.topic': 'Что вас интересует?',
  'ct.o1': 'Заказать сайт', 'ct.o2': 'Курс по vibe coding', 'ct.o3': 'Другое',
  'ct.o4': 'AI-чат-бот', 'ct.o5': 'Автоматизация (CRM)', 'ct.o6': 'Внутреннее приложение (MVP)',
  'ct.msg': 'Сообщение (необязательно)',
  'ct.submit': 'Отправить',
  'err.name': 'Введите имя (минимум 2 буквы)',
  'err.phone': 'Введите корректный номер телефона (9–15 цифр)',
  'ty.title': 'Спасибо!',
  'ty.text': 'Ваше сообщение готово. Нажмите «Отправить» в WhatsApp.',
  'ty.btn': 'Открыть WhatsApp',

  'ft.privacy': 'Сайт собирает анонимную статистику (без cookie). Данные из формы видит только владелец сайта.', 'ft.tag': 'AI-чат-боты, сайты и курс', 'ft.rights': 'Все права защищены.'
};

/* Беттин мета-маалыматы */
const META = {
  kg: {
    title: 'vibe_coder.kg — AI чат-боттор, сайттар жана vibe coding курсу',
    desc: "AI чат-боттор, CRM автоматташтыруу, сайттар жана ички тиркемелер — $150дөн. Vibe coding курсу — $50дөн. WhatsApp'ка жазыңыз."
  },
  ru: {
    title: 'vibe_coder.kg — AI-чат-боты, сайты и курс по vibe coding',
    desc: 'AI-чат-боты, автоматизация CRM, сайты и внутренние приложения — от $150. Курс по vibe coding — от $50. Пишите в WhatsApp.'
  }
};

/* WhatsApp'ка алдын ала жазылган тексттер */
const WA_TEXT = {
  kg: {
    hero: 'Саламатсызбы! Сайт жасатуу боюнча сурагым бар.',
    landing: 'Саламатсызбы! Landing баракча жасатууну кааладым.',
    site: 'Саламатсызбы! Бизнес сайт жасатууну кааладым.',
    course: 'Саламатсызбы! Vibe coding курсуна жазылгым келет.',
    srv1: 'Саламатсызбы! AI чат-бот жасатууну кааладым.',
    srv2: 'Саламатсызбы! CRM автоматташтырууну кааладым.',
    srv3: 'Саламатсызбы! Лендинг/сайт жасатууну кааладым.',
    srv4: 'Саламатсызбы! Ички башкаруу тиркемесин (MVP) жасатууну кааладым.',
    tb: 'Саламатсызбы! Vibe coding курсунун «Базалык» тарифине алдын ала жазылгым келет.',
    ts: 'Саламатсызбы! Vibe coding курсунун «Стандарт» тарифине алдын ала жазылгым келет.',
    tv: 'Саламатсызбы! Vibe coding курсунун «Премиум VIP» тарифине алдын ала жазылгым келет.',
    direct: 'Саламатсызбы!'
  },
  ru: {
    hero: 'Здравствуйте! У меня вопрос по созданию сайта.',
    landing: 'Здравствуйте! Хочу заказать лендинг.',
    site: 'Здравствуйте! Хочу заказать бизнес-сайт.',
    course: 'Здравствуйте! Хочу записаться на курс по vibe coding.',
    srv1: 'Здравствуйте! Хочу заказать AI-чат-бота.',
    srv2: 'Здравствуйте! Хочу заказать автоматизацию CRM.',
    srv3: 'Здравствуйте! Хочу заказать лендинг/сайт.',
    srv4: 'Здравствуйте! Хочу заказать внутреннее приложение (MVP).',
    tb: 'Здравствуйте! Хочу записаться заранее на курс vibe coding, тариф «Базовый».',
    ts: 'Здравствуйте! Хочу записаться заранее на курс vibe coding, тариф «Стандарт».',
    tv: 'Здравствуйте! Хочу записаться заранее на курс vibe coding, тариф «Премиум VIP».',
    direct: 'Здравствуйте!'
  }
};

const waUrl = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

let currentLang = 'kg';

/* Кыргызча баштапкы текстти эстеп калабыз (HTML ичинен) */
const KG = {};
document.querySelectorAll('[data-i18n]').forEach((el) => {
  const key = el.dataset.i18n;
  if (!(key in KG)) KG[key] = el.innerHTML;
});
const KG_PLACEHOLDERS = {};
document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
  KG_PLACEHOLDERS[el.dataset.i18nPlaceholder] = el.getAttribute('placeholder');
});

function applyLang(lang) {
  currentLang = lang;
  const dict = lang === 'ru' ? RU : KG;

  document.documentElement.lang = lang === 'ru' ? 'ru' : 'ky';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = dict[el.dataset.i18n];
    if (val !== undefined) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.setAttribute('placeholder', lang === 'ru' ? RU[key] : KG_PLACEHOLDERS[key]);
  });

  document.title = META[lang].title;
  document.querySelector('meta[name="description"]').setAttribute('content', META[lang].desc);

  /* WhatsApp шилтемелери */
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waUrl(WA_TEXT[lang][a.dataset.wa] || WA_TEXT[lang].direct);
  });

  /* Активдүү тил баскычы */
  document.querySelectorAll('.lang-btn').forEach((b) => {
    const active = b.dataset.lang === lang;
    b.classList.toggle('bg-gold', active);
    b.classList.toggle('text-ink', active);
    b.setAttribute('aria-pressed', String(active));
  });

  try { localStorage.setItem('lang', lang); } catch (e) { /* жок болсо мейли */ }

  /* Тил алмашканда hero тексти кайра ойнойт */
  playHeroText();
}

/* ---------- ТЕКСТ АНИМАЦИЯСЫ ----------
   Аталык: сөз-сөз өйдө чыгат, алтын сөздөр жылтырайт.
   Кичи сап: тамга-тамга пайда болот.
   prefers-reduced-motion болсо, CSS анимацияларды өчүрөт. */
function splitWords(el) {
  let i = 0;
  const walk = (node, cls) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w' + (cls ? ' ' + cls : '');
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.animationDelay = (150 + i++ * 90) + 'ms';
          w.appendChild(inner);
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        walk(n, n.classList.contains('text-gold') ? 'gw' : cls);
      }
    });
  };
  walk(el, '');
}

function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.style.animationDelay = (i * 28) + 'ms';
    s.textContent = c;
    el.appendChild(s);
  });
}

function playHeroText() {
  const eyebrow = document.getElementById('heroEyebrow');
  const title = document.getElementById('heroTitle');
  if (eyebrow) splitChars(eyebrow);
  if (title) splitWords(title);
}

document.querySelectorAll('.lang-btn').forEach((b) =>
  b.addEventListener('click', () => applyLang(b.dataset.lang))
);

let saved = 'kg';
try { saved = localStorage.getItem('lang') || 'kg'; } catch (e) { /* ignore */ }
applyLang(saved === 'ru' ? 'ru' : 'kg');

/* Telegram (болсо гана көрсөтөбүз) */
if (CONFIG.telegramUser) {
  const row = document.getElementById('tgRow');
  const tgUrl = `https://t.me/${CONFIG.telegramUser}`;
  document.getElementById('tgLink').href = tgUrl;
  row.classList.remove('hidden');
  const foot = document.getElementById('tgFoot');
  foot.href = tgUrl;
  foot.classList.remove('hidden');
}

/* ---------- 3. МОБИЛДИК МЕНЮ ---------- */
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');

function setMenu(open) {
  mobileNav.classList.toggle('hidden', !open);
  mobileNav.classList.toggle('flex', open);
  menuBtn.setAttribute('aria-expanded', String(open));
}
menuBtn.addEventListener('click', () => setMenu(mobileNav.classList.contains('hidden')));
mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ---------- 4. КӨРҮНҮҮ АНИМАЦИЯСЫ ---------- */
const revealEls = document.querySelectorAll('.reveal');
/* Бир топтогу элементтер кезек менен чыгат (карточкалар, тизмелер) */
revealEls.forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  const idx = sibs.indexOf(el);
  if (idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 90 + 'ms';
});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 5. ФОРМА ---------- */
const form = document.getElementById('leadForm');
const formShownAt = Date.now();
const thanks = document.getElementById('thanks');
const fName = document.getElementById('fName');
const fPhone = document.getElementById('fPhone');

function setError(input, errId, bad) {
  document.getElementById(errId).classList.toggle('hidden', !bad);
  input.setAttribute('aria-invalid', String(bad));
  input.classList.toggle('border-[#F5B7A8]', bad);
}

const nameOk = () => fName.value.trim().length >= 2;
const phoneOk = () => {
  const digits = fPhone.value.replace(/\D/g, '');
  return /^[+\d\s()-]+$/.test(fPhone.value.trim()) && digits.length >= 9 && digits.length <= 15;
};

fName.addEventListener('blur', () => setError(fName, 'eName', !nameOk()));
fPhone.addEventListener('blur', () => setError(fPhone, 'ePhone', !phoneOk()));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const okName = nameOk();
  const okPhone = phoneOk();
  setError(fName, 'eName', !okName);
  setError(fPhone, 'ePhone', !okPhone);
  if (!okName || !okPhone) {
    (okName ? fPhone : fName).focus();
    return;
  }

  /* Даяр билдирүүнү түзөбүз */
  const topicSel = document.getElementById('fTopic');
  const topic = topicSel.options[topicSel.selectedIndex].textContent;
  const msg = clean(document.getElementById('fMsg').value, 500);
  const L = currentLang === 'ru'
    ? { hi: 'Здравствуйте!', name: 'Меня зовут', phone: 'Телефон', topic: 'Интересует' }
    : { hi: 'Саламатсызбы!', name: 'Мен', phone: 'Телефон', topic: 'Кызыккан тема' };
  const text = `${L.hi} ${L.name}: ${clean(fName.value, 60)}. ${L.phone}: ${clean(fPhone.value, 20)}. ${L.topic}: ${topic}.${msg ? ' ' + msg : ''}`;
  const url = waUrl(text);

  /* Заявканы базага сактайбыз (бот болсо — жымжырттык менен өткөрүп жиберебүз) */
  const spam = document.getElementById('fWebsite').value !== '' || Date.now() - formShownAt < 2500;
  if (!spam) {
    send({
      t: 'lead', name: clean(fName.value, 60), phone: clean(fPhone.value, 20),
      topic, msg, hp: '', ...ctx()
    });
    track('form_submit', topicSel.value);
  }

  /* «Рахмат» көрсөтөбүз жана WhatsApp'ты ачабыз */
  document.getElementById('thanksWa').href = url;
  form.classList.add('hidden');
  thanks.classList.remove('hidden');
  window.open(url, '_blank', 'noopener,noreferrer');
});

/* ---------- 6. СТАТИСТИКА ЖАНА ЗАЯВКАЛАР БАЗАСЫ ----------
   Бардыгы CONFIG.collectUrl бош болсо өчүк. Статистика анонимдүү: cookie жок, жеке маалымат жок,
   "Do Not Track" / Global Privacy Control күйгүзүлгөн болсо — жөнөтүлбөйт.
   Заявкалар (форма) гана — колдонуучу өзү жөнөткөндө — Google Sheets'ке түшөт. Маалыматты ээси гана көрөт. */
const dnt = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;

let sid = '';
try {
  sid = sessionStorage.getItem('sid') || '';
  if (!sid) { sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); sessionStorage.setItem('sid', sid); }
} catch (e) { sid = 'na'; }

const qs = new URLSearchParams(location.search);
const refHost = () => { try { const h = new URL(document.referrer).host; return h && h !== location.host ? h : ''; } catch (e) { return ''; } };
const ctx = () => ({
  sid, lang: currentLang,
  dev: innerWidth < 768 ? 'mobile' : innerWidth < 1100 ? 'tablet' : 'desktop',
  src: clean(qs.get('utm_source') || refHost() || 'direct', 40),
  cam: clean(qs.get('utm_campaign') || '', 40)
});

function send(payload) {
  if (!CONFIG.collectUrl) return;
  try {
    fetch(CONFIG.collectUrl, {
      method: 'POST', mode: 'no-cors', keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ k: CONFIG.siteKey, ...payload })
    }).catch(() => {});
  } catch (e) { /* статистика сайттын иштешин бузбашы керек */ }
}
function track(ev, detail) {
  if (dnt) return;
  send({ t: 'ev', ev, d: clean(detail || '', 40), ...ctx() });
}

if (CONFIG.collectUrl) {
  const note = document.getElementById('privacyNote');
  if (note) note.classList.remove('hidden');

  track('page_view');

  /* Бөлүмдөр көрүндү (ар бири бир гана жолу) */
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !seen.has(en.target.id)) { seen.add(en.target.id); track('section', en.target.id); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('main section[id]').forEach((s) => sio.observe(s));
  }

  /* Скролл тереңдиги */
  const marks = [25, 50, 75, 100]; const hit = new Set();
  addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = Math.round((h.scrollTop + innerHeight) / h.scrollHeight * 100);
    marks.forEach((m) => { if (pct >= m && !hit.has(m)) { hit.add(m); track('scroll', String(m)); } });
  }, { passive: true });

  /* Баскычтар: WhatsApp (кайсы кызмат/тариф), Telegram */
  document.addEventListener('click', (e) => {
    const wa = e.target.closest('[data-wa]');
    if (wa) { track('cta_wa', wa.dataset.wa); return; }
    if (e.target.closest('#tgLink, #tgFoot')) track('cta_tg', '');
  });

  document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => track('lang', b.dataset.lang)));
  fName.addEventListener('focus', () => track('form_start', ''), { once: true });

  /* Баракчада канча убакыт болду */
  const t0 = Date.now();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') track('leave', String(Math.min(Math.round((Date.now() - t0) / 1000), 3600)));
  });
}

/* ---------- 7. HERO ФОНУ: бири-бирине байланган чекиттер ----------
   Жеңил canvas (жүктөлгөндөн 3,5 сек кийин башталат): чекиттер жай жылат, жакындары сызык менен байланат. Hero көрүнбөсө же бет жашырылса — токтойт.
   "prefers-reduced-motion" болсо — бир жолу гана тартылат. Баракчанын жүктөлүшүн кармабайт (idle убакытта башталат). */
(function heroNetwork() {
  const cv = document.getElementById('heroCanvas');
  const ctx = cv && cv.getContext && cv.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0, h = 0, pts = [], raf = 0, visible = true;

  function seed() {
    const n = Math.round(Math.min(58, Math.max(22, innerWidth / 24)));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.3 + 0.6
    }));
  }
  function resize() {
    const r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed(); draw();
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const max = innerWidth < 640 ? 100 : 135;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let k = i + 1; k < pts.length; k++) {
        const b = pts[k], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < max * max) {
          ctx.strokeStyle = 'rgba(201,178,124,' + (0.26 * (1 - Math.sqrt(d2) / max)).toFixed(3) + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(228,218,192,.75)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
    }
  }
  function step() {
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    draw();
    raf = requestAnimationFrame(step);
  }
  function update() {
    const run = visible && !document.hidden && !reduce;
    if (run && !raf) raf = requestAnimationFrame(step);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  function start() {
    resize();
    let t = 0;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 200); });
    document.addEventListener('visibilitychange', update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((e) => { visible = e[0].isIntersecting; update(); }, { threshold: 0 }).observe(cv.parentElement);
    }
    update();
  }
  /* Баракча толук жүктөлүп, негизги мазмун көрүнгөндөн кийин гана баштайт (ылдамдыкты тоскоол кылбайт), жумшак пайда болот */
  const begin = () => setTimeout(() => { cv.classList.add('on'); start(); }, 3500);
  if (document.readyState === 'complete') begin();
  else addEventListener('load', begin, { once: true });
})();
