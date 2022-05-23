import React from "react"
import { NavLink } from "react-router-dom"
import { StoreContext } from "../controllers/store"
import { State } from "../models/state"

const Navigation = () => {
  const {
    state: [state],
  } = React.useContext(StoreContext)

  // const renderConnectedWalletPage = () => {
  //   if(state === State.CONNECTED){
  //     return (
  //       <li className="nav-item">
  //         <NavLink className="" to="/DRM">
  //           CONNECTED
  //         </NavLink>
  //       </li>
  //     )
  //   } else {
  //     return (<></>)
  //   }
  // }

  return (
    <nav className="relative mx-auto p-6 bg-clrSecondary text-clrLight text-2xl ">
      <div className="flex items-center justify-center space-x-8">
        {/* {renderConnectedWalletPage()} */}

        <NavLink className=" hover:text-clrDark  " to="/">
          Home
          <span className="hover:text-clrDark sr-only">(current)</span>
        </NavLink>

        <NavLink className="hover:text-clrDark " to="/Wallet">
          Wallet
        </NavLink>

        <NavLink className="hover:text-clrDark " to="/DRM">
          DRM
        </NavLink>

        <NavLink className="hover:text-clrDark " to="/Player">
          Player
        </NavLink>
      </div>
    </nav>
  )
}

export default Navigation
