import { Bell } from 'lucide-react';

export default function Notification({ message, type = 'info', theme }) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    error: 'bg-red-500/10 border-red-500/30 text-red-500'
  };

  return (
    <div className={`mb-6 border rounded-xl p-4 flex gap-3 ${styles[type]}`}>
      <Bell size={20} />
      <p className={`${type === 'info' ? theme.textSecondary : ''} text-sm font-medium`}>
        {message}
      </p>
    </div>
  );
}
