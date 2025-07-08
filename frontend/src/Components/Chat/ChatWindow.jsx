import { useEffect, useState, useRef } from 'react';
import { FiPhoneCall, FiVideo } from 'react-icons/fi';
import { encryptMessage, decryptMessage } from '../../utils/crypto';
import { socket } from '../../utils/socket';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

export default function ChatWindow({ currentUserId, selectedUser = null, selectedGroup = null }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const title = selectedGroup ? selectedGroup.name : selectedUser?.name || "Chat";

  // Join group room
  useEffect(() => {
    if (selectedGroup?._id) {
      socket.emit('join-room', selectedGroup._id);
    }
  }, [selectedGroup]);

  // Message listeners
  useEffect(() => {
    socket.emit('user-connected', currentUserId);

    const handlePrivate = (message) => {
      const decrypted = decryptMessage(message.encryptedText);
      setMessages((prev) => [...prev, { ...message, text: decrypted }]);
    };

    const handleGroup = (message) => {
      const decrypted = decryptMessage(message.encryptedText);
      setMessages((prev) => [...prev, { ...message, text: decrypted }]);
    };

    socket.on('private-message', handlePrivate);
    socket.on('group-message', handleGroup);

    return () => {
      socket.off('private-message', handlePrivate);
      socket.off('group-message', handleGroup);
    };
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Message
  const handleSend = (input) => {
    const encrypted = encryptMessage(input);
    const message = {
      sender: currentUserId,
      encryptedText: encrypted,
      type: 'text',
    };

    if (selectedGroup?._id) {
      socket.emit('group-message', {
        groupId: selectedGroup._id,
        message: encrypted,
        sender: currentUserId,
      });
    } else if (selectedUser?._id) {
      socket.emit('private-message', {
        to: selectedUser._id,
        message,
      });
    }

    setMessages((prev) => [...prev, { ...message, text: input }]);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} isOwn={msg.sender === currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputBox onSend={handleSend} />
    </div>
  );
}
