import type { Lang, Param } from "./eco-data"

type BandKey = "good" | "fair" | "moderate" | "poor" | "vpoor" | "epoor"

export type Dict = {
  nav: { overview: string; map: string; trends: string; facilities: string; about: string }
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
  }
  trends: {
    title: string
    subtitle: string
    parameter: string
    airGroup: string
    weatherGroup: string
    periods: { d1: string; d7: string; d30: string; d90: string }
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
    pm2_5: "Ұсақ бөлшектер PM2.5",
    pm10: "Бөлшектер PM10",
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
    nav: { overview: "Обзор", map: "Карта", trends: "Динамика", facilities: "Объекты", about: "О данных" },
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
      subtitle: "Частицы показывают перенос воздуха; цвет — значение выбранного слоя. Нажмите на карту, чтобы узнать значение.",
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
      facilityLayer: "Ваши объекты",
    },
    trends: {
      title: "Динамика и аналитика",
      subtitle: "Как менялись показатели за выбранный период и что это значит.",
      parameter: "Показатель",
      airGroup: "Воздух",
      weatherGroup: "Погода",
      periods: { d1: "24 ч", d7: "7 дн.", d30: "30 дн.", d90: "90 дн." },
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
        "Погода и качество воздуха загружаются почасово за последние 92 дня. Средние для направления ветра считаются по кругу. Превышение норм ВОЗ оценивается по среднесуточным значениям.",
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
    nav: { overview: "Шолу", map: "Карта", trends: "Динамика", facilities: "Нысандар", about: "Деректер" },
    langLabel: "Тіл",
    hero: {
      eyebrow: "Павлодар облысы · экомонитор",
      title: "Ертіс өңірінде немен тыныстаймыз",
      subtitle:
        "Павлодар, Екібастұз және Ақсудағы ауа сапасы мен ауа райы — түсінікті тілмен, ДДСҰ нормаларымен және денсаулыққа кеңестермен.",
      chooseCity: "Қаланы таңдаңыз",
      explore: "Картаны ашу",
    },
    aqi: {
      title: "Ауа сапасының индексі",
      scale: "Еуропалық AQI, 0–100+",
      updated: "Дерек уақыты",
      advice: "Ұсыныс",
      unavailable: "Ауа деректері қазір қолжетімсіз",
    },
    bands: {
      good: { label: "Жақсы", advice: "Серуенге, спортқа және желдетуге тамаша күн." },
      fair: { label: "Қанағаттанарлық", advice: "Ауа қолайлы. Далада уақыт өткізуге болады." },
      moderate: { label: "Орташа", advice: "Сезімтал адамдарға далада ұзақ жүктемені азайтқан жөн." },
      poor: { label: "Нашар", advice: "Далада болуды азайтыңыз, әсіресе балалар, қарттар және демікпесі барлар." },
      vpoor: { label: "Өте нашар", advice: "Далада жүктемеден аулақ болыңыз, терезені жабыңыз." },
      epoor: { label: "Аса нашар", advice: "Үйде болыңыз. Шықсаңыз — FFP2 респираторы." },
    },
    overview: {
      title: "Қазіргі ауа",
      subtitle: "Соңғы модельдік мәндер ДДСҰ 2021 нормаларымен салыстырылған.",
      pollutants: "Ластаушылар",
      weather: "Ауа райы",
      ofGuideline: "ДДСҰ нормасынан",
      guideline: "ДДСҰ нормасы",
      noGuideline: "ДДСҰ нормасы жоқ",
      compareTitle: "Облыс қалалары",
      compareSubtitle: "Толығырақ көру үшін қаланы басыңыз.",
      select: "Таңдау",
      selected: "Таңдалды",
    },
    map: {
      title: "Жел мен ауаның тірі картасы",
      subtitle: "Бөлшектер ауаның тасымалын көрсетеді; түс — таңдалған қабат мәні. Мәнді білу үшін картаны басыңыз.",
      layer: "Қабат",
      off: "Қабатсыз",
      particles: "Жел бөлшектері",
      play: "Ойнату",
      pause: "Кідірту",
      now: "Қазір",
      forecast: "Болжам",
      observed: "Өткен сағаттар",
      loading: "Ауа райы өрісі жүктелуде…",
      error: "Ауа райы өрісі жүктелмеді. Мәндер ойдан шығарылмайды.",
      clickHint: "1° тор бойынша модель интерполяциясы, өлшеу емес.",
      noData: "дерек жоқ",
      legendNote: "Шкала тек визуализацияға арналған",
      who: "ДДСҰ",
      cityLayer: "Қалалар (AQI индексі)",
      facilityLayer: "Сіздің нысандарыңыз",
    },
    trends: {
      title: "Динамика және талдау",
      subtitle: "Таңдалған кезеңде көрсеткіштер қалай өзгерді және бұл нені білдіреді.",
      parameter: "Көрсеткіш",
      airGroup: "Ауа",
      weatherGroup: "Ауа райы",
      periods: { d1: "24 сағ", d7: "7 күн", d30: "30 күн", d90: "90 күн" },
      mean: "Орташа",
      min: "Минимум",
      max: "Максимум",
      change: "Өзгеріс",
      vsPrevious: "алдыңғы кезеңге",
      daysAbove: "ДДСҰ нормасынан жоғары күндер",
      ofDays: "{n} күннен",
      missing: "Жетіспейді",
      noData: "Таңдалған кезеңде дерек жоқ.",
      dailyMeans: "Тәуліктік орташа мәндер",
      hourly: "Сағаттық мәндер",
      compareTitle: "Кезең бойынша қалаларды салыстыру",
      city: "Қала",
      insightsTitle: "Бұл нені білдіреді",
      insightWind: "Басым жел {n} ({d}°) бағытынан соғады — қоспалар қарама-қарсы жаққа тасымалданады.",
      insightTrendUp: "Орташа мән алдыңғы кезеңмен салыстырғанда {v} {u} өсті.",
      insightTrendDown: "Орташа мән алдыңғы кезеңмен салыстырғанда {v} {u} төмендеді — жақсы белгі.",
      insightTrendFlat: "Көрсеткіш алдыңғы кезеңмен салыстырғанда іс жүзінде өзгермеді.",
      insightGuidelineOk: "Кезеңде ДДСҰ нормасынан жоғары бірде-бір күн болған жоқ.",
      insightGuidelineBad: "{t} күннің {n} күнінде тәуліктік орташа мән ДДСҰ нормасынан асты.",
      insightCaveat: "Қорытындылар модельдік деректерге негізделген және нақты кәсіпорындардың кінәсін дәлелдемейді.",
    },
    facilities: {
      title: "Нысандар мен көздер",
      subtitle: "Белгілі кәсіпорындарды немесе бақылау нүктелерін қосыңыз — олар картада пайда болады.",
      emptyTitle: "Әзірге нысандар жоқ",
      emptyDesc: "Расталған нысандарды картаға қосу үшін JSON немесе CSV файлын импорттаңыз.",
      importTitle: "Каталогты импорттау",
      importDesc: "JSON массиві немесе CSV, бағандар:",
      chooseFile: "Файлды таңдаңыз",
      import: "Импорттау",
      clear: "Тазалау",
      imported: "Қосылды: {ok}. Координатсыз өткізілді: {bad}.",
      parseError: "Файлды оқу мүмкін болмады.",
      verified: "Расталған",
      needsCheck: "Тексеруді қажет етеді",
      official: "Ресми",
      manual: "Қолмен",
      cols: { name: "Атауы", type: "Түрі", coords: "Координаттар", status: "Күйі", source: "Дереккөз" },
    },
    about: {
      title: "Деректер туралы",
      subtitle: "Ашықтық әдемі сандардан маңыздырақ.",
      sources: "Дереккөздер",
      limitations: "Шектеулер",
      limitationsList: [
        "Барлық мәндер — модельдік бағалаулар (Open-Meteo, CAMS), станция өлшеулері емес.",
        "Қала координаттары шамамен; модель торы жергілікті бедерді ескермейді.",
        "Болжам сағаттары статистикаға кірмейді.",
        "Нысандар каталогы тек сіздің браузеріңізде сақталады.",
      ],
      methodology: "Әдістеме",
      methodologyText:
        "Ауа райы мен ауа сапасы соңғы 92 күн бойы сағат сайын жүктеледі. Жел бағытының орташасы шеңбер бойынша есептеледі. ДДСҰ нормасынан асу тәуліктік орташа бойынша бағаланады.",
      sourceNotes: {
        weather: "Сағаттық ауа райы моделі мен талдауы",
        air: "CAMS моделі, станция өлшеуі емес",
        tiles: "Карта негізі © OpenStreetMap contributors",
        boundary: "Облыс шекарасы OpenStreetMap-тен",
      },
    },
    footer: "EcoPavlodar — Павлодар облысының ашық экомониторы.",
    loading: "Деректер жүктелуде…",
    fetchError: "Open-Meteo деректерін алу мүмкін болмады. Байланысты тексеріңіз.",
    dirs: ["Т", "ТШ", "Ш", "ОШ", "О", "ОБ", "Б", "СБ"],
    params: params.kk,
    paramsShort,
  },
  en: {
    nav: { overview: "Overview", map: "Map", trends: "Trends", facilities: "Facilities", about: "About data" },
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
      facilityLayer: "Your facilities",
    },
    trends: {
      title: "Trends & insights",
      subtitle: "How values changed over the selected period — and what it means.",
      parameter: "Parameter",
      airGroup: "Air",
      weatherGroup: "Weather",
      periods: { d1: "24 h", d7: "7 days", d30: "30 days", d90: "90 days" },
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
        "Weather and air quality are loaded hourly for the last 92 days. Wind direction means are computed circularly. WHO guideline exceedances are assessed on daily means.",
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
