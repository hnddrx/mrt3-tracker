import { Navigation, Moon, Sun } from 'lucide-react';

const Header = ({ isDarkMode, onToggleTheme, theme }) => (
  <header className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`${theme.accent} p-3 rounded-xl`}>
          <Navigation className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">MRT-3 Tracker</h1>
          <p className={`text-sm ${theme.textMuted} mt-1`}>Real-time transit monitoring</p>
        </div>
      </div>
      
      <button
        onClick={onToggleTheme}
        className={`${theme.card} ${theme.cardBorder} border p-3 rounded-xl ${theme.accentHover} transition-all`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);

export default Header;