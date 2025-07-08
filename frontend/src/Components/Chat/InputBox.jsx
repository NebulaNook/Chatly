import { useState } from 'react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';

export default function InputBox({ onSend }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
