import Spinner from '../../common/Spinner'
import SidebarItem from './SidebarItem'
import SidebarTrashItem from './SidebarTrashItem'

export default function SidebarList({
  tab,
  notes,
  loading,
  onNew,
  onOpen,
  onDelete,
  onFavorite,
  onRestore
}) {
  return (
    <div className="flex-1 overflow-y-auto mt-3 px-3">

      {tab === 'notes' && (
        <>
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs text-gray-400 uppercase">Notes</span>
            <button
              onClick={onNew}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
            >
              + New
            </button>
          </div>

          {loading ? (
            <Spinner />
          ) : notes.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-4">
              No notes found
            </p>
          ) : (
            notes.map(note => (
              <SidebarItem
                key={note.id}
                note={note}
                onOpen={onOpen}
                onDelete={onDelete}
                onFavorite={onFavorite}
              />
            ))
          )}
        </>
      )}

      {tab === 'favorites' && notes.map(note => (
        <SidebarItem
          key={note.id}
          note={note}
          onOpen={onOpen}
          onDelete={onDelete}
          onFavorite={onFavorite}
        />
      ))}

      {tab === 'trash' && notes.map(note => (
        <SidebarTrashItem
          key={note.id}
          note={note}
          onRestore={onRestore}
        />
      ))}

    </div>
  )
}