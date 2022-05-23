import React, { useEffect, useState } from "react"
import { StoreContext } from "../controllers/store"
import Images from "../images/Images"
import QRCode from "react-qr-code"
import * as DRM from "../controllers/drm"
import { BN, web3 } from "@project-serum/anchor"
import { useParams } from "react-router-dom"
import BlankPage from "./BlankPage"
import { WalletService } from "../controllers/wallet"

const button: string =
  "px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

// Gold 4DAAY9p9oR75yVMp2R4m8ic7y3r7EipssMg4isbzx2WX 2
// DJ   6aDNXDxVy8GE3EbiqnMpzMRYTB18EnkdmyjZBUbdeQYa 4
// Cute Gan9Tnx3eRA6b1Av76A9wiMfjBJirdRgP6B1q5edq84v 2
// Curator 8vQ5S4cbLUi1cVTwHU33qYjniHpFGSe9ZQBY6MTDN1DF
const TestPlayer = () => {
  const { id } = useParams()
  const [wallet, setWallet] = useState<WalletService | undefined>()
  const [drmProvider, setDRMProvider] = useState<DRM.DRMProvider | undefined>()
  const [curator, setCurator] = useState<DRM.Curator | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    loadCurator()
  }, [])

  // -------------------- FUNCTIONS ----------------------------------
  const loadCurator = () => {
    // TODO load wallet from browser
    // const testWallet = WalletService.createWallet()
    // if (drm) {
    //   console.log("there");
    //   try {
    //     setIsLoading(true)
    //     DRM.getCuratorAccount(drm, new web3.PublicKey(id ?? ""))
    //       .then(newCurator => {
    //         setCurator(newCurator)
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    //       .finally(() => {
    //         setIsLoading(false)
    //       })
    //   } catch (error) {
    //     console.log(error)
    //     setIsLoading(false)
    //   }
    // }
  }

  const crank = () => {
    alert(id)
    if (drmProvider && curator) {
      setIsLoading(true)

      DRM.crank(drmProvider, curator, Math.min(curator.artists.length, 5))
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
    if (drmProvider && curator) {
      setIsLoading(true)

      DRM.compliment(drmProvider, curator, new BN(web3.LAMPORTS_PER_SOL))
        .then(curator => {
          setCurator(curator)
        })
        .finally(() => {
          setIsLoading(false)
          alert("Donated!")
        })
    }
  }

  // if (!curator || !drmProvider) return BlankPage()

  // -----------------------------------------------------------------
  return (
    <div className="container flex flex-col m-auto min-h-screen  max-w-full min-w-screen px-4 py-6 items-center text-center  bg-clrMain  text-clrLight">
      <img className="w-2/6" src={Images.private.logohead} alt="" />
      <div className="mt-6 flex flex-col items-center md:flex-row">
        <div className="m-6 items-center flex flex-col content-center items-borderline md:flex-row">
          <video
            title="Main"
            src={curator?.url}
            className="w-fit md:w-fit"
            controls
          />
        </div>
        <div className="items-center justify-center flex flex-col ">
          <div>
            {/* <img className="w-2/6 md:w-3/4" src={Images.qrcode.qrcode} alt="" /> */}
            <QRCode value={curator?.curator.toString() ?? "NA"} />
          </div>
          <div className="flex-col md:flex-row text-left">
            <p className="">Wallet Address:</p>

            <strong>
              <p>{curator?.curator.toString()}</p>
            </strong>
            <div>
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
            <div className="flex flex-col md:flex-row">
              <button className={button}>
                <a href="/Wallet" className="">
                  Create Your Wallet
                </a>
              </button>
              <button className={button} onClick={compliment}>
                Donate
              </button>
              <button className={button} onClick={crank}>
                Crank
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPlayer
