import React from 'react'

function About({label,name,value,onChange}) {
  return (
    <div className="col-span-full">
          <label htmlFor={label} className="block text-sm/6 font-medium text-gray-800">{label}</label>
          <div className="mt-1">
            <textarea id="about" name={name} rows="3" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            value={value}
            onChange={onChange}
            />
          </div>
    </div>
  )
}

export default About
