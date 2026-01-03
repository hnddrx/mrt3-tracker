import { Map } from 'lucide-react';

const MobileMapToggle = ({ onClick, theme }) => (
  <button
    onClick={onClick}
    className={`lg:hidden fixed bottom-6 right-6 z-40 ${theme.accent} text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold hover:scale-105 transition-transform`}
  >
    <Map size={20} />
    <span>Map</span>
  </button>
);

export default MobileMapToggle;