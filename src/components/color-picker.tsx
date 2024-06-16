import * as React from 'react';
import { useRecoilState } from 'recoil';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { selectedColorState } from '@/state/color-picker';

const colors = [
  "#FF6B6B",
  "#FFC107",
  "#4CAF50",
  "#2196F3",
  "#9B59B6",
  "#E91E63",
  "#673AB7",
  "#03A9F4",
  "#8BC34A",
  "#FF9800",
  "#795548",
  "#607D8B",
  "#F44336",
  "#9E9E9E",
  "#000000",
  "#ffffff"
];

const colorSet = new Set(colors);

export function ColorPicker() {
    const [ selectedColor, setSelectedColor ] = useRecoilState(selectedColorState);

    const onCustomColorChanged = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColor(e.target.value);
    }, [
        setSelectedColor,
    ]);

    const colorElements = React.useMemo(() => {
        return colors.map((c) => {
            const isSelected = c === selectedColor;

            const bgColor = c === '#ffffff'
                ? 'border-blue-800'
                : 'border-white';

            return (
                <div
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                        backgroundColor: c,
                    }}
                    className={`w-7 h-7 rounded-md cursor-pointer hover:ring-2 ${isSelected ? `border ${bgColor}` : ''}`}
                />
            );
        });
    }, [
        selectedColor,
        setSelectedColor,
    ]);

    return (
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-primary">
            <div className="grid grid-cols-4 gap-2">
                {colorElements}
            </div>
            <div className="mt-4 flex items-center justify-between gap-x-1">
                <Label
                    className="text-sm"
                    htmlFor="customColor"
                >
                    Custom Color
                </Label>
                <Input
                    className={`bg-transparent ${colorSet.has(selectedColor) ? 'border-none' : 'border-white'} h-[48px] w-[60px] -mr-2`}
                    id="customColor"
                    type="color"
                    onChange={onCustomColorChanged}
                />
            </div>
        </div>

    );
}
