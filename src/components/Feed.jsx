import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const feed = useSelector((store) => store.feed);
 

  const dispatch = useDispatch();

  const getFeed = async () => {
  
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;
  if (feed.length <= 0) return (
      <div className="flex justify-center my-10 h-full">
        <h1>No new users found</h1>
      </div>
    );
  return (
    <div className="flex justify-center my-10  ">
      
      <UserCard user={feed[0]} hideBtns={false} />
    </div>
  );
}

export default Feed;
