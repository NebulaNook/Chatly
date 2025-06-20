import Sidebar from "../Components/Sidebar";
import ChatWindow from "../Components/ChatWindow";
import ChatList from "../Components/ChatList";
export default function ChatPage() {
  return (
    <>
      <div className="flex h-full w-full">
        <Sidebar />
        <ChatList />
        <ChatWindow />
      </div>
    </>
  );
}
