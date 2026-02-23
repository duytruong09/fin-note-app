export const THEME_COLORS = {
  red: { primary: '#FF6B6B', light: '#FFE3E3', dark: '#C92A2A' },
  pink: { primary: '#FF85C0', light: '#FFE0F0', dark: '#C2255C' },
  purple: { primary: '#9775FA', light: '#E5DBFF', dark: '#6741D9' },
  blue: { primary: '#4C6EF5', light: '#E7F5FF', dark: '#1C7ED6' },
  cyan: { primary: '#22B8CF', light: '#E3FAFC', dark: '#0B7285' },
  teal: { primary: '#20C997', light: '#E6FCF5', dark: '#087F5B' },
  green: { primary: '#51CF66', light: '#EBFBEE', dark: '#2F9E44' },
  lime: { primary: '#94D82D', light: '#F4FCE3', dark: '#5C940D' },
  yellow: { primary: '#FCC419', light: '#FFF9DB', dark: '#E67700' },
  orange: { primary: '#FF922B', light: '#FFF4E6', dark: '#D9480F' },
  indigo: { primary: '#5C7CFA', light: '#EDF2FF', dark: '#3B5BDB' },
  violet: { primary: '#CC5DE8', light: '#F3D9FA', dark: '#9C36B5' },
  fuchsia: { primary: '#E64980', light: '#FFDEEB', dark: '#A61E4D' },
  rose: { primary: '#F06595', light: '#FFF0F6', dark: '#C2255C' },
  sky: { primary: '#339AF0', light: '#D0EBFF', dark: '#1971C2' },
  emerald: { primary: '#12B886', light: '#C3FAE8', dark: '#087F5B' },
  amber: { primary: '#FAB005', light: '#FFF3BF', dark: '#F08C00' },
  slate: { primary: '#495057', light: '#F1F3F5', dark: '#212529' },
  gray: { primary: '#868E96', light: '#F8F9FA', dark: '#343A40' },
  neutral: { primary: '#ADB5BD', light: '#F8F9FA', dark: '#495057' },
} as const;

export type ThemeColor = keyof typeof THEME_COLORS;

export const DEFAULT_THEME: ThemeColor = 'blue';
