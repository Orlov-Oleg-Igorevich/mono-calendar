export const CATEGORIES = [
  'Образование',
  'Работа',
  'Хобби',
  'Здоровье',
  'Спорт',
  'Развлечения',
  'Путешествие',
  'Покупки',
  'Документы',
  'Встречи',
  'Быт',
  'Отношения',
  'Красота',
] as const;

export type Category = (typeof CATEGORIES)[number];
