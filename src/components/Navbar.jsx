import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser, addUser } from "../redux/userSlice";
import MountaunMind from "../images/7.jpeg";
import { createSocketConnection } from "../utils/socket";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification states
  const [messageNotification, setMessageNotification] = useState(0);
  const [requestNotification, setRequestNotification] = useState(0);
  const [lastMessageSenderId, setLastMessageSenderId] = useState(null);
  const [lastRequestSenderId, setLastRequestSenderId] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      dispatch(addUser(JSON.parse(storedUser)));
    }
    // eslint-disable-next-line
  }, []);

  // Listen for new messages and requests
  useEffect(() => {
    if (!user?._id) return;
    const socket = createSocketConnection();
    socket.emit("userOnline", {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    socket.on("newMessageNotification", (data) => {
      setMessageNotification((prev) => prev + 1);
      setLastMessageSenderId(data.fromUserId);
    });

    socket.on("friendRequestNotification", (data) => {
      setRequestNotification((prev) => prev + 1);
      setLastRequestSenderId(data.fromUserId);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, user?.firstName, user?.lastName]);

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

  // // Reset notifications on navigation
  // const handleNavLinkClick = (path) => {
  //   setDropdownOpen(false);
  //   if (path === "/requests") setRequestNotification(0);
  //   if (path === "/connections") setMessageNotification(0);
  //   navigate(path);
  // };

  // Click message icon: go to chat with sender
  const handleMessageIconClick = () => {
    setMessageNotification(0);
    if (lastMessageSenderId) {
      navigate(`/chat/${lastMessageSenderId}`);
    } else {
      navigate("/connections");
    }
  };

  // Click request icon: go to requests page, autofill search
  const handleRequestIconClick = () => {
    setRequestNotification(0);
    if (lastRequestSenderId) {
      navigate("/requests", { state: { focusUserId: lastRequestSenderId } });
    } else {
      navigate("/requests");
    }
  };

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
        <div className="flex flex-col flex-1 items-start text-xs lg:text-xl w-full lg:w-[1/4]">
          <Link
            to={user && "/"}
            className={
              user
                ? "btn btn-ghost justify-start w-full "
                : "btn btn-ghost justify-between lg:justify-start w-full"
            }
          >
            <img width={30} height={40} src={MountaunMind} />
            <span> MountainMinds</span>
          </Link>
        </div>
        {!!user ? (
          <div className="flex-none gap-2 mx-3 lg:mx-10">
            <p className="hidden md:block">Welcome {user.firstName}</p>
            {/* Message notification icon */}
            <div
              className="relative h-10 w-10 flex items-center justify-center cursor-pointer"
              onClick={handleMessageIconClick}
              title="Go to chat"
            >
              <svg
                className="h-7 w-7 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
              </svg>
              {messageNotification > 0 && (
                <div className="badge badge-primary badge-ms absolute top-[-7px] right-0">
                  {messageNotification}
                </div>
              )}
            </div>
            {/* Friend request notification icon */}
            {/* <div
              className="relative h-10 w-10 flex items-center justify-center cursor-pointer"
              onClick={handleRequestIconClick}
              title="Go to requests"
            >
              <svg
                className="h-7 w-7 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21h13a2 2 0 0 0 2-2v-2a7 7 0 0 0-14 0v2a2 2 0 0 0 2 2z" />
              </svg>
              {/* {requestNotification > 0 && (
                <div className="badge badge-secondary badge-ms absolute top-[-7px] right-0">
                  {requestNotification}
                </div>
              
            </div> */}
            <div className="dropdown dropdown-end mx-1 items-center" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="w-10 rounded-full ">
                  <img alt="user photo" src={user.photoURL} />
                </div>
              </div>
              {dropdownOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu menu-sm bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => {
                          setDropdownOpen(false);
                          handleNavLinkClick(link.path);
                        }}
                      >
                        {link.name}
                        {/* {link.path === "/requests" && requestNotification > 0 && (
                          <span className="badge badge-secondary ml-2">{requestNotification}</span>
                        )}
                        {link.path === "/connections" && messageNotification > 0 && (
                          <span className="badge badge-primary ml-2">{messageNotification}</span>
                        )} */}
                      </Link>
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