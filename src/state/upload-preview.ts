import { atom } from 'recoil';
import { Canvas } from 'fabric';

export const uploadPreviewCanvasState = atom<Canvas | undefined>({
    key: 'uploadPreviewCanvas',
    default: undefined,
    dangerouslyAllowMutability: true,
});

export const uploadPreviewImageState = atom<string | undefined>({
    key: 'uploadPreviewImage',
    default: undefined,
});
