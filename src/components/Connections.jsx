import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../redux/connectionslice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
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
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="text-center my-10 h-full w-1/2 mx-auto">
        <h1 className="font-bold text-2xl">No connections found</h1>
      </div>
    );

  return (
    <div className="text-center my-10  w-[80%] lg:w-1/2 mx-auto">
      <h1 className="font-bold  text-white text-3xl">Connections</h1>
      {connections.map((connection) => {
        const { firstName, lastName, age, gender, photoURL, _id, about } =
          connection;
        return (
          <div
            key={photoURL}
            className="flex  flex-col lg:flex-row  m-4 p-4  rounded-lg bg-base-300 items-center  "
          >
            <div className="">
              {" "}
              <img 
                src={photoURL}
                alt="user"
                className="w-20 h-20 rounded-full my-2"
              />
            </div>
            <div className=" text-center lg:text-left m-6  w-[85%] lg:w-[70%] ">
              {" "}
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p className="">{about}</p>
             
            </div>
            <Link to={"/chat/"+_id}>
            <button className="btn btn-primary mt-4">Chat</button></Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
