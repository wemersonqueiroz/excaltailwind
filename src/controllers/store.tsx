import { DRMProvider, Curator } from "./drm"
import React from "react"
import {
  State,
  STARTING_STATE,
  STARTING_WALLET,
  STARTING_DRM,
  STARTING_DRM_URL,
  STARTING_CURATOR,
} from "../models/state"
import { WalletService } from "./wallet"

export interface Store {
  isLoading: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  state: [State, React.Dispatch<React.SetStateAction<State>>]
  wallet: [
    WalletService | undefined,
    React.Dispatch<React.SetStateAction<WalletService | undefined>>
  ]
  drm: [
    DRMProvider | undefined,
    React.Dispatch<React.SetStateAction<DRMProvider | undefined>>
  ]
  curator: [
    Curator | undefined,
    React.Dispatch<React.SetStateAction<Curator | undefined>>
  ]
  drmFileURL: [
    string | undefined,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ]
  logout: [() => void]
}

export const logoutOfStore = (store: Store) => {
  if (store.isLoading[1] !== null) store.isLoading[1](false)
  if (store.state[1] !== null) store.state[1](STARTING_STATE)
  if (store.wallet[1] !== null) store.wallet[1](STARTING_WALLET)
  if (store.drm[1] !== null) store.wallet[1](STARTING_DRM)
  if (store.curator[1] !== null) store.curator[1](STARTING_CURATOR)
  if (store.drmFileURL[1] !== null) store.drmFileURL[1](STARTING_DRM_URL)
}

export const NULL_STORE: Store = {
  isLoading: [false, null as any],
  state: [STARTING_STATE, null as any],
  wallet: [null as any, null as any],
  drm: [null as any, null as any],
  curator: [null as any, null as any],
  drmFileURL: [null as any, null as any],
  logout: [null as any],
}

export const StoreContext = React.createContext<Store>(NULL_STORE)

export default function StoreProvider({ children }: any) {
  // Is Loading
  const [isLoading, setIsLoading] = React.useState(false)

  // State
  const [state, setState] = React.useState(STARTING_STATE)

  // Wallet
  const [wallet, setWallet] = React.useState<WalletService | undefined>(
    STARTING_WALLET
  )

  // DRM
  const [drm, setDrm] = React.useState<DRMProvider | undefined>(STARTING_WALLET)

  // DRM
  const [curator, setCurator] = React.useState<Curator | undefined>(
    STARTING_CURATOR
  )

  // DRM URL
  const [drmFileURL, setDrmFileURL] = React.useState<string | undefined>(
    STARTING_WALLET
  )

  const store: Store = {
    isLoading: [isLoading, setIsLoading],
    state: [state, setState],
    wallet: [wallet, setWallet],
    drm: [drm, setDrm],
    curator: [curator, setCurator],
    drmFileURL: [drmFileURL, setDrmFileURL],
    logout: [
      () => {
        logoutOfStore(store)
      },
    ],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
