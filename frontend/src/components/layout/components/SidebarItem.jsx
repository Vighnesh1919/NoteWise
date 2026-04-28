export default function SidebarItem({ note, onOpen, onDelete, onFavorite }) {
  return (
    <div
      onClick={() => onOpen(note)}
      className="group flex justify-between items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition"
    >
      <span className="truncate text-sm text-gray-800">
        {note.title}
      </span>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

        <button
          onClick={(e) => onFavorite(e, note.id)}
          className={`text-sm ${
            note.is_favorite ? 'text-yellow-500' : 'text-gray-300'
          } hover:scale-110 transition`}
        >
          ★
        </button>

        <button
          onClick={(e) => onDelete(e, note.id)}
          className="text-sm text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>

      </div>
    </div>
  )
}