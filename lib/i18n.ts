import type { Lang, Param } from "./eco-data"

type BandKey = "good" | "fair" | "moderate" | "poor" | "vpoor" | "epoor"

export type Dict = {
  nav: { overview: string; map: string; trends: string; analysis: string; facilities: string; about: string }
  langLabel: string
  hero: { eyebrow: string; title: string; subtitle: string; chooseCity: string; explore: string }
  aqi: { title: string; scale: string; updated: string; advice: string; unavailable: string }
  bands: Record<BandKey, { label: string; advice: string }>
  overview: {
    title: string
    subtitle: string
    pollutants: string
    weather: string
    ofGuideline: string
    guideline: string
    noGuideline: string
    compareTitle: string
    compareSubtitle: string
    select: string
    selected: string
  }
  map: {
    title: string
    subtitle: string
    layer: string
    off: string
    particles: string
    play: string
    pause: string
    now: string
    forecast: string
    observed: string
    loading: string
    error: string
    clickHint: string
    noData: string
    legendNote: string
    who: string
    cityLayer: string
    facilityLayer: string
    adaptive: string
    adaptiveHint: string
    adaptiveNote: string
    emissionScale: string
  }
  range: {
    title: string
    from: string
    to: string
    apply: string
    since2025: string
    thisYear: string
    last90: string
    last30: string
    loading: string
    summary: string
  }
  analysis: {
    title: string
    subtitle: string
    focus: string
    focusOptions: { overview: string; health: string; industry: string; seasonal: string; today: string }
    question: string
    questionPlaceholder: string
    run: string
    running: string
    stop: string
    error: string
    empty: string
    basedOn: string
    disclaimer: string
  }
  trends: {
    title: string
    subtitle: string
    parameter: string
    airGroup: string
    weatherGroup: string
    periods: { all: string; d1: string; d7: string; d30: string; d90: string }
    mean: string
    min: string
    max: string
    change: string
    vsPrevious: string
    daysAbove: string
    ofDays: string
    missing: string
    noData: string
    dailyMeans: string
    hourly: string
    compareTitle: string
    city: string
    insightsTitle: string
    insightWind: string
    insightTrendUp: string
    insightTrendDown: string
    insightTrendFlat: string
    insightGuidelineOk: string
    insightGuidelineBad: string
    insightCaveat: string
  }
  facilities: {
    title: string
    subtitle: string
    emptyTitle: string
    emptyDesc: string
    emissionsLabel: string
    importTitle: string
    importDesc: string
    chooseFile: string
    import: string
    clear: string
    imported: string
    parseError: string
    verified: string
    needsCheck: string
    official: string
    manual: string
    cols: { name: string; type: string; coords: string; status: string; source: string }
  }
  about: {
    title: string
    subtitle: string
    sources: string
    limitations: string
    limitationsList: string[]
    methodology: string
    methodologyText: string
    sourceNotes: { weather: string; air: string; tiles: string; boundary: string }
  }
  footer: string
  loading: string
  fetchError: string
  dirs: string[]
  params: Record<Param, string>
  paramsShort: Partial<Record<Param, string>>
}

const params = {
  ru: {
    temperature_2m: "Температура",
    relative_humidity_2m: "Влажность",
    pressure_msl: "Давление",
    precipitation: "Осадки",
    wind_speed_10m: "Скорость ветра",
    wind_gusts_10m: "Порывы ветра",
    wind_direction_10m: "Направление ветра",
    european_aqi: "Европейский AQI",
    pm2_5: "Мелкие частицы PM2.5",
    pm10: "Частицы PM10",
    nitrogen_dioxide: "Диоксид азота NO2",
    sulphur_dioxide: "Диоксид серы SO2",
    ozone: "Озон O3",
    carbon_monoxide: "Угарный газ CO",
  },
  kk: {
    temperature_2m: "Температура",
    relative_humidity_2m: "Ылғалдылық",
    pressure_msl: "Қысым",
    precipitation: "Жауын-шашын",
    wind_speed_10m: "Жел жылдамдығы",
    wind_gusts_10m: "Жел екпіні",
    wind_direction_10m: "Жел бағыты",
    european_aqi: "Еуропалық AQI",
    pm2_5: "Ұсақ қалқыма бөлшектер PM2.5",
    pm10: "Қалқыма бөлшектер PM10",
    nitrogen_dioxide: "Азот диоксиді NO2",
    sulphur_dioxide: "Күкірт диоксиді SO2",
    ozone: "Озон O3",
    carbon_monoxide: "Иіс газы CO",
  },
  en: {
    temperature_2m: "Temperature",
    relative_humidity_2m: "Humidity",
    pressure_msl: "Pressure",
    precipitation: "Precipitation",
    wind_speed_10m: "Wind speed",
    wind_gusts_10m: "Wind gusts",
    wind_direction_10m: "Wind direction",
    european_aqi: "European AQI",
    pm2_5: "Fine particles PM2.5",
    pm10: "Particles PM10",
    nitrogen_dioxide: "Nitrogen dioxide NO2",
    sulphur_dioxide: "Sulphur dioxide SO2",
    ozone: "Ozone O3",
    carbon_monoxide: "Carbon monoxide CO",
  },
} satisfies Record<Lang, Record<Param, string>>

const paramsShort: Partial<Record<Param, string>> = {
  pm2_5: "PM2.5",
  pm10: "PM10",
  nitrogen_dioxide: "NO2",
  sulphur_dioxide: "SO2",
  ozone: "O3",
  carbon_monoxide: "CO",
  european_aqi: "AQI",
}

export const DICT: Record<Lang, Dict> = {
  ru: {
    nav: {
      overview: "Обзор",
      map: "Карта",
      trends: "Динамика",
      analysis: "ИИ-анализ",
      facilities: "Объекты",
      about: "О данных",
    },
    langLabel: "Язык",
    hero: {
      eyebrow: "Павлодарская область · экомонитор",
      title: "Чем мы дышим в Прииртышье",
      subtitle:
        "Качество воздуха и погода в Павлодаре, Экибастузе и Аксу — понятным языком, с ориентирами ВОЗ и советами для здоровья.",
      chooseCity: "Выберите город",
      explore: "Открыть карту",
    },
    aqi: {
      title: "Индекс качества воздуха",
      scale: "Европейский AQI, 0–100+",
      updated: "Данные на",
      advice: "Рекомендация",
      unavailable: "Данные о воздухе сейчас недоступны",
    },
    bands: {
      good: { label: "Хорошо", advice: "Отличный день для прогулки, спорта и проветривания." },
      fair: { label: "Удовлетворительно", advice: "Воздух приемлемый. Можно спокойно проводить время на улице." },
      moderate: {
        label: "Умеренно",
        advice: "Чувствительным людям стоит сократить длительные нагрузки на улице.",
      },
      poor: {
        label: "Плохо",
        advice: "Сократите время на улице, особенно детям, пожилым и людям с астмой.",
      },
      vpoor: { label: "Очень плохо", advice: "Избегайте нагрузок на улице, закройте окна, используйте очиститель." },
      epoor: { label: "Крайне плохо", advice: "Оставайтесь в помещении. При выходе — респиратор FFP2." },
    },
    overview: {
      title: "Воздух прямо сейчас",
      subtitle: "Последние модельные значения в сравнении с ориентирами ВОЗ 2021 года.",
      pollutants: "Загрязнители",
      weather: "Погода",
      ofGuideline: "от нормы ВОЗ",
      guideline: "Ориентир ВОЗ",
      noGuideline: "Без ориентира ВОЗ",
      compareTitle: "Города области",
      compareSubtitle: "Нажмите на город, чтобы увидеть подробности.",
      select: "Выбрать",
      selected: "Выбран",
    },
    map: {
      title: "Живая карта ветра и воздуха",
      subtitle: "Частицы показывают перенос воздуха; цвет — значение выбранного слоя. Нажмите на карту, что��ы узнать значение.",
      layer: "Слой",
      off: "Без слоя",
      particles: "Частицы ветра",
      play: "Воспроизвести",
      pause: "Пауза",
      now: "Сейчас",
      forecast: "Прогноз",
      observed: "Прошедшие часы",
      loading: "Загружаем поле погоды…",
      error: "Не удалось загрузить поле погоды. Значения не выдумываются.",
      clickHint: "Интерполяция модели по сетке 1°, не измерение.",
      noData: "нет данных",
      legendNote: "Шкала только для визуализации",
      who: "ВОЗ",
      cityLayer: "Города (индекс AQI)",
      facilityLayer: "Предприятия",
      adaptive: "Контрастная шкала",
      adaptiveHint: "Растянуть цвета на текущий диапазон значений, чтобы видеть даже небольшие различия",
      adaptiveNote: "Шкала растянута по текущим значениям на карте",
      emissionScale: "выбросы: мало → много",
    },
    range: {
      title: "Период данных",
      from: "С",
      to: "По",
      apply: "Применить",
      since2025: "С января 2025",
      thisYear: "Этот год",
      last90: "90 дней",
      last30: "30 дней",
      loading: "Загружаем архив Open-Meteo…",
      summary: "Архив Open-Meteo: {n} дн.",
    },
    analysis: {
      title: "ИИ-аналитик региона",
      subtitle: "Gemini анализирует архив Open-Meteo за выбранный период, текущие значения и каталог предприятий.",
      focus: "Фокус анализа",
      focusOptions: {
        overview: "Общий обзор",
        health: "Здоровье",
        industry: "Промышленность",
        seasonal: "Сезонность",
        today: "Сегодня",
      },
      question: "Ваш вопрос (необязательно)",
      questionPlaceholder: "Например: в какие месяцы PM2.5 был выше всего и почему?",
      run: "Анализировать",
      running: "Анализируем…",
      stop: "Остановить",
      error: "Не удалось получить ответ от Gemini. Попробуйте ещё раз.",
      empty: "Выберите фокус и нажмите «Анализировать», чтобы получить разбор прошлого и настоящего региона.",
      basedOn: "Данные: {city}, {from} — {to}",
      disclaimer: "Анализ сгенерирован ИИ на основе модельных данных и может содержать ошибки.",
    },
    trends: {
      title: "Динамика и аналитика",
      subtitle: "Как менялись показатели за выбранный период и что это значит.",
      parameter: "Показатель",
      airGroup: "Воздух",
      weatherGroup: "Погода",
      periods: { all: "Весь период", d1: "24 ч", d7: "7 дн.", d30: "30 дн.", d90: "90 дн." },
      mean: "Среднее",
      min: "Минимум",
      max: "Максимум",
      change: "Изменение",
      vsPrevious: "к пред. периоду",
      daysAbove: "Дней выше нормы ВОЗ",
      ofDays: "из {n}",
      missing: "Пропуски",
      noData: "За выбранный период данных нет.",
      dailyMeans: "Среднесуточные значения",
      hourly: "Почасовые значения",
      compareTitle: "Сравнение городов за период",
      city: "Город",
      insightsTitle: "Что это значит",
      insightWind:
        "Преобладающий ветер дует с направления {n} ({d}°) — примеси переносятся в противоположную сторону.",
      insightTrendUp: "Среднее выросло на {v} {u} по сравнению с предыдущим периодом.",
      insightTrendDown: "Среднее снизилось на {v} {u} по сравнению с предыдущим периодом — хороший знак.",
      insightTrendFlat: "Показатель практически не изменился по сравнению с предыдущим периодом.",
      insightGuidelineOk: "Ни одного дня выше ориентира ВОЗ за период.",
      insightGuidelineBad: "{n} дн. из {t} среднесуточное значение превышало ориентир ВОЗ.",
      insightCaveat: "Выводы основаны на модельных данных и не доказывают причастность конкретных предприятий.",
    },
    facilities: {
      title: "Объекты и источники",
      subtitle: "Добавьте известные предприятия или точки наблюдения — они появятся на карте.",
      emptyTitle: "Пока нет объектов",
      emptyDesc: "Импортируйте JSON или CSV-файл, чтобы добавить проверенные объекты на карту.",
      emissionsLabel: "Выбросы",
      importTitle: "Импорт каталога",
      importDesc: "JSON-массив или CSV с колонками:",
      chooseFile: "Выберите файл",
      import: "Импортировать",
      clear: "Очистить",
      imported: "Добавлено: {ok}. Пропущено без координат: {bad}.",
      parseError: "Не удалось прочитать файл.",
      verified: "Проверен",
      needsCheck: "Требует проверки",
      official: "Официальный",
      manual: "Ручной",
      cols: { name: "Название", type: "Тип", coords: "Координаты", status: "Статус", source: "Источник" },
    },
    about: {
      title: "О данных",
      subtitle: "Прозрачность важнее красивых цифр.",
      sources: "Источники",
      limitations: "Ограничения",
      limitationsList: [
        "Все значения — модельные оценки (Open-Meteo, CAMS), а не измерения станций.",
        "Координаты городов ориентировочные; сетка модели не учитывает локальный рельеф.",
        "Прогнозные часы не входят в статистику.",
        "Каталог объектов хранится только в вашем браузере.",
      ],
      methodology: "Методология",
      methodologyText:
        "Погода и качество воздуха загружаются почасово из архива Open-Meteo за выбранный период (с января 2025 года). Средние для направления ветра считаются по кругу. Превышение норм ВОЗ оценивается по среднесуточным значениям.",
      sourceNotes: {
        weather: "Почасовая модель и анализ погоды",
        air: "Модель CAMS, не измерения станций",
        tiles: "Картографическая подложка © OpenStreetMap contributors",
        boundary: "Граница области из OpenStreetMap",
      },
    },
    footer: "EcoPavlodar — открытый экомонитор Павлодарской области.",
    loading: "Загрузка данных…",
    fetchError: "Не удалось получить данные Open-Meteo. Проверьте соединение.",
    dirs: ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"],
    params: params.ru,
    paramsShort,
  },
  kk: {
    nav: {
      overview: "Шолу",
      map: "Карта",
      trends: "Динамика",
      analysis: "ЖИ талдауы",
      facilities: "Нысандар",
      about: "Деректер туралы",
    },
    langLabel: "Тіл",
    hero: {
      eyebrow: "Павлодар облысы · экомонитор",
      title: "Ертіс өңірінде немен тыныс аламыз",
      subtitle:
        "Павлодар, Екібастұз және Ақсу қалаларындағы ауа сапасы мен ауа райы — түсінікті тілде, ДДСҰ ұсынымдарымен және денсаулыққа арналған кеңестермен.",
      chooseCity: "Қаланы таңдаңыз",
      explore: "Картаны ашу",
    },
    aqi: {
      title: "Ауа сапасының индексі",
      scale: "Еуропалық AQI, 0–100+",
      updated: "Деректер уақыты",
      advice: "Ұсыныс",
      unavailable: "Ауа сапасы туралы деректер қазір қолжетімсіз",
    },
    bands: {
      good: { label: "Жақсы", advice: "Серуендеуге, спортпен шұғылдануға және бөлмені желдетуге тамаша күн." },
      fair: { label: "Қанағаттанарлық", advice: "Ауа сапасы қолайлы. Далада еркін уақыт өткізуге болады." },
      moderate: { label: "Орташа", advice: "Сезімтал адамдарға далада ұзақ уақыт күш салуды азайтқан жөн." },
      poor: {
        label: "Нашар",
        advice: "Далада аз болыңыз, әсіресе балалар, егде жастағы адамдар және демікпемен ауыратындар.",
      },
      vpoor: { label: "Өте нашар", advice: "Далада күш салудан аулақ болыңыз, терезелерді жабыңыз, ауа тазартқышты қосыңыз." },
      epoor: { label: "Аса нашар", advice: "Үйден шықпаңыз. Сыртқа шықсаңыз, FFP2 респираторын киіңіз." },
    },
    overview: {
      title: "Ауа дәл қазір",
      subtitle: "Соңғы модельдік мәндер ДДСҰ-ның 2021 жылғы ұсынымдарымен салыстырылды.",
      pollutants: "Ластаушы заттар",
      weather: "Ауа райы",
      ofGuideline: "ДДСҰ нормасының",
      guideline: "ДДСҰ нормасы",
      noGuideline: "ДДСҰ нормасы белгіленбеген",
      compareTitle: "Облыс қалалары",
      compareSubtitle: "Толық ақпарат көру үшін қаланы басыңыз.",
      select: "Таңдау",
      selected: "Таңдалған",
    },
    map: {
      title: "Жел мен ауаның жедел картасы",
      subtitle:
        "Бөлшектер ауаның қозғалысын, ал түс таңдалған қабаттың мәнін көрсетеді. Мәнді білу үшін картаның кез келген жерін басыңыз.",
      layer: "Қабат",
      off: "Қабатсыз",
      particles: "Жел бөлшектері",
      play: "Ойнату",
      pause: "Тоқтата тұру",
      now: "Қазір",
      forecast: "Болжам",
      observed: "Өткен сағаттар",
      loading: "Ауа райы деректері жүктелуде…",
      error: "Ауа райы деректерін жүктеу мүмкін болмады. Мәндер ойдан құрастырылмайды.",
      clickHint: "1° торлы модельдің интерполяциясы, өлшеу нәтижесі емес.",
      noData: "дерек жоқ",
      legendNote: "Шкала тек көрнекілік үшін",
      who: "ДДСҰ",
      cityLayer: "Қалалар (AQI индексі)",
      facilityLayer: "Кәсіпорындар",
      adaptive: "Контрастты шкала",
      adaptiveHint: "Шамалы айырмашылықтар да көрінуі үшін түстерді ағымдағы мәндер ауқымына созу",
      adaptiveNote: "Шкала картадағы ағымдағы мәндерге бейімделген",
      emissionScale: "шығарындылар: аз → көп",
    },
    range: {
      title: "Деректер кезеңі",
      from: "Басы",
      to: "Соңы",
      apply: "Қолдану",
      since2025: "2025 қаңтардан бері",
      thisYear: "Биылғы жыл",
      last90: "90 күн",
      last30: "30 күн",
      loading: "Open-Meteo мұрағаты жүктелуде…",
      summary: "Open-Meteo мұрағаты: {n} күн",
    },
    analysis: {
      title: "Өңірдің ЖИ сарапшысы",
      subtitle:
        "Gemini таңдалған кезеңдегі Open-Meteo мұрағатын, ағымдағы мәндерді және кәсіпорындар каталогын талдайды.",
      focus: "Талдау бағыты",
      focusOptions: {
        overview: "Жалпы шолу",
        health: "Денсаулық",
        industry: "Өнеркәсіп",
        seasonal: "Маусымдылық",
        today: "Бүгін",
      },
      question: "Сұрағыңыз (міндетті емес)",
      questionPlaceholder: "Мысалы: PM2.5 қай айларда ең жоғары болды және неге?",
      run: "Талдау",
      running: "Талдап жатырмыз…",
      stop: "Тоқтату",
      error: "Gemini жауап бере алмады. Қайталап көріңіз.",
      empty: "Өңірдің өткені мен бүгінін талдау үшін бағытты таңдап, «Талдау» батырмасын басыңыз.",
      basedOn: "Деректер: {city}, {from} — {to}",
      disclaimer: "Талдауды модельдік деректер негізінде ЖИ жасаған, қателер болуы мүмкін.",
    },
    trends: {
      title: "Динамика және талдау",
      subtitle: "Таңдалған кезеңде көрсеткіштер қалай өзгергені және оның мәні.",
      parameter: "Көрсеткіш",
      airGroup: "Ауа",
      weatherGroup: "Ауа райы",
      periods: { all: "Бүкіл кезең", d1: "24 сағ", d7: "7 күн", d30: "30 күн", d90: "90 күн" },
      mean: "Орташа",
      min: "Ең төмені",
      max: "Ең жоғары",
      change: "Өзгеріс",
      vsPrevious: "алдыңғы кезеңмен салыстырғанда",
      daysAbove: "ДДСҰ нормасынан асқан күндер",
      ofDays: "{n} күннің ішінде",
      missing: "Бос мәндер",
      noData: "Таңдалған кезеңде деректер жоқ.",
      dailyMeans: "Тәуліктік орташа мәндер",
      hourly: "Сағаттық мәндер",
      compareTitle: "Кезең бойынша қалаларды салыстыру",
      city: "Қала",
      insightsTitle: "Бұл нені білдіреді",
      insightWind: "Жел негізінен {n} ({d}°) жақтан соғады — ластаушы заттар қарама-қарсы бағытқа тарайды.",
      insightTrendUp: "Орташа мән алдыңғы кезеңмен салыстырғанда {v} {u} артты.",
      insightTrendDown: "Орташа мән алдыңғы кезеңмен салыстырғанда {v} {u} төмендеді — бұл жақсы белгі.",
      insightTrendFlat: "Көрсеткіш алдыңғы кезеңмен салыстырғанда іс жүзінде өзгерген жоқ.",
      insightGuidelineOk: "Бұл кезеңде ДДСҰ нормасынан асқан бірде-бір күн болған жоқ.",
      insightGuidelineBad: "{t} күннің {n} күнінде тәуліктік орташа мән ДДСҰ нормасынан асты.",
      insightCaveat:
        "Қорытындылар модельдік деректерге негізделген және белгілі бір кәсіпорынның кінәлі екенін дәлелдемейді.",
    },
    facilities: {
      title: "Нысандар мен ластану көздері",
      subtitle: "Облыстағы ірі кәсіпорындар мен ластану көздері картада көрсетілген. Өз нысандарыңызды да қоса аласыз.",
      emptyTitle: "Әзірге нысандар жоқ",
      emptyDesc: "Тексерілген нысандарды картаға қосу үшін JSON немесе CSV файлын жүктеңіз.",
      emissionsLabel: "Шығарындылар",
      importTitle: "Каталогты жүктеу",
      importDesc: "JSON массиві немесе келесі бағандары бар CSV:",
      chooseFile: "Файлды таңдаңыз",
      import: "Жүктеу",
      clear: "Тазарту",
      imported: "Қосылды: {ok}. Координатасыз өткізіліп жіберілді: {bad}.",
      parseError: "Файлды оқу мүмкін болмады.",
      verified: "Тексерілген",
      needsCheck: "Тексеруді қажет етеді",
      official: "Ресми",
      manual: "Қолмен қосылған",
      cols: { name: "Атауы", type: "Түрі", coords: "Координаталар", status: "Мәртебесі", source: "Дереккөз" },
    },
    about: {
      title: "Деректер туралы",
      subtitle: "Ашықтық әдемі сандардан маңыздырақ.",
      sources: "Дереккөздер",
      limitations: "Шектеулер",
      limitationsList: [
        "Барлық мәндер — модельдік бағалаулар (Open-Meteo, CAMS), бақылау станцияларының өлшемдері емес.",
        "Қалалардың координаталары шамамен алынған; модель торы жергілікті жер бедерін ескермейді.",
        "Болжам сағаттары статистикаға енгізілмейді.",
        "Өзіңіз қосқан нысандар тек браузеріңізде сақталады.",
      ],
      methodology: "Әдістеме",
      methodologyText:
        "Ауа райы мен ауа сапасы деректері Open-Meteo мұрағатынан таңдалған кезең үшін (2025 жылғы қаңтардан бастап) сағат сайын жүктеледі. Жел бағытының орташа мәні шеңбер бойынша есептеледі. ДДСҰ нормасынан асу тәуліктік орташа мәндер бойынша бағаланады.",
      sourceNotes: {
        weather: "Ауа райының сағаттық моделі мен талдауы",
        air: "CAMS моделі, станция өлшемдері емес",
        tiles: "Картаның негізі © OpenStreetMap contributors",
        boundary: "Облыс шекарасы OpenStreetMap деректерінен",
      },
    },
    footer: "EcoPavlodar — Павлодар облысының ашық экомониторы.",
    loading: "Деректер жүктелуде…",
    fetchError: "Open-Meteo деректерін алу мүмкін болмады. Интернет байланысын тексеріңіз.",
    dirs: ["С", "СШ", "Ш", "ОШ", "О", "ОБ", "Б", "СБ"],
    params: params.kk,
    paramsShort,
  },
  en: {
    nav: {
      overview: "Overview",
      map: "Map",
      trends: "Trends",
      analysis: "AI analysis",
      facilities: "Facilities",
      about: "About data",
    },
    langLabel: "Language",
    hero: {
      eyebrow: "Pavlodar region · eco monitor",
      title: "What we breathe along the Irtysh",
      subtitle:
        "Air quality and weather in Pavlodar, Ekibastuz and Aksu — in plain language, with WHO guidelines and health advice.",
      chooseCity: "Choose a city",
      explore: "Open the map",
    },
    aqi: {
      title: "Air quality index",
      scale: "European AQI, 0–100+",
      updated: "Data as of",
      advice: "Advice",
      unavailable: "Air quality data is currently unavailable",
    },
    bands: {
      good: { label: "Good", advice: "A great day for a walk, sports and airing out your home." },
      fair: { label: "Fair", advice: "Air is acceptable. Enjoy your usual outdoor activities." },
      moderate: { label: "Moderate", advice: "Sensitive people should reduce prolonged outdoor exertion." },
      poor: { label: "Poor", advice: "Limit time outdoors, especially children, older adults and people with asthma." },
      vpoor: { label: "Very poor", advice: "Avoid outdoor exertion, keep windows closed, use an air purifier." },
      epoor: { label: "Extremely poor", advice: "Stay indoors. If you must go out, wear an FFP2 respirator." },
    },
    overview: {
      title: "The air right now",
      subtitle: "Latest model values compared with the 2021 WHO air quality guidelines.",
      pollutants: "Pollutants",
      weather: "Weather",
      ofGuideline: "of WHO guideline",
      guideline: "WHO guideline",
      noGuideline: "No WHO guideline",
      compareTitle: "Cities in the region",
      compareSubtitle: "Tap a city to see its details.",
      select: "Select",
      selected: "Selected",
    },
    map: {
      title: "Live wind & air map",
      subtitle: "Particles trace how air moves; colour shows the selected layer. Tap the map to read a value.",
      layer: "Layer",
      off: "No layer",
      particles: "Wind particles",
      play: "Play",
      pause: "Pause",
      now: "Now",
      forecast: "Forecast",
      observed: "Past hours",
      loading: "Loading weather field…",
      error: "Weather field could not be loaded. No values are made up.",
      clickHint: "Model interpolation on a 1° grid, not a measurement.",
      noData: "no data",
      legendNote: "Scale is for visualisation only",
      who: "WHO",
      cityLayer: "Cities (AQI)",
      facilityLayer: "Industrial facilities",
      adaptive: "High-contrast scale",
      adaptiveHint: "Stretch colours over the current value range so even small differences are visible",
      adaptiveNote: "Scale stretched to the values currently on the map",
      emissionScale: "emissions: low → high",
    },
    range: {
      title: "Data period",
      from: "From",
      to: "To",
      apply: "Apply",
      since2025: "Since Jan 2025",
      thisYear: "This year",
      last90: "90 days",
      last30: "30 days",
      loading: "Loading Open-Meteo archive…",
      summary: "Open-Meteo archive: {n} days",
    },
    analysis: {
      title: "AI regional analyst",
      subtitle: "Gemini analyses the Open-Meteo archive for the selected period, current values and the facility catalog.",
      focus: "Analysis focus",
      focusOptions: {
        overview: "Overview",
        health: "Health",
        industry: "Industry",
        seasonal: "Seasonality",
        today: "Today",
      },
      question: "Your question (optional)",
      questionPlaceholder: "E.g. which months had the highest PM2.5 and why?",
      run: "Analyse",
      running: "Analysing…",
      stop: "Stop",
      error: "Could not get a response from Gemini. Please try again.",
      empty: "Pick a focus and press Analyse to get a breakdown of the region's past and present.",
      basedOn: "Data: {city}, {from} — {to}",
      disclaimer: "AI-generated analysis based on model data; it may contain mistakes.",
    },
    trends: {
      title: "Trends & insights",
      subtitle: "How values changed over the selected period — and what it means.",
      parameter: "Parameter",
      airGroup: "Air",
      weatherGroup: "Weather",
      periods: { all: "Whole period", d1: "24 h", d7: "7 days", d30: "30 days", d90: "90 days" },
      mean: "Mean",
      min: "Min",
      max: "Max",
      change: "Change",
      vsPrevious: "vs previous period",
      daysAbove: "Days above WHO guideline",
      ofDays: "of {n}",
      missing: "Missing",
      noData: "No data for the selected period.",
      dailyMeans: "Daily means",
      hourly: "Hourly values",
      compareTitle: "City comparison for the period",
      city: "City",
      insightsTitle: "What it means",
      insightWind: "Prevailing wind blows from the {n} ({d}°) — pollutants drift the opposite way.",
      insightTrendUp: "The mean rose by {v} {u} compared with the previous period.",
      insightTrendDown: "The mean fell by {v} {u} compared with the previous period — a good sign.",
      insightTrendFlat: "Practically unchanged compared with the previous period.",
      insightGuidelineOk: "Not a single day above the WHO guideline in this period.",
      insightGuidelineBad: "On {n} of {t} days the daily mean exceeded the WHO guideline.",
      insightCaveat: "Insights are based on model data and do not prove that any specific facility is responsible.",
    },
    facilities: {
      title: "Facilities & sources",
      subtitle: "Add known plants or observation points — they will appear on the map.",
      emptyTitle: "No facilities yet",
      emptyDesc: "Import a JSON or CSV file to add verified facilities to the map.",
      emissionsLabel: "Emissions",
      importTitle: "Import catalog",
      importDesc: "JSON array or CSV with columns:",
      chooseFile: "Choose file",
      import: "Import",
      clear: "Clear",
      imported: "Added: {ok}. Skipped without coordinates: {bad}.",
      parseError: "Could not read the file.",
      verified: "Verified",
      needsCheck: "Needs check",
      official: "Official",
      manual: "Manual",
      cols: { name: "Name", type: "Type", coords: "Coordinates", status: "Status", source: "Source" },
    },
    about: {
      title: "About the data",
      subtitle: "Transparency matters more than pretty numbers.",
      sources: "Sources",
      limitations: "Limitations",
      limitationsList: [
        "All values are model estimates (Open-Meteo, CAMS), not station measurements.",
        "City coordinates are approximate; the model grid ignores local terrain.",
        "Forecast hours are excluded from statistics.",
        "The facility catalog is stored only in your browser.",
      ],
      methodology: "Methodology",
      methodologyText:
        "Weather and air quality are loaded hourly from the Open-Meteo archive for the selected period (since January 2025). Wind direction means are computed circularly. WHO guideline exceedances are assessed on daily means.",
      sourceNotes: {
        weather: "Hourly weather model and analysis",
        air: "CAMS model, not station measurements",
        tiles: "Basemap © OpenStreetMap contributors",
        boundary: "Region boundary from OpenStreetMap",
      },
    },
    footer: "EcoPavlodar — an open eco monitor for the Pavlodar region.",
    loading: "Loading data…",
    fetchError: "Could not fetch Open-Meteo data. Check your connection.",
    dirs: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    params: params.en,
    paramsShort,
  },
}

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""))
}
