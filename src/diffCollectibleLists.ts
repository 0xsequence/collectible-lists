import { CollectibleInfo } from './types';

export type CollectibleInfoChangeKey = Exclude<
  keyof CollectibleInfo,
  'address' | 'chainId'
>;
export type CollectibleInfoChanges = Array<CollectibleInfoChangeKey>;

/**
 * compares two collectible info key values
 * this subset of full deep equal functionality does not work on objects or object arrays
 * @param a comparison item a
 * @param b comparison item b
 */
function compareCollectibleInfoProperty(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.every((el, i) => b[i] === el);
  }
  return false;
}

/**
 * Differences between a base list and an updated list.
 */
export interface CollectibleListDiff {
  /**
   * Tokens from updated with chainId/address not present in base list
   */
  readonly added: CollectibleInfo[];
  /**
   * Tokens from base with chainId/address not present in the updated list
   */
  readonly removed: CollectibleInfo[];
  /**
   * The token info that changed
   */
  readonly changed: {
    [chainId: number]: {
      [address: string]: CollectibleInfoChanges;
    };
  };
}

/**
 * Computes the diff of a collectible list where the first argument is the base and the second argument is the updated list.
 * @param base base list
 * @param update updated list
 */
export function diffCollectibleLists(
  base: CollectibleInfo[],
  update: CollectibleInfo[]
): CollectibleListDiff {
  const indexedBase = base.reduce<{
    [chainId: number]: { [address: string]: CollectibleInfo };
  }>((memo, tokenInfo) => {
    if (!memo[tokenInfo.chainId]) memo[tokenInfo.chainId] = {};
    memo[tokenInfo.chainId][tokenInfo.address] = tokenInfo;
    return memo;
  }, {});

  const newListUpdates = update.reduce<{
    added: CollectibleInfo[];
    changed: {
      [chainId: number]: {
        [address: string]: CollectibleInfoChanges;
      };
    };
    index: {
      [chainId: number]: {
        [address: string]: true;
      };
    };
  }>(
    (memo, tokenInfo) => {
      const baseToken = indexedBase[tokenInfo.chainId]?.[tokenInfo.address];
      if (!baseToken) {
        memo.added.push(tokenInfo);
      } else {
        const changes: CollectibleInfoChanges = Object.keys(tokenInfo)
          .filter(
            (s): s is CollectibleInfoChangeKey =>
              s !== 'address' && s !== 'chainId'
          )
          .filter(s => {
            return !compareCollectibleInfoProperty(tokenInfo[s], baseToken[s]);
          });
        if (changes.length > 0) {
          if (!memo.changed[tokenInfo.chainId]) {
            memo.changed[tokenInfo.chainId] = {};
          }
          memo.changed[tokenInfo.chainId][tokenInfo.address] = changes;
        }
      }

      if (!memo.index[tokenInfo.chainId]) {
        memo.index[tokenInfo.chainId] = {
          [tokenInfo.address]: true,
        };
      } else {
        memo.index[tokenInfo.chainId][tokenInfo.address] = true;
      }

      return memo;
    },
    { added: [], changed: {}, index: {} }
  );

  const removed = base.reduce<CollectibleInfo[]>((list, curr) => {
    if (
      !newListUpdates.index[curr.chainId] ||
      !newListUpdates.index[curr.chainId][curr.address]
    ) {
      list.push(curr);
    }
    return list;
  }, []);

  return {
    added: newListUpdates.added,
    changed: newListUpdates.changed,
    removed,
  };
}
