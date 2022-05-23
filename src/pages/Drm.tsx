import React, { useState } from "react"
import Images from "../images/Images"
import DrmForm from "../containers/DrmForm"
import { WalletService } from "../controllers/wallet"
import { BN, web3 } from "@project-serum/anchor"
import { StoreContext } from "../controllers/store"
import { State } from "../models/state"
import * as DRM from "../controllers/drm"

const button: string =
  "text-md bg-clrSecondary px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

const loginForm: string =
  "p-2 text-xs w-full text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

function Drm() {
  // Check wallet Connected
  // Upload file
  // Create Splits
  // Create DRM
  // Forward to Content URL based off of key of artwork

  // The url for the user
  const {
    wallet: [wallet, setWallet],
    state: [state, setState],
    drm: [drm, setDRM],
    curator: [curator, setCurator],
    drmFileURL: [drmFileURL, setDrmFileURL],
    isLoading: [isLoading, setIsLoading],
  } = React.useContext(StoreContext)

  const [artwork, setArtwork] = useState<string | undefined>()
  const [arworkKeypair, setarworkKeypair] = useState<web3.Keypair | undefined>()

  // -------------------- FUNCTIONS ----------------------------------

  const handleArtworkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (!fileList) return
    const artwork = fileList[0]

    setArtwork(URL.createObjectURL(artwork))
    parseFileIntoProvider(artwork)
  }

  const parseFileIntoProvider = (file: File) => {
    if (file) {
      setIsLoading(true)
      file
        .arrayBuffer()
        .then(array => {
          setarworkKeypair(WalletService.keypairFromFile(array))
        })
        .catch(error => {
          console.log(`Error parsing file into drm [${error}]`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      alert("Please select a file")
    }
  }

  const createDRM = (artists: DRM.ArtistParam[]) => {
    if (!wallet) {
      alert("Please connect your wallet first!")
      return
    }
    if (!arworkKeypair) {
      alert("Please upload your art")
      return
    }
    if (artists.length === 0) {
      alert("Please add in the artists")
      return
    }

    let percentTally = 0
    for (const artist of artists) {
      if (artist.name?.length === 0) {
        alert(`Please fill in a name`)
        return
      }
      try {
        const testPK = new web3.PublicKey(artist.wallet)
      } catch (error) {
        alert(`Artist ${artist.name} - has an invalid wallet address`)
        return
      }

      percentTally += artist.percentage
    }

    if (percentTally > DRM.MAX_PERCENT) {
      alert("Percentage adds up to more than 100%")
      return
    }

    if (wallet.provider) {
      setIsLoading(true)
      DRM.DRMProvider.init(
        wallet.publicKey ?? web3.PublicKey.default,
        wallet.provider
      )
        .then(drmProvider => {
          //TODO use this for production
          // const curatorKeypair = arworkKeypair;
          const curatorKeypair = web3.Keypair.generate()
          DRM.createDRM(drmProvider, curatorKeypair, artists, artwork)
            .then(curator => {
              setDrmFileURL(artwork)
              setDRM(drmProvider)
              setCurator(curator)
              setIsLoading(false)

              alert(`DRM created! [${curator.curator.toString()}]`)
            })
            .catch(error => {
              console.log(`Error creating DRM ${error}`)
              setIsLoading(false)
            })
        })
        .catch(error => {
          console.log(`Error initallizing DRM Provider ${error}`)
          setIsLoading(false)
        })
    }

    // DRM.createDRM()
  }
  // -------------------- RENDER MOVIE ----------------------------------

  const renderArtwork = () => {
    if (artwork) {
      // TODO render diffrent assets from diffrent files

      return (
        <div
          className="container px-4 py-6 w-5/6 mt-6 items-center justify-center "
          id="VIDEO-RENDERED-DRM">
          <video className="" controls title="Main" src={artwork} />
        </div>
      )
    }
    return <></>
  }
  //EWoBgNE1txdETLqoepnrS7PYVrpAdsipbrYHyT4Khuy  - 6.99
  //FyauJRRhtbUibrnXfruiv9BKA4WLe9XCN7tJG1aumkLK  - 6
  //HqLV9AeSxKTR1x4cjCujMkPimq7Qkuk35Waywd17DTCP - 4.49  =>3.48
  // -------------------------------------------------------------------
  return (
    <div
      className="container flex flex-col m-auto min-h-screen  max-w-full min-w-screen px-4 py-6 items-center text-center  bg-clrMain  text-clrLight"
      id="DRM-CONTAINER">
      <img
        className="w-2/6 max-w-sm mb-20"
        src={Images.private.logohead}
        alt=""
      />
      <div className="items-center flex flex-col content-center ">
        <div />
        {renderArtwork()}
        <label className={button}>
          Upload File <i className="fa-solid fa-upload"></i>
          <input
            accept="*"
            className="hidden"
            name="mediaUpload"
            type="file"
            multiple={false}
            onChange={handleArtworkUpload}
          />
        </label>
      </div>
      {/* FORM AFTER FILE SELECTED: */}
      {/* RENDER VIDEO THUMBNAIL HERE */}
      <DrmForm
        isLoading={isLoading}
        onSubmit={createDRM}
        startingAddress={(
          wallet?.publicKey ?? web3.PublicKey.default
        ).toString()}
      />
    </div>
  )
}

export default Drm
