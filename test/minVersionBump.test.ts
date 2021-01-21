import { minVersionBump, CollectibleInfo, VersionUpgrade } from '../src';
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
  metadataBaseURI: 'ipfs://blah.io/',
  logoURI: 'ipfs://blah',
  symbol: 'defg',
  name: 'token b',
  tags: ['token', 'other'],
};
describe('#minVersionBump', () => {
  it('empty', () => {
    expect(minVersionBump([], [])).toBe(VersionUpgrade.NONE);
  });
  it('patch for tag changes only', () => {
    expect(minVersionBump([tokenA], [tokenAChangedTags])).toBe(
      VersionUpgrade.PATCH
    );
  });
  it('patch for name/metadata changes', () => {
    expect(minVersionBump([tokenA], [tokenAChangedNameMetadata])).toBe(
      VersionUpgrade.PATCH
    );
  });
  it('major for remove', () => {
    expect(minVersionBump([tokenA], [])).toBe(VersionUpgrade.MAJOR);
  });
  it('minor for add', () => {
    expect(minVersionBump([], [tokenA])).toBe(VersionUpgrade.MINOR);
  });
  it('major for add/remove', () => {
    expect(minVersionBump([tokenB], [tokenA])).toBe(VersionUpgrade.MAJOR);
  });
});
