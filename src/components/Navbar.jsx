import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch= useDispatch()
  const navigate= useNavigate()

  const handleLogOut= async()=>{
    try{
      axios.post(BASE_URL + "/logout",{},{withCredentials:true})
      dispatch(removeUser())
      navigate("/login")
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{handleLogOut()},[])
  return (
    <>
      <div className="navbar bg-base-100 py-4" data-theme="dark" >
        <div className="flex-1">
          <Link  to="/"className="btn btn-ghost text-xl">🏔🧠MountainMinds</Link>
        </div>
        {user && (
          <div className="flex-none gap-2 mx-10">
            <p>Welcome {user.firstName}</p>
            <div className="dropdown dropdown-end mx-4 items-center">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ">
                  <img alt="user photo" src={user.photoURL} />
                </div>{" "}
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogOut}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
