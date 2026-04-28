import { useEffect, useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import EditorPage from '../Editor/EditorPage'
import { noteService } from '../../services/noteService'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [openTabs, setOpenTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)

  // 🔥 LOAD TABS FROM STORAGE
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tabs') || '[]')
    const active = localStorage.getItem('activeTab')

    setOpenTabs(saved)
    setActiveTab(active)
  }, [])

  // 🔥 SAVE TABS
  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(openTabs))
    localStorage.setItem('activeTab', activeTab || '')
  }, [openTabs, activeTab])

  const openNote = (note) => {
    setOpenTabs(prev => {
      if (prev.find(n => n.id === note.id)) return prev
      return [...prev, note]
    })
    setActiveTab(note.id)
  }

  const closeTab = (id) => {
    setOpenTabs(prev => {
      const updated = prev.filter(n => n.id !== id)

      if (activeTab === id) {
        setActiveTab(updated.length ? updated[updated.length - 1].id : null)
      }

      return updated
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar onOpenNote={openNote} />

      <main className="flex-1 flex flex-col bg-gray-50">

        {/* 🔥 TABS */}
        <div className="flex items-center bg-white border-b overflow-x-auto">

          {openTabs.map(tab => (
            <motion.div
              key={tab.id}
              layout
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mr-1 cursor-pointer text-sm relative
                ${activeTab === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 rounded-t-md -z-10"
                />
              )}

              <span className="truncate max-w-[120px] mr-2">
                {tab.title || 'Untitled'}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="text-xs hover:text-red-500"
              >
                ✕
              </button>
            </motion.div>
          ))}

        </div>

        {/* 🔥 EDITOR */}
        <div className="flex-1 overflow-hidden">
          {activeTab ? (
            <EditorPage noteId={activeTab} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Open a note ✨
            </div>
          )}
        </div>

      </main>
    </div>
  )
}