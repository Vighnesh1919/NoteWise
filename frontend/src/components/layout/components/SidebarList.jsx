import Spinner from '../../common/Spinner'
import SidebarItem from './SidebarItem'
import SidebarTrashItem from './SidebarTrashItem'

export default function SidebarList({
  tab,
  notes,
  loading,
  onOpen,
  onDelete,
  onHardDelete,
  onFavorite,
  onRestore
}) {
  return (
    <div className="mt-2">

      {tab === 'notes' && (
        loading ? (
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
              onHardDelete={onHardDelete}
              onFavorite={onFavorite}
            />
          ))
        )
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
           onHardDelete={onHardDelete}  
        />
      ))}

    </div>
  )
}