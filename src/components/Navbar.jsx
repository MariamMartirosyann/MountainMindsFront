import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser, addUser } from "../redux/userSlice";
import MountaunMind from "../images/7.jpeg";

const navLinks = [
  { name: "Profile", path: "/profile" },
  { name: "People", path: "/" },
  { name: "Connections", path: "/connections" },
  { name: "Requests", path: "/requests" },
  { name: "Premium", path: "/premium" },
];

const Navbar = () => {
  const [notification, setNotification] = useState(0);
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking a nav link
  const handleNavLinkClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <div className="navbar bg-base-100 py-4" data-theme="dark">
        <div className=" flex flex-col flex-1 items-start text-xs lg:text-xl w-full   lg:w-[1/4]">
          <Link
            to={user && "/"}
            className={
              user
                ? "btn btn-ghost justify-start w-full "
                : "btn btn-ghost justify-between lg:justify-start w-full"
            }
          >
            <img width={30} height={40} src={MountaunMind} />
            <span className="  "> MountainMinds</span>
          </Link>
        </div>
        {!!user ? (
          <div className=" flex-none gap-2 mx-3 lg:mx-10">
            <p className="hidden md:block">Welcome {user.firstName} </p>
            {notification ? (
              <div className=" relative h-10 w-10 dropdown dropdown-end">
                <svg
                  className="h-7 w-7 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />{" "}
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <div className="badge badge-primary badge-ms  absolute top-[-7px] right-0">1</div>
              </div>
            ) : null}

            <div className="dropdown dropdown-end mx-1 items-center" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="w-10 rounded-full ">
                  <img alt="user photo" src={user.photoURL} />
                </div>{" "}
              </div>
              {dropdownOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm  bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <a
                        href={link.path}
                        onClick={e => {
                          e.preventDefault();
                          handleNavLinkClick(link.path);
                        }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogOut();
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;