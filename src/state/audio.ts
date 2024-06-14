import { atom, selector } from "recoil";

interface AudioState {
    audio: HTMLAudioElement | null;
    isPlaying: boolean;
}

export const audioState = atom<AudioState>({
    key: "audioState",
    default: {
        audio: new Audio('/music.mp3'),
        isPlaying: false,
    },
});

export const audioElementState = selector<HTMLAudioElement | null>({
    key: "audioElementState",
    get: ({ get }) => {
        const state = get(audioState);
        return state.audio;
    },
    set: ({ set }, newValue) => {
        set(audioState, (prevState) => ({
            ...prevState,
            audio: newValue as HTMLAudioElement | null,
        }));
    },
});

export const isPlayingState = selector<boolean>({
    key: "isPlayingState",
    get: ({ get }) => {
        const state = get(audioState);
        return state.isPlaying;
    },
    set: ({ set }, newValue) => {
        set(audioState, (prevState) => ({
            ...prevState,
            isPlaying: newValue as boolean,
        }));
    },
});

