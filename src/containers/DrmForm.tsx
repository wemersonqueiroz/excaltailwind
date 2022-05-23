import React, { useContext, useEffect, useState } from "react"
import DrmArtist from "./DrmArtist"
import { ArtistParam, MAX_PERCENT, percentToPoints } from "../controllers/drm"
import { web3, BN } from "@project-serum/anchor"

const button: string =
  "text-md bg-clrSecondary px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

const form: string =
  "p-2 text-xs text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-lg"

const loginForm: string =
  "p-2 text-xs w-full text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

export interface DRMEntry {
  key: string
  wallet: string
  name: string
  role: string
  percent: number
}

// -------------------------DRM FORM TO ADD ARTISTS
function DrmForm(props: any) {
  const startingAddress = props.startingAddress as string
  const [artists, setArtists] = useState<DRMEntry[]>([
    CreateArtistEntry(startingAddress),
  ])

  // const exampleArtist = {
  //   wallet: web3.Keypair.generate().publicKey,
  //   percentage: percentToPoints(0.55), //55% - Dont worry about the BN
  //   name: "Tod",
  //   role: "Filmer",
  // } as ArtistParam

  function AddArtist() {
    setArtists([...artists, CreateArtistEntry()])
  }

  function RemoveArtist(key: string | undefined) {
    if (!key) return
    if (artists.length > 0) {
      setArtists([
        ...artists.filter(function (value, index) {
          return value.key !== key
        }),
      ])
    }
  }

  function onWalletChange(key: string, wallet: string) {
    if (!key) return

    for (const entry of artists) {
      if (entry.key === key) {
        entry.wallet = wallet
      }
    }
  }

  function onNameChange(key: string, name: string) {
    if (!key) return
    for (const entry of artists) {
      if (entry.key === key) {
        entry.name = name
      }
    }
  }

  function onRoleChange(key: string, role: string) {
    if (!key) return
    for (const entry of artists) {
      if (entry.key === key) {
        entry.role = role
      }
    }
  }

  function onPercentChange(key: string, percent: number) {
    if (!key) return
    for (const entry of artists) {
      if (entry.key === key) {
        entry.percent = percentToPoints(percent / 100)
      }
    }
  }

  function CreateArtistEntry(wallet?: string) {
    return {
      key: web3.Keypair.generate().publicKey.toString(),
      wallet: wallet ?? "",
      name: "",
      role: "",
      percent: percentToPoints(1),
    } as DRMEntry
  }

  const renderArtists = () => {
    const lines = []
    let index = 0
    for (const entry of artists) {
      lines.push(
        <DrmArtist
          key={entry.key}
          shouldHaveTrashCan={index > 0}
          onDelete={() => {
            RemoveArtist(entry.key)
          }}
          startingWallet={entry.wallet}
          onWalletChange={(wallet: string) => {
            onWalletChange(entry.key, wallet)
          }}
          onNameChange={(name: string) => {
            onNameChange(entry.key, name)
          }}
          onRoleChange={(role: string) => {
            onRoleChange(entry.key, role)
          }}
          onPercentChange={(percent: number) => {
            onPercentChange(entry.key, percent)
          }}
        />
      )
      index = lines.length
    }

    return lines
  }

  const isLoading = props.isLoading as boolean
  const onSubmit = props.onSubmit as (artists: ArtistParam[]) => void
  const submitForm = () => {
    const output = [] as ArtistParam[]

    for (const entry of artists) {
      output.push({
        wallet: new web3.PublicKey(entry.wallet),
        percentage: entry.percent,
        name: entry.name,
        role: entry.role,
      })
    }

    onSubmit(output)
  }

  return (
    <div
      className="container flex flex-col  px-4 py-6 items-center text-center w-screen bg-clrMain   text-clrLight md:max-w-full "
      id="DRM-FORM">
      <div className="h-auto " id="DRM-ARTISTS">
        {renderArtists()}

        <div className="items-center flex flex-row justify-center ">
          <div className="space-x-6">
            <button type="submit" className={button} onClick={AddArtist}>
              Add Artist
            </button>
            <button onClick={submitForm} type="submit" className={button}>
              Copyright
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrmForm

//--------- NAME + ROLE TO BE ADDED ON THE FORM []
//---------
