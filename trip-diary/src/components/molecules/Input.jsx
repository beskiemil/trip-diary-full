/* eslint-disable react/jsx-props-no-spreading */
import { PropTypes } from 'prop-types';
import React from 'react';

const Input = ({
  type,
  label,
  placeholder,
  name,
  id,
  value,
  rows,
  cols,
  onChange,
  className,
  error,
  ...props
}) => (
  <>
    <span className="flex items-baseline justify-between gap-5">
      <label htmlFor={id}>{label}</label>
      {type === 'textarea' && (
        <textarea
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          rows={rows}
          cols={cols}
          value={value}
          onChange={onChange}
          className={`
      border-b-2 border-gray-300 p-2 tracking-wide
      hover:mb-[2px] hover:border-none hover:shadow-md hover:outline hover:outline-2 hover:outline-teal-500
      focus:mb-[2px] focus:border-none focus:outline focus:outline-2 focus:outline-teal-500
      ${className} ${
            error &&
            'border-red-500 hover:outline-red-500 focus:outline-red-500'
          }`}
          {...props}
        />
      )}
      {type !== 'textarea' && (
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className={`
      border-b-2 border-gray-300 p-2 tracking-wide
      hover:mb-[2px] hover:border-none hover:shadow-md hover:outline hover:outline-2 hover:outline-teal-500
      focus:mb-[2px] focus:border-none focus:outline focus:outline-2 focus:outline-teal-500
      ${className} ${
            error &&
            'border-red-500 hover:outline-red-500 focus:outline-red-500'
          }`}
          {...props}
        />
      )}
    </span>

    {error && <p className="relative text-xs italic text-red-500">{error}</p>}
  </>
);

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string || PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default Input;
