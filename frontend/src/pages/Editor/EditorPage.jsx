import { useEffect, useState, useRef, useCallback } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import { noteService } from '../../services/noteService'
import Spinner from '../../components/common/Spinner'

const DELAY = 1000

export default function EditorPage({ noteId }) {
  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const timer = useRef(null)

  const editor = useCreateBlockNote()

  useEffect(() => {
    if (!noteId) return

    setLoading(true)

    noteService.getOne(noteId)
      .then(data => {
        setNote(data)
        setTitle(data.title)

        if (data.content?.length) {
          editor.replaceBlocks(editor.document, data.content)
        }
      })
      .finally(() => setLoading(false))
  }, [noteId])

  const autoSave = useCallback(() => {
    clearTimeout(timer.current)
    setStatus('Saving...')

    timer.current = setTimeout(async () => {
      try {
        await noteService.update(noteId, title, editor.document)
        setStatus('Saved ✓')
        setTimeout(() => setStatus(''), 1500)
      } catch {
        setStatus('Error ❌')
      }
    }, DELAY)
  }, [noteId, title, editor])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Top Bar */}
      <div className="px-10 pt-8 pb-2 flex justify-between items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => noteService.update(noteId, title, editor.document)}
          placeholder="Untitled"
          className="text-4xl font-bold text-gray-900 w-full bg-transparent outline-none placeholder-gray-300"
        />

        <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">
          {status}
        </span>
      </div>

      {/* Divider */}
      <div className="border-b mx-10 mb-4"></div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-10 pb-10">
        <div className="max-w-3xl mx-auto">

          <BlockNoteView
            editor={editor}
            onChange={autoSave}
            theme="light"   // ✅ THIS FIXES YOUR BLACK UI
          />

        </div>
      </div>
    </div>
  )
}