const DestinationSelector = ({ destination, onDestinationChange, stations, theme }) => (
  <section className={`${theme.card} ${theme.cardBorder} border rounded-2xl p-6 shadow-sm`}>
    <label className="block mb-3">
      <span className={`text-lg font-semibold ${theme.text} mb-2 block`}>Destination</span>
      <span className={`text-sm ${theme.textMuted} block mb-4`}>Select where you're heading</span>
    </label>
    <select
      value={destination?.id || ''}
      onChange={(e) => {
        const selected = stations.find(s => s.id === parseInt(e.target.value));
        onDestinationChange(selected);
      }}
      className={`w-full ${theme.input} ${theme.cardBorder} border rounded-xl p-4 text-base font-medium focus:outline-none focus:ring-2 ${theme.inputFocus} transition-all`}
    >
      <option value="">Choose a station...</option>
      {stations.map(station => (
        <option key={station.id} value={station.id}>
          {station.name}
        </option>
      ))}
    </select>
  </section>
);

export default DestinationSelector;
