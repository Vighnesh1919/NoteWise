export default function SidebarTrashItem({ note, onRestore }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 text-sm text-gray-500 line-through hover:bg-gray-100 rounded">
      {note.title}
      <button
        onClick={(e) => onRestore(e, note.id)}
        className="text-green-600 hover:text-green-800"
      >
        ↺
      </button>
    </div>
  )
}