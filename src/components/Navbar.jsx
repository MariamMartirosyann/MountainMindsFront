import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser, addUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import MountaunMind from "../images/7.jpeg";

const navLinks = [
  { name: "Profile", path: "/profile" },
  { name: "People", path: "/" },
  { name: "Connections", path: "/connections" },
  { name: "Requests", path: "/requests" },
  { name: "Premium", path: "/premium" },
];

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      dispatch(addUser(JSON.parse(storedUser)));
    }
    // eslint-disable-next-line
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 py-4" data-theme="dark">
        <div className="flex-1  text-xs lg:text-xl w-full   lg:w-[1/4]">
          <Link to={user && "/"} className={user ? "btn btn-ghost justify-start w-full " : "btn btn-ghost justify-between lg:justify-start w-full"}>
            <img width={30} height={40} src={MountaunMind} />
            <span className="  "> MountainMinds</span>
          </Link>
        </div>
        {!!user ? (
          <div className="flex-none gap-2 mx-3 lg:mx-10">
            <p className="hidden md:block">Welcome {user.firstName}</p>
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
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
                <li>
                  <a onClick={handleLogOut}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;