import { atom, selector } from 'recoil';

import { SelectedBrick } from '@/types/selected-brick';

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
