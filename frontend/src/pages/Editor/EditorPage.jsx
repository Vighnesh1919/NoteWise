import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import Sidebar from '../../components/layout/Sidebar'
import Spinner from '../../components/common/Spinner'
import { noteService } from '../../services/noteService'

// Auto-save debounce in ms
const AUTOSAVE_DELAY = 1000

export default function EditorPage() {
  const { id } = useParams()
  const [note,    setNote]    = useState(null)
  const [title,   setTitle]   = useState('')
  const [status,  setStatus]  = useState('') // 'saving' | 'saved' | 'error'
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef(null)

  // Initialise BlockNote editor
  const editor = useCreateBlockNote()

  // Load note on mount / when id changes
  useEffect(() => {
    setLoading(true)
    noteService.getOne(id)
      .then((data) => {
        setNote(data)
        setTitle(data.title)
        // Populate editor with saved JSONB content
        if (data.content && data.content.length > 0) {
          editor.replaceBlocks(editor.document, data.content)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  // Auto-save whenever blocks change
  const handleEditorChange = useCallback(() => {
    clearTimeout(saveTimer.current)
    setStatus('saving')
    saveTimer.current = setTimeout(async () => {
      try {
        const blocks = editor.document
        await noteService.update(id, title, blocks)
        setStatus('saved')
        setTimeout(() => setStatus(''), 2000)
      } catch {
        setStatus('error')
      }
    }, AUTOSAVE_DELAY)
  }, [id, title, editor])

  // Save when title changes
  const handleTitleBlur = async () => {
    if (!note) return
    try {
      setStatus('saving')
      await noteService.update(id, title, editor.document)
      setStatus('saved')
      setTimeout(() => setStatus(''), 2000)
    } catch {
      setStatus('error')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-10 pt-8 pb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Untitled"
            className="text-3xl font-bold text-gray-900 bg-transparent
                       border-none outline-none w-full placeholder-gray-300"
          />
          <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">
            {status === 'saving' && '⏳ Saving…'}
            {status === 'saved'  && '✅ Saved'}
            {status === 'error'  && '❌ Save failed'}
          </span>
        </div>

        {/* BlockNote editor */}
        <div className="flex-1 overflow-y-auto px-6">
          <BlockNoteView
            editor={editor}
            onChange={handleEditorChange}
            theme="light"
          />
        </div>
      </main>
    </div>
  )
}