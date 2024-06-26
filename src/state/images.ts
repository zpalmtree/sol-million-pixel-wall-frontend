import { atom } from 'recoil';
import * as fabric from 'fabric';

export const addedImagesState = atom<fabric.Image[]>({
    key: 'addedImages',
    default: [],
    dangerouslyAllowMutability: true,
});

export const startingPixelWallImageState = atom<string | undefined>({
    key: 'startingPixelWallImage',
    default: undefined,
});
