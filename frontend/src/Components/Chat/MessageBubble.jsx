export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 rounded-lg max-w-xs break-words ${
          isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {message.type === 'image' ? (
          <img src={message.text} alt="Sent media" className="rounded-lg w-52 object-cover" />
        ) : (
          <span>{message.text}</span>
        )}
      </div>
    </div>
  );
}
