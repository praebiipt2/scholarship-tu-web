import React from "react";
import clsx from "clsx";

function ButtonSummit({ primary, children, onClick, type = "button", className }) {
  const buttonClass = clsx(
    "flex w-full mt-2 justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer",
    primary
      ? "bg-[#FFA500] hover:bg-[#FF8000] text-white"
      : "bg-[#D3D3D3] text-[#BEBEBE]",
    className
  );

  return (
    <button type={type} onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
}

export default ButtonSummit;