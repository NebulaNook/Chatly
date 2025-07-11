import Sidebar from "../Components/Chat/VideoCall/SideBar/SideBar";
import ChatWindow from "../Components/Chat/ChatWindow";
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
