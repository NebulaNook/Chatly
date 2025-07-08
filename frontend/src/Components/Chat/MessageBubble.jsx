export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 rounded-lg max-w-xs break-words ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
