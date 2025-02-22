import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("mar@gmail.com");
  const [password, setPassword] = useState("Mariam22#");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          emailId,
          password,
          firstName,
          lastName,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || "Something went wrong");

    }}

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-5  pb-5">
      <div className="card bg-base-300 w-96 shadow-xl ">
        <div className="card-body">
          <h2 className="card-title justify-center cursor-pointer">  
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm ? (
              <>
                {" "}
                <label className="form-control w-full max-w-xs">
                  <div className="label py-4">
                    <span className="label-text">Frist Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label py-4">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            ) : null}

            <label className="form-control w-full max-w-xs">
              <div className="label py-4">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label py-4">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {error ? <p className=" text-red-700">{error}</p> : null}
          <div className="card-actions justify-center my-2">
            <button className="btn btn-primary" onClick={isLoginForm?handleLogin:handleSignUp}>
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
          <p className="justify-center my-1  text-center" onClick={() => setIsLoginForm((value)=>!value)}>
            {isLoginForm
              ? "New User? Sign Up Here"
              : "Exicting User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
