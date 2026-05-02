export default function SidebarTrashItem({ note, onRestore, onHardDelete }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 text-sm text-gray-500 line-through hover:bg-gray-100 rounded">

      <span className="truncate">{note.title}</span>

      <div className="flex gap-2">

        {/* Restore */}
        <button
          onClick={(e) => onRestore(e, note.id)}
          className="text-green-600 hover:text-green-800"
        >
          ↺
        </button>

        {/* Hard Delete */}
        <button
          onClick={(e) => onHardDelete(e, note.id)}
          className="text-red-600 hover:text-red-800"
        >
          🗑
        </button>

      </div>
    </div>
  )
}