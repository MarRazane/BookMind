const TABS = [
  { key: 'wantToRead', label: 'Want to Read', icon: '🔖' },
  { key: 'reading',    label: 'Reading',       icon: '📖' },
  { key: 'finished',   label: 'Finished',      icon: '✅' },
]

export default function ShelfTabs({ active, counts = {}, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            active === tab.key
              ? 'bg-white shadow-sm text-primary-800'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>{tab.icon}</span>
          <span className="hidden sm:block">{tab.label}</span>
          {counts[tab.key] > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              active === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
