import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update with your backend

export default function VideoCall({ userId, targetUserId }) {
  const [isCalling, setIsCalling] = useState(false);
  const localRef = useRef();
  const remoteRef = useRef();
  const peerConnection = useRef(null);

  const ICE_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    socket.emit("user-connected", userId);

    socket.on("incoming-call", async ({ from, offer }) => {
      peerConnection.current = new RTCPeerConnection(ICE_SERVERS);

      // Access media devices
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      localRef.current.srcObject = stream;

      peerConnection.current.ontrack = ({ streams }) => {
        remoteRef.current.srcObject = streams[0];
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer-call", { to: from, answer });

      peerConnection.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { to: from, candidate: e.candidate });
        }
      };
    });

    socket.on("call-answered", async ({ from, answer }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Failed to add ICE candidate", e);
      }
    });

    return () => socket.disconnect();
  }, [userId]);

  const startCall = async () => {
    setIsCalling(true);
    peerConnection.current = new RTCPeerConnection(ICE_SERVERS);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

    peerConnection.current.ontrack = ({ streams }) => {
      remoteRef.current.srcObject = streams[0];
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", { to: targetUserId, offer });

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: targetUserId, candidate: e.candidate });
      }
    };
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4">
        <video ref={localRef} autoPlay muted className="w-64 h-48 bg-black" />
        <video ref={remoteRef} autoPlay className="w-64 h-48 bg-black" />
      </div>
      {!isCalling && (
        <button onClick={startCall} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          Start Call
        </button>
      )}
    </div>
  );
}
