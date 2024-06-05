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

export const purchasedBricksState = selector<BrickInfo[]>({
    key: 'purchasedBricks',
    get: ({ get }) => {
        const startingBricks = get(startingBricksState);
        return startingBricks.filter((b) => b.purchased);
    },
});

export const purchasedBricksSetState = selector<Set<string>>({
    key: 'purchasedBricksSet',
    get: ({ get }) => {
        const purchasedBricks = get(purchasedBricksState);
        return new Set(purchasedBricks.map((b) => b.name));
    },
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

export const selectedOwnedBricksWithArtState = atom<SelectedBrick[]>({
    key: 'selectedOwnedBricksWithArt',
    default: [],
});

export const selectedOwnedBricksWithoutArtState = atom<SelectedBrick[]>({
    key: 'selectedOwnedBricksWithoutArt',
    default: [],
});

export const selectedOwnedBricksWithArtSetState = selector<Set<string>>({
    key: 'selectedOwnedBricksWithArtSetState',
    get: ({ get }) => {
        const selectedBricks = get(selectedOwnedBricksWithArtState);
        const nameSet = new Set(selectedBricks.map(brick => brick.name));
        return nameSet;
    },
});

export const selectedOwnedBricksWithoutArtSetState = selector<Set<string>>({
    key: 'selectedOwnedBricksWithoutArtSetState',
    get: ({ get }) => {
        const selectedBricks = get(selectedOwnedBricksWithoutArtState);
        const nameSet = new Set(selectedBricks.map(brick => brick.name));
        return nameSet;
    },
});
