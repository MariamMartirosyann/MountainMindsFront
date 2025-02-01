import React from "react";

const UserCard = ({ user }) => {
  
  const { firstName, lastName, photoURL, age, gender, about, skills } = user;
  return (
    <div className="card bg-base-300 w-96 shadow-xl pt-6">
      <figure>
        <img src={photoURL} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + "  " + lastName}</h2>
        <p>{age && gender && age + ", " + gender}</p>
        <p>{skills}</p>
        <p>{about}</p>
       
        <div className="card-actions justify-center mt-4">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
