import { Navigation, Moon, Sun, Share2 } from 'lucide-react';
import ShareLocationButton from './ShareLocationButton'; // import your existing component

const Header = ({ isDarkMode, onToggleTheme, theme, userLocation }) => (
  <header
    className={`
      fixed top-0 left-0 w-full z-50
      ${theme.bg} ${theme.text} 
      shadow-md border-b border-gray-200 dark:border-gray-700
      transition-colors duration-300
    `}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div
            className={`
              ${theme.accent} 
              p-3 rounded-2xl flex items-center justify-center
              shadow-md
              transition-transform transform hover:scale-105
            `}
          >
            <Navigation className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              NAVIX
            </h1>
            <p className={`text-sm sm:text-base ${theme.textMuted} mt-0.5`}>
              Real-time transit monitoring
            </p>
          </div>
        </div>

        {/* Right Controls: Theme + Share Location */}
        <div className="flex items-center gap-3">
          {/* Share Location Button */}
          <ShareLocationButton userLocation={userLocation} theme={theme} />

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`
              ${theme.card} ${theme.cardBorder} border
              p-3 rounded-xl 
              flex items-center justify-center
              shadow-sm hover:shadow-md
              ${theme.accentHover}
              transition-all duration-300
            `}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
