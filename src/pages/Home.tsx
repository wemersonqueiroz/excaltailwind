import React from "react"
import { StoreContext } from "../controllers/store"
import Images from "../images/Images"
import Videos from "../videos/videos"

export { default as Home } from "./Home"

function Home() {
  const {
    wallet: [wallet, setWallet],
    state: [state, setState],
    // isLoading: [isLoading, setIsLoading],
  } = React.useContext(StoreContext)

  return (
    <div className="container  flex flex-col px-4 py-6 items-center text-center w-screen bg-clrMain  text-clrLight   h:screen max-w-full md:h-full  md:text-left">
      <img className="w-2/6 max-w-sm" src={Images.private.logohead} alt="" />
      {/* TOP CONTAINER */}

      <div className="mt-6 flex flex-col items-center lg:flex-row">
        <div className="container px-4 py-6 ">
          <h1 className="mx-auto py-6 text-2xl">
            Decentralized Media
            {/* USE THIS TO PRINT WALLET ADDRESS */}
            {/* {wallet?.publicKey.toString()} */}
          </h1>

          <p>
            Excalibur is a Decentralised Broadcasting Network (DBN). We are made
            up of a community of people that create, validate and broadcast
            media. The network rewards participants for the work that they do.
            Their activities successfully add to the quality and to the size of
            the network and the code of the network programatically rewards them
            with Excalibur tokens. The quality of the network is measured by the
            extent to which people are motivated to pay for and share the
            content that they receive.
            <p>
              This is a Proof of Work (POW) system where the activities that
              build the community are recognized by the network and are paid
              for. Creation of good quality content and promotion of good
              quality content is key to achieving a high level of customer
              interaction. The more they like what they see, the more they will
              want to reward the creators and share with their friends.
            </p>
          </p>
        </div>
        <div>
          {/* <iframe
            className="w-full aspect-video"
            src={Videos.private.videomain}
            title="Main video "
            allow="accelerometer; clipboard-write encrypted-media; gyroscope; picture-in-picture"></iframe> */}
          <video
            title="Main"
            src={Videos.private.videomain}
            className="w-fit md:w-fit"
            controls
          />
        </div>
      </div>

      {/* MID CONTAINER */}
      <div className="mt-6 flex flex-col items-center lg:flex-row">
        <div className="container px-4 py-6 ">
          <h1 className="mx-auto py-6 text-2xl">Excalibur Broadcast</h1>

          <p>
            This is the page that allows the end user to consume the media. It
            is the Digital content along with opportunities for the consumer to
            pay, including a QR that they can scan with their mobile wallet, a
            wallet address that they can copy to their desktop based wallet and
            a link to the Excalibur wallet where they can create one if they
            don’t have one already.
          </p>
          <p>
            Each one of these pages will have a unique url that will consist of
            Excal.tv followed by ‘/‘ a number. The numbers will continue to
            count up for as long as the application is functioning.
          </p>
          <p>
            There will need to be a process by which the url of the broadcast
            page for each piece of digital media is linked to the file that has
            been uploaded on the Excalibur DRM page and held in the S3 bucket.
            Also the QR code and other payment information on the Broadcast page
            should be linked to the public key address created on the DRM page.
          </p>
        </div>
        <div>
          <video
            title="Main"
            src={Videos.private.broadcast}
            className="w-fit md:w-fit"
            controls
          />
        </div>
      </div>
      {/* BOTTON CONTAINER */}
      <div className="mt-6 flex flex-col items-center lg:flex-row">
        <div className="container px-4 py-6 ">
          <h1 className="mx-auto py-6 text-2xl">The Excalibur Wallet</h1>
          <p>
            The web based crypto wallet that uses a digital file as the source
            of unique data for SHA256 encryption into the public/private key. An
            explainer video that describes how to use the wallet can be embedded
            into the page. Further development of the wallet is anticipated in
            order that we can include Excalibur SPL token.
          </p>
        </div>
        <div>
          <video
            title="Main"
            src={Videos.private.wallet}
            className="w-fit md:w-fit"
            controls
          />
        </div>
      </div>
    </div>
  )
}

export default Home
