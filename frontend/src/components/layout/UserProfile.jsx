export default function UserProfile() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-xl p-6 w-[360px]">

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            V
          </div>
        </div>

        {/* Name */}
        <h2 className="mt-4 text-center text-lg font-semibold">
          Vighnesh Barage
        </h2>

        {/* Email */}
        <p className="text-center text-sm text-gray-500">
          vighnesh@example.com
        </p>

        {/* Details */}
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <p><strong>Role:</strong> Free User</p>
          <p><strong>Joined:</strong> 2024</p>
        </div>

        {/* Button */}
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Edit Profile
        </button>

      </div>

    </div>
  )
}