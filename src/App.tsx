import "./index.css"
import * as serviceWorker from "./serviceWorker"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import {
  Navigation,
  Footer,
  Home,
  Wallet,
  Drm,
  Player,
  PageNotFound,
} from "./pages"
import StoreProvider, { StoreContext } from "./controllers/store"
import React from "react"
import { State } from "./models/state"
import TestPlayer from "./pages/TestPlayer"

function App() {
  const {
    state: [state],
    // isLoading: [isLoading, setIsLoading],
  } = React.useContext(StoreContext)

  const renderConnectedWalletPage = () => {
    if (state === State.CONNECTED) {
      return <Route path="/connected" element={<Player />} />
    } else {
      return <></>
    }
  }

  return (
    <>
      <StoreProvider>
        <Router>
          <Navigation />
          <Routes>
            {/* {renderConnectedWalletPage()} */}
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/drm" element={<Drm />} />
            <Route path="/player" element={<Player />} />
            <Route path="/test/:id" element={<TestPlayer />} />
            <Route path="/404" element={<PageNotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </Router>
      </StoreProvider>
      <Footer />
    </>
  )
}

export default App
serviceWorker.unregister()
