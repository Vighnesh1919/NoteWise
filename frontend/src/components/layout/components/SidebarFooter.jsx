import { LogOut } from 'lucide-react'

export default function SidebarFooter({ logout, navigate }) {
  return (
    <div className="p-4 border-t bg-white">

      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="group w-full flex items-center gap-3 px-4 py-2.5 
                   rounded-lg text-sm font-medium text-gray-600
                   hover:bg-red-50 hover:text-red-600 
                   transition-all duration-200"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-md 
                        bg-gray-100 group-hover:bg-red-100 transition">
          <LogOut size={16} />
        </div>

        {/* Text */}
        <span className="flex-1 text-left">
          Sign out
        </span>

        {/* Optional subtle arrow */}
        <span className="opacity-0 group-hover:opacity-100 text-xs transition">
          →
        </span>
      </button>

    </div>
  )
}