import { atom } from 'recoil';

export const uploadTabEnabledState = atom<boolean>({
    key: 'uploadTabEnabled',
    default: false,
});

export const currentTabState = atom<string>({
    key: 'currentTab',
    default: 'create',
});
