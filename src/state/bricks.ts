import { atom, selector } from 'recoil';

import { SelectedBrick } from '@/types/selected-brick';
import { BrickInfo, OwnedBrick } from '@/types/brick';

export const selectedBricksState = atom<SelectedBrick[]>({
    key: 'selectedBricks',
    default: [],
});

export const selectedBrickNamesSetState = selector<Set<string>>({
    key: 'selectedBrickNamesSet',
    get: ({ get }) => {
        const selectedBricks = get(selectedBricksState);
        const nameSet = new Set(selectedBricks.map(brick => brick.name));
        return nameSet;
    },
});

export const startingBricksState = atom<BrickInfo[]>({
    key: 'startingBricks',
    default: [],
});

export const ownedBricksState = atom<OwnedBrick[]>({
    key: 'ownedBricks',
    default: [],
});

export const ownedBricksWithArtState = selector<OwnedBrick[]>({
    key: 'ownedBricksWithArt',
    get: ({ get }) => {
        const ownedBricks = get(ownedBricksState);
        return ownedBricks.filter((b) => b.hasImage);
    },
});

export const ownedBricksWithoutArtState = selector<OwnedBrick[]>({
    key: 'ownedBricksWithoutArt',
    get: ({ get }) => {
        const ownedBricks = get(ownedBricksState);
        return ownedBricks.filter((b) => !b.hasImage);
    },
});
