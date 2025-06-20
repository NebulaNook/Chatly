import { FiPhoneCall, FiVideo, FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
export default function ChatWindow() {
  return (
    <>
 <div className="flex flex-col flex-1 bg-gray-50">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Jenny Wilson</h2>
          <p className="text-sm text-green-500">Online</p>
        </div>
        <div className="space-x-2">
          <button className="bg-blue-500 text-white p-2 rounded-lg">
            <FiPhoneCall size={20} />
          </button>
          <button className="bg-blue-500 text-white p-2 rounded-lg">
            <FiVideo size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="self-start bg-gray-200 p-3 rounded-lg max-w-xs">Hi! I'm doing well, thanks. How about you?</div>
        <div className="self-end bg-blue-500 text-white p-3 rounded-lg max-w-xs">I'm good, working on the new project!</div>
        <div className="self-start bg-gray-200 p-3 rounded-lg max-w-xs">That's great to hear! 😊</div>
        <div className="self-end">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="chat-image"
            className="rounded-lg w-64"
          />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FiPaperclip size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FiMic size={20} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white p-2 rounded-lg">
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
