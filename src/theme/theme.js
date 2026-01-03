export const getTheme = (isDarkMode) => ({
  dark: {
    bg: 'bg-slate-950',
    card: 'bg-slate-900/90',
    cardBorder: 'border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    input: 'bg-slate-800 border-slate-600 text-white',
    inputFocus: 'focus:border-blue-500 focus:ring-blue-500/20',
    progressBg: 'bg-slate-800',
    routeLine: 'bg-slate-600',
    routeLineInactive: 'bg-slate-800',
    stationBorder: 'border-slate-700'
  },
  light: {
    bg: 'bg-slate-50',
    card: 'bg-white',
    cardBorder: 'border-slate-200',
    text: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    input: 'bg-white border-slate-300 text-slate-900',
    inputFocus: 'focus:border-blue-500 focus:ring-blue-500/20',
    progressBg: 'bg-slate-200',
    routeLine: 'bg-slate-400',
    routeLineInactive: 'bg-slate-200',
    stationBorder: 'border-slate-300'
  }
})[isDarkMode ? 'dark' : 'light'];