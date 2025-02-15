import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "./../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../redux/feedSlice";
import UserCard from "./UserCard";

function Feed() {
  const feed = useSelector((store) => store.feed);
  console.log(feed?.lenght,"feed")

  const dispatch = useDispatch();

  const getFeed = async () => {
  
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err, "feed err");
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
    <div className="flex justify-center my-10 h-screen ">
      
      <UserCard user={feed[0]} height={true} />
    </div>
  );
}

export default Feed;
