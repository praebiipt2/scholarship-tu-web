import React from 'react'
import { MdAdd ,  MdDelete  } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


function ActionButton({action = '' , onClick, children}) {
  /* import icon */
    const iconButton = {
        add: <MdAdd className="w-4 h-4 mr-2 text-white" />,
        edit: <FaEdit className="w-4 h-4 mr-2 text-white"/>,
        delete: <MdDelete className="w-4 h-4 text-white"/>
    }

    /* match */
    const icon = iconButton[action] || <FaPlus />;

    const buttonClass =  "px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-purple-800 hover:bg-purple-900 focus:outline-none rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " 
    

  return (
    <button type="button" onClick={onClick} className={buttonClass}>
      {icon}
       {/* ข้อความ */}
      {children}
    </button>
  )
}

export default ActionButton
