import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { noteService } from '../../services/noteService'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../common/Spinner'

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const { id: activeId } = useParams()

  const [notes,   setNotes]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    noteService.getAll()
      .then(setNotes)
      .finally(() => setLoading(false))
  }, [])

  const handleNew = async () => {
    const note = await noteService.create()
    setNotes((prev) => [note, ...prev])
    navigate(`/editor/${note.id}`)
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await noteService.remove(id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (activeId === id) navigate('/dashboard')
  }

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-gray-100">
        <span className="text-lg font-bold text-brand-600 tracking-tight">NoteWise</span>
      </div>

      {/* New note button */}
      <div className="px-4 py-3">
        <button
          onClick={handleNew}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm
                     bg-brand-500 hover:bg-brand-600 text-white rounded-lg
                     transition-colors font-medium"
        >
          <span className="text-base leading-none">+</span> New note
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="flex justify-center mt-6"><Spinner /></div>
        ) : notes.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-6">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/editor/${note.id}`)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg
                          mb-0.5 cursor-pointer text-sm transition-colors
                          ${activeId === note.id
                            ? 'bg-brand-50 text-brand-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="truncate">{note.title || 'Untitled'}</span>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400
                           hover:text-red-500 transition-all text-xs px-1"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full text-sm text-gray-500 hover:text-red-500
                     transition-colors text-left px-2 py-1"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}