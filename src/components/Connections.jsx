import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionslice";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { createSocketConnection } from "../utils/socket";



const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const currentUser = useSelector((store) => store.auth?.user); // assuming this is your auth state
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch connections from backend
  const fetchConnections = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(response?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  // Emit current user to socket server & listen for online users
  useEffect(() => {
      const socket = createSocketConnection();
    if (currentUser) {
      
      socket.emit("userOnline", {
        userId: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      });

      socket.emit("getOnlineUsers");
    }

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [currentUser]);

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="text-center my-10 h-full w-1/2 mx-auto">
        <h1 className="font-bold text-xs lg:text-2xl">No connections found</h1>
      </div>
    );

  return (
    <div className="text-center my-10 w-[80%] lg:w-1/2 mx-auto">
      <h1 className="font-bold text-white text-3xl">Connections</h1>
      {connections.map((connection) => {
        const {
          firstName,
          lastName,
          age,
          gender,
          photoURL,
          _id,
          about,
        } = connection;

        const isOnline = onlineUsers.some((user) => user.userId === _id);

        return (
          <div
            key={_id}
            className="flex flex-col lg:flex-row m-4 p-4 rounded-lg bg-base-300 items-center"
          >
            <div>
              <img
                src={photoURL}
                alt="user"
                className="w-20 h-20 rounded-full my-2"
              />
            </div>
            <div className="text-center lg:text-left m-6 w-[85%] lg:w-[70%]">
              <h2 className="font-bold text-md lg:text-xl">
                {firstName + " " + lastName}
              </h2 >
              {age && gender && <p className=" text-sm lg:text-lg">{age + ", " + gender}</p>}
              <p className=" text-sm lg:text-lg">{about}</p>
              <p className={`font-semibold ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
            
              <button className="btn btn-primary m-4 w-[65%] lg:w-[15%]"><Link to={"/chat/" + _id} >Chat  </Link></button>
           
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
