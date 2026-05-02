import { LogOut, User } from 'lucide-react'

export default function SidebarFooter({ logout, navigate }) {
  return (
    <div className="p-4 border-t bg-white flex items-center justify-between gap-2">

      {/* 👤 PROFILE BUTTON */}
      <button
        onClick={() => navigate('/profile')}
        className="group flex items-center gap-3 px-3 py-2.5 
                   rounded-lg text-sm font-medium text-gray-600
                   hover:bg-blue-50 hover:text-blue-600 
                   transition-all duration-200"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md 
                        bg-gray-100 group-hover:bg-blue-100 transition">
          <User size={16} />
        </div>
      </button>


      {/* 🚪 LOGOUT BUTTON (your same design) */}
      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="group flex-1 flex items-center gap-3 px-4 py-2.5 
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

        {/* Arrow */}
        <span className="opacity-0 group-hover:opacity-100 text-xs transition">
          →
        </span>
      </button>

    </div>
  )
}