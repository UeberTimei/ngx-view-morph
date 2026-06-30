import { MORPH_RADIUS_PROPERTIES } from '../../constants';
import { MorphCoverSnapshotStyle } from './morph.cover.types';

/** Confirms every expected radius property was captured before narrowing the type. */
export function assertIsRadiiRecord(
  value: Record<string, string>,
): asserts value is MorphCoverSnapshotStyle['radii'] {
  for (const property of MORPH_RADIUS_PROPERTIES) {
    if (!(property in value)) {
      throw new Error(`Missing radius property: ${property}`);
    }
  }
}
