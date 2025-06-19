import React from "react";
import { useNavigate } from "react-router-dom";

const GoBack = () => {
  const navigate = useNavigate();

  return (
    <button
      className="mr-4"
      onClick={() => navigate(-1)}
      title="Go Back"
    >
     
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-base-content hover:text-primary"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" className="fill-base-300" />
        <path
          d="M13.5 8l-4 4 4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
};

export default GoBack;
