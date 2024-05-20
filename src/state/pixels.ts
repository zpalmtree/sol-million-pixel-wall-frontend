import { atom, selector } from 'recoil';

import { Pixel } from '@/types/pixel';

export const selectedPixelsState = atom<Pixel[]>({
    key: 'selectedPixels',
    default: [],
});

export const selectedPixelNamesSetState = selector<Set<string>>({
    key: 'selectedPixelNamesSet',
    get: ({ get }) => {
        const selectedPixels = get(selectedPixelsState);
        const nameSet = new Set(selectedPixels.map(pixel => pixel.name));
        return nameSet;
    },
});
