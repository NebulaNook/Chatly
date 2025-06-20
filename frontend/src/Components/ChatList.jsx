import SearchBar from './SearchBar';
const chats = [
  {
    id: 1,
    name: 'Jenny Wilson',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'Online',
    lastMessage: 'Can we meet tomorrow?',
    timestamp: '10:45 AM',
  },
  {
    id: 2,
    name: 'Robert Fox',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    status: 'Offline',
    lastMessage: 'I will check and let you know.',
    timestamp: '9:20 AM',
  },
  {
    id: 3,
    name: 'Savannah Nguyen',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    status: 'Online',
    lastMessage: 'Let’s push the release to Monday.',
    timestamp: 'Yesterday',
  },
];
export default function ChatList() {
  return (
    <>
     <div className="bg-white w-full md:w-1/3 border-r border-gray-200 overflow-y-auto flex flex-col">
      <SearchBar />
      <div className="divide-y">
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center">
              <img src={chat.image} className="w-10 h-10 rounded-full" alt={chat.name} />
              <div className="ml-3">
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">{chat.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
