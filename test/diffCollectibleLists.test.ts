import { diffCollectibleLists, CollectibleInfo } from '../src';

const tokenA: CollectibleInfo = {
  chainId: 1,
  address: '0x0a',
  metadataBaseURI: 'https://test.io/',
  logoURI: 'ipfs://test',
  symbol: 'abcd',
  name: 'token a',
  tags: ['hello', 'world'],
};
const tokenAChangedNameMetadata: CollectibleInfo = {
  ...tokenA,
  name: 'blah',
  metadataBaseURI: 'https://test.io/metadata/latest/',
};
const tokenAChangedTags: CollectibleInfo = {
  ...tokenA,
  tags: ['hello', 'worlds'],
};
const tokenB: CollectibleInfo = {
  chainId: 1,
  address: '0x0b',
  logoURI: 'ipfs://blah',
  metadataBaseURI: 'ipfs://blah/',
  symbol: 'defg',
  name: 'token b',
  tags: ['token', 'other'],
};

describe('#diffCollectibleLists', () => {
  it('change address', () => {
    expect(diffCollectibleLists([tokenA], [tokenB])).toEqual({
      added: [tokenB],
      removed: [tokenA],
      changed: {},
    });
  });

  it('change name and metadata', () => {
    expect(
      diffCollectibleLists(
        [tokenB, tokenA],
        [tokenB, tokenAChangedNameMetadata]
      )
    ).toEqual({
      added: [],
      removed: [],
      changed: {
        1: {
          '0x0a': ['metadataBaseURI', 'name'],
        },
      },
    });
  });

  it('change tags', () => {
    expect(diffCollectibleLists([tokenB, tokenA], [tokenAChangedTags])).toEqual(
      {
        added: [],
        removed: [tokenB],
        changed: {
          1: {
            '0x0a': ['tags'],
          },
        },
      }
    );
  });
  it('remove tags', () => {
    expect(
      diffCollectibleLists([tokenB, tokenA], [{ ...tokenA, tags: undefined }])
    ).toEqual({
      added: [],
      removed: [tokenB],
      changed: {
        1: {
          '0x0a': ['tags'],
        },
      },
    });
  });
});
