import React from "react";

const PlacePage = ({ params }) => {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center text-center px-3 pt-5 min-h-screen">
      <p className="text-5xl">Oops! 🙄</p>
      <p className="text-3xl">
        Looks like you are trying to access a{" "}
        <span className="font-bold underline decoration-dashed">
          {params.place}
        </span>{" "}
        place that does not exist.
      </p>
    </div>
  );
};

export default PlacePage;
