import  { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionslice";
import { createSocketConnection } from "../utils/socket";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const user = useSelector((state) => state?.user);
  const userId = user?._id;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [search, setSearch] = useState("");

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
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="text-center my-10 h-full w-1/2 mx-auto">
        <h1 className="font-bold text-2xl">No connections found</h1>
      </div>
    );

  // Filter connections by search
  const filteredConnections = connections.filter((connection) => {
    const fullName = (connection.firstName + " " + connection.lastName).toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="text-center my-10 w-[80%] lg:w-1/2 mx-auto">
      <h1 className="font-bold text-white text-lg lg:text-3xl">Connections</h1>
      {/* Search input */}
      <div className="m-6 flex justify-center ">
        <div className="relative w-full w-70%">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Find connection..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-200 text-base-content"
          />
        </div>
      </div>
      {filteredConnections.map((connection) => {
        const { firstName, lastName, age, gender, photoURL, _id, about } = connection;
        return (
          <div
            key={_id}
            className="flex flex-col lg:flex-row m-4 p-4 rounded-lg bg-base-300 items-center"
          >
            <div className="relative">
              <img
                src={photoURL}
                alt="user"
                className="w-20 h-20 rounded-full my-2"
              />
              {onlineUsers.includes(_id) && (
                <span className="absolute bottom-1 right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="text-center lg:text-left m-6 w-[85%] lg:w-[70%]">
              <h2 className="font-bold text-md lg:text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p className="text-sm lg:text-lg">{age + ", " + gender}</p>}
              <p className="text-sm lg:text-lg">{about.slice(0, 100)}</p>
            </div>
            <Link to={"/chat/" + _id} className="w-[60%] lg:w-1/6">
              <button className="btn w-full btn-primary mt-0 lg:mt-4 mr-8">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;