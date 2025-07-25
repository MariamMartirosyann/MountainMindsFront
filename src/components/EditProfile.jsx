import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "./../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

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

  const validateForm = () => {
    if (!firstName.trim() || !/^[a-zA-Z]+$/.test(firstName) || firstName.length > 20) {
      return "First name is required, only letters allowed, max 20 characters.";
    }

    if (!lastName.trim() || !/^[a-zA-Z]+$/.test(lastName) || lastName.length > 20) {
      return "Last name is required, only letters allowed, max 20 characters.";
    }

    if (!age || isNaN(age) || +age < 1 || +age > 120) {
      return "Age must be a number between 1 and 120.";
    }

    if (skills && skills.length > 50) {
      return "Skills must be less than or equal to 50 characters.";
    }

    if (about && about.length > 70) {
      return "About must be less than or equal to 70 characters.";
    }

    return null;
  };

  const saveProfile = async () => {
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, photoURL, gender, about, skills },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex justify-center mb-10 flex-col lg:flex-row items-center lg:items-start">
        <div className="card bg-base-300 w-96 shadow-xl mb-5 lg:mb-0 mx-10">
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
                  maxLength={20}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <small className="text-xs text-gray-500">{firstName.length}/20</small>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  maxLength={20}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
                <small className="text-xs text-gray-500">{lastName.length}/20</small>
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
                  type="number"
                  value={age}
                  min="1"
                  max="120"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Skills</span>
                </div>
                <input
                  type="text"
                  value={skills}
                  maxLength={50}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setSkills(e.target.value)}
                />
                <small className="text-xs text-gray-500">{skills.length}/50</small>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label pt-4">
                  <span className="label-text">Gender</span>
                </div>
                <select
                  className="select select-bordered max-w-xs"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
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
                  maxLength={70}
                  onChange={(e) => setAbout(e.target.value)}
                  className="textarea textarea-bordered textarea-lg w-full max-w-xs"
                ></textarea>
                <small className="text-xs text-gray-500">{about.length}/70</small>
              </label>
            </div>

            {error ? <p className="text-red-700 pt-2">{error}</p> : null}

            <div className="card-actions justify-center my-2">
              <button className="btn btn-primary" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>

        <UserCard
          user={{ firstName, lastName, age, photoURL, gender, about, skills }}
          hideBtns={true}
          height={true}
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
