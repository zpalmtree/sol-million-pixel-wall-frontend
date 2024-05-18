import { atom } from 'recoil';

export const selectedColorState = atom<string>({
    key: 'selectedColor',
    default: 'white',
});
