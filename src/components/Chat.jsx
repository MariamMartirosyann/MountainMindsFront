import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((state) => state?.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const userId = user?._id;
  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;
  const conecctions = useSelector((state) => state?.connection);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadMessages, setLoadMessages] = useState(7);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages?.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });

    setMessages(chatMessages);
  };

  const targetConnection = conecctions?.find(
    (connection) => connection?._id === targetUserId
  );

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && loadMessages < messages.length) {
      setLoadMessages((prev) => Math.min(prev + 10, messages.length));
    }
  };

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    const socket = createSocketConnection();

    socket.emit("userConnected", userId);

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      userId,
      targetUserId,
      firstName: user?.firstName,
      lastName: user?.lastName,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
      setLoadMessages((prev) => Math.min(prev + 1, messages.length + 1));
      // Scroll to bottom on new message
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChatMessages();
  }, []);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Calculate which messages to show
  const startIdx = Math.max(messages.length - loadMessages, 0);
  const visibleMessages = messages.slice(startIdx);

  return (
    <div className="w-3/4 lg:w-1/2 m-2 border border-gray-600 mx-auto h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div
        className="flex-1 overflow-y-scroll px-2"
        ref={chatBoxRef}
        onScroll={handleScroll}
      >
        {visibleMessages.map((message, idx) => {
          const { firstName, lastName, text } = message;
          return (
            <div
              className={
                firstName === userFirstName
                  ? "chat chat-start "
                  : "chat chat-end"
              }
              key={firstName + idx + text}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full relative">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={
                      firstName === userFirstName
                        ? user?.photoURL
                        : targetConnection?.photoURL
                    }
                  />
                  {onlineUsers.includes(targetUserId) && (
                    <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
              </div>
              <div className="chat-header">
                {firstName + " " + lastName}
                <time className="text-xs opacity-50">
                  {new Date().toString().slice(15, 21)}
                </time>
              </div>
              <div className="chat-bubble">{text}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className=" p-5 border-t border-gray-600  gap-2 flex flex-col md:flex-row">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className=" flex-1 border border-gray-500 text-white rounded p-2"
          type="text"
        />
        <button className="btn btn-secondary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
