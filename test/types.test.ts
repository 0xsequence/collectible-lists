import { CollectibleList } from '../src';
import exampleList from './schema/example.collectiblelist.json';

describe('types', () => {
  it('matches example schema', () => {
    // this is enough--typescript won't cast it unless it matches the interface
    const list: CollectibleList = exampleList;
    expect(list.name).toEqual('My Token List');
  });
});
