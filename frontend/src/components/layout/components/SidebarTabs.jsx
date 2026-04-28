function Tab({ tab, setTab, val, label }) {
  return (
    <button
      onClick={() => setTab(val)}
      className={`w-full text-left px-3 py-2 rounded-md transition
        ${tab === val
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'hover:bg-gray-100 text-gray-600'
        }`}
    >
      {label}
    </button>
  )
}

export default function SidebarTabs({ tab, setTab }) {
  return (
    <div className="px-3 space-y-1 text-sm">
      <Tab tab={tab} setTab={setTab} val="notes" label="📄 Notes" />
      <Tab tab={tab} setTab={setTab} val="favorites" label="⭐ Favorites" />
      <Tab tab={tab} setTab={setTab} val="trash" label="🗑 Trash" />
    </div>
  )
}