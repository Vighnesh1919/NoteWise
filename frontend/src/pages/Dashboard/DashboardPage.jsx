import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/layout/Sidebar'

export default function DashboardPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-gray-800">
            Good to see you 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Pick a note from the sidebar or create a new one to start writing.
          </p>
          <button
            onClick={async () => {
              const { noteService } = await import('../../services/noteService')
              const note = await noteService.create()
              navigate(`/editor/${note.id}`)
            }}
            className="mt-4 px-5 py-2 bg-brand-500 hover:bg-brand-600
                       text-white rounded-lg text-sm font-medium transition-colors"
          >
            + New note
          </button>
        </div>
      </main>
    </div>
  )
}