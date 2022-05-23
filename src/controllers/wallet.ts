import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  ConfirmOptions,
} from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  getCluster,
  ClusterName,
  Cluster,
  defaultOpts,
} from "../models/cluster"
import * as crypto from "crypto-js"
import { AnchorProvider } from "@project-serum/anchor"
import { NodeWallet } from "@metaplex/js"

export type LoginResult = "incorrect-password" | "no-stored-wallet" | "success"

export interface Vault {
  seed: string
}

export class WalletService {
  provider: AnchorProvider | undefined

  get clusterName(): ClusterName {
    const name = localStorage.getItem("cluster") as ClusterName
    if (!name) {
      this.clusterName = "mainnet-beta"
      return this.clusterName
    }
    return name
  }

  set clusterName(name: ClusterName) {
    localStorage.setItem("cluster", name)
  }

  get cluster(): Cluster {
    return getCluster(this.clusterName)
  }

  get isDevCluster(): boolean {
    return this.cluster.isDev
  }

  constructor(
    provider: AnchorProvider | undefined,
    byteBuffer?: ArrayBuffer,
    password?: string,
    keypair?: Keypair,
    clusterName: ClusterName = "mainnet-beta",
    opts?: ConfirmOptions
  ) {
    this.provider = provider
    this.clusterName = clusterName

    if (byteBuffer) {
      this.provider = new AnchorProvider(
        new Connection(this.cluster.apiUrl, "confirmed"),
        new NodeWallet(WalletService.keypairFromFile(byteBuffer, password)),
        opts ?? defaultOpts
      )
    }

    if (keypair) {
      this.provider = new AnchorProvider(
        new Connection(this.cluster.apiUrl, "confirmed"),
        new NodeWallet(keypair),
        opts ?? defaultOpts
      )
    }
  }

  async init() {
    const seed = localStorage.getItem("seed")
    if (seed) {
      this.provider = new AnchorProvider(
        new Connection(this.cluster.apiUrl, "confirmed"),
        new NodeWallet(WalletService.getKeypairFromSeed(seed)),
        defaultOpts
      )
    }
  }

  static keypairFromFile(byteBuffer: ArrayBuffer, password?: string) {
    const seed = WalletService.getSeedFromByteBuffer(byteBuffer, password)
    if (password) {
      const vault: Vault = { seed }
      const vaultEncoded = crypto.enc.Utf8.parse(JSON.stringify(vault))
      const encrypted = crypto.AES.encrypt(vaultEncoded, password).toString()
      localStorage.setItem("vault", encrypted)
    } else {
      localStorage.setItem("seed", seed)
    }
    return WalletService.getKeypairFromSeed(seed)
  }

  isPasswordProtected() {
    return !!localStorage.getItem("vault")
  }

  isLoggedIn() {
    return !!this.provider
  }

  hasStoredWallet() {
    return !!localStorage.getItem("vault")
  }

  get publicKey() {
    return this.provider?.wallet.publicKey
  }

  async getSPLTokens(otherPublicKey: string) {
    const publicKey = new PublicKey(otherPublicKey)
    const connection = new Connection(this.cluster.apiUrl, "confirmed")
    return await connection.getTokenAccountsByOwner(publicKey, {
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
  }

  async getBalance(otherPublicKey: string): Promise<number | undefined> {
    const publicKey = new PublicKey(otherPublicKey)
    const connection = new Connection(this.cluster.apiUrl, "confirmed")
    return await connection.getBalance(publicKey!)
  }

  async getYourBalance(): Promise<number | undefined> {
    const connection = new Connection(this.cluster.apiUrl, "confirmed")
    return await connection.getBalance(this.provider?.wallet.publicKey!)
  }

  async airDrop(sol: number) {
    const connection = new Connection(this.cluster.apiUrl, "confirmed")
    if (!this.isLoggedIn()) {
      throw new Error("not logged in")
    }
    const lamports = sol * LAMPORTS_PER_SOL
    const hash = await connection.requestAirdrop(
      this.provider?.wallet.publicKey ?? PublicKey.default,
      lamports
    )
    await connection.confirmTransaction(hash)
  }

  async airDropOtherWallet(sol: number, otherPublicKey: string) {
    const publicKey = new PublicKey(otherPublicKey)
    const connection = new Connection(this.cluster.apiUrl, "confirmed")
    const lamports = sol * LAMPORTS_PER_SOL
    const hash = await connection.requestAirdrop(publicKey, lamports)
    await connection.confirmTransaction(hash)
  }

  static walletFromKeypair(
    keypair: Keypair,
    clusterName: ClusterName = "mainnet-beta",
    opts?: ConfirmOptions
  ) {
    return new WalletService(
      undefined,
      undefined,
      undefined,
      keypair,
      clusterName,
      opts
    )
  }

  static createBurnerWallet(
    clusterName: ClusterName = "mainnet-beta",
    opts?: ConfirmOptions
  ) {
    return WalletService.walletFromKeypair(
      Keypair.generate(),
      clusterName,
      opts
    )
  }

  static getKeypairFromSeed(seed: string): Keypair {
    const array = new Uint8Array(
      atob(seed)
        .split("")
        .map(char => char.charCodeAt(0))
    )
    return Keypair.fromSeed(array)
  }

  static getSeedFromByteBuffer(
    arrayBuffer: ArrayBuffer,
    password?: string
  ): string {
    const bytesBase64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
    const base64 = password ? password + ":" + bytesBase64 : bytesBase64

    return crypto.SHA256(base64).toString(crypto.enc.Base64)
  }

  async send(recipientPublicKey: string, lamports: number) {
    if (!this.isLoggedIn()) {
      throw new Error("Not logged in")
    }
    const toPubkey = new PublicKey(recipientPublicKey)
    const instructions = SystemProgram.transfer({
      fromPubkey: this.provider?.wallet.publicKey!,
      toPubkey,
      lamports,
    })

    // Maybe adding something to a Transaction could be interesting ?
    const transaction = new Transaction()
    transaction.add(instructions)

    if ((this.provider as any).send) {
      return await (this.provider as any)?.send(transaction)
    }

    return await this.provider?.sendAndConfirm(transaction)
  }
}
