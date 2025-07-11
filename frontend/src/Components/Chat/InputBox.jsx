import { useState } from 'react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
import { uploadToCloudinary } from '../../Utlis/cloudinaryUpload';

export default function InputBox({ onSend }) {
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      onSend({ type: 'text', content: input });
      setInput('');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onSend({ type: 'image', content: url }); // support image/file
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
          <FiPaperclip size={20} />
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
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
          disabled={uploading}
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
