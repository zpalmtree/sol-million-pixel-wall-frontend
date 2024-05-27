import { atom } from 'recoil';

export const uploadTabEnabledState = atom<boolean>({
    key: 'uploadTabEnabled',
    default: false,
});
