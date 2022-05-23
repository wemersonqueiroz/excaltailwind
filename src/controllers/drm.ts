import * as anchor from "@project-serum/anchor"
import { web3, BN } from "@project-serum/anchor"

// --------- DEFINES -----------------------------------------
export const DRM_ID = new web3.PublicKey(
  "GoD4Ls1MLFvaEYwvm9n5ho4Xj7bYv4rZpB4LqNQ5xKfR"
)

export const MAX_PERCENT = 100 * 100

export interface Artist {
  wallet: web3.PublicKey
  percentage: BN
  name: string
  role: string
  lamportsEarned: BN
  lamportsDistributed: BN
}

// Curator now needs a URL to create
export interface Curator {
  artwork: web3.PublicKey
  creationDate: BN
  name: string
  url: string
  auth: web3.PublicKey
  curator: web3.PublicKey
  curatorBump: number
  mutable: boolean
  lamportsTally: BN
  crankTally: BN
  poolLamports: BN
  artists: Artist[]
}

export interface CreateCuratorParams {
  artistCount: number
  curatorBump?: number
  name?: string
  url?: string
}

export interface ArtistParam {
  wallet: web3.PublicKey
  percentage: number
  name?: string
  role?: string
}

export interface LoadArtistParams {
  percentage: BN
  name?: string
  role?: string
}

export interface PullFromPoolParams {
  lamports: BN
}

export interface ComplimentParams {
  lamports: BN
}

// --------- PROVIDER -----------------------------------------
/**
 * Returns the provder to interface with the DRM program
 */
export class DRMProvider {
  provider: anchor.AnchorProvider
  program: anchor.Program<anchor.Idl>
  owner: anchor.web3.PublicKey

  // Call init
  private constructor(
    provider: anchor.AnchorProvider,
    program: anchor.Program<anchor.Idl>,
    owner: anchor.web3.PublicKey
  ) {
    this.provider = provider
    this.program = program
    this.owner = owner
  }

  static init = async (
    owner: anchor.web3.PublicKey,
    provider: anchor.AnchorProvider,
    program?: anchor.Program<anchor.Idl>
  ) => {
    return new DRMProvider(
      provider,
      program ?? (await DRMProvider._getDRMProgram(provider)),
      owner
    )
  }

  static _getDRMProgram = async (provider: anchor.Provider) => {
    const idl = await anchor.Program.fetchIdl(DRM_ID, provider)
    return new anchor.Program<anchor.Idl>(idl as any, DRM_ID, provider)
  }
}

// --------- FUNCTIONS -----------------------------------------
/**
 * Returns the Curator account for an art piece from the art piece
 */
export const getCuratorAccountFromArtwork = async (
  drmProvider: DRMProvider,
  artworkKey: web3.PublicKey | web3.Keypair
) => {
  let artKey = (artworkKey as web3.Keypair).publicKey
  if (!artKey) {
    artKey = artworkKey as web3.PublicKey
  }

  const [curatorKey, curatorBump] = await findCuratorAccount(
    drmProvider,
    artKey
  )

  return await getCuratorAccount(drmProvider, curatorKey, true)
}

/**
 * Returns the Curator account for an art piece
 */
export const getCuratorAccount = async (
  drmProvider: DRMProvider,
  curatorKey: web3.PublicKey | Curator,
  shouldUpdate?: boolean
) => {
  if ((curatorKey as Curator).artwork) {
    if (shouldUpdate) {
      return (await drmProvider.program.account.curator.fetch(
        (curatorKey as Curator).curator
      )) as any as Curator
    } else {
      return (await curatorKey) as Curator
    }
  }
  return (await drmProvider.program.account.curator.fetch(
    curatorKey as web3.PublicKey
  )) as any as Curator
}

/**
 * Gets the Escrow account from the curator account
 */
export const findEscrowAccount = async (
  drmProvider: DRMProvider,
  curatorKey: web3.PublicKey
) => {
  return await web3.PublicKey.findProgramAddress(
    [curatorKey.toBuffer()],
    drmProvider.program.programId
  )
}

/**
 * Gets the Curator Account from artwork key
 */
export const findCuratorAccount = async (
  drmProvider: DRMProvider,
  artworkKey: web3.PublicKey
) => {
  return await web3.PublicKey.findProgramAddress(
    [artworkKey.toBuffer()],
    drmProvider.program.programId
  )
}

/**
 * This macro function will create the drm for a
 * Anyone can call this function
 */
const runDRMCommand = async (
  drmProvider: DRMProvider,
  curatorKey: anchor.web3.PublicKey,
  instructions: anchor.web3.TransactionInstruction[]
) => {
  try {
    const tx = new web3.Transaction()
    for (const instruction of instructions) {
      tx.add(instruction)
    }
    await drmProvider.provider.sendAndConfirm(tx)
    return getCuratorAccount(drmProvider, curatorKey, true)
  } catch (error) {
    throw new Error("TX Failed " + error)
  }

  throw new Error("TX Failed")
}

/**
 * This macro function will create the drm for a
 * Anyone can call this function
 */
export const createDRM = async (
  drmProvider: DRMProvider,
  artworkKeypair: web3.Keypair,
  artists: ArtistParam[],
  artworkURL?: string
) => {
  if (artists.length === 0) {
    throw new Error("Need at least 1 artist")
  }

  const tx = new web3.Transaction()

  const [curator, curatorBump] = await findCuratorAccount(
    drmProvider,
    artworkKeypair.publicKey
  )

  tx.add(
    await createCuratorInstruction(drmProvider, artworkKeypair, {
      artistCount: artists.length,
      url: artworkURL,
    })
  )

  for (const artist of artists) {
    const artistParams: LoadArtistParams = {
      percentage: new BN(artist.percentage),
      name: artist.name ?? "",
      role: artist.role ?? "",
    }

    tx.add(
      await createLoadArtistInstruction(
        drmProvider,
        artworkKeypair,
        curator,
        artist.wallet,
        artistParams
      )
    )
  }

  tx.add(
    await createSignAccountInstruction(drmProvider, artworkKeypair, curator)
  )

  await drmProvider.provider.sendAndConfirm(tx)

  return await getCuratorAccount(drmProvider, curator, true)
}

/**
 * This macro function will create the curator account for a piece of art
 * Anyone can call this function
 */
export const createCuratorAccount = async (
  drmProvider: DRMProvider,
  artworkKeypair: web3.Keypair,
  artists: ArtistParam[]
) => {
  if (artists.length === 0) {
    throw new Error("Need at least 1 artist")
  }

  const [curator, curatorBump] = await findCuratorAccount(
    drmProvider,
    artworkKeypair.publicKey
  )

  let curatorAccount = await runDRMCommand(drmProvider, curator, [
    await createCuratorInstruction(drmProvider, artworkKeypair, {
      artistCount: artists.length,
    }),
  ])

  for (const artist of artists) {
    const artistParams: LoadArtistParams = {
      percentage: new BN(artist.percentage),
      name: artist.name ?? "",
      role: artist.role ?? "",
    }
    curatorAccount = await runDRMCommand(drmProvider, curatorAccount.curator, [
      await createLoadArtistInstruction(
        drmProvider,
        artworkKeypair,
        curatorAccount.curator,
        artist.wallet,
        artistParams
      ),
    ])
  }

  curatorAccount = await runDRMCommand(drmProvider, curatorAccount.curator, [
    await createSignAccountInstruction(
      drmProvider,
      artworkKeypair,
      curatorAccount.curator
    ),
  ])

  return await getCuratorAccount(drmProvider, curatorAccount, true)
}

/**
 * This macro function will pull from the curator pool
 * Anyone can call this function
 */
export const pullFromPool = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  lamports?: number | BN
) => {
  let curatorAccount = await getCuratorAccount(drmProvider, curator)

  curatorAccount = await runDRMCommand(drmProvider, curatorAccount.curator, [
    await createPullFromPoolInstruction(
      drmProvider,
      curatorAccount,
      new BN(lamports ?? curatorAccount.poolLamports)
    ),
  ])

  return await getCuratorAccount(drmProvider, curator, true)
}

/**
 * This macro function will pay into the artwork
 * Anyone can call this function
 */
export const compliment = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  lamports: number | BN
) => {
  let curatorAccount = await getCuratorAccount(drmProvider, curator)

  curatorAccount = await runDRMCommand(drmProvider, curatorAccount.curator, [
    await createComplimentInstruction(
      drmProvider,
      curatorAccount,
      new BN(lamports)
    ),
  ])

  return await getCuratorAccount(drmProvider, curator, true)
}

/**
 * This macro function will crank Escrow to distrubte earnings
 * Anyone can call this function
 */
export const crank = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  times?: number
) => {
  let curatorAccount = await getCuratorAccount(drmProvider, curator)

  let loops = curatorAccount.artists.length
  if (times) loops = times

  for (let i = 0; i < loops; i++) {
    curatorAccount = await runDRMCommand(drmProvider, curatorAccount.curator, [
      await createCrankInstruction(drmProvider, curatorAccount),
    ])
  }

  return await getCuratorAccount(drmProvider, curator, true)
}

// ------------------- Instructions ---------------------
/**
 * This instruction loads in an artists for the work
 * Needs to be executed
 */
export const createLoadArtistInstruction = async (
  drmProvider: DRMProvider,
  artworkKeypair: web3.Keypair,
  curator: web3.PublicKey,
  wallet: web3.PublicKey,
  params: LoadArtistParams
) => {
  return drmProvider.program.instruction.loadArtist(params, {
    accounts: {
      curator,
      artist: wallet,
      auth: drmProvider.owner,
      artwork: artworkKeypair.publicKey,
    },
    signers: [artworkKeypair],
    instructions: [],
  })
}

/**
 * This instruction seals the DRM contract, cannot be altered after
 * Needs to be executed
 */
export const createSignAccountInstruction = async (
  drmProvider: DRMProvider,
  artworkKeypair: web3.Keypair,
  curator: web3.PublicKey
) => {
  return drmProvider.program.instruction.signAccount({
    accounts: {
      curator,
      auth: drmProvider.owner,
      artwork: artworkKeypair.publicKey,
    },
    signers: [artworkKeypair],
    instructions: [],
  })
}

/**
 * This instruction churns out who gets paid what
 * Needs to be executed
 */
export const createCrankInstruction = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  artistOverride?: web3.PublicKey,
  indexOverride?: number
) => {
  const curatorAccount = await getCuratorAccount(drmProvider, curator)

  let artistWallet = curatorAccount.artists[indexOverride ?? 0].wallet

  for (const artist of curatorAccount.artists) {
    if (!artist.lamportsDistributed.eq(artist.lamportsEarned)) {
      artistWallet = artist.wallet
      break
    }
  }

  artistWallet = artistOverride ?? artistWallet

  return drmProvider.program.instruction.dispurseCrank({
    accounts: {
      curator: curatorAccount.curator,
      artistWallet,
    },
    signers: [],
    instructions: [],
  })
}

/**
 * This instruction pays the artists for the artwork
 * Needs to be executed
 * Cranks need to happen for the money to be distrabuted
 */
export const createPullFromPoolInstruction = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  amount: BN | number
) => {
  const curatorAccount = await getCuratorAccount(drmProvider, curator)

  const params: PullFromPoolParams = {
    lamports: new BN(amount),
  }

  return drmProvider.program.instruction.pullFromPool(params, {
    accounts: {
      curator: curatorAccount.curator,
      artist: drmProvider.owner,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [],
    instructions: [],
  })
}

/**
 * This instruction pays the artists for the artwork
 * Needs to be executed
 * Cranks need to happen for the money to be distrabuted
 */
export const createComplimentInstruction = async (
  drmProvider: DRMProvider,
  curator: web3.PublicKey | Curator,
  amount: BN | number
) => {
  const curatorAccount = await getCuratorAccount(drmProvider, curator)

  const params: PullFromPoolParams = {
    lamports: new BN(amount),
  }

  return drmProvider.program.instruction.compliment(params, {
    accounts: {
      curator: curatorAccount.curator,
      patron: drmProvider.owner,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [],
    instructions: [],
  })
}

/**
 * This instruction creates the curator account that will handle the DRM for it's specific artwork.
 * Needs to be executed
 */
export const createCuratorInstruction = async (
  drmProvider: DRMProvider,
  artworkKeypair: web3.Keypair,
  params: CreateCuratorParams
) => {
  const [curator, curatorBump] = await findCuratorAccount(
    drmProvider,
    artworkKeypair.publicKey
  )

  const createParams: CreateCuratorParams = {
    ...params,
    curatorBump,
    name: params.name ?? "YAL",
    url:
      params.url ??
      "https://shdw-drive.genesysgo.net/6P6WznKbJ2nEMCfrXZDQvipCgCSx45SXxjWMWvqfPtyJ/yal_website.html",
  }

  return drmProvider.program.instruction.createCurator(createParams, {
    accounts: {
      curator,
      artwork: artworkKeypair.publicKey,
      auth: drmProvider.owner,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [artworkKeypair],
    instructions: [],
  })
}

// ------------------- HELPERS ----------------------------
/**
 * 0.00 -> 1.00 % to percentage points
 */
export const percentToPoints = (percentage: number) => {
  if (percentage > 1) {
    throw new Error("Percentage must be between 0.00 and 1.00")
  }

  return Math.trunc(percentage * MAX_PERCENT)
}

/**
 * Creates a list of mock artists for testing
 */
export const createMockArtists = (
  drmProvider: DRMProvider,
  artistCount: number = 1,
  mockTotalPercent: number = 0.9
) => {
  const artists: ArtistParam[] = []
  const percentPerArtist = 1 / (artistCount + 1)
  for (let i = 0; i < artistCount; i++) {
    artists.push({
      wallet: anchor.web3.Keypair.generate().publicKey,
      percentage: percentToPoints(percentPerArtist * mockTotalPercent),
    })
  }

  artists.push(createMockAuthArtist(drmProvider, percentPerArtist))

  return artists
}

export const createMockAuthArtist = (
  drmProvider: DRMProvider,
  percentage: number = 0.1
) => {
  return {
    wallet: drmProvider.owner,
    percentage: percentToPoints(percentage),
  } as ArtistParam
}
