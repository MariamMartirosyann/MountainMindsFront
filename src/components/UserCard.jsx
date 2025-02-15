import React from "react";
import { BASE_URL } from './../utils/constants';
import { useDispatch } from "react-redux";
import {removeUserFromFeed} from "../redux/feedSlice";
import axios from "axios";

const UserCard = ({ user,height }) => {
  const dispatch= useDispatch()
  
  const { _id,firstName, lastName, photoURL, age, gender, about, skills } = user;

  const handleSendRequest= async(status,userId)=>{
    try{
      const response= await axios.post( BASE_URL+"/request/send/"+status+ "/"+userId,{},{withCredentials:true});
      dispatch(removeUserFromFeed(userId))
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div className={height?"card bg-base-300 w-96 shadow-xl pt-6 h-[70%]": "card bg-base-300 w-96 shadow-xl pt-6"} >
      <figure>
        <img src={photoURL} alt="photo" className="" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + "  " + lastName}</h2>
        <p>{age && gender && age + ", " + gender}</p>
        <p>{skills}</p>
        <p>{about}</p>
       
        <div className="card-actions justify-center mt-4">
          <button className="btn btn-primary" onClick={()=>handleSendRequest("ignored",_id)}>Ignore</button>
          <button className="btn btn-secondary" onClick={()=>handleSendRequest("interested",_id)}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
