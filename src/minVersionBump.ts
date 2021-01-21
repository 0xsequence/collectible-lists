import { diffCollectibleLists } from './diffCollectibleLists';
import { VersionUpgrade } from './getVersionUpgrade';
import { CollectibleInfo } from './types';

/**
 * Returns the minimum version bump for the given list
 * @param baseList the base list of collectibles
 * @param updatedList the updated list of collectibles
 */
export function minVersionBump(
  baseList: CollectibleInfo[],
  updatedList: CollectibleInfo[]
): VersionUpgrade {
  const diff = diffCollectibleLists(baseList, updatedList);
  if (diff.removed.length > 0) return VersionUpgrade.MAJOR;
  if (diff.added.length > 0) return VersionUpgrade.MINOR;
  if (Object.keys(diff.changed).length > 0) return VersionUpgrade.PATCH;
  return VersionUpgrade.NONE;
}
