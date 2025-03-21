import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../redux/requestsSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store?.request);
 

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
     
      dispatch(addRequests(response?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {            
      const response = await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{withCredentials:true});
      dispatch(removeRequest(_id));
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length === 0)return <div className="text-center my-10 h-full w-1/2 mx-auto ">
    <h1 className="font-bold text-2xl text-center my-10 h-full w-2/3 mx-auto">No requests found</h1>;
    </div>

  return (
    <div className="text-center my-10 h-full w-[80%] lg:w-1/2 mx-auto ">
      <h1 className="font-bold  text-white text-3xl">Requests</h1>
      {requests.map((request) => {
        const { _id,firstName, lastName, age, gender, photoURL, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="flex flex-col lg:flex-row  m-4 p-4  rounded-lg bg-base-300 items-center  lg:justify-between"
          >
            <div className="">
              {" "}
              <img
                src={photoURL}
                alt="user"
                className="w-20 h-20 rounded-full my-2"
              />
            </div>
            <div className=" text-center lg:text-left m-6 w-[80%] lg:w-[60%] ">
              {" "}
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p className="">{about}</p>
            </div>
            <div className="flex flex-row  justify-center lg:justify-end items-center ">
              <button className="btn btn-primary mx-2" onClick={() => reviewRequest("rejected",request._id)}>Reject</button>
              <button className="btn btn-secondary mx-2" onClick={() => reviewRequest("accepted",request._id)}>Accept</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
