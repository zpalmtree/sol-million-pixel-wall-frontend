import { atom } from 'recoil';

export const purchaseTransactionState = atom<string | undefined>({
    key: 'purchaseTransaction',
    default: undefined,
});
