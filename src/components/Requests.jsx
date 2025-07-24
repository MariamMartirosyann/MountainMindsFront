import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../redux/requestsSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useLocation } from "react-router-dom";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store?.request);
  const [search, setSearch] = useState("");
  const location = useLocation();

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
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.log(error);
    }
  };

  // Autofill search if navigated with focusUserId (from notification)
  useEffect(() => {
    if (location.state?.focusUserId && requests?.length) {
      const req = requests.find(r => r.fromUserId._id === location.state.focusUserId);
      if (req) {
        setSearch(req.fromUserId.firstName + " " + req.fromUserId.lastName);
      }
    }
  }, [location.state, requests]);

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;
  if (requests.length === 0)
    return (
      <div className="text-center my-10 h-full w-1/2 mx-auto ">
        <h1 className="font-bold text-2xl text-center my-10 h-full w-2/3 mx-auto">
          No requests found
        </h1>
      </div>
    );

  // Filter requests by search input
  const filteredRequests = requests.filter((request) => {
    const { firstName, lastName } = request.fromUserId;
    const fullName = (firstName + " " + lastName).toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="text-center my-10  w-[80%] lg:w-1/2 mx-auto">
      <h1 className="font-bold  text-white  text-lg lg:text-3xl">Requests</h1>
      <div className="m-6 flex justify-center">
        <div className="relative w-full w-70%">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10 bg-base-200 text-base-content"
          />
        </div>
      </div>
      {filteredRequests.map((request) => {
        const { _id, firstName, lastName, age, gender, photoURL, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="flex flex-col lg:flex-row  m-4 p-4  rounded-lg bg-base-300 items-center  lg:justify-between"
          >
            <div className="">
              <img
                src={photoURL}
                alt="user"
                className="w-20 h-20 rounded-full my-2"
              />
            </div>
            <div className=" text-center lg:text-left m-6 w-[80%] lg:w-[50%] ">
              <h2 className="font-bold text-md lg:text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p className="text-sm lg:text-lg">{about}</p>
            </div>
            <div className="flex flex-col lg:flex-row  justify-center lg:justify-end items-center w-[80%] lg:w-[25%] ">
              <button
                className="btn btn-primary w-2/3 lg:w-1/2  my-2 lg:my-0 mx-2 "
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary w-2/3 lg:w-1/2 my-2 lg:my-0  mx-2"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;