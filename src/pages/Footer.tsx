import React from "react"

function Footer() {
  return (
    <footer className="text-center text-clrLight">
      <div className="max-w-full  inset-x-0 bottom-0 p-6 flex items-center justify-center text-3xl bg-clrSecondary text-clrLight ">
        <a
          className="mr-6 hover:text-clrDark"
          href="https://twitter.com/ExcaliburWallet"
          target="_blank"
          rel="noreferrer">
          <i className="fa-brands fa-twitter-square"></i>
        </a>
        <a
          className="mr-6 hover:text-clrDark"
          href="https://www.instagram.com/excaliburwallet"
          target="_blank"
          rel="noreferrer">
          <i className="fa-brands fa-instagram"></i>
        </a>
        <a
          className="mr-6 hover:text-clrDark"
          href="https://www.facebook.com/Excaliburwallet/"
          target="_blank"
          rel="noreferrer">
          <i className="fa-brands fa-facebook"></i>
        </a>
        <a
          className="mr-6 hover:text-clrDark"
          href="https://discord.com/channels/961718530594734120"
          target="_blank"
          rel="noreferrer">
          <i className="fa-brands fa-discord"></i>
        </a>
        <a
          className="hover:text-clrDark"
          href="https://www.linkedin.com/company/excaliburwallet/"
          target="_blank"
          rel="noreferrer">
          <i className="fa-brands fa-linkedin"></i>
        </a>
      </div>
      <div className="text-center text-clrLight bg-clrSecondary p-3 ">
        © 2022 Copyright:
        <a
          className="text-clrLight hover:text-clrDarkBlue"
          href="https://excal.tv/">
          Excalibur{" "}
        </a>
      </div>
    </footer>
  )
}

export default Footer
