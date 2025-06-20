import { FaComments, FaUserFriends, FaCog, FaSignOutAlt } from "react-icons/fa";
export default function Sidebar() {
  return (
    <>
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white w-full md:w-1/5 p-4 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src='https://randomuser.me/api/portraits/women/65.jpg' alt="avatar" className="w-16 h-16 rounded-full" />
          <h4 className="text-lg font-semibold">John Doe</h4>
        </div>
        <nav className="space-y-4">
          <button className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded">
            <FaComments /> New Chat
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded">
            <FaUserFriends /> Contacts
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded">
            <FaCog /> Settings
          </button>
        </nav>
      </div>
      <button className="flex items-center gap-2 hover:bg-red-700 bg-red-600 p-2 mt-8 rounded w-full">
        <FaSignOutAlt /> Logout
      </button>
    </div>
    </>
  );
}
