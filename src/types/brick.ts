export interface Brick {
    x: number;

    y: number;

    name: string;
}

export interface BrickInfo extends Brick {
    purchased: boolean;
}

export interface OwnedBrick extends Brick {
    assetId: string;

    hasImage: boolean;
}
