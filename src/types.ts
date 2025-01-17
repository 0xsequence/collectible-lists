export type SupportedStandard = 'erc721' | 'erc1155';

export interface CollectibleInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly standard: SupportedStandard;
  readonly symbol: string;
  readonly metadataBaseURI?: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: Object;
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export interface CollectibleList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly tokens: CollectibleInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
