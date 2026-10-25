/* «Лёгкость» — данные: магазины, ингредиенты, блюда.
   Все цены базовые, ₽ за кг или за штуку. Коэффициент магазина применяется в app.js. */

const STORES = [
  {
    id: 'pyaterochka', name: 'Пятёрочка', letter: 'П', color: '#E8453C',
    slogan: 'У дома · низкие цены', coef: 0.98,
    image: 'assets/stores/pyaterochka.jpg', address: 'пр. Ленина, 44', branches: 39,
    delivery: { service: 'Купер · Яндекс Еда', eta: '30–60 мин', fee: 99, min: 500, freeFrom: 1500 },
    deliveryUrl: 'https://eda.yandex.ru/Orsk/retail', siteUrl: 'https://5ka.ru/',
    note: 'Ближайшие магазины — в шаговой доступности. Доставка от 30 минут.'
  },
  {
    id: 'magnit', name: 'Магнит', letter: 'М', color: '#D6001C',
    slogan: 'У дома · низкие цены', coef: 0.97,
    image: 'assets/stores/magnit.jpg', address: 'пр. Ленина, 19', branches: 49,
    delivery: { service: 'Магнит Доставка · Купер', eta: '35–70 мин', fee: 0, min: 1000, freeFrom: 1000 },
    deliveryUrl: 'https://magnit.ru/', siteUrl: 'https://magnit.ru/',
    note: 'Самая широкая сеть в Орске: 49 адресов и доставка на дом.'
  },
  {
    id: 'lenta', name: 'Лента', letter: 'Л', color: '#0057A8',
    slogan: 'Гипермаркет · закупка', coef: 1.00,
    image: 'assets/stores/lenta.jpg', address: 'пр. Ленина, 168', branches: 1,
    delivery: { service: 'Лента Онлайн · Яндекс Еда', eta: '60–120 мин', fee: 149, min: 1500, freeFrom: 3000 },
    deliveryUrl: 'https://lenta.com/cities/orsk/0167/', siteUrl: 'https://lenta.com/cities/orsk/0167/',
    note: 'Большая закупка на неделю, свежая выпечка и широкая полка.'
  },
  {
    id: 'svetofor', name: 'Светофор', letter: 'С', color: '#69A93C',
    slogan: 'Дискаунтер · крупная фасовка', coef: 0.88,
    image: 'assets/stores/svetofor.jpg', address: 'ул. Макаренко, 20Б', branches: 5,
    delivery: { service: 'Самовывоз', eta: 'самовывоз', fee: 0, min: 0, freeFrom: 0 },
    deliveryUrl: 'https://2gis.ru/orsk/search/%D1%81%D0%B2%D0%B5%D1%82%D0%BE%D1%84%D0%BE%D1%80', siteUrl: 'https://2gis.ru/orsk/search/%D1%81%D0%B2%D0%B5%D1%82%D0%BE%D1%84%D0%BE%D1%80',
    note: 'Крупные упаковки и базовые продукты — выгодно для семьи.'
  },
  {
    id: 'yandex_eda', name: 'Яндекс Еда', letter: 'Я', color: '#FC3F1D',
    slogan: 'Маркетплейс · доставка из магазинов', coef: 1.04, kind: 'service',
    image: 'assets/stores/yandex-eda.jpg', address: 'Орск и пригород', branches: null,
    delivery: { service: 'Яндекс Еда', eta: '20–60 мин', fee: 0, min: 0, freeFrom: 0 },
    deliveryUrl: 'https://eda.yandex.ru/Orsk/retail', siteUrl: 'https://eda.yandex.ru/Orsk/retail',
    note: 'Собирает заказ из Пятёрочки, Ленты и других магазинов Орска.'
  },
  {
    id: 'kuper', name: 'Купер', letter: 'К', color: '#00A87E',
    slogan: 'Маркетплейс · продукты за 30 минут', coef: 1.00, kind: 'service',
    image: 'assets/stores/kuper.jpg', address: 'Орск и пригород', branches: null,
    delivery: { service: 'Купер', eta: '30–60 мин', fee: 0, min: 500, freeFrom: 1000 },
    deliveryUrl: 'https://web.kuper.ru/', siteUrl: 'https://web.kuper.ru/',
    note: 'Доставка из Пятёрочки и Магнита по адресу в Орске.'
  },
  { id: 'dixy',        name: 'Дикси',      letter: 'Д', color: '#EF7D22', slogan: 'У дома · рядом',       coef: 1.00 },
  { id: 'chizhik',     name: 'Чижик',      letter: 'Ч', color: '#E8B400', slogan: 'Дискаунтер · базовое', coef: 0.92 },
  { id: 'perekrestok', name: 'Перекрёсток',letter: 'П', color: '#2C7A3F', slogan: 'Средние цены · выбор', coef: 1.05 },
  { id: 'auchan',      name: 'Ашан',       letter: 'А', color: '#E30613', slogan: 'Гипермаркет · оптом', coef: 1.03 },
  { id: 'metro',       name: 'Метро',      letter: 'M', color: '#003B71', slogan: 'Мелкий опт · большие упаковки', coef: 0.95 },
  { id: 'vkusvill',    name: 'ВкусВилл',   letter: 'В', color: '#4CAF50', slogan: 'Своё производство',   coef: 1.15 }
];

/* Регионы: доступные магазины и поправка к ценам.
   center = [широта, долгота] — используется для карты Яндекс.Карт. */
const REGIONS = [
  {
    id: 'orsk', name: 'Орск', area: 'Оренбургская область',
    center: [51.2292, 58.4752], zoom: 12, priceCoef: 1.00,
    photo: 'assets/stores/orsk.jpg', photoThumb: 'assets/stores/orsk-thumb.jpg',
    storeIds: ['pyaterochka', 'magnit', 'lenta', 'svetofor', 'yandex_eda', 'kuper'],
    storeCoefs: { pyaterochka: 1.00, magnit: 0.99, lenta: 1.015, svetofor: 0.96, yandex_eda: 1.07, kuper: 1.04 },
    note: 'домашний регион · локальные цены',
    description: 'Орск — наш основной город. Пятёрочка и Магнит на каждой улице, Лента — для большой закупки, Светофор — за крупной фасовкой. Доставка — через Купер и Яндекс Еду.',
    highlights: ['39 Пятёрочек', '49 Магнитов', 'доставка от 30 мин', 'локальный снимок цен'],
    priceSnapshot: true
  },
  {
    id: 'moscow', name: 'Москва', area: 'Москва и область',
    center: [55.7558, 37.6173], zoom: 10, priceCoef: 1.00,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'chizhik', 'svetofor', 'perekrestok', 'lenta', 'auchan', 'metro', 'vkusvill'],
    storeCoefs: { lenta: 0.98, metro: 0.96, vkusvill: 1.01 },
    note: 'Базовые цены сети'
  },
  {
    id: 'spb', name: 'Санкт-Петербург', area: 'Ленинградская область',
    center: [59.9398, 30.3158], zoom: 10, priceCoef: 1.04,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'chizhik', 'svetofor', 'perekrestok', 'lenta', 'vkusvill'],
    storeCoefs: { lenta: 0.96, perekrestok: 1.02, vkusvill: 1.02 },
    note: 'Северо-Запад · цены выше'
  },
  {
    id: 'kazan', name: 'Казань', area: 'Республика Татарстан',
    center: [55.7963, 49.1064], zoom: 10, priceCoef: 0.94,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'perekrestok', 'lenta', 'metro'],
    storeCoefs: { magnit: 0.97, lenta: 0.99 },
    note: 'Поволжье · цены ниже'
  },
  {
    id: 'ekaterinburg', name: 'Екатеринбург', area: 'Свердловская область',
    center: [56.8389, 60.6122], zoom: 10, priceCoef: 0.97,
    storeIds: ['pyaterochka', 'magnit', 'svetofor', 'lenta', 'metro', 'vkusvill'],
    storeCoefs: { lenta: 0.98, vkusvill: 1.04 },
    note: 'Урал · средние цены'
  },
  {
    id: 'novosibirsk', name: 'Новосибирск', area: 'Новосибирская область',
    center: [55.0084, 82.9346], zoom: 10, priceCoef: 0.96,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'svetofor', 'lenta', 'metro'],
    storeCoefs: { lenta: 0.97, magnit: 0.98 },
    note: 'Сибирь · цены ниже'
  },
  {
    id: 'krasnodar', name: 'Краснодар', area: 'Краснодарский край',
    center: [45.0355, 38.9769], zoom: 10, priceCoef: 0.92,
    storeIds: ['pyaterochka', 'magnit', 'svetofor', 'lenta', 'metro'],
    storeCoefs: { magnit: 1.02, svetofor: 0.97 },
    note: 'Юг России · самые низкие цены'
  },
  {
    id: 'nizhny', name: 'Нижний Новгород', area: 'Нижегородская область',
    center: [56.3269, 44.0059], zoom: 10, priceCoef: 0.95,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'chizhik', 'perekrestok', 'lenta'],
    storeCoefs: { lenta: 0.98, perekrestok: 1.01 },
    note: 'Поволжье · цены ниже'
  },
  {
    id: 'samara', name: 'Самара', area: 'Самарская область',
    center: [53.1959, 50.1002], zoom: 10, priceCoef: 0.93,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'lenta', 'metro'],
    storeCoefs: { lenta: 1.00, metro: 0.97 },
    note: 'Поволжье · цены ниже'
  },
  {
    id: 'sochi', name: 'Сочи', area: 'Краснодарский край',
    center: [43.6028, 39.7303], zoom: 11, priceCoef: 1.12,
    storeIds: ['pyaterochka', 'magnit', 'perekrestok', 'lenta', 'vkusvill'],
    storeCoefs: { perekrestok: 1.03, vkusvill: 1.04 },
    note: 'Курорт · цены выше'
  },
  {
    id: 'vladivostok', name: 'Владивосток', area: 'Приморский край',
    center: [43.1155, 131.8855], zoom: 10, priceCoef: 1.17,
    storeIds: ['pyaterochka', 'magnit', 'svetofor', 'lenta', 'metro'],
    storeCoefs: { lenta: 1.02, svetofor: 0.98 },
    note: 'Дальний Восток · цены выше'
  },
  {
    id: 'kaliningrad', name: 'Калининград', area: 'Калининградская область',
    center: [54.7104, 20.4522], zoom: 10, priceCoef: 1.07,
    storeIds: ['pyaterochka', 'magnit', 'dixy', 'lenta', 'vkusvill'],
    storeCoefs: { vkusvill: 1.03 },
    note: 'Запад России · цены выше'
  }
];

/* Снимок цен Орска. Это не «живой» API: цены собраны по витринам магазинов
   и сервисов доставки на указанную дату. Файл data/prices-orsk.json позволяет
   обновлять снимок без правки кода — приложение загрузит его при старте. */
let ORSK_PRICE_SNAPSHOT = {
  regionId: 'orsk',
  updatedAt: '2026-10-22T09:00:00+05:00',
  dateLabel: '22 октября 2026',
  source: 'Снимок витрин Яндекс.Еды, Купера и магазинов Орска',
  sourceUrl: 'https://eda.yandex.ru/Orsk/retail',
  disclaimer: 'Цены ориентировочные и могут отличаться от приложения доставки. Перед заказом проверь корзину.',
  ingredients: {
    chicken_fillet: 459, turkey: 529, pork: 349, beef: 529, liver: 229, minced_chicken: 399,
    salmon: 1190, cod: 599, pollock: 349, shrimp: 1190,
    egg: 13, cottage_cheese: 379, yogurt: 269, milk: 89, kefir: 99, cheese: 649,
    butter: 999, sour_cream: 299, cream: 399,
    potato: 39, onion: 29, carrot: 39, zucchini: 69, pumpkin: 49, broccoli: 239,
    tomato: 199, cucumber: 129, pepper: 219, cabbage: 35, beet: 49, eggplant: 159,
    mushrooms: 219, greens: 499, cilantro: 499, garlic: 199, avocado: 89, olives: 899,
    spinach: 349, green_peas: 129, corn: 149, celery: 149, beans: 119,
    banana: 89, apple: 99, berries: 349, orange: 149, lemon: 169, pear: 149,
    rice: 99, buckwheat: 79, oatmeal: 69, millet: 59, oat_flour: 129, flour: 55,
    pasta: 99, pearl_barley: 49, bread: 90, lavash: 35,
    sweetener: 3, spices: 690, soy_sauce: 399, tofu: 399, sesame: 590,
    honey: 499, nuts: 990, peanut: 649, oil: 159, cocoa: 699
  }
};

/* allergens: nuts | peanut | milk | egg | gluten | fish | seafood | soy | honey | citrus | sesame */
const INGREDIENTS = [
  { id: 'chicken_fillet', name: 'Куриное филе', emoji: '🍗', category: 'meat', unit: 'kg', pricePerUnit: 1274, allergens: [], syn: ['курица', 'куриц', 'куриное'] },
  { id: 'turkey', name: 'Индейка', emoji: '🦃', category: 'meat', unit: 'kg', pricePerUnit: 1334, allergens: [], syn: ['индейк'] },
  { id: 'pork', name: 'Свинина', emoji: '🥩', category: 'meat', unit: 'kg', pricePerUnit: 899, allergens: [], syn: ['свинин'] },
  { id: 'beef', name: 'Говядина', emoji: '🥩', category: 'meat', unit: 'kg', pricePerUnit: 1190, allergens: [], syn: ['говядин'] },
  { id: 'liver', name: 'Печень', emoji: '🫀', category: 'meat', unit: 'kg', pricePerUnit: 549, allergens: [], syn: ['печен'] },
  { id: 'minced_chicken', name: 'Куриный фарш', emoji: '🍗', category: 'meat', unit: 'kg', pricePerUnit: 780, allergens: [], syn: ['фарш'] },
  { id: 'salmon', name: 'Лосось', emoji: '🐟', category: 'fish', unit: 'kg', pricePerUnit: 1650, allergens: ['fish'], syn: ['лосос', 'семг', 'форел'] },
  { id: 'cod', name: 'Треска', emoji: '🐟', category: 'fish', unit: 'kg', pricePerUnit: 990, allergens: ['fish'], syn: ['треск'] },
  { id: 'pollock', name: 'Минтай', emoji: '🐟', category: 'fish', unit: 'kg', pricePerUnit: 649, allergens: ['fish'], syn: ['минтай'] },
  { id: 'shrimp', name: 'Креветки', emoji: '🦐', category: 'fish', unit: 'kg', pricePerUnit: 1890, allergens: ['seafood'], syn: ['креветк'] },
  { id: 'egg', name: 'Яйца', emoji: '🥚', category: 'eggs', unit: 'pc', pricePerUnit: 59, allergens: ['egg'], syn: ['яйц', 'яиц'] },

  { id: 'cottage_cheese', name: 'Творог', emoji: '🧀', category: 'dairy', unit: 'kg', pricePerUnit: 429, allergens: ['milk'], syn: ['творог'] },
  { id: 'yogurt', name: 'Йогурт натуральный', emoji: '🥛', category: 'dairy', unit: 'kg', pricePerUnit: 299, allergens: ['milk'], syn: ['йогурт'] },
  { id: 'milk', name: 'Молоко', emoji: '🥛', category: 'dairy', unit: 'kg', pricePerUnit: 92, allergens: ['milk'], syn: ['молок'] },
  { id: 'kefir', name: 'Кефир', emoji: '🥛', category: 'dairy', unit: 'kg', pricePerUnit: 110, allergens: ['milk'], syn: ['кефир'] },
  { id: 'cheese', name: 'Сыр', emoji: '🧀', category: 'dairy', unit: 'kg', pricePerUnit: 649, allergens: ['milk'], syn: ['сыр'] },
  { id: 'butter', name: 'Масло сливочное', emoji: '🧈', category: 'dairy', unit: 'kg', pricePerUnit: 1099, allergens: ['milk'], syn: ['сливочн'] },
  { id: 'sour_cream', name: 'Сметана', emoji: '🥣', category: 'dairy', unit: 'kg', pricePerUnit: 349, allergens: ['milk'], syn: ['сметан'] },
  { id: 'cream', name: 'Сливки 20%', emoji: '🥛', category: 'dairy', unit: 'kg', pricePerUnit: 499, allergens: ['milk'], syn: ['сливк'] },

  { id: 'potato', name: 'Картофель', emoji: '🥔', category: 'veg', unit: 'kg', pricePerUnit: 62, allergens: [], syn: ['картоф', 'картошк'] },
  { id: 'onion', name: 'Лук', emoji: '🧅', category: 'veg', unit: 'kg', pricePerUnit: 39, allergens: [], syn: ['лук', 'луков'] },
  { id: 'carrot', name: 'Морковь', emoji: '🥕', category: 'veg', unit: 'kg', pricePerUnit: 48, allergens: [], syn: ['морков'] },
  { id: 'zucchini', name: 'Кабачок', emoji: '🥒', category: 'veg', unit: 'kg', pricePerUnit: 89, allergens: [], syn: ['кабачк'] },
  { id: 'pumpkin', name: 'Тыква', emoji: '🎃', category: 'veg', unit: 'kg', pricePerUnit: 79, allergens: [], syn: ['тыкв'] },
  { id: 'broccoli', name: 'Брокколи', emoji: '🥦', category: 'veg', unit: 'kg', pricePerUnit: 259, allergens: [], syn: ['брокколи'] },
  { id: 'tomato', name: 'Помидоры', emoji: '🍅', category: 'veg', unit: 'kg', pricePerUnit: 219, allergens: [], syn: ['помидор', 'томат'] },
  { id: 'cucumber', name: 'Огурцы', emoji: '🥒', category: 'veg', unit: 'kg', pricePerUnit: 149, allergens: [], syn: ['огурц'] },
  { id: 'pepper', name: 'Болгарский перец', emoji: '🫑', category: 'veg', unit: 'kg', pricePerUnit: 249, allergens: [], syn: ['перец'] },
  { id: 'cabbage', name: 'Капуста', emoji: '🥬', category: 'veg', unit: 'kg', pricePerUnit: 45, allergens: [], syn: ['капуст'] },
  { id: 'beet', name: 'Свёкла', emoji: '🟣', category: 'veg', unit: 'kg', pricePerUnit: 69, allergens: [], syn: ['свекл', 'свёкл'] },
  { id: 'eggplant', name: 'Баклажаны', emoji: '🍆', category: 'veg', unit: 'kg', pricePerUnit: 179, allergens: [], syn: ['баклажан'] },
  { id: 'mushrooms', name: 'Шампиньоны', emoji: '🍄', category: 'veg', unit: 'kg', pricePerUnit: 249, allergens: [], syn: ['гриб'] },
  { id: 'greens', name: 'Зелень', emoji: '🌿', category: 'veg', unit: 'kg', pricePerUnit: 647, allergens: [], syn: ['зелень', 'укроп', 'петрушк'] },
  { id: 'cilantro', name: 'Кинза', emoji: '🌿', category: 'veg', unit: 'kg', pricePerUnit: 647, allergens: [], syn: ['кинз', 'кориандр'] },
  { id: 'garlic', name: 'Чеснок', emoji: '🧄', category: 'veg', unit: 'kg', pricePerUnit: 249, allergens: [], syn: ['чеснок'] },
  { id: 'avocado', name: 'Авокадо', emoji: '🥑', category: 'veg', unit: 'pc', pricePerUnit: 89, allergens: [], syn: ['авокадо'] },
  { id: 'olives', name: 'Оливки', emoji: '🫒', category: 'other', unit: 'kg', pricePerUnit: 1299, allergens: [], syn: ['оливк'] },
  { id: 'spinach', name: 'Шпинат', emoji: '🥬', category: 'veg', unit: 'kg', pricePerUnit: 429, allergens: [], syn: ['шпинат'] },
  { id: 'green_peas', name: 'Зелёный горошек', emoji: '🫛', category: 'veg', unit: 'kg', pricePerUnit: 179, allergens: [], syn: ['горош'] },
  { id: 'corn', name: 'Кукуруза', emoji: '🌽', category: 'veg', unit: 'kg', pricePerUnit: 189, allergens: [], syn: ['кукуруз'] },
  { id: 'celery', name: 'Сельдерей', emoji: '🥬', category: 'veg', unit: 'kg', pricePerUnit: 189, allergens: [], syn: ['сельдер'] },
  { id: 'beans', name: 'Фасоль консервированная', emoji: '🫘', category: 'veg', unit: 'kg', pricePerUnit: 149, allergens: [], syn: ['фасол'] },

  { id: 'banana', name: 'Бананы', emoji: '🍌', category: 'fruit', unit: 'kg', pricePerUnit: 109, allergens: [], syn: ['банан'] },
  { id: 'apple', name: 'Яблоки', emoji: '🍎', category: 'fruit', unit: 'kg', pricePerUnit: 119, allergens: [], syn: ['яблок'] },
  { id: 'berries', name: 'Ягоды замороженные', emoji: '🍓', category: 'fruit', unit: 'kg', pricePerUnit: 379, allergens: [], syn: ['ягод'] },
  { id: 'orange', name: 'Апельсины', emoji: '🍊', category: 'fruit', unit: 'kg', pricePerUnit: 189, allergens: ['citrus'], syn: ['апельсин'] },
  { id: 'lemon', name: 'Лимон', emoji: '🍋', category: 'fruit', unit: 'kg', pricePerUnit: 199, allergens: ['citrus'], syn: ['лимон'] },
  { id: 'pear', name: 'Груши', emoji: '🍐', category: 'fruit', unit: 'kg', pricePerUnit: 169, allergens: [], syn: ['груш'] },

  { id: 'rice', name: 'Рис', emoji: '🍚', category: 'grain', unit: 'kg', pricePerUnit: 129, allergens: [], syn: ['рис'] },
  { id: 'buckwheat', name: 'Гречка', emoji: '🌾', category: 'grain', unit: 'kg', pricePerUnit: 109, allergens: [], syn: ['гречк', 'гречнев'] },
  { id: 'oatmeal', name: 'Овсяные хлопья', emoji: '🥣', category: 'grain', unit: 'kg', pricePerUnit: 79, allergens: ['gluten'], syn: ['овсян', 'геркулес'] },
  { id: 'millet', name: 'Пшено', emoji: '🌾', category: 'grain', unit: 'kg', pricePerUnit: 69, allergens: [], syn: ['пшен'] },
  { id: 'oat_flour', name: 'Овсяная мука', emoji: '🌾', category: 'grain', unit: 'kg', pricePerUnit: 149, allergens: ['gluten'], syn: ['овсяная мука'] },
  { id: 'flour', name: 'Мука пшеничная', emoji: '🌾', category: 'grain', unit: 'kg', pricePerUnit: 65, allergens: ['gluten'], syn: ['мука'] },
  { id: 'pasta', name: 'Макароны', emoji: '🍝', category: 'grain', unit: 'kg', pricePerUnit: 119, allergens: ['gluten'], syn: ['макарон', 'паст'] },
  { id: 'pearl_barley', name: 'Перловка', emoji: '🌾', category: 'grain', unit: 'kg', pricePerUnit: 59, allergens: ['gluten'], syn: ['перлов'] },
  { id: 'bread', name: 'Хлеб', emoji: '🍞', category: 'bread', unit: 'kg', pricePerUnit: 90, allergens: ['gluten'], syn: ['хлеб'] },
  { id: 'lavash', name: 'Лаваш', emoji: '🫓', category: 'bread', unit: 'pc', pricePerUnit: 39, allergens: ['gluten'], syn: ['лаваш'] },

  { id: 'sweetener', name: 'Сахарозаменитель', emoji: '🍬', category: 'other', unit: 'pc', pricePerUnit: 4, allergens: [], syn: ['сахарозам'] },
  { id: 'spices', name: 'Специи', emoji: '🧂', category: 'other', unit: 'kg', pricePerUnit: 890, allergens: [], syn: ['специ', 'приправ'] },
  { id: 'soy_sauce', name: 'Соевый соус', emoji: '🍶', category: 'other', unit: 'kg', pricePerUnit: 490, allergens: ['soy'], syn: ['соевый'] },
  { id: 'tofu', name: 'Тофу', emoji: '🧊', category: 'other', unit: 'kg', pricePerUnit: 449, allergens: ['soy'], syn: ['тофу'] },
  { id: 'sesame', name: 'Кунжут', emoji: '⚪', category: 'other', unit: 'kg', pricePerUnit: 690, allergens: ['sesame'], syn: ['кунжут'] },
  { id: 'honey', name: 'Мёд', emoji: '🍯', category: 'other', unit: 'kg', pricePerUnit: 590, allergens: ['honey'], syn: ['мед', 'мёд'] },
  { id: 'nuts', name: 'Орехи грецкие', emoji: '🌰', category: 'other', unit: 'kg', pricePerUnit: 1290, allergens: ['nuts'], syn: ['орех'] },
  { id: 'peanut', name: 'Арахис', emoji: '🥜', category: 'other', unit: 'kg', pricePerUnit: 790, allergens: ['peanut'], syn: ['арахис'] },
  { id: 'oil', name: 'Масло растительное', emoji: '🫗', category: 'other', unit: 'kg', pricePerUnit: 199, allergens: [], syn: ['растительн', 'масло растит'] },
  { id: 'cocoa', name: 'Какао-порошок', emoji: '🍫', category: 'other', unit: 'kg', pricePerUnit: 790, allergens: [], syn: ['какао'] }
];

/* Реальные упаковки магазина: в каком объёме продукт продаётся.
   Используется в списке покупок — округляем до целых упаковок, а не граммов. */
const PACKS = {
  egg: { qty: 10, unit: 'шт', desc: 'упаковка 10 шт' },
  milk: { qty: 0.92, unit: 'кг', desc: 'пакет 920 мл' },
  kefir: { qty: 0.92, unit: 'кг', desc: 'пакет 920 мл' },
  yogurt: { qty: 0.45, unit: 'кг', desc: 'стаканчик 450 г' },
  cottage_cheese: { qty: 0.4, unit: 'кг', desc: 'упаковка 400 г' },
  cheese: { qty: 0.2, unit: 'кг', desc: 'блок 200 г' },
  butter: { qty: 0.2, unit: 'кг', desc: 'упаковка 200 г' },
  sour_cream: { qty: 0.3, unit: 'кг', desc: 'стаканчик 300 г' },
  cream: { qty: 0.3, unit: 'кг', desc: 'пакет 300 мл' },
  bread: { qty: 0.4, unit: 'кг', desc: 'батон 400 г' },
  lavash: { qty: 8, unit: 'шт', desc: 'упаковка 8 шт' },
  rice: { qty: 0.9, unit: 'кг', desc: 'пакет 900 г' },
  buckwheat: { qty: 0.9, unit: 'кг', desc: 'пакет 900 г' },
  oatmeal: { qty: 0.8, unit: 'кг', desc: 'пакет 800 г' },
  millet: { qty: 0.8, unit: 'кг', desc: 'пакет 800 г' },
  oat_flour: { qty: 0.5, unit: 'кг', desc: 'пакет 500 г' },
  flour: { qty: 1, unit: 'кг', desc: 'пакет 1 кг' },
  pasta: { qty: 0.9, unit: 'кг', desc: 'пакет 900 г' },
  pearl_barley: { qty: 0.8, unit: 'кг', desc: 'пакет 800 г' },
  oil: { qty: 1, unit: 'кг', desc: 'бутылка 1 л' },
  spices: { qty: 0.1, unit: 'кг', desc: 'банка 100 г' },
  soy_sauce: { qty: 0.25, unit: 'кг', desc: 'бутылка 250 мл' },
  honey: { qty: 0.5, unit: 'кг', desc: 'банка 500 г' },
  sugar: { qty: 1, unit: 'кг', desc: 'пакет 1 кг' },
  salt: { qty: 1, unit: 'кг', desc: 'пакет 1 кг' },
  potato: { qty: 2, unit: 'кг', desc: 'мешок 2 кг' },
  onion: { qty: 1, unit: 'кг', desc: 'сетка 1 кг' },
  carrot: { qty: 1, unit: 'кг', desc: 'шт 1 кг' },
  cabbage: { qty: 1, unit: 'кг', desc: 'кочан 1 кг' },
  chicken_fillet: { qty: 1, unit: 'кг', desc: 'упаковка 1 кг' },
  minced_chicken: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  turkey: { qty: 0.7, unit: 'кг', desc: 'упаковка 700 г' },
  salmon: { qty: 0.5, unit: 'кг', desc: 'филе 500 г' },
  cod: { qty: 0.6, unit: 'кг', desc: 'тушка 600 г' },
  pollock: { qty: 0.7, unit: 'кг', desc: 'тушка 700 г' },
  shrimp: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  banana: { qty: 1, unit: 'кг', desc: 'пучок 1 кг' },
  apple: { qty: 1, unit: 'кг', desc: 'шт 1 кг' },
  orange: { qty: 1, unit: 'кг', desc: 'шт 1 кг' },
  lemon: { qty: 0.5, unit: 'кг', desc: 'сетка 500 г' },
  tomato: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  cucumber: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  pepper: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  broccoli: { qty: 0.5, unit: 'кг', desc: 'упаковка 500 г' },
  mushrooms: { qty: 0.4, unit: 'кг', desc: 'упаковка 400 г' },
  greens: { qty: 0.1, unit: 'кг', desc: 'пучок 100 г' },
  avocado: { qty: 4, unit: 'шт', desc: 'упаковка 4 шт' },
  berries: { qty: 0.4, unit: 'кг', desc: 'пакет 400 г' }
};

/* Собственные рецепты пользователя — хранятся в IndexedDB/localStorage.
   Кастомные блюда участвуют в генерации наравне с встроенными. */
const CUSTOM_RECIPES = [];

const DISHES = [
  /* ───── ЗАВТРАКИ ───── */
  {
    id: 'b_salmon_toast', slot: 'breakfast', name: 'Бутерброд с лососем и яйцом', emoji: '🥪', gradient: 'linear-gradient(135deg,#F9D6B8,#E96D3F)',
    timeMin: 10, appliances: ['stove'], tier: 3,
    ingredients: [
      { ingId: 'bread', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'salmon', qtyPerServing: 35, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'avocado', qtyPerServing: 0.25, unit: 'pc' },
      { ingId: 'greens', qtyPerServing: 8, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 420, p: 24, f: 20, c: 32 },
    steps: [
      'Обжарь яйца — можно сделать пашот.',
      'Авокадо разомни вилкой.',
      'На хлеб намажь авокадо, сверху положи лосось.',
      'Посыпь зеленью.',
      'Всё, готово — ресторан у тебя дома.'
    ]
  },
  {
    id: 'b_syrniki', slot: 'breakfast', name: 'Сырники из творога с ягодным соусом', emoji: '🥞', gradient: 'linear-gradient(135deg,#FBE3C0,#D98A4B)',
    timeMin: 20, appliances: ['stove', 'blender'], tier: 2,
    ingredients: [
      { ingId: 'cottage_cheese', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 0.5, unit: 'pc' },
      { ingId: 'oat_flour', qtyPerServing: 25, unit: 'kg' },
      { ingId: 'sweetener', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'berries', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'yogurt', qtyPerServing: 40, unit: 'kg' }
    ],
    macros: { kcal: 380, p: 24, f: 12, c: 45 },
    steps: [
      'Смешай творог, яйцо, муку и сахарозаменитель.',
      'Сформируй сырники и обжарь на антипригарной сковороде без масла.',
      'Ягоды пробей блендером с йогуртом — получится соус.',
      'Подавай сырники тёплыми с ягодным соусом.'
    ]
  },
  {
    id: 'b_oatmeal', slot: 'breakfast', name: 'Овсянка с бананом и орехами', emoji: '🥣', gradient: 'linear-gradient(135deg,#F6E5C8,#B97845)',
    timeMin: 10, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'oatmeal', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'banana', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'nuts', qtyPerServing: 10, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 360, p: 11, f: 12, c: 52 },
    steps: [
      'Залей хлопья молоком и вари 5–7 минут, помешивая.',
      'Добавь сливочное масло и мёд.',
      'Нарежь банан кружочками.',
      'Выложи банан и орехи поверх каши.'
    ]
  },
  {
    id: 'b_omelette', slot: 'breakfast', name: 'Омлет с помидорами и сыром', emoji: '🍳', gradient: 'linear-gradient(135deg,#FFE0CC,#E8895A)',
    timeMin: 15, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'egg', qtyPerServing: 2, unit: 'pc' },
      { ingId: 'milk', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 25, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 330, p: 21, f: 23, c: 7 },
    steps: [
      'Взбей яйца с молоком и щепоткой специй.',
      'Растопи масло на сковороде, вылей яичную смесь.',
      'Разложи ломтики помидоров и потри сыр сверху.',
      'Готовь под крышкой 5 минут, посыпь зеленью.'
    ]
  },
  {
    id: 'b_zucchini', slot: 'breakfast', name: 'Кабачковые оладьи с соусом', emoji: '🥒', gradient: 'linear-gradient(135deg,#EADFC8,#C98B57)',
    timeMin: 25, appliances: ['stove', 'blender'], tier: 2,
    ingredients: [
      { ingId: 'zucchini', qtyPerServing: 180, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'flour', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'yogurt', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 3, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 290, p: 13, f: 12, c: 30 },
    steps: [
      'Натри кабачок на крупной тёрке и отожми лишнюю жидкость.',
      'Смешай с яйцом, мукой и специями.',
      'Обжарь оладьи с двух сторон до золотистой корочки.',
      'Смешай йогурт с чесноком и зеленью — это соус.',
      'Подавай оладьи горячими с соусом.'
    ]
  },
  {
    id: 'b_buckwheat_milk', slot: 'breakfast', name: 'Гречневая каша с молоком и ягодами', emoji: '🥣', gradient: 'linear-gradient(135deg,#FDE9D0,#E0A26D)',
    timeMin: 15, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'buckwheat', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'berries', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 310, p: 10, f: 6, c: 55 },
    steps: [
      'Промой гречку и отвари в подсоленной воде до готовности.',
      'Добавь молоко и прогревай ещё 2 минуты.',
      'Разложи по мискам.',
      'Добавь ягоды и немного мёда.'
    ]
  },
  {
    id: 'b_toast_cheese', slot: 'breakfast', name: 'Тосты с сыром и томатами', emoji: '🍞', gradient: 'linear-gradient(135deg,#F4D9C4,#C26A45)',
    timeMin: 8, appliances: ['microwave'], tier: 1,
    ingredients: [
      { ingId: 'bread', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 340, p: 14, f: 16, c: 36 },
    steps: [
      'Подсуши хлеб в микроволновке или на сухой сковороде.',
      'Намажь тонким слоем масла.',
      'Положи сыр и ломтики помидора.',
      'Разогрей 40 секунд, чтобы сыр расплавился, и посыпь зеленью.'
    ]
  },
  {
    id: 'b_pumpkin_porridge', slot: 'breakfast', name: 'Тыквенная каша с пшеном', emoji: '🎃', gradient: 'linear-gradient(135deg,#FFF0D8,#E8A85C)',
    timeMin: 25, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'millet', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'pumpkin', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 320, p: 8, f: 8, c: 55 },
    steps: [
      'Нарежь тыкву кубиками и потуши с молоком 10 минут.',
      'Добавь промытое пшено и вари до мягкости.',
      'Пробей кашу блендером или помни толкушкой.',
      'Добавь масло и мёд перед подачей.'
    ]
  },
  {
    id: 'b_egg_spinach', slot: 'breakfast', name: 'Яичница со шпинатом и авокадо', emoji: '🍳', gradient: 'linear-gradient(135deg,#E8E0C8,#A98455)',
    timeMin: 12, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'egg', qtyPerServing: 2, unit: 'pc' },
      { ingId: 'spinach', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'avocado', qtyPerServing: 0.3, unit: 'pc' },
      { ingId: 'tomato', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 300, p: 17, f: 22, c: 7 },
    steps: [
      'Разогрей масло и потуши шпинат 1 минуту.',
      'Добавь нарезанный помидор.',
      'Разбей яйца и готовь до нужной степени.',
      'Подавай с ломтиками авокадо и щепоткой специй.'
    ]
  },
  {
    id: 'b_cottage_banana', slot: 'breakfast', name: 'Творожная миска с бананом и какао', emoji: '🍌', gradient: 'linear-gradient(135deg,#FADCC8,#D96B4B)',
    timeMin: 5, appliances: ['blender'], tier: 1,
    ingredients: [
      { ingId: 'cottage_cheese', qtyPerServing: 160, unit: 'kg' },
      { ingId: 'banana', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'yogurt', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'cocoa', qtyPerServing: 3, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 320, p: 26, f: 9, c: 33 },
    steps: [
      'Смешай творог с йогуртом до кремовой текстуры.',
      'Добавь какао и мёд, перемешай.',
      'Нарежь банан и выложи сверху.',
      'Можно посыпать какао для красоты.'
    ]
  },
  {
    id: 'b_avocado_egg', slot: 'breakfast', name: 'Авокадо-тост с яйцом пашот', emoji: '🥑', gradient: 'linear-gradient(135deg,#F1E3CD,#B9825C)',
    timeMin: 15, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'bread', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'avocado', qtyPerServing: 0.4, unit: 'pc' },
      { ingId: 'egg', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'lemon', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 370, p: 15, f: 24, c: 28 },
    steps: [
      'Подсуши хлеб до хрустящей корочки.',
      'Разомни авокадо с лимонным соком и специями.',
      'Приготовь яйцо пашот в кипящей воде 3 минуты.',
      'Намажь авокадо на тост и положи яйцо сверху.',
      'Посыпь зеленью.'
    ]
  },
  {
    id: 'b_pancakes', slot: 'breakfast', name: 'Овсяные панкейки с яблоком', emoji: '🥞', gradient: 'linear-gradient(135deg,#FDECD7,#DE8B52)',
    timeMin: 20, appliances: ['stove', 'blender'], tier: 1,
    ingredients: [
      { ingId: 'oat_flour', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'milk', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'apple', qtyPerServing: 90, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 3, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 340, p: 14, f: 11, c: 45 },
    steps: [
      'Смешай овсяную муку, яйцо и молоко.',
      'Натри яблоко и добавь в тесто.',
      'Обжарь панкейки на разогретой сковороде с двух сторон.',
      'Подавай с мёдом и ломтиками яблока.'
    ]
  },

  /* ───── ОБЕДЫ ───── */
  {
    id: 'l_chicken_buckwheat', slot: 'lunch', name: 'Куриное филе с гречкой и овощами', emoji: '🍗', gradient: 'linear-gradient(135deg,#F6E5C8,#B97845)',
    timeMin: 30, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'chicken_fillet', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'buckwheat', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 480, p: 42, f: 13, c: 48 },
    steps: [
      'Отвари гречку в подсоленной воде.',
      'Нарежь курицу кусочками и обжарь на масле до золотистого цвета.',
      'Добавь лук и морковь, готовь ещё 7 минут.',
      'Смешай с гречкой, приправь и прогревай 2 минуты.',
      'Посыпь зеленью перед подачей.'
    ]
  },
  {
    id: 'l_turkey_veg', slot: 'lunch', name: 'Индейка с овощами и рисом', emoji: '🦃', gradient: 'linear-gradient(135deg,#EADFC8,#C98B57)',
    timeMin: 35, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'turkey', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 65, unit: 'kg' },
      { ingId: 'broccoli', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'pepper', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 500, p: 38, f: 14, c: 52 },
    steps: [
      'Поставь вариться рис.',
      'Индейку нарежь и обжарь до румяности.',
      'Добавь брокколи и перец, влей немного воды.',
      'Туши под крышкой 10 минут.',
      'Смешай с рисом и приправь.'
    ]
  },
  {
    id: 'l_borsch', slot: 'lunch', name: 'Борщ с говядиной и сметаной', emoji: '🍲', gradient: 'linear-gradient(135deg,#FADCC8,#D96B4B)',
    timeMin: 60, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'beef', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'beet', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'cabbage', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'sour_cream', qtyPerServing: 20, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 420, p: 25, f: 18, c: 38 },
    steps: [
      'Отвари говядину до мягкости, сохрани бульон.',
      'Добавь картофель и капусту, вари 10 минут.',
      'Сделай зажарку из лука, моркови и свёклы с томатом.',
      'Отправь зажарку в кастрюлю, посоли и поперчи.',
      'Дай настояться 10 минут, подавай со сметаной и чесноком.'
    ]
  },
  {
    id: 'l_peppers', slot: 'lunch', name: 'Фаршированные перцы с курицей и рисом', emoji: '🫑', gradient: 'linear-gradient(135deg,#FDE9D0,#E0A26D)',
    timeMin: 55, appliances: ['oven'], tier: 2,
    ingredients: [
      { ingId: 'pepper', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'minced_chicken', qtyPerServing: 130, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 20, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 4, unit: 'kg' }
    ],
    macros: { kcal: 470, p: 30, f: 16, c: 52 },
    steps: [
      'Отвари рис до полуготовности.',
      'Смешай фарш, рис, мелко нарезанные лук и морковь.',
      'Нафаршируй половинки перцев и выложи в форму.',
      'Залей томатным соусом и накрой фольгой.',
      'Запекай 35 минут при 190 °C, за 5 минут сними фольгу и посыпь сыром.'
    ]
  },
  {
    id: 'l_pasta_chicken', slot: 'lunch', name: 'Паста с курицей и шпинатом', emoji: '🍝', gradient: 'linear-gradient(135deg,#F4D9C4,#C26A45)',
    timeMin: 25, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'pasta', qtyPerServing: 90, unit: 'kg' },
      { ingId: 'chicken_fillet', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'spinach', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'cream', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 15, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 3, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 590, p: 38, f: 20, c: 62 },
    steps: [
      'Отвари пасту аль денте.',
      'Обжарь курицу кусочками с чесноком.',
      'Добавь шпинат и сливки, прогревай 3 минуты.',
      'Смешай с пастой и потри сыр сверху.'
    ]
  },
  {
    id: 'l_fishcakes', slot: 'lunch', name: 'Рыбные котлеты с пюре', emoji: '🐟', gradient: 'linear-gradient(135deg,#FFF0D8,#E8A85C)',
    timeMin: 40, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'pollock', qtyPerServing: 160, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 0.5, unit: 'pc' },
      { ingId: 'bread', qtyPerServing: 15, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 180, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 8, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 20, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 520, p: 32, f: 18, c: 55 },
    steps: [
      'Пропусти рыбное филе с луком и размоченным хлебом через мясорубку.',
      'Добавь яйцо, соль и специи, перемешай.',
      'Сформируй котлеты и обжарь с двух сторон.',
      'Отвари картофель и сделай пюре с молоком и маслом.',
      'Подавай котлеты с пюре и зеленью.'
    ]
  },
  {
    id: 'l_pilaf', slot: 'lunch', name: 'Плов с индейкой и морковью', emoji: '🍚', gradient: 'linear-gradient(135deg,#E8E0C8,#A98455)',
    timeMin: 45, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'turkey', qtyPerServing: 130, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 6, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 520, p: 33, f: 14, c: 65 },
    steps: [
      'Обжарь индейку кусочками в казане.',
      'Добавь лук и морковь, готовь 5 минут.',
      'Всыпь промытый рис, вставь зубчики чеснока.',
      'Залей горячей водой на 1,5 см выше риса.',
      'Готовь под крышкой 25 минут на медленном огне.'
    ]
  },
  {
    id: 'l_soup_chicken', slot: 'lunch', name: 'Куриный суп с лапшой и зеленью', emoji: '🍜', gradient: 'linear-gradient(135deg,#FBE3C0,#D98A4B)',
    timeMin: 40, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'chicken_fillet', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'pasta', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 25, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 8, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 350, p: 26, f: 9, c: 40 },
    steps: [
      'Отвари курицу, снимая пену.',
      'Добавь картофель, морковь и лук.',
      'Через 10 минут всыпь лапшу и вари ещё 3 минуты.',
      'Посоли, поперчи и добавь зелень.'
    ]
  },
  {
    id: 'l_buckwheat_mushroom', slot: 'lunch', name: 'Гречка с грибами и луком', emoji: '🍄', gradient: 'linear-gradient(135deg,#FDE9D0,#E0A26D)',
    timeMin: 25, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'buckwheat', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'mushrooms', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 6, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 390, p: 12, f: 9, c: 64 },
    steps: [
      'Отвари гречку до готовности.',
      'Обжарь лук и морковь, добавь нарезанные грибы.',
      'Готовь грибы до испарения жидкости.',
      'Смешай с гречкой, посыпь зеленью.'
    ]
  },
  {
    id: 'l_liver_potato', slot: 'lunch', name: 'Печень по-домашнему с картофелем', emoji: '🫀', gradient: 'linear-gradient(135deg,#F1E3CD,#B9825C)',
    timeMin: 35, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'liver', qtyPerServing: 140, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 170, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 430, p: 30, f: 16, c: 38 },
    steps: [
      'Замочи печень в молоке на 10 минут.',
      'Обжарь лук и морковь до мягкости.',
      'Добавь печень и готовь по 3 минуты с каждой стороны.',
      'Отвари картофель и подавай с печенью и подливой.'
    ]
  },
  {
    id: 'l_shrimp_rice', slot: 'lunch', name: 'Креветки с рисом и овощами', emoji: '🦐', gradient: 'linear-gradient(135deg,#FADCC8,#D96B4B)',
    timeMin: 25, appliances: ['stove'], tier: 3, spicy: true,
    ingredients: [
      { ingId: 'shrimp', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'broccoli', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'pepper', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'soy_sauce', qtyPerServing: 10, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 4, unit: 'kg' }
    ],
    macros: { kcal: 450, p: 30, f: 10, c: 58 },
    steps: [
      'Отвари рис.',
      'Обжарь креветки на сильном огне 2 минуты.',
      'Добавь овощи и влей соевый соус.',
      'Готовь ещё 3 минуты и смешай с рисом.'
    ]
  },
  {
    id: 'l_cabbage_rolls', slot: 'lunch', name: 'Ленивые голубцы с индейкой', emoji: '🥬', gradient: 'linear-gradient(135deg,#FDECD7,#DE8B52)',
    timeMin: 50, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'turkey', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'cabbage', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 45, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'sour_cream', qtyPerServing: 20, unit: 'kg' }
    ],
    macros: { kcal: 410, p: 28, f: 14, c: 42 },
    steps: [
      'Нашинкуй капусту и потуши 10 минут.',
      'Смешай фарш из индейки с рисом, луком и морковью.',
      'Сформируй ленивые голубцы и выложи в кастрюлю.',
      'Залей томатным соусом со сметаной.',
      'Туши под крышкой 30 минут.'
    ]
  },

  /* ───── УЖИНЫ ───── */
  {
    id: 'd_salmon_rice', slot: 'dinner', name: 'Запечённый лосось с рисом', emoji: '🐟', gradient: 'linear-gradient(135deg,#FADCC8,#D96B4B)',
    timeMin: 30, appliances: ['oven'], tier: 3,
    ingredients: [
      { ingId: 'salmon', qtyPerServing: 160, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'broccoli', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'lemon', qtyPerServing: 10, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' },
      { ingId: 'greens', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 560, p: 38, f: 22, c: 48 },
    steps: [
      'Разогрей духовку до 200 °C.',
      'Выложи лосось на противень, посоли, поперчи и сбрызни маслом.',
      'Запекай 18 минут вместе с брокколи.',
      'Отвари рис.',
      'Подавай с ломтиком лимона и зеленью.'
    ]
  },
  {
    id: 'd_chicken_mushroom', slot: 'dinner', name: 'Котлетки с грибами и гречкой', emoji: '🍗', gradient: 'linear-gradient(135deg,#F6E5C8,#B97845)',
    timeMin: 40, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'minced_chicken', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'mushrooms', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 0.5, unit: 'pc' },
      { ingId: 'bread', qtyPerServing: 15, unit: 'kg' },
      { ingId: 'buckwheat', qtyPerServing: 65, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 540, p: 35, f: 17, c: 58 },
    steps: [
      'Измельчи грибы и лук, соедини с фаршем.',
      'Добавь яйцо, размоченный хлеб, соль и специи.',
      'Сформируй котлетки и обжарь с двух сторон.',
      'Отвари гречку и подавай с котлетками.'
    ]
  },
  {
    id: 'd_zucchini_boats', slot: 'dinner', name: 'Кабачки, фаршированные индейкой', emoji: '🥒', gradient: 'linear-gradient(135deg,#EADFC8,#C98B57)',
    timeMin: 45, appliances: ['oven'], tier: 2,
    ingredients: [
      { ingId: 'zucchini', qtyPerServing: 250, unit: 'kg' },
      { ingId: 'turkey', qtyPerServing: 140, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 25, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 20, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 4, unit: 'kg' }
    ],
    macros: { kcal: 430, p: 32, f: 15, c: 38 },
    steps: [
      'Разрежь кабачки пополам и вынь мякоть.',
      'Смешай индейку, рис, лук и мякоть кабачка.',
      'Нафаршируй кабачки и выложи в форму.',
      'Запекай 30 минут при 190 °C.',
      'Посыпь сыром и верни в духовку на 5 минут.'
    ]
  },
  {
    id: 'd_cod_veg', slot: 'dinner', name: 'Треска с овощами на пару', emoji: '🐟', gradient: 'linear-gradient(135deg,#FFF0D8,#E8A85C)',
    timeMin: 30, appliances: ['steamer'], tier: 2,
    ingredients: [
      { ingId: 'cod', qtyPerServing: 160, unit: 'kg' },
      { ingId: 'broccoli', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'lemon', qtyPerServing: 8, unit: 'kg' }
    ],
    macros: { kcal: 400, p: 34, f: 8, c: 46 },
    steps: [
      'Нарежь овощи и выложи в пароварку.',
      'Сверху положи филе трески, посоли и поперчи.',
      'Готовь на пару 20 минут.',
      'Сбрызни маслом и лимонным соком перед подачей.'
    ]
  },
  {
    id: 'd_chicken_wrap', slot: 'dinner', name: 'Куриный ролл с овощами', emoji: '🌯', gradient: 'linear-gradient(135deg,#F4D9C4,#C26A45)',
    timeMin: 20, appliances: ['stove'], tier: 2,
    ingredients: [
      { ingId: 'lavash', qtyPerServing: 1, unit: 'pc' },
      { ingId: 'chicken_fillet', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'cucumber', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'yogurt', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 20, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 480, p: 34, f: 16, c: 48 },
    steps: [
      'Обжарь курицу полосками до готовности.',
      'Смешай йогурт с чесноком и специями.',
      'Смажь лаваш соусом, выложи курицу, овощи и сыр.',
      'Заверни плотным роллом и разрежь пополам.'
    ]
  },
  {
    id: 'd_pumpkin_chicken', slot: 'dinner', name: 'Курица с тыквой в духовке', emoji: '🎃', gradient: 'linear-gradient(135deg,#FDE9D0,#E0A26D)',
    timeMin: 45, appliances: ['oven'], tier: 1,
    ingredients: [
      { ingId: 'chicken_fillet', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'pumpkin', qtyPerServing: 180, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 450, p: 36, f: 14, c: 38 },
    steps: [
      'Нарежь курицу, тыкву и картофель крупными кусками.',
      'Смешай с маслом и специями.',
      'Выложи на противень в один слой.',
      'Запекай 30–35 минут при 200 °C до румяной корочки.'
    ]
  },
  {
    id: 'd_shrimp_pasta', slot: 'dinner', name: 'Паста с креветками в сливочном соусе', emoji: '🍤', gradient: 'linear-gradient(135deg,#FDECD7,#DE8B52)',
    timeMin: 25, appliances: ['stove'], tier: 3,
    ingredients: [
      { ingId: 'pasta', qtyPerServing: 90, unit: 'kg' },
      { ingId: 'shrimp', qtyPerServing: 130, unit: 'kg' },
      { ingId: 'cream', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'cheese', qtyPerServing: 15, unit: 'kg' },
      { ingId: 'garlic', qtyPerServing: 4, unit: 'kg' },
      { ingId: 'spinach', qtyPerServing: 40, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 610, p: 36, f: 22, c: 64 },
    steps: [
      'Отвари пасту до готовности.',
      'Обжарь креветки с чесноком на масле.',
      'Влей сливки и добавь шпинат, прогревай 2 минуты.',
      'Смешай соус с пастой и посыпь сыром.'
    ]
  },
  {
    id: 'd_turkey_airfryer', slot: 'dinner', name: 'Индейка в аэрогриле с овощами', emoji: '🦃', gradient: 'linear-gradient(135deg,#E8E0C8,#A98455)',
    timeMin: 35, appliances: ['airfryer'], tier: 2,
    ingredients: [
      { ingId: 'turkey', qtyPerServing: 170, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'pepper', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'zucchini', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 4, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 480, p: 40, f: 15, c: 38 },
    steps: [
      'Нарежь индейку и овощи кусочками.',
      'Смешай с маслом и специями.',
      'Выложи в корзину аэрогриля.',
      'Готовь 18 минут при 190 °C, встряхни корзину на середине.'
    ]
  },
  {
    id: 'd_tofu_veg', slot: 'dinner', name: 'Тофу с овощами и рисом', emoji: '🧊', gradient: 'linear-gradient(135deg,#F1E3CD,#B9825C)',
    timeMin: 25, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'tofu', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'rice', qtyPerServing: 70, unit: 'kg' },
      { ingId: 'broccoli', qtyPerServing: 80, unit: 'kg' },
      { ingId: 'pepper', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'soy_sauce', qtyPerServing: 12, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 4, unit: 'kg' }
    ],
    macros: { kcal: 430, p: 20, f: 14, c: 56 },
    steps: [
      'Отвари рис.',
      'Обжарь тофу кубиками до золотистой корочки.',
      'Добавь овощи и соевый соус.',
      'Туши 5 минут и подавай с рисом.'
    ]
  },
  {
    id: 'd_cottage_casserole', slot: 'dinner', name: 'Творожная запеканка с яблоком', emoji: '🍎', gradient: 'linear-gradient(135deg,#FBE3C0,#D98A4B)',
    timeMin: 40, appliances: ['oven'], tier: 1,
    ingredients: [
      { ingId: 'cottage_cheese', qtyPerServing: 180, unit: 'kg' },
      { ingId: 'egg', qtyPerServing: 0.5, unit: 'pc' },
      { ingId: 'oat_flour', qtyPerServing: 25, unit: 'kg' },
      { ingId: 'apple', qtyPerServing: 90, unit: 'kg' },
      { ingId: 'honey', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 3, unit: 'kg' }
    ],
    macros: { kcal: 360, p: 24, f: 12, c: 42 },
    steps: [
      'Смешай творог, яйцо, муку и мёд.',
      'Натри яблоко и добавь в массу.',
      'Выложи в форму, смазанную маслом.',
      'Запекай 30 минут при 180 °C.'
    ]
  },
  {
    id: 'd_fish_potato', slot: 'dinner', name: 'Минтай, запечённый с картофелем', emoji: '🐟', gradient: 'linear-gradient(135deg,#F9D6B8,#E96D3F)',
    timeMin: 40, appliances: ['oven'], tier: 1,
    ingredients: [
      { ingId: 'pollock', qtyPerServing: 170, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 180, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'milk', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'butter', qtyPerServing: 5, unit: 'kg' },
      { ingId: 'spices', qtyPerServing: 1, unit: 'kg' }
    ],
    macros: { kcal: 430, p: 30, f: 12, c: 46 },
    steps: [
      'Нарежь картофель тонкими кружками.',
      'Выложи в форму слоями картофель, лук и минтай.',
      'Залей молоком и положи кусочки масла.',
      'Запекай 30 минут при 190 °C под фольгой, затем 5 минут без неё.'
    ]
  },
  {
    id: 'd_veg_stew', slot: 'dinner', name: 'Овощное рагу с фасолью', emoji: '🥘', gradient: 'linear-gradient(135deg,#EADFC8,#C98B57)',
    timeMin: 35, appliances: ['stove'], tier: 1,
    ingredients: [
      { ingId: 'beans', qtyPerServing: 120, unit: 'kg' },
      { ingId: 'potato', qtyPerServing: 150, unit: 'kg' },
      { ingId: 'zucchini', qtyPerServing: 100, unit: 'kg' },
      { ingId: 'carrot', qtyPerServing: 50, unit: 'kg' },
      { ingId: 'onion', qtyPerServing: 30, unit: 'kg' },
      { ingId: 'tomato', qtyPerServing: 60, unit: 'kg' },
      { ingId: 'oil', qtyPerServing: 5, unit: 'kg' }
    ],
    macros: { kcal: 360, p: 13, f: 9, c: 58 },
    steps: [
      'Обжарь лук и морковь до мягкости.',
      'Добавь картофель, кабачок и помидоры.',
      'Влей немного воды и туши 20 минут.',
      'Добавь фасоль, прогревай 5 минут и приправь.'
    ]
  }
];

const INGREDIENT_MAP = {};
INGREDIENTS.forEach(function (ing) { INGREDIENT_MAP[ing.id] = ing; });

/* ───────── БОЛЬШАЯ БАЗА БЛЮД ─────────
   Сотни сочетаний из проверенных продуктов: белок + гарнир + овощи,
   каши, омлеты, тосты, запеканки, супы, салаты и котлеты.
   КБЖУ считается по таблице на 100 г, а не выдумывается. */
const MACRO100 = {
  chicken_fillet: [165, 31, 3.6, 0], turkey: [104, 19, 2, 0], beef: [187, 19, 14, 0],
  pork: [263, 27, 17, 0], liver: [135, 21, 3, 5], minced_chicken: [143, 17, 8, 0],
  salmon: [208, 20, 13, 0], cod: [82, 18, 0.7, 0], pollock: [72, 16, 1, 0], shrimp: [99, 24, 0.3, 0],
  cottage_cheese: [121, 17, 5, 3], yogurt: [60, 10, 3.5, 4], milk: [52, 3, 2.5, 4.7],
  kefir: [40, 3, 1, 4], cheese: [364, 25, 29, 2], butter: [717, 0.5, 81, 0.1],
  sour_cream: [206, 2.5, 20, 3], cream: [205, 2.5, 20, 3],
  potato: [77, 2, 0.1, 17], onion: [40, 1.7, 0.1, 9], carrot: [41, 0.9, 0.2, 10],
  zucchini: [17, 0.6, 0.3, 3], pumpkin: [26, 1, 0.1, 6.5], broccoli: [34, 2.8, 0.4, 7],
  tomato: [18, 0.9, 0.2, 3.9], cucumber: [15, 0.8, 0.1, 3.6], pepper: [27, 1, 0.3, 6],
  cabbage: [25, 1.3, 0.1, 6], beet: [43, 1.6, 0.2, 10], eggplant: [25, 1, 0.2, 6],
  mushrooms: [27, 4.3, 0.1, 3.3], greens: [36, 3, 0.8, 6], garlic: [149, 6.5, 0.5, 33],
  spinach: [23, 2.9, 0.4, 3.6], green_peas: [81, 5, 0.4, 14], corn: [86, 3.2, 1.2, 19],
  celery: [16, 0.7, 0.2, 3], beans: [127, 7.8, 0.5, 23],
  banana: [89, 1.1, 0.3, 23], apple: [52, 0.3, 0.2, 14], berries: [50, 1, 0.3, 12],
  orange: [47, 0.9, 0.1, 12], lemon: [29, 1.1, 0.3, 9], pear: [57, 0.4, 0.1, 15],
  rice: [344, 6.7, 0.7, 78], buckwheat: [343, 13, 3.4, 72], oatmeal: [389, 17, 7, 66],
  millet: [378, 11, 4.2, 73], oat_flour: [369, 12, 6, 66], flour: [364, 10, 1, 76],
  pasta: [350, 12, 1.5, 72], pearl_barley: [352, 9, 1, 77], bread: [265, 8, 3, 49],
  soy_sauce: [53, 8, 0, 5], tofu: [76, 8, 4.8, 1.9], sesame: [573, 17, 49, 12],
  honey: [304, 0.3, 0, 82], nuts: [654, 15, 65, 14], peanut: [567, 26, 49, 16],
  oil: [899, 0, 100, 0], cocoa: [228, 20, 14, 58], spices: [0, 0, 0, 0]
};
const MACRO_PC = {
  egg: [78, 6.3, 5.3, 0.6], avocado: [160, 2, 15, 9], lavash: [90, 3, 1, 18], sweetener: [0, 0, 0, 0]
};

function makeIngredient(ingId, qty) {
  const ing = INGREDIENT_MAP[ingId];
  return { ingId: ingId, qtyPerServing: qty, unit: ing ? ing.unit : 'kg' };
}
function macrosFor(items) {
  const m = { kcal: 0, p: 0, f: 0, c: 0 };
  items.forEach(function (it) {
    const ing = INGREDIENT_MAP[it.ingId];
    const table = ing && ing.unit === 'pc' ? MACRO_PC[it.ingId] : MACRO100[it.ingId];
    if (!table) return;
    const factor = ing && ing.unit === 'pc' ? it.qtyPerServing : it.qtyPerServing / 100;
    m.kcal += table[0] * factor;
    m.p += table[1] * factor;
    m.f += table[2] * factor;
    m.c += table[3] * factor;
  });
  return { kcal: Math.round(m.kcal), p: Math.round(m.p), f: Math.round(m.f), c: Math.round(m.c) };
}
function shuffleSeed(list, seed) {
  let s = seed >>> 0;
  for (let i = list.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
  }
  return list;
}

(function buildDishLibrary() {
  const IMG = {
    chicken: 'l_chicken_buckwheat', turkey: 'l_turkey_veg', beef: 'l_borsch', pork: 'l_pilaf',
    liver: 'l_liver_potato', minced_chicken: 'd_chicken_mushroom', cod: 'd_cod_veg',
    pollock: 'd_fish_potato', salmon: 'd_salmon_rice', shrimp: 'l_shrimp_rice', tofu: 'd_tofu_veg'
  };
  const add = function (dish) {
    dish.image = 'assets/food/dishes/' + dish.imageId + '.jpg';
    dish.gradient = dish.gradient || 'linear-gradient(135deg,#F6E5C8,#B97845)';
    DISHES.push(dish);
  };

  /* ── Завтраки: каши ── */
  const GRAINS = [
    { ing: 'oatmeal', qty: 55, nom: 'Овсянка', img: 'b_oatmeal', emoji: '🥣' },
    { ing: 'buckwheat', qty: 60, nom: 'Гречневая каша', img: 'b_buckwheat_milk', emoji: '🌾' },
    { ing: 'millet', qty: 55, nom: 'Пшённая каша', img: 'b_pumpkin_porridge', emoji: '🌾' },
    { ing: 'rice', qty: 55, nom: 'Рисовая каша', img: 'b_buckwheat_milk', emoji: '🍚' }
  ];
  const TOPPINGS = [
    { text: 'с бананом и грецкими орехами', items: [['banana', 60], ['nuts', 10], ['honey', 5]], img: 'b_oatmeal' },
    { text: 'с яблоком и мёдом', items: [['apple', 70], ['honey', 5], ['butter', 5]], img: 'b_oatmeal' },
    { text: 'с ягодами и йогуртом', items: [['berries', 50], ['yogurt', 40]], img: 'b_buckwheat_milk' },
    { text: 'с грушей и грецкими орехами', items: [['pear', 70], ['nuts', 10]], img: 'b_oatmeal' },
    { text: 'с тыквой и мёдом', items: [['pumpkin', 100], ['honey', 5]], img: 'b_pumpkin_porridge' },
    { text: 'с апельсином и мёдом', items: [['orange', 70], ['honey', 5]], img: 'b_buckwheat_milk' }
  ];
  GRAINS.forEach(function (g, gi) {
    TOPPINGS.forEach(function (t, ti) {
      const items = [makeIngredient(g.ing, g.qty), makeIngredient('milk', 150)].concat(t.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
      add({
        id: 'v_b_porridge_' + gi + '_' + ti, slot: 'breakfast', name: g.nom + ' ' + t.text, emoji: g.emoji,
        timeMin: 15, appliances: ['stove'], tier: 1, ingredients: items,
        macros: macrosFor(items), imageId: t.img,
        prep: 'Отмерь крупу и подготовь добавки. Молоко можно заменить водой.',
        steps: [
          'Промой крупу и залей молоком (или водой).',
          'Доведи до кипения и вари 10–15 минут на слабом огне, помешивая.',
          'Добавь масло и мёд, прогревай ещё минуту.',
          'Выложи в миску и добавь ' + t.text.replace(/^с /, '') + '.'
        ],
        doneness: 'Крупа должна стать мягкой, а каша — густой. Если слишком густо, добавь немного молока.',
        tip: 'Для кремовой текстуры дай каше постоять под крышкой 3–5 минут.',
        serve: 'Подавай тёплой. Ягоды и орехи добавляй перед подачей, чтобы они не размокли.'
      });
    });
  });

  /* ── Завтраки: омлеты ── */
  const OMELETS = [
    { text: 'помидорами и сыром', items: [['tomato', 70], ['cheese', 25]], img: 'b_omelette' },
    { text: 'шпинатом и грибами', items: [['spinach', 50], ['mushrooms', 60]], img: 'b_egg_spinach' },
    { text: 'кабачком и зеленью', items: [['zucchini', 100], ['greens', 5]], img: 'b_zucchini' },
    { text: 'брокколи и сыром', items: [['broccoli', 80], ['cheese', 25]], img: 'b_omelette' },
    { text: 'тыквой и сыром', items: [['pumpkin', 100], ['cheese', 20]], img: 'b_pumpkin_porridge' },
    { text: 'болгарским перцем и зеленью', items: [['pepper', 80], ['greens', 5]], img: 'b_omelette' },
    { text: 'курицей и овощами', items: [['chicken_fillet', 60], ['tomato', 60]], img: 'b_omelette' },
    { text: 'треской и шпинатом', items: [['cod', 70], ['spinach', 40]], img: 'b_egg_spinach' }
  ];
  OMELETS.forEach(function (o, i) {
    const items = [makeIngredient('egg', 2), makeIngredient('milk', 30), makeIngredient('oil', 3)]
      .concat(o.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
    add({
      id: 'v_b_omelet_' + i, slot: 'breakfast', name: 'Омлет с ' + o.text, emoji: '🍳',
      timeMin: 15, appliances: ['stove'], tier: 1, ingredients: items, macros: macrosFor(items), imageId: o.img,
      steps: [
        'Взбей яйца с молоком, солью и специями.',
        'Разогрей сковороду с маслом и вылей яичную смесь.',
        'Разложи начинку и готовь под крышкой 5–7 минут.',
        'Сложи омлет пополам и подавай горячим.'
      ],
      doneness: 'Омлет готов, когда середина схватилась, но остаётся нежной.',
      tip: 'Не делай огонь слишком сильным — омлет станет сухим.',
      serve: 'Подавай сразу, с ломтиком хлеба или свежими овощами.'
    });
  });

  /* ── Завтраки: тосты ── */
  const TOASTS = [
    { text: 'авокадо и яйцом', items: [['avocado', 0.3], ['egg', 1], ['greens', 5]], img: 'b_avocado_egg' },
    { text: 'лососем и яйцом', items: [['salmon', 40], ['egg', 1], ['yogurt', 20]], img: 'b_salmon_toast' },
    { text: 'творогом и помидором', items: [['cottage_cheese', 80], ['tomato', 60], ['greens', 5]], img: 'b_toast_cheese' },
    { text: 'сыром и помидором', items: [['cheese', 30], ['tomato', 60], ['butter', 5]], img: 'b_toast_cheese' },
    { text: 'индейкой и авокадо', items: [['turkey', 60], ['avocado', 0.25], ['tomato', 40]], img: 'b_avocado_egg' },
    { text: 'яйцом и шпинатом', items: [['egg', 2], ['spinach', 40], ['cheese', 15]], img: 'b_egg_spinach' }
  ];
  TOASTS.forEach(function (t, i) {
    const items = [makeIngredient('bread', 60)].concat(t.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
    add({
      id: 'v_b_toast_' + i, slot: 'breakfast', name: 'Тост с ' + t.text, emoji: '🥪',
      timeMin: 10, appliances: ['stove'], tier: 1, ingredients: items, macros: macrosFor(items), imageId: t.img,
      steps: [
        'Подсуши хлеб на сухой сковороде или в тостере.',
        'Подготовь начинку: нарежь овощи, приготовь яйцо или рыбу.',
        'Выложи начинку на хлеб и приправь.',
        'Подавай сразу, пока хлеб хрустит.'
      ],
      doneness: 'Хлеб должен быть золотистым, но не гореть.',
      tip: 'Авокадо разомни вилкой с щепоткой соли — так вкус ярче.',
      serve: 'Подавай с листовым салатом или свежим огурцом.'
    });
  });

  /* ── Завтраки: сырники и запеканки ── */
  const CURD = [
    { text: 'ягодами и йогуртом', items: [['berries', 50], ['yogurt', 40]], name: 'Сырники', img: 'b_syrniki' },
    { text: 'яблоком', items: [['apple', 70]], name: 'Сырники', img: 'b_syrniki' },
    { text: 'бананом и какао', items: [['banana', 60], ['cocoa', 3]], name: 'Творожная запеканка', img: 'd_cottage_casserole' },
    { text: 'грушей', items: [['pear', 70]], name: 'Творожная запеканка', img: 'd_cottage_casserole' },
    { text: 'апельсином', items: [['orange', 60]], name: 'Сырники', img: 'b_syrniki' },
    { text: 'тыквой', items: [['pumpkin', 80]], name: 'Творожная запеканка', img: 'b_pumpkin_porridge' }
  ];
  CURD.forEach(function (c, i) {
    const items = [makeIngredient('cottage_cheese', 150), makeIngredient('egg', 0.5), makeIngredient('oat_flour', 25), makeIngredient('sweetener', 1)]
      .concat(c.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
    add({
      id: 'v_b_curd_' + i, slot: 'breakfast', name: c.name + ' с ' + c.text, emoji: '🥞',
      timeMin: c.name === 'Сырники' ? 20 : 30, appliances: c.name === 'Сырники' ? ['stove'] : ['oven'], tier: 2,
      ingredients: items, macros: macrosFor(items), imageId: c.img,
      steps: c.name === 'Сырники' ? [
        'Смешай творог, яйцо, овсяную муку и сахарозаменитель.',
        'Добавь подготовленную начинку и перемешай.',
        'Сформируй сырники и обжарь на антипригарной сковороде по 3–4 минуты с каждой стороны.',
        'Подавай тёплыми.'
      ] : [
        'Разогрей духовку до 180 °C.',
        'Смешай творог, яйцо, муку и сахарозаменитель.',
        'Добавь начинку, переложи в форму и разровняй.',
        'Запекай 25–30 минут до золотистой корочки.'
      ],
      doneness: c.name === 'Сырники' ? 'Сырники готовы, когда корочка золотистая, а середина остаётся мягкой.' : 'Запеканка готова, когда центр схватился и не дрожит.',
      tip: 'Если творог влажный, отожми его или добавь ложку муки.',
      serve: 'Подавай тёплыми, с йогуртом или свежими фруктами.'
    });
  });

  /* ── Завтраки: панкейки ── */
  const PANCAKES = [
    { text: 'яблоком', items: [['apple', 70]], img: 'b_pancakes' },
    { text: 'бананом', items: [['banana', 60]], img: 'b_pancakes' },
    { text: 'ягодами', items: [['berries', 50]], img: 'b_pancakes' },
    { text: 'творогом', items: [['cottage_cheese', 60]], img: 'b_syrniki' },
    { text: 'тыквой', items: [['pumpkin', 80]], img: 'b_pumpkin_porridge' }
  ];
  PANCAKES.forEach(function (p, i) {
    const items = [makeIngredient('oat_flour', 50), makeIngredient('egg', 1), makeIngredient('milk', 80), makeIngredient('sweetener', 1), makeIngredient('oil', 3)]
      .concat(p.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
    add({
      id: 'v_b_pancake_' + i, slot: 'breakfast', name: 'Овсяные панкейки с ' + p.text, emoji: '🥞',
      timeMin: 20, appliances: ['stove'], tier: 1, ingredients: items, macros: macrosFor(items), imageId: p.img,
      steps: [
        'Смешай овсяную муку, яйцо, молоко и сахарозаменитель.',
        'Добавь начинку и перемешай до однородности.',
        'Разогрей сковороду с маслом и жарь панкейки по 2 минуты с каждой стороны.',
        'Подавай стопкой, полив йогуртом или мёдом.'
      ],
      doneness: 'Панкейки готовы, когда на поверхности появляются пузырьки, а края подсохли.',
      tip: 'Дай тесту постоять 5 минут — панкейки получатся пышнее.',
      serve: 'Подавай тёплыми с ягодами или ломтиками фруктов.'
    });
  });

  /* ── Завтраки: смузи ── */
  const SMOOTHIES = [
    { text: 'ягодами и овсянкой', items: [['berries', 80], ['oatmeal', 25]], img: 'b_cottage_banana' },
    { text: 'яблоком и орехами', items: [['apple', 70], ['nuts', 10]], img: 'b_cottage_banana' },
    { text: 'грушей и мёдом', items: [['pear', 80], ['honey', 5]], img: 'b_cottage_banana' },
    { text: 'апельсином и йогуртом', items: [['orange', 80], ['yogurt', 60]], img: 'b_cottage_banana' },
    { text: 'бананом и какао', items: [['banana', 70], ['cocoa', 3]], img: 'b_cottage_banana' },
    { text: 'тыквой и бананом', items: [['pumpkin', 80], ['banana', 50]], img: 'b_cottage_banana' }
  ];
  SMOOTHIES.forEach(function (s, i) {
    const items = [makeIngredient('kefir', 200), makeIngredient('oatmeal', 20)]
      .concat(s.items.map(function (x) { return makeIngredient(x[0], x[1]); }));
    add({
      id: 'v_b_smoothie_' + i, slot: 'breakfast', name: 'Смузи с ' + s.text, emoji: '🥤',
      timeMin: 7, appliances: ['blender'], tier: 1, ingredients: items, macros: macrosFor(items), imageId: s.img,
      steps: [
        'Подготовь фрукты: вымой, при необходимости очисти.',
        'Сложи все ингредиенты в чашу блендера.',
        'Взбивай 30–60 секунд до однородности.',
        'Перелей в стакан и подавай сразу.'
      ],
      doneness: 'Смузи должен быть однородным, без крупных кусочков.',
      tip: 'Если смузи слишком густой, добавь немного воды или кефира.',
      serve: 'Подавай сразу после приготовления — так больше витаминов.'
    });
  });

  /* ── Обеды и ужины: белок + гарнир + овощи ── */
  const PROTEINS = [
    { id: 'chicken_fillet', qty: 150, nom: 'Куриное филе', instr: 'курицей', tier: 1, emoji: '🍗', img: IMG.chicken },
    { id: 'turkey', qty: 150, nom: 'Индейка', instr: 'индейкой', tier: 1, emoji: '🦃', img: IMG.turkey },
    { id: 'beef', qty: 140, nom: 'Говядина', instr: 'говядиной', tier: 2, emoji: '🥩', img: IMG.beef },
    { id: 'pork', qty: 140, nom: 'Свинина', instr: 'свининой', tier: 2, emoji: '🥩', img: IMG.pork },
    { id: 'liver', qty: 150, nom: 'Печень', instr: 'печенью', tier: 1, emoji: '🫀', img: IMG.liver },
    { id: 'cod', qty: 170, nom: 'Треска', instr: 'треской', tier: 2, emoji: '🐟', img: IMG.cod },
    { id: 'pollock', qty: 170, nom: 'Минтай', instr: 'минтаем', tier: 1, emoji: '🐟', img: IMG.pollock },
    { id: 'salmon', qty: 140, nom: 'Лосось', instr: 'лососем', tier: 3, emoji: '🐟', img: IMG.salmon },
    { id: 'shrimp', qty: 120, nom: 'Креветки', instr: 'креветками', tier: 3, emoji: '🦐', img: IMG.shrimp },
    { id: 'tofu', qty: 160, nom: 'Тофу', instr: 'тофу', tier: 2, emoji: '🧊', img: IMG.tofu }
  ];
  const SIDES = [
    { id: 'buckwheat', qty: 60, instr: 'гречкой', nom: 'гречка', tier: 1 },
    { id: 'rice', qty: 60, instr: 'рисом', nom: 'рис', tier: 1 },
    { id: 'potato', qty: 200, instr: 'картофелем', nom: 'картофель', tier: 1 },
    { id: 'pasta', qty: 60, instr: 'пастой', nom: 'паста', tier: 1 },
    { id: 'pearl_barley', qty: 60, instr: 'перловкой', nom: 'перловка', tier: 1 },
    { id: 'beans', qty: 150, instr: 'фасолью', nom: 'фасоль', tier: 1 }
  ];
  const VEGS = [
    { id: 'broccoli', qty: 120, instr: 'брокколи', nom: 'брокколи' },
    { id: 'zucchini', qty: 150, instr: 'кабачком', nom: 'кабачок' },
    { id: 'pepper', qty: 120, instr: 'болгарским перцем', nom: 'болгарский перец' },
    { id: 'tomato', qty: 120, instr: 'помидорами', nom: 'помидоры' },
    { id: 'pumpkin', qty: 150, instr: 'тыквой', nom: 'тыква' },
    { id: 'spinach', qty: 80, instr: 'шпинатом', nom: 'шпинат' },
    { id: 'green_peas', qty: 80, instr: 'зелёным горошком', nom: 'зелёный горошек' },
    { id: 'beet', qty: 120, instr: 'свёклой', nom: 'свёкла' }
  ];
  const PLATE_STYLES = [
    { key: 'pan', appliances: ['stove'], time: 25, text: 'обжарь' },
    { key: 'oven', appliances: ['oven'], time: 35, text: 'запеки' },
    { key: 'multi', appliances: ['multicooker'], time: 30, text: 'приготовь' }
  ];

  const combos = [];
  PROTEINS.forEach(function (p) {
    SIDES.forEach(function (s) {
      VEGS.forEach(function (v) { combos.push({ p: p, s: s, v: v }); });
    });
  });
  shuffleSeed(combos, 20261025);

  function plateDish(combo, index, slot) {
    const p = combo.p, s = combo.s, v = combo.v;
    const style = PLATE_STYLES[index % PLATE_STYLES.length];
    const items = [makeIngredient(p.id, p.qty), makeIngredient(s.id, s.qty), makeIngredient(v.id, v.qty), makeIngredient('oil', 5), makeIngredient('spices', 1), makeIngredient('garlic', 3)];
    const time = style.time + (p.id === 'potato' ? 10 : 0);
    const steps = style.key === 'oven' ? [
      'Разогрей духовку до 190 °C.',
      'Нарежь ' + v.nom + ' и подготовь ' + s.nom + ' согласно инструкции.',
      'Выложи ' + p.instr + ', ' + s.instr + ' и овощи на противень, добавь масло и специи.',
      'Запекай 25–35 минут, перевернув один раз.',
      'Дай настояться 5 минут и подавай.'
    ] : (style.key === 'multi' ? [
      'Подготовь ' + p.instr + ', ' + s.nom + ' и ' + v.nom + '.',
      'Сложи продукты в чашу мультиварки, добавь масло, специи и немного воды.',
      'Включи режим «Тушение» или «Плов» на 30 минут.',
      'После сигнала дай настояться 5–10 минут.',
      'Разложи по тарелкам и посыпь зеленью.'
    ] : [
      'Подготовь ' + p.instr + ': нарежь и обсуши.',
      'Отвари ' + s.nom + ' до готовности.',
      'Разогрей сковороду с маслом, обжарь ' + p.instr + ' до золотистой корочки.',
      'Добавь ' + v.nom + ' и специи, готовь ещё 7–10 минут.',
      'Подавай с гарниром и свежей зеленью.'
    ]);
    add({
      id: 'v_' + slot.charAt(0) + '_plate_' + index, slot: slot,
      name: p.nom + ' с ' + s.instr + ' и ' + v.instr,
      emoji: p.emoji, timeMin: time, appliances: style.appliances, tier: p.tier,
      ingredients: items, macros: macrosFor(items), imageId: p.img,
      prep: 'Вымой овощи и зелень. Мясо или рыбу обсуши бумажным полотенцем — так корочка будет лучше.',
      steps: steps,
      doneness: p.id === 'cod' || p.id === 'pollock' || p.id === 'salmon'
        ? 'Рыба готова, когда легко расслаивается вилкой и стала непрозрачной в центре.'
        : 'Мясо готово, когда сок прозрачный, а внутри нет розового цвета.',
      tip: 'Не перегружай сковороду: продукты должны лежать в один слой, иначе они будут тушиться, а не жариться.',
      serve: 'Подавай горячим, с свежей зеленью и ломтиком лимона по желанию.'
    });
  }

  for (let i = 0; i < 120; i++) plateDish(combos[i], i + 1, 'lunch');
  for (let i = 120; i < 240; i++) plateDish(combos[i], i + 1, 'dinner');

  /* ── Супы ── */
  const SOUP_PROTEINS = PROTEINS.filter(function (p) { return ['chicken_fillet', 'turkey', 'beef', 'cod', 'pollock', 'salmon'].indexOf(p.id) !== -1; });
  const SOUP_VEGS = [VEGS[0], VEGS[1], VEGS[2], VEGS[4]];
  let soupIndex = 0;
  SOUP_PROTEINS.forEach(function (p) {
    SOUP_VEGS.forEach(function (v) {
      soupIndex++;
      const items = [makeIngredient(p.id, 120), makeIngredient('potato', 150), makeIngredient('carrot', 40), makeIngredient('onion', 30), makeIngredient(v.id, 100), makeIngredient('oil', 5), makeIngredient('spices', 1), makeIngredient('greens', 5)];
      add({
        id: 'v_l_soup_' + soupIndex, slot: 'lunch', name: 'Суп с ' + p.instr + ', картофелем и ' + v.instr, emoji: '🍲',
        timeMin: 40, appliances: ['stove'], tier: p.tier, ingredients: items, macros: macrosFor(items), imageId: p.id === 'beef' ? 'l_borsch' : 'l_soup_chicken',
        prep: 'Нарежь мясо или рыбу кусочками, овощи — кубиками. Подготовь кастрюлю.',
        steps: [
          'Доведи 1,2 л воды до кипения, добавь ' + p.instr + ' и вари 15 минут.',
          'Добавь картофель, морковь и лук, вари ещё 10 минут.',
          'Положи ' + v.nom + ', масло и специи, готовь 5–7 минут.',
          'Попробуй и отрегулируй соль, добавь зелень.',
          'Дай супу настояться 5 минут под крышкой.'
        ],
        doneness: 'Овощи должны стать мягкими, а бульон — ароматным.',
        tip: 'Не кипяти суп слишком vigorously — так он останется прозрачным.',
        serve: 'Подавай горячим, со свежей зеленью и ломтиком хлеба.'
      });
    });
  });

  /* ── Запеканки ── */
  const BAKE_PROTEINS = PROTEINS.filter(function (p) { return ['chicken_fillet', 'turkey', 'beef', 'cod', 'pollock', 'tofu'].indexOf(p.id) !== -1; });
  const BAKE_VEGS = [VEGS[1], VEGS[2], VEGS[4], VEGS[6]];
  let bakeIndex = 0;
  BAKE_PROTEINS.forEach(function (p) {
    BAKE_VEGS.forEach(function (v) {
      bakeIndex++;
      const items = [makeIngredient(p.id, 150), makeIngredient(v.id, 150), makeIngredient('cheese', 30), makeIngredient('sour_cream', 30), makeIngredient('oil', 5), makeIngredient('spices', 1)];
      add({
        id: 'v_d_bake_' + bakeIndex, slot: 'dinner', name: 'Запеканка с ' + p.instr + ' и ' + v.instr, emoji: '🥘',
        timeMin: 40, appliances: ['oven'], tier: p.tier, ingredients: items, macros: macrosFor(items), imageId: p.id === 'tofu' ? 'd_tofu_veg' : 'd_zucchini_boats',
        prep: 'Разогрей духовку до 190 °C. Нарежь овощи тонкими ломтиками.',
        steps: [
          'Смешай ' + p.instr + ' со специями и половиной сметаны.',
          'Выложи половину овощей в форму, затем слой белка.',
          'Накрой оставшимися овощами и смажь сметаной.',
          'Посыпь сыром и запекай 30–35 минут.',
          'Дай постоять 5 минут перед подачей.'
        ],
        doneness: 'Сыр должен расплавиться и подрумяниться, а овощи — стать мягкими.',
        tip: 'Если овощи дают много сока, слейте его перед запеканием.',
        serve: 'Подавай прямо из формы, с свежим салатом.'
      });
    });
  });

  /* ── Салаты ── */
  const SALAD_PROTEINS = PROTEINS.filter(function (p) { return ['chicken_fillet', 'turkey', 'beef', 'shrimp', 'tofu'].indexOf(p.id) !== -1; });
  const SALAD_VEGS = [VEGS[2], VEGS[3], VEGS[6], VEGS[7]];
  let saladIndex = 0;
  SALAD_PROTEINS.forEach(function (p) {
    SALAD_VEGS.forEach(function (v) {
      saladIndex++;
      const items = [makeIngredient(p.id, 110), makeIngredient(v.id, 100), makeIngredient('cucumber', 60), makeIngredient('greens', 10), makeIngredient('oil', 6), makeIngredient('lemon', 10), makeIngredient('spices', 1)];
      add({
        id: 'v_l_salad_' + saladIndex, slot: 'lunch', name: 'Салат с ' + p.instr + ' и ' + v.instr, emoji: '🥗',
        timeMin: 20, appliances: p.id === 'tofu' ? ['stove'] : ['stove'], tier: p.tier,
        ingredients: items, macros: macrosFor(items), imageId: 'd_chicken_wrap',
        prep: 'Вымой овощи и зелень. Белок приготовь заранее и остуди.',
        steps: [
          'Приготовь ' + p.instr + ' на сковороде до готовности и нарежь.',
          'Нарежь ' + v.nom + ' и огурец удобными кусочками.',
          'Смешай всё в миске, добавь зелень.',
          'Заправь маслом и лимонным соком, приправь.',
          'Перемешай и подавай сразу.'
        ],
        doneness: 'Белок должен быть полностью готов, овощи — свежими и хрустящими.',
        tip: 'Заправляй салат прямо перед подачей, чтобы овощи не дали сок.',
        serve: 'Подавай как самостоятельное блюдо или гарнир к супу.'
      });
    });
  });

  /* ── Котлеты ── */
  const CUTLET_SIDES = [SIDES[0], SIDES[1], SIDES[2], SIDES[3]];
  const CUTLET_VEGS = [VEGS[0], VEGS[1], VEGS[4]];
  let cutletIndex = 0;
  CUTLET_SIDES.forEach(function (s) {
    CUTLET_VEGS.forEach(function (v) {
      cutletIndex++;
      const items = [makeIngredient('minced_chicken', 140), makeIngredient('egg', 0.3), makeIngredient('bread', 20), makeIngredient('onion', 30), makeIngredient(s.id, s.qty), makeIngredient(v.id, v.qty), makeIngredient('oil', 5), makeIngredient('spices', 1)];
      add({
        id: 'v_d_cutlet_' + cutletIndex, slot: 'dinner', name: 'Куриные котлеты с ' + s.instr + ' и ' + v.instr, emoji: '🍗',
        timeMin: 30, appliances: ['stove'], tier: 1, ingredients: items, macros: macrosFor(items), imageId: 'd_chicken_mushroom',
        prep: 'Подготовь фарш, лук и хлеб. Лук натри на мелкой тёрке.',
        steps: [
          'Смешай фарш, яйцо, размоченный хлеб, лук и специи.',
          'Сформируй котлеты мокрыми руками.',
          'Обжарь на разогретой сковороде по 4–5 минут с каждой стороны.',
          'Отвари гарнир и подготовь ' + v.nom + '.',
          'Подавай котлеты с гарниром и овощами.'
        ],
        doneness: 'Котлеты готовы, когда внутри нет розового фарша, а корочка золотистая.',
        tip: 'Дай фаршу постоять 10 минут — котлеты будут сочнее.',
        serve: 'Подавай горячими, с любимым соусом и свежей зеленью.'
      });
    });
  });
})();

DISHES.forEach(function (dish) {
  if (!dish.image) dish.image = 'assets/food/dishes/' + dish.id + '.jpg';
  const set = [];
  dish.ingredients.forEach(function (it) {
    const ing = INGREDIENT_MAP[it.ingId];
    if (!ing) return;
    (ing.allergens || []).forEach(function (a) { if (set.indexOf(a) === -1) set.push(a); });
  });
  dish.allergens = set;
  dish.spicy = !!dish.spicy;
  if (!dish.steps || dish.steps.length < 3) dish.steps = ['Подготовь ингредиенты.', 'Приготовь блюдо.', 'Подавай к столу.'];
});

const DISH_MAP = {};
DISHES.forEach(function (dish) { DISH_MAP[dish.id] = dish; });
