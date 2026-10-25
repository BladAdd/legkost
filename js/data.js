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

DISHES.forEach(function (dish) {
  dish.image = 'assets/food/dishes/' + dish.id + '.jpg';
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
