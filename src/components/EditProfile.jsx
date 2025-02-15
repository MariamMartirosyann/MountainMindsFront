import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "./../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import Profile from "./Profile";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, photoURL, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
    
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error(err, "eror");
      setError(err?.response?.data);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-10">
        <div className="card bg-base-300 w-96 shadow-xl  mx-10">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Photo</span>
                </div>
                <input
                  type="text"
                  value={photoURL}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Age</span>
                </div>
                <input
                  type="text"
                  value={age}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              {/* <label className="form-control w-full max-w-xs">
              <div className="label pt-4">
                <span className="label-text">Skills</span>
              </div>
              <input
                type="text"
                value={skills}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setSkills(e.target.value)}
              />
            </label> */}

              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Gender</span>
                </div>
                <select
                  className="select select-bordered max-w-xs"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {/* <option disabled selected>
                    Male
                  </option> */}
                  <option>female</option>
                  <option>male</option>
                  <option>other</option>
                </select>
              </label>
            
              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">About</span>
                </div>
                <textarea
                  placeholder="Bio"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="textarea textarea-bordered textarea-lg w-full max-w-xs"
                ></textarea>
              </label>
            </div>
            {error ? <p className=" text-red-700">{error}</p> : null}
            <div className="card-actions justify-center my-2">
              <button className="btn btn-primary" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, age, photoURL, gender, about, skills }}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
