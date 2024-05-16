import { atom } from 'recoil';

import { SelectedBrick } from '@/types/selected-brick';

export const selectedBricksState = atom<SelectedBrick[]>({
    key: 'selectedBricks',
    default: [],
});
