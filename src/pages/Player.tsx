import React from "react"
import { StoreContext } from "../controllers/store"
import Images from "../images/Images"
import Videos from "../videos/videos"
import QRCode from "react-qr-code"
import * as DRM from "../controllers/drm"
import { BN, web3 } from "@project-serum/anchor"
import { useParams } from "react-router-dom"

const button: string =
  "text-md bg-clrSecondary px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

const form: string =
  "p-2 text-xs text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

const loginForm: string =
  "p-2 text-xs w-full text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

const Player = () => {
  const {
    wallet: [wallet, setWallet],
    state: [state, setState],
    drm: [drm, setDRM],
    curator: [curator, setCurator],
    drmFileURL: [drmFileURL, setDrmFileURL],
    isLoading: [isLoading, setIsLoading],
  } = React.useContext(StoreContext)

  // -------------------- FUNCTIONS ----------------------------------

  const crank = () => {
    if (drm && curator) {
      setIsLoading(true)

      DRM.crank(drm, curator, Math.min(curator.artists.length, 5))
        .then(curator => {
          setCurator(curator)
        })
        .finally(() => {
          setIsLoading(false)
          alert("Cranked!")
        })
    }
  }

  const compliment = () => {
    if (drm && curator) {
      setIsLoading(true)

      DRM.compliment(drm, curator, new BN(web3.LAMPORTS_PER_SOL))
        .then(curator => {
          setCurator(curator)
        })
        .finally(() => {
          setIsLoading(false)
          alert("Donated!")
        })
    }
  }

  const donate = () => {
    if (wallet && curator) {
      setIsLoading(true)

      wallet
        .send(
          curator.curator.toString(),
          web3.LAMPORTS_PER_SOL + web3.LAMPORTS_PER_SOL * 0.006
        )
        .finally(() => {
          setIsLoading(false)
          alert("Donated!")
        })
    }
  }
  // ------------------- RENDERERS -----------------------------------
  const renderArtists = () => {
    if (!curator) return null

    const lines = []

    for (const artist of curator.artists) {
      lines.push(
        <div className="flex flex-row justify-between">
          <p className="">{artist.name}</p>

          <strong>
            <p>
              {(
                (artist.lamportsDistributed.toNumber() ?? 0) /
                web3.LAMPORTS_PER_SOL
              ).toFixed(3)}
            </p>
          </strong>
        </div>
      )
    }

    return lines
  }

  // -----------------------------------------------------------------
  return (
    <div className="container flex flex-col m-auto min-h-screen  max-w-full min-w-screen px-4 py-6 items-center text-center  bg-clrMain  text-clrLight">
      <img className="w-2/6 max-w-sm" src={Images.private.logohead} alt="" />
      <div className="mt-6 flex flex-col items-center ">
        <div className="m-6 items-center flex flex-col content-center items-borderline md:flex-row">
          <video title="Main" src={drmFileURL} className="max-w-1/5" controls />
        </div>
        <div className="items-center justify-center flex flex-col space-y-2">
          <div>
            {/* <img className="w-2/6 md:w-3/4" src={Images.qrcode.qrcode} alt="" /> */}
            <QRCode className="" value={curator?.curator.toString() ?? "NA"} />
          </div>
          <div className="flex-col md:flex-row text-left">
            <p className="">Wallet Address:</p>

            <p>{curator?.curator.toString()}</p>
            <div className="flex flex-row justify-between">
              <p className="">Sol Donated:</p>

              <strong>
                <p>
                  {(
                    (curator?.lamportsTally.toNumber() ?? 0) /
                    web3.LAMPORTS_PER_SOL
                  ).toFixed(3)}
                </p>
              </strong>
            </div>
            {renderArtists()}
            <div className="my-6"></div>
            <div className="flex flex-col ">
              <button className={`${button}`}>
                <a href="/Wallet" className="">
                  Create Your Wallet
                </a>
              </button>
              <button className={`${button}`} onClick={donate}>
                Donate
              </button>
              <button className={`${button}`} onClick={crank}>
                Crank
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
