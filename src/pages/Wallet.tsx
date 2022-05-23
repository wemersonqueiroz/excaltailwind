import React, { useContext, useEffect, useState } from "react"
import Images from "../images/Images"
import { WalletService } from "../controllers/wallet"
import { StoreContext } from "../controllers/store"
import { State } from "../models/state"
import { web3 } from "@project-serum/anchor"
import QRCode from "react-qr-code"

// CUSTOM CLASS TAILWIND
const button: string =
  "text-md bg-clrSecondary px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

const form: string =
  "p-2 text-xs text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

const loginForm: string =
  "p-2 text-xs w-full text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

//TOGGLE POP UP PAYMENT TO BE SETUP
const toggleModal: any = (
  <button className="block text-sm text-clrLight font-semibold rounded-full border-clrLight ">
    Send Funds
  </button>
)

// CODE STARTS HERE
const Wallet = () => {
  const [fp, setFP] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>()
  const [file, setFile] = useState<File>()

  const {
    wallet: [wallet, setWallet],
    state: [state, setState],
    isLoading: [isLoading, setIsLoading],
    logout: [logout],
  } = React.useContext(StoreContext)

  React.useEffect(() => {
    if (wallet) {
      setFile(undefined)
      setFP(undefined)
      setPassword(undefined)
      setPasswordConfirm(undefined)
      setWalletBalance(0)
      updateBalance()
    }
  }, [wallet])

  // Cute Gan9Tnx3eRA6b1Av76A9wiMfjBJirdRgP6B1q5edq84v 1.49 @25   -> 1.74
  // Gold 4DAAY9p9oR75yVMp2R4m8ic7y3r7EipssMg4isbzx2WX 2    @25   -> 2.24
  // DJ   6aDNXDxVy8GE3EbiqnMpzMRYTB18EnkdmyjZBUbdeQYa 4.49 @50 * -> (-1sol) 3.9
  // DMB2wXy6hMkktF79ebGXjF2yxTCWXjh8SVSwE12AtvXC
  // BFHN5JJkDNh5YtfH2Z32RGVGQrwBgKXc7T4nGRd5VqUM

  // -------------------- WEB3 FUNCTIONS --------------------------------------
  const createWallet = () => {
    if (file) {
      file.arrayBuffer().then(array => {
        //TODO Better form validation
        let pass = formValidation()

        // Devnet
        // setWallet(
        //   new WalletService(undefined, array, pass, undefined, "devnet")
        // )
        // Mainnet
        setWallet(
          new WalletService(undefined, array, pass, undefined, "mainnet-beta")
        )
        setState(State.CONNECTED)
      })
    } else {
      alert("Please select a file")
    }
  }

  // -------------------- INPUT --------------------------------------
  const formValidation = () => {
    if (password && passwordConfirm) {
      if (password === passwordConfirm) {
        return password
      } else {
        alert("Passwords do not match")
        throw new Error("Need passwords to match")
      }
    }

    return undefined
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files

    // TODO fix - Same file is being

    if (!fileList) {
      setFile(undefined)
      setFP(undefined)
      return
    }
    const newFile = fileList[0]

    setFile(newFile)
    setFP(URL.createObjectURL(newFile))
  }

  const setFormPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const setFormConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value)
  }

  // -------------------- FUNCTIONS ----------------------------------
  const updateBalance = () => {
    setIsLoading(true)
    console.log(wallet?.publicKey?.toString() ?? "no wallet")
    wallet
      ?.getBalance(
        wallet.publicKey?.toString() ?? web3.PublicKey.default.toString()
      )
      .then(newBalance => {
        if (newBalance) {
          setWalletBalance(newBalance)
        }
      })
      .catch(error => {
        console.log(`Error Checking Balance [${error}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const airdrop2 = () => {
    setIsLoading(true)

    wallet
      ?.airDrop(2)
      .then(() => {
        updateBalance()
      })
      .catch(error => {
        console.log(`Error Airdropping [${error}`)
      })
      .finally(() => {
        setIsLoading(false)
        alert("Airdropped 2 Sol")
      })
  }

  const txSol = (toWallet: string, lamports: number) => {
    setIsLoading(true)

    wallet
      ?.send(toWallet, lamports)
      .catch(error => {
        console.log(`Error Sending ${lamports} to ${toWallet} [${error}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  //HqLV9AeSxKTR1x4cjCujMkPimq7Qkuk35Waywd17DTCP
  //EWoBgNE1txdETLqoepnrS7PYVrpAdsipbrYHyT4Khuy

  // -------------------- RENDERERS ----------------------------------
  const renderImg = () => {
    if (fp) {
      return (
        <div className="flex flex-col items-center">
          <img
            alt="Your new Wallet"
            className="w-3/6 md:w-1/4 newWallet bg-clrSecondary rounded-lg mb-6"
            src={fp}
          />
        </div>
      )
    }
    return <></>
  }

  const renderAddress = () => {
    return (
      <p>
        {wallet?.publicKey?.toString() ?? web3.PublicKey.default.toString()}
      </p>
    )
  }

  // -------------------- MAIN PAGE --------------------------------------

  // //TODO Take out
  // if(state === State.CONNECTED){
  //   return (
  //     <div className="container">
  //       <p>Connected!</p>
  //     </div>
  //   )
  // }

  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  const ToggleForm = () => {
    setShowPaymentForm(!showPaymentForm)
  }

  const paymentForm = () => {
    if (!showPaymentForm) return null

    return (
      <div className={`container {showPaymentForm ? "d-block" : "d-none"}`}>
        <div className="m-6 items-center flex flex-col content-center items-borderline">
          <form
            action="/wallet"
            className="container flex flex-col space-x-2 space-y-2">
            <div className="absolute inset-0  py-10 align-center bg-clrSecondary px-4 pt-6 rounded-lg   flex flex-col">
              <label className="text-2xl">Recipient</label>
              <p>
                Sol Balance {(walletBalance / web3.LAMPORTS_PER_SOL).toFixed(5)}
              </p>
              <input
                type="text"
                className={form}
                id="recipientAddress"
                placeholder="e.g FjvfG63iNSYfJTeUaFqh5vPk9PrLqjFmfqivRdbpJ2Q6"
                name="recipient"
                required
              />
              <input
                type="number"
                className={form}
                id="transactionValue"
                placeholder="Amount"
                name="transactionValue"
                step="any"
                required
              />
              <button type="submit" className={button}>
                Confirm
              </button>
              <button type="button" className={button} onClick={ToggleForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderNotConnectedWalletPage = () => {
    if (state !== State.NOT_CONNECTED) return null
    return (
      <div className="container flex flex-col  px-4 py-6 items-center text-center  justify-center bg-clrMain   text-clrLight   ">
        <div
          id="FORM-LOGIN"
          className="items-center justify-center content-center">
          {renderImg()}
          <label className={`drop-shadow-md ${button}`}>
            Upload File <i className="fa-solid fa-upload" />
            <input
              accept="*"
              className="hidden"
              name="recipientfile"
              type="file"
              placeholder="Select file"
              multiple={false}
              onChange={handleFileInput}
            />
          </label>
          <div className=" flex flex-col  items-center mt-6">
            <label>Password(recomended)</label>
            <input
              className={loginForm}
              name="recipientfile"
              type="password"
              placeholder="Password"
              onChange={setFormPassword}
            />
            <label>Confirm Password</label>
            <input
              className={loginForm}
              name="recipientfile"
              type="password"
              placeholder="Password"
              onChange={setFormConfirmPassword}
            />
            <button
              onClick={createWallet}
              className={` drop-shadow-md ${button}`}>
              Create Wallet & Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // CONDITIONAL RENDERING WHEN CONNECTED:
  const renderConnectedWalletPage = () => {
    if (state !== State.CONNECTED) {
      return null
    }
    return (
      <div className="  flex flex-col px-4 py-6 items-center text-center bg-clrMain   text-clrLight h-screen md:h-content  align-center ">
        <div className="relative items-center flex flex-col">
          <h5 className="">
            {" "}
            Sol Balance {(walletBalance / web3.LAMPORTS_PER_SOL).toFixed(5)}
          </h5>
          <div
            className="mt-4 mb-8 p-2 bg-clrSecondary rounded-lg"
            id="QR-CODE-RENDERED">
            <QRCode value={wallet?.publicKey?.toString() ?? ""} />
          </div>
          <h2>Public Key :</h2>
          <h5
            className="text-sm md:text-base border p-2 rounded"
            id="newWalletAddress">
            {renderAddress()}
          </h5>
          {/* <div className="container flex flex-col wallet-buttons space-x-4 items-center text-center md:flex-row "> */}
          <div className="container  grid grid-cols-1 content-evenly space-8 md:grid-cols-1 ">
            <button className={`w-full ${button}`} onClick={updateBalance}>
              Check Balance
            </button>
            <button className={`w-full ${button}`} onClick={airdrop2}>
              Airdrop
            </button>
            <button className={`w-full ${button}`} onClick={ToggleForm}>
              Send Funds
            </button>
            <button
              className={`w-full hover:bg-red-500 ${button}`}
              onClick={logout}>
              Logout
            </button>
            {paymentForm()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="container flex flex-col m-auto min-h-screen min-w-full px-4 py-6 items-center text-center  bg-clrMain  text-clrLight"
      id="WALLET-CONTAINER">
      <img
        className="w-2/6 max-w-sm mb-20"
        src={Images.private.logohead}
        alt=""
      />
      {/* <div className="m-2 items-center flex flex-col content-center items-borderline md:flex-row"></div> */}
      {renderNotConnectedWalletPage()}
      {renderConnectedWalletPage()}
    </div>
  )
}

export default Wallet
//NOT CONNECTED
// min-h-screen md
//
//
//
