import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((state) => state?.user);
  console.log(user, "user");
  const userId = user?._id;
  const userFirstName = user?.firstName;
  const userLastName = user?.lastName;
  const conecctions = useSelector((state) => state?.connection);


  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    console.log(chat.data.messages, "chat");

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

  console.log(targetConnection, "targetConnection");
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

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
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChatMessages();
  }, []);

  return (
    <div className="w-3/4 m-2 border border-gray-600 mx-auto h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className=" flex-1 overflow-y-scroll px-2">
        {messages?.map((message) => {
          const { firstName, lastName, text } = message;
          console.log(message, "ms");
          return (
            <div
              className={
                firstName === userFirstName
                  ? "chat chat-start "
                  : "chat chat-end"
              }
              key={firstName + Date.now() * Math.random()}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src={
                      firstName === userFirstName
                        ? user?.photoURL
                        : targetConnection?.photoURL
                    }
                  />
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
