import { atom } from 'recoil';

import {
    PRICE_PER_BRICK,
    PRICE_PER_BRICK_EDIT,
} from '@/constants';

export const purchaseTransactionState = atom<string | undefined>({
    key: 'purchaseTransaction',
    default: undefined,
});

export const pricePerBrickState = atom<number>({
    key: 'pricePerBrick',
    default: PRICE_PER_BRICK,
});

export const pricePerBrickEditState = atom<number>({
    key: 'pricePerBrickEdit',
    default: PRICE_PER_BRICK_EDIT,
});
