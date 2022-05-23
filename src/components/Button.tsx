import React from "react"

const Button = (props: { className: any; onClick: any; label: any }) => {
  const { className, onClick, label } = props

  return (
    <button
      className={`px-4 py-1 text-sm text-clrDarkBlue font-semibold rounded-full border border-clrMain hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-2 focus:ring-clrDarkBlue focus:ring-offset-2 ${className}`}
      onClick={onClick}>
      {label}
    </button>
  )
}

export default Button
