import React from "react"
import Images from "../images/Images"

const PageNotFound = () => {
  return (
    <div className="max-w-none	relative container flex flex-col mx-auto p-6 space-x-8 space-y-6 bg-clrMain items-center  text-clrLight h-screen">
      <img className="w-2/6 max-w-sm" src={Images.private.logohead} alt="" />
    </div>
  )
}

export default PageNotFound
