import React, { useState } from "react";
import clsx from "clsx";

function InputBox({
  id,
  label,
  type,
  name,
  placeholder,
  required = false,
  autoComplete,
  maxLength,
  pattern,
  options = [],
  value,
  onChange,
}) {
  const [touched, setTouched] = useState(false);
  const hasError = required && touched && String(value || "").trim() === ""; //เช็คว่ากรอกข้อมูลหรือยัง

  const regex =
    pattern === "number"
      ? /^\d*$/
      : pattern === "text"
      ? /^[A-Za-zก-๙\s]*$/
      : pattern === "decimal"
      ? /^\d+(\.\d{0,2})?$/
      : /.*/;

  const setPattern = (e) => {
    /* e.target.value ค่าที่ input เข้ามา */
    const valPatter = e.target.value;
    /* copy and paste ได้ */
    const val = e.target.value;

     
    if (pattern === "text") {
      onChange(e);
      return;
    }

    /*  number */
    if (pattern === "number") {
      if (/^\d*$/.test(val) || val === "") {
        onChange(e);
      }
      return;
    }

    /* ทศนิยม */
    if (pattern === "decimal") {
      if (/^\d*(\.\d{0,2})?$/.test(val) || val === "") {
        onChange(e);
      }
      return;
    }
    onChange(e);
  };

  return (
    /* หัวข้อ */
    <div className="mb-1">
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {/* input แบบ option */}
      {options.length > 0 ? (
        <>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={clsx(
              "block w-full rounded-md px-3 pb-2 text-base text-black bg-gray-50 border border-gray-100",
              hasError
                ? "outline-1 -outline-offset-1 outline-red-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500 sm:text-sm/6 "
                : "outline-1 -outline-offset-1 outline-[#C2C2C2] placeholder:text-[#D2D2D2] focus:outline-2 focus:-outline-offset-2 focus:outline-[#BEBEBE] sm:text-sm/6"
            )}
          >
            <option value="" className="text-sm/6 font-medium text-[#C2C2C2]">
              กรุณาเลือก{label}
            </option>
            {options.map((opt, i) =>
              typeof opt === "object" ? (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ) : (
                <option key={i} value={opt}>
                  {opt}
                </option>
              )
            )}
          </select>
          {hasError && (
            <p className="text-red-500 text-sm mt-1">กรุณากรอก {label}</p>
          )}
        </>
      ) : (
        /* input ปกติ */
        <>
          <input
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={value ?? ""}
            maxLength={maxLength}
            onChange={setPattern}
            onBlur={() => setTouched(true)}
            className={clsx(
              "block w-full rounded-md px-3 pb-2 text-base text-black bg-gray-50 border border-gray-100",
              hasError
                ? "outline-1 -outline-offset-1 outline-red-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500 sm:text-sm/6"
                : "outline-1 -outline-offset-1 outline-[#C2C2C2] placeholder:text-[#D2D2D2] focus:outline-2 focus:-outline-offset-2 focus:outline-[#BEBEBE] sm:text-sm/6"
            )}
          />
          {hasError && (
            <p className="text-red-500 text-sm mt-1">กรุณากรอก {label}</p>
          )}
        </>
      )}
    </div>
  );
}

export default InputBox;
