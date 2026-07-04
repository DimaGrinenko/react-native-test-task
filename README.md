# Field Tasks — React Native Test Task

**Код кандидата:** `SA-RN-XXXX` ← замените на код от рекрутера

Мобильное приложение для полевых сотрудников: создание, планирование и отслеживание рабочих задач с локацией, вложениями, статусами, историей и офлайн-синхронизацией.

Репозиторий: [github.com/DimaGrinenko/react-native-test-task](https://github.com/DimaGrinenko/react-native-test-task)

---

## Статус проекта

Сейчас создан **скелет проекта** (Expo + TypeScript + папки). Основная реализация — следующий этап.

## Стек (план)

| Область | Библиотека |
|--------|------------|
| Фреймворк | Expo SDK 57 + React Native |
| Язык | TypeScript |
| Навигация | `@react-navigation/native` + bottom tabs + stack |
| Состояние | Zustand или React Context |
| Локальное хранение | `@react-native-async-storage/async-storage` + JSON |
| Синхронизация | fetch + json-server (last-write-wins) |
| Уведомления | `expo-notifications` |
| Карта | `react-native-maps` |
| Вложения | `expo-image-picker`, `expo-document-picker` |
| Тема | React Navigation theme + переключатель в настройках |

## Структура папок

```
react-native-test-task/
├── App.tsx                 # Точка входа (временный tab-shell)
├── src/
│   ├── components/         # UI-компоненты
│   ├── constants/          # Статусы, ключи storage, код кандидата
│   ├── hooks/
│   ├── navigation/
│   ├── screens/            # Экраны: список, форма, детали, карта, история, настройки
│   ├── services/
│   │   ├── api/            # REST-клиент
│   │   ├── storage/        # Локальное хранение
│   │   ├── sync/           # Офлайн-очередь и синхронизация
│   │   └── notifications/  # Локальные push
│   ├── types/
│   └── utils/              # Валидация и хелперы
└── server/                 # json-server mock
    ├── db.json
    └── package.json
```

## Установка и запуск

### Приложение

```bash
cd react-native-test-task
npm install
npm start
# Android: npm run android
```

### Mock-сервер

```bash
cd server
npm install
npm start
# API: http://localhost:3000/tasks
```

Для эмулятора Android используйте `http://10.0.2.2:3000` (см. `.env.example`).

### Сборка APK

```bash
npx expo prebuild
cd android && ./gradlew assembleRelease
# или EAS Build: eas build -p android --profile preview
```

## Что нужно реализовать (чеклист задания)

### 1. Задачи (CRUD) — 25%
- [ ] Создание/редактирование: название, описание, дедлайн, адрес, вложения, статус
- [ ] Валидация обязательных полей
- [ ] Список с сортировкой (дата добавления / срок / статус)
- [ ] Детальный экран, удаление, пустое состояние

### 2. Расширенный функционал — 25%
- [ ] Вложения (минимум изображения)
- [ ] Push за 30 мин до дедлайна + demo mode (30–60 сек)
- [ ] Карта с маркерами и открытием задачи
- [ ] Журнал истории (локально, переживает перезапуск)
- [ ] Офлайн + синхронизация со статусами pending/syncing/failed

### 3. UI/UX — 15%
- [ ] Светлая и тёмная тема с переключателем
- [ ] Loading / empty / error / success состояния
- [ ] Доступность: крупные кнопки, labels

### 4. Сдача — 10%
- [ ] README (этот файл — дополнить по ходу)
- [ ] APK + видео 2–5 мин
- [ ] Код кандидата в приложении, README и видео
- [ ] Осмысленные коммиты в GitHub

## Архитектура (кратко)

1. **Storage** — задачи и история в AsyncStorage; вложения хранятся по URI + метаданные.
2. **Sync** — при появлении сети отправка локальных изменений на json-server; конфликты: last-write-wins по `updatedAt`.
3. **Notifications** — `expo-notifications` планирует локальное уведомление; demo mode сокращает интервал.
4. **Map** — координаты вручную или из пресетов; маркеры из задач с lat/lng.

## Известные ограничения

- Геокодирование не обязательно — ручной ввод адреса и координат.
- Аутентификация не требуется.
- Конфликты синхронизации — простая стратегия (документировать в README).

## Email для сдачи

- pavel@salesautomators.com
- charles.n@salesautomators.com

Тема: `Тестовое задание стажёра для мобильной медицинской сестры выполнено — [Полное имя]`
