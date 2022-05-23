import { clusterApiUrl, ConfirmOptions } from '@solana/web3.js';

export const MAINNET_URL = 'https://solana-api.projectserum.com';
export const MAINNET_BACKUP_URL = 'https://solana-api.projectserum.com/';

export type ClusterName = 'mainnet-beta' | 'mainnet-beta-backup' | 'devnet' | 'testnet' | 'localnet';
export type Commitment = 'processed' | 'confirmed';

export interface Cluster {
  name: ClusterName;
  apiUrl: string;
  label: string;
  isDev: boolean;
}

export const CLUSTERS: Cluster[] = [
  {
    name: 'mainnet-beta',
    apiUrl: MAINNET_URL,
    label: 'MainNet',
    isDev: false,
  },
  {
    name: 'mainnet-beta-backup',
    apiUrl: MAINNET_BACKUP_URL,
    label: 'MainNet Backup',
    isDev: false,
  },
  {
    name: 'devnet',
    apiUrl: clusterApiUrl('devnet'),
    label: 'DevNet',
    isDev: true,
  },
  {
    name: 'testnet',
    apiUrl: clusterApiUrl('testnet'),
    label: 'TestNet',
    isDev: true,
  },
  {
    name: 'localnet',
    apiUrl: 'http://localhost:8899',
    label: 'Local',
    isDev: true,
  },
];

export function getCluster(name: ClusterName): Cluster {
  return CLUSTERS.find((c) => c.name === name)!;
}

export const OPTS: ConfirmOptions[] = [
    {
        commitment: 'processed'
    },
    {
        commitment: 'confirmed'
    },
];

export const defaultOpts = OPTS[0];
export const processedOpts = OPTS[0];
export const confirmedOpts = OPTS[1];