export default function SidebarSearch({ search, setSearch }) {
  return (
    <div className="px-4 py-3">
      <input
        placeholder="Search notes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-gray-100 rounded-lg 
                   focus:bg-white focus:ring-2 focus:ring-blue-200 
                   outline-none transition"
      />
    </div>
  )
}