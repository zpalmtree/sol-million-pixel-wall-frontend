import React  from 'react';

export interface SwitchProps {
    left?: string;
    right?: string;
    onChange: (isRight: boolean) => void;
    isRight: boolean;
}

export function Switch(props: SwitchProps) {
    const {
        left,
        right,
        onChange,
        isRight,
    } = props;

    React.useEffect(() => {
        if (onChange) {
            onChange(isRight);
        }
    }, [
        isRight,
        onChange,
    ]);

    if (!left && !right) {
        return (
            <div className='flex items-center justify-center'>
                <div
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 ${isRight ? 'bg-secondary' : 'bg-neutral-700'} cursor-pointer`}
                    onClick={() => onChange(!isRight)}
                >
                    <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${isRight ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center'>
            <span className={`${isRight ? 'text-[#919191]' : 'text-white'} text-base`}>
                {left}
            </span>

            <div
                className={`mx-2 w-10 h-5 flex items-center rounded-full p-0.5 ${isRight ? 'bg-primary' : 'bg-neutral-700'} cursor-pointer`}
                onClick={() => onChange(!isRight)}
            >
                <div
                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform duration-300 ease-in-out ${isRight ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </div>

            <span className={`${isRight ? 'text-white' : 'text-[#919191]'} text-base`}>
                {right}
            </span>
        </div>
    );
}
