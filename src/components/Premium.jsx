import React from "react";

const Premium = () => {
  return (
    <div className="flex flex-col md:flex-row m-10  ">
      <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
       <h1 className=" font-bold text-3xl">Silver Membership</h1>
       <ul>
        <li>- Chat with oyher people</li>
        <li>- 100 conecction Request per day</li>
        <li>- Blue Tick</li>
        <li>- 3 months</li>
       </ul>
       <button className="btn btn-secondary">Buy Silver</button>
      </div>
      <div className="divider  md:divider-horizontal">OR</div>
      <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
      <h1 className=" font-bold text-3xl">Gold Membership</h1>
      <ul>
        <li>- Chat with oyher people</li>
        <li>- Infinite Conecction Request per day</li>
        <li>- Blue Tick</li>
        <li>- 6 months</li>
       </ul>
       <button className="btn btn-primary">Buy Gold</button>
      </div>
    </div>
  );
};

export default Premium;
