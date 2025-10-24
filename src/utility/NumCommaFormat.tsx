import { useState } from 'react';

const useNumberCommaFormatter = (indianStyle = false): ((num: number) => string) => {
    const formatNumber = (num: number): string => {
        if (indianStyle) {
            return num.toLocaleString('en-IN');
        }
        if (Math.abs(num) < 1000) {
            return num.toString();
        }
        const formattedNum = Math.abs(num) >= 1.0e+9
            ? (Math.abs(num) / 1.0e+9).toFixed(1) + 'b'
            : Math.abs(num) >= 1.0e+6
                ? (Math.abs(num) / 1.0e+6).toFixed(1) + 'm'
                : Math.abs(num) >= 1.0e+3
                    ? (Math.abs(num) / 1.0e+3).toFixed(1) + 'k'
                    : num.toString(); // Return as string if not formatted
        return num < 0 ? '-' + formattedNum : formattedNum;
    };

    return formatNumber;
};

export default useNumberCommaFormatter;