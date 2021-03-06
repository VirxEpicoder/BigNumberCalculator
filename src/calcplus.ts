/*!
Copyright 2019-2020 Eric Michael Veilleux

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * This is the NodeJS/ModuleJS release of {@link https://github.com/VirxEC/CalcPlus CalcPlus} as seen on {@link https://www.virxcase.dev VirxEC Showcase}
 *
 * For more information about CalcPlus, go to {@link https://calcplus.virxcase.dev/ About CalcPlus on VirxEC Showcase}
 *
 * To preview this library online, go to {@link https://www.virxcase.dev/CP-P Preview CalcPlus on VirxEC Showcase}
 */
export function calcplus_info() {
    return {
        name: "CalcPlus Node TypeScript/Module JavaScript Library",
        major: 0,
        minor: 5,
        bugFix: 9
    };
}

const defaults: { powermode: boolean, maxNumberLength: number, maxDecimalLength: number } = {
    powermode: false, // Feel free to change this, or use togglePowerMode();
    maxNumberLength: String(Number.MAX_SAFE_INTEGER).length - 1, // Feel free to change this, or use setMaxIntegerLength(maxIntegerLength);
    maxDecimalLength: 10 // Feel free to change this, or use setMaxDecimalLength(maxDecimalLength);
};

var powermode: boolean = defaults.powermode,
    maxNumberLength: number = defaults.maxNumberLength,
    maxDecimalLength: number = defaults.maxDecimalLength;

let varinfo = (obj: object) => console.log(JSON.stringify(obj)); // For debugging

interface numberProperties extends Object {
    numbers: string[];
    isNegative: boolean;
    decimals: number;
}

/**
 * This function takes a number string and returns the number's properties
 * @param numberString A number but contained in a string
 */
export function define(numberString: string): numberProperties {
    let isNegative: boolean,
        decimals: number;

    numberString = numberString.replace(/,/g, "");

    if (numberString[0] === "-") numberString = numberString.replace("-", ""), isNegative = true;
    else isNegative = false;

    if (numberString.includes(".")) {
        decimals = numberString.length - numberString.indexOf(".") - 1;
        numberString = numberString.replace(".", "");
    } else decimals = 0;

    return {
        numbers: numberString.split(""),
        isNegative,
        decimals
    };
}

/**
 * This is used when passing a MathMode into the parse function
 */
export enum MathMode { ADD = 1, SUBTRACT, MULTIPLY, DIVIDE }

/**
 * 
 * @param num1 An object containing a number's properties
 * @param num2 An object containing a number's properties
 * @param mathMode The math function that the number are to be parsed for
 */
export function parse(num1: numberProperties, num2: numberProperties, mathMode: MathMode): { num1: numberProperties, num2: numberProperties, isNeg: boolean, decimals: number } {
    let isNeg: boolean = false,
        decimals: number = 0;

    if (num1.decimals > 0 || num2.decimals > 0) {
        decimals = [1, 2].includes(mathMode) ? Math.max(num1.decimals, num2.decimals) : mathMode === 3 ? num1.decimals + num2.decimals : num1.decimals - num2.decimals;
        if (decimals < 0) decimals = 0;
    }

    const maxChar = Math.max(num1.numbers.length, num2.numbers.length);

    if ([1, 2].includes(mathMode)) {
        if (mathMode === 1) {
            if (!isNeg && (num1.isNegative || num2.isNegative) && num2.numbers.length === maxChar) {
                for (let i = 0; i < num1.numbers.length; i++) {
                    if (num2.numbers[i] > num1.numbers[i]) {
                        isNeg = true;
                        break;
                    }
                }
            }
        }

        if (num1.numbers.length !== num2.numbers.length) {
            if (num1.decimals !== num2.decimals) {
                if (num1.decimals === decimals) {
                    for (let i = 0; i < num1.decimals - num2.decimals; i++) {
                        num2.decimals++;
                        num2.numbers.push("0");
                    }
                } else if (num2.decimals === decimals) {
                    for (let i = 0; i < num2.decimals - num1.decimals; i++) {
                        num1.decimals++;
                        num1.numbers.push("0");
                    }
                }
            }

            while (num1.numbers.length - num2.numbers.length > 0) num2.numbers.unshift("0");
            while (num2.numbers.length - num1.numbers.length > 0) num1.numbers.unshift("0");
        }

        if (mathMode === 2) {
            if (num1.isNegative && num2.isNegative) {
                num1.isNegative = false;
                num2.isNegative = false;
                num1 = [num2, num2 = num1][0];
            }

            if (!isNeg && num2.numbers.length === maxChar) {
                for (let i = 0; i < maxChar; i++) {
                    if (num1.numbers[i] === num2.numbers[i]) continue;
                    else if (num1.numbers[i] > num2.numbers[i]) break;
                    else {
                        isNeg = true;
                        break;
                    }
                }
            }

            if (isNeg && !num1.isNegative && !num2.isNegative) num1 = [num2, num2 = num1][0];
        }
    }

    if ([3, 4].includes(mathMode)) {
        if (mathMode === 3) {
            if (maxChar === num2.numbers.length) num1 = [num2, num2 = num1][0];

            if (num1.numbers.length !== num2.numbers.length) {
                if (num1.decimals !== num2.decimals) {
                    if (num1.decimals === decimals) {
                        for (let i = 0; i < num1.decimals - num2.decimals; i++) {
                            num2.decimals++;
                            num2.numbers.push("0");
                        }
                    } else if (num2.decimals === decimals) {
                        for (let i = 0; i < num2.decimals - num1.decimals; i++) {
                            num1.decimals++;
                            num1.numbers.push("0");
                        }
                    }
                }

                while (num1.numbers.length - num2.numbers.length > 0) num2.numbers.unshift("0");
                while (num2.numbers.length - num1.numbers.length > 0) num1.numbers.unshift("0");
            }
        }

        if (num1.isNegative !== num2.isNegative) isNeg = true;
        if (num1.isNegative && num2.isNegative) {
            isNeg = false;
            num1 = [num2, num2 = num1][0];
        }

        if (mathMode === 4) {
            for (let i = num1.numbers.length; i < num2.numbers.length; i++) {
                num1.numbers.push("0");
                decimals++;
            }
        }
    }

    return {
        num1,
        num2,
        isNeg,
        decimals
    };
}

function formatOutput(numbers: string[], decimals: number, isNegative: boolean) {
    if (decimals > 0) numbers.splice(numbers.length - decimals, 0, ".");
    let final: string = numbers.join("");

    if (final.includes(".")) final = final.replace(/\.?0+$/g, '');
    final = final.replace(/^0+/g, '');

    if (final.length > 1 && final[0] === ".") final = "0" + final;
    if (isNegative) final = "-" + final;
    if (final[final.length - 1] === "." || final[0] === ".") final = final.replace(".", "");

    return ["", ".", "-", "-0"].includes(final) ? "0" : final;
}

function toNumber(item: string | number | numberProperties): number {
    switch (typeof item) {
        case "number":
            return item;

        case "string":
            return +item;

        default:
            return +formatOutput(item.numbers, item.decimals, item.isNegative);
    }
}

function toString(item: string | number | numberProperties): string {
    switch (typeof item) {
        case "number":
            return item + "";

        case "string":
            return item;

        case "object":
            return formatOutput(item.numbers, item.decimals, item.isNegative);
    }
}

function toNumberProperties(item: string | number | numberProperties): numberProperties {
    switch (typeof item) {
        case "number":
            return define(item + "");

        case "string":
            return define(item);

        case "object":
            return item;
    }
}

function shouldRun(num1: string | number | numberProperties, num2?: string | number | numberProperties): boolean {
    if (powermode) {
        if (typeof num1 === "number") num1 = num1 + "";

        if (typeof num1 === "string") {
            if (num1[0] === "-") num1 = num1.substr(1);
        } else num1 = num1.numbers.join("");

        if (num1.length > maxNumberLength || num1.includes(".")) return true;

        if (num2 === undefined) return false;
        if (typeof num2 === "number") num2 = num2 + "";

        if (typeof num2 === "string") {
            if (num2[0] === "-") num2 = num2.substr(1);
        } else num2 = num2.numbers.join("");

        if (num2.length > maxNumberLength || num1.includes(".")) return true;

        return false;
    }

    return true;
}

/**
 * PowerMode is set to the specified value
 * Returns the current PowerMode
 * @param mode Value (optional) to set the state of PowerMode to
 */
export function PowerMode(mode?: boolean): boolean {
    if (mode) powermode = mode;
    return powermode;
}

/**
 * MaxIntegerLength is set to the specified value
 * Returns the current MaxIntegerLength
 * @param length Value (optional) to set the state of MaxIntegerLength to
 */
export function MaxIntegerLength(length?: number | "default"): number {
    if (length) maxNumberLength = length === "default" ? defaults.maxNumberLength : length;
    return maxNumberLength;
}

/**
 * MaxDecimalLength is set to the specified value
 * Returns the current MaxDecimalLength
 * @param length Value (optional) to set the state of MaxDecimalLength to
 */
export function MaxDecimalLength(length?: number | "default"): number {
    if (length) maxDecimalLength = length === "default" ? defaults.maxDecimalLength : length;
    return maxDecimalLength;
}

function ADD(num1: string | number | numberProperties, num2: string | number | numberProperties): number | numberProperties {
    if (shouldRun(num1, num2)) {
        if (typeof num1 === "number") num1 = define(num1 + "");
        else if (typeof num1 === "string") num1 = define(num1);

        if (typeof num2 === "number") num2 = define(num2 + "");
        else if (typeof num2 === "string") num2 = define(num2);

        if (num2.isNegative) {
            num2.isNegative = false;
            return SUBTRACT(num1, num2);
        }

        if (num1.isNegative) {
            num1.isNegative = false;
            return SUBTRACT(num2, num1);
        }

        const parsed = parse(num1, num2, 1),
            maxChar = Math.max(parsed.num1.numbers.length, parsed.num2.numbers.length);

        let final: string[] = [],
            carry: number = 0;

        num1 = parsed.num1, num2 = parsed.num2;

        for (let i = maxChar - 1; i >= 0; i--) {
            let semifinal: number | String = +num1.numbers[i] + +num2.numbers[i];
            semifinal += carry, carry = 0;

            if (semifinal > 9) {
                semifinal = String(semifinal);
                const carryChar = semifinal[0];
                final.push(semifinal[1]);

                if (i === 0) final.push(carryChar);

                carry = +carryChar;
            } else final.push(String(semifinal));

        }

        return {
            numbers: final.reverse(),
            isNegative: parsed.isNeg,
            decimals: parsed.decimals
        };
    }
    
    return toNumber(num1) + toNumber(num2);
}

export function add(...numbers: (string | number | numberProperties)[]): string | number {
    const a = [...numbers];
    let permfinal: number | numberProperties = ADD(a[0], a[1]);

    for (let i = 2; i < a.length; i++) permfinal = ADD(permfinal, a[i]);

    return typeof permfinal === "number" ? permfinal : formatOutput(permfinal.numbers, permfinal.decimals, permfinal.isNegative);
}

function SUBTRACT(num1: number | string | numberProperties, num2: number | string | numberProperties): number | numberProperties {
    if (shouldRun(num1, num2)) {
        if (typeof num1 === "number") num1 = define(num1 + "");
        else if (typeof num1 === "string") num1 = define(num1);

        if (typeof num2 === "number") num2 = define(num2 + "");
        else if (typeof num2 === "string") num2 = define(num2);

        if (!num1.isNegative && num2.isNegative) {
            num2.isNegative = false;
            return ADD(num1, num2);
        }

        if (num1.isNegative && !num2.isNegative) {
            num1.isNegative = false;
            const item = ADD(num1, num2);

            if (typeof item === "number") return item * -1;

            item.isNegative = true;
            return item;
        }

        const parsed = parse(num1, num2, 2),
            maxChar = Math.max(num1.numbers.length, num2.numbers.length);
        let final: string[] = [];

        num1 = parsed.num1, num2 = parsed.num2;

        for (let i = maxChar - 1; i >= 0; i--) {
            const finali: number = maxChar - i - 1,
                semifinal: number = +num1.numbers[i] - +num2.numbers[i];

            if (semifinal < 0) {
                if (i === 0) final[finali] = String(semifinal * -1 - 1);
                else {
                    let j = i - 1;

                    final[finali] = String(semifinal + 10), num1.numbers[j] = String(+num1.numbers[j] - 1);

                    while (+num1.numbers[j] < 0 && j !== num1.decimals) {
                        num1.numbers[j] = String(+num1.numbers[j] + 10);
                        j--;
                        num1.numbers[j] = String(+num1.numbers[j] - 1);
                    }

                    if (num1.decimals > 0 && j === num1.decimals) {
                        while (+num1.numbers[j] < 0 && j !== 0) {
                            num1.numbers[j] = String(+num1.numbers[j] + 10);
                            j--;
                            num1.numbers[j] = String(+num1.numbers[j] - 1);
                        }
                    }
                }
            } else final[finali] = String(semifinal);
        }

        return {
            numbers: final.reverse(),
            isNegative: parsed.isNeg,
            decimals: parsed.decimals
        };
    }
    
    return toNumber(num1) - toNumber(num2);
}

export function subtract(...numbers: (string | number | numberProperties)[]): string | number {
    const a = [...numbers];
    let permfinal: number | numberProperties = SUBTRACT(a[0], a[1]);

    for (let i = 2; i < a.length; i++) permfinal = SUBTRACT(permfinal, a[i]);

    return typeof permfinal === "number" ? permfinal : formatOutput(permfinal.numbers, permfinal.decimals, permfinal.isNegative);
}

export function isLessThan(num1: string | number | numberProperties, num2: string | number | numberProperties): boolean {
    if (shouldRun(num1, num2)) {
        const num: number | numberProperties = SUBTRACT(num2, num1);

        switch(typeof num) {
            case "number":
                return Math.sign(num) === -1 && num !== 0;

            case "object":
                return !num.isNegative && +num.numbers.join('') !== 0;
        }
    }
    
    return toNumber(num1) < toNumber(num2);
}

export function isGreaterThan(num1: string | number | numberProperties, num2: string | number | numberProperties): boolean {
    if (shouldRun(num1, num2)) {
        const num: number | numberProperties = SUBTRACT(num2, num1);

        switch (typeof num) {
            case "number":
                return Math.sign(num) === 1 && num !== 0;

            case "object":
                return num.isNegative && +num.numbers.join('') !== 0;
        }
    }
    
    return toNumber(num1) > toNumber(num2);
}

export function isLessThanEqual(num1: string | number | numberProperties, num2: string | number | numberProperties): boolean {
    if (shouldRun(num1, num2)) {
        const num: number | numberProperties = SUBTRACT(num2, num1);

        switch (typeof num) {
            case "number":
                return Math.sign(num) === 1;

            case "object":
                return !num.isNegative;
        }
    }
    
    return toNumber(num1) <= toNumber(num2);
}

export function isGreaterThanEqual(num1: string | number | numberProperties, num2: string | number | numberProperties): boolean {
    if (shouldRun(num1, num2)) {
        const num: number | numberProperties = SUBTRACT(num2, num1);

        switch (typeof num) {
            case "number":
                return Math.sign(num) === -1;

            case "object":
                return num.isNegative || +num.numbers.join('') === 0;
        }
    }
    
    return toNumber(num1) >= toNumber(num2);
}

export function round(item: string | number | numberProperties): string | number {
    if (shouldRun(item)) {
        switch (typeof item) {
            case "number":
                break;

            case "string":
                const tempS = item.split(".");
                if (tempS.length > 1 && +tempS[1][0] >= 5) {
                    const final = tempS[0][0] == "-" ? SUBTRACT(tempS[0], { numbers: ["1"], isNegative: false, decimals: 0 }) : ADD(tempS[0], { numbers: ["1"], isNegative: false, decimals: 0 });
        
                    return typeof final === "object" ? formatOutput(final.numbers, final.decimals, final.isNegative) : final;
                }
                return tempS[0];

            case "object":
                item.numbers.length -= item.decimals;
    
                if (item.decimals > 0 && +item.numbers[item.decimals] > 4) {
                    const final = item.isNegative ? SUBTRACT(item.numbers.join(""), { numbers: ["1"], isNegative: false, decimals: 0 }) : ADD(item.numbers.join(""), { numbers: ["1"], isNegative: false, decimals: 0 });
    
                    return typeof final === "object" ? formatOutput(final.numbers, final.decimals, final.isNegative) : final;
                }
                return item.numbers.join("");
        }
    }
    
    return Math.round(toNumber(item));
}

export function roundDown(item: string | number | numberProperties): string | number {
    if (shouldRun(item)) {
        switch (typeof item) {
            case "number":
                break;

            case "string":
                const temp = item.split(".");
                temp[1] = temp[1].replace(/0+$/, "");
    
                if (temp[1].length === 0) temp.pop();
                return toString(temp.length === 2 ? temp[0][0] === "-" ? SUBTRACT(temp[0], { numbers: ["1"], isNegative: false, decimals: 0 }) : temp[0] : temp[0]);

            case "object":
                item.numbers.length -= item.decimals;
                return toString(item.isNegative ? SUBTRACT("-" + item.numbers.join(""), { numbers: ["1"], isNegative: false, decimals: 0 }) : item.numbers.join(""));
        }
    }
    
    return Math.floor(toNumber(item));
}

export function roundUp(item: string | number | numberProperties): string | number {
    if (shouldRun(item)) {
        switch (typeof item) {
            case "number":
                break;

            case "string":
                const temp = item.split(".");
                temp[1] = temp[1].replace(/0+$/, "");
                
                if (temp[1].length === 0) temp.pop();
                return toString(temp.length === 2 ? temp[0][0] === "-" ? temp[0] : ADD(temp[0], { numbers: ["1"], isNegative: false, decimals: 0 }) : temp[0]);

            case "object":
                return toString(item.decimals > 0 ? item.isNegative ? formatOutput((() => { item.numbers.length -= item.decimals; return item.numbers.reverse(); })(), 0, true) : ADD(item, { numbers: ["1"], isNegative: false, decimals: 0 }) : formatOutput(item.numbers.reverse(), 0, item.isNegative));
        }
    }
    
    return Math.ceil(toNumber(item));
}

export function abs(item: string | number | numberProperties): string | number {
    if (shouldRun(item)) {
        switch (typeof item) {
            case "number":
                break;

            case "string":
                if (item[0] === "-") return item.substr(1);
                return item;

            case "object":
                return formatOutput(item.numbers, item.decimals, false);
        }
    }
    
    return Math.abs(toNumber(item));
}

function MULTIPLY(num1: string | number | numberProperties, num2: string | number | numberProperties): number | numberProperties {
    if (shouldRun(num1, num2)) {
        if (typeof num1 === "number") num1 = define(num1 + "");
        else if (typeof num1 === "string") num1 = define(num1);

        if (typeof num2 === "number") num2 = define(num2 + "");
        else if (typeof num2 === "string") num2 = define(num2);

        let parsed = parse(num1, num2, 3);

        num1 = parsed.num1, num2 = parsed.num2;

        let final: numberProperties[] = [],
            f: string[] = [];

        for (let bottom = num2.numbers.length - 1; bottom >= 0; bottom--) {
            const r1i: number = num2.numbers.length - bottom - 1;
            let semifinal: string[] = [],
                carry = 0;

            if (bottom !== num2.numbers.length - 1) f.push("0");

            for (let top = num1.numbers.length - 1; top >= 0; top--) {
                const r2i = num1.numbers.length - top - 1;
                if (num1.numbers[top] !== "0" && num2.numbers[bottom] !== "0") {
                    let trifinal: number = +num2.numbers[bottom] * +num1.numbers[top] + carry;
                    carry = 0;

                    const str_trifinal: string = "" + trifinal;
                    if (trifinal > 9) {
                        semifinal[r2i] = str_trifinal[1];

                        if (top === 0) semifinal.push(str_trifinal[0]);
                        else carry = +str_trifinal[0];
                    } else semifinal[r2i] = str_trifinal;
                } else {
                    semifinal[r2i] = "" + carry;
                    carry = 0;
                }
            }

            if (f.length > 0) semifinal = f.concat(semifinal);
            if (+carry > 0) semifinal[num2.numbers.length] = "" + carry;

            final[r1i] = {
                numbers: semifinal.reverse(),
                isNegative: false,
                decimals: 0
            };
        }

        final = final.filter(x => x.numbers);  // filter out all null or undefined values from the list
        if (final.length > 1) {
            let answer = ADD(final[0], final[1]);
            for (let i = 2; i < final.length; i++) answer = ADD(answer, final[i]);

            return typeof answer === "number" ? answer : {
                numbers: answer.numbers,
                decimals: parsed.decimals,
                isNegative: parsed.isNeg
            };
        }

        return {
            numbers: (final.length == 1) ? final[0].numbers : ["0"],
            decimals: parsed.decimals,
            isNegative: parsed.isNeg
        };

    }
    
    return toNumber(num1) * toNumber(num2);
}

export function multiply(...numbers: (string | number | numberProperties)[]): string | number {
    const a = [...numbers];
    let permfinal: number | numberProperties = MULTIPLY(a[0], a[1]);

    for (let i = 2; i < a.length; i++) permfinal = MULTIPLY(permfinal, a[i]);

    return typeof permfinal === "number" ? permfinal : formatOutput(permfinal.numbers, permfinal.decimals, permfinal.isNegative);
}

function DIVIDE(num1: string | number | numberProperties, num2: string | number | numberProperties, maxD: number = maxDecimalLength, i: number = 1): number | numberProperties | undefined {
    if (shouldRun(num1, num2)) {
        if (typeof num1 === "number") num1 = define(num1 + "");
        else if (typeof num1 === "string") num1 = define(num1);

        if (typeof num2 === "number") num2 = define(num2 + "");
        else if (typeof num2 === "string") num2 = define(num2);

        let parsed = parse(num1, num2, 4);

        num1 = parsed.num1, num2 = parsed.num2;

        if (+num1.numbers.join('') === 0) return { numbers: ["0"], decimals: 0, isNegative: false };
        if (+num2.numbers.join('') === 0) return;

        let final: number | numberProperties = { numbers: ["0"], decimals: 0, isNegative: false };

        while (isLessThanEqual(num2, num1)) num1 = SUBTRACT(num1, num2), final = ADD(final, { numbers: ["1"], isNegative: false, decimals: 0 });

        /*if (maxD > parsed.decimals && !isLessThanEqual(num2, num1) && (typeof num1 === "object" ? +num1.numbers.join("") : num1) !== 0 && toNumber(SUBTRACT(num1, num2)) !== 0) {
            if (num2.numbers[0] !== "0" && num2.numbers.length !== 1) num2.numbers.push("0");

            if (i !== 1) i++;
            parsed.decimals++;

            let decimal = DIVIDE(num1, num2, maxD - parsed.decimals, i) + "";
            parsed.decimals += define(decimal).decimals - parsed.decimals;
            decimal = decimal.replace(".", ""); // .replace(/^0/g, "");

            for (let j = 0; j < i; j++) decimal += "0"

            final = ADD({
                numbers: typeof final === "object" ? final.numbers.reverse() : [...(final + "")].reverse(),
                decimals: 0,
                isNegative: false
            }, decimal);
        }*/

        final = toNumberProperties(final);
        while (parsed.decimals > final.numbers.length) final.numbers.push("0");

        return {
            numbers: final.numbers,
            decimals: parsed.decimals,
            isNegative: parsed.isNeg
        };
    }
    
    return toNumber(num1) / toNumber(num2);
}

export function divide(...numbers: (string | number | numberProperties)[]): string | number | undefined {
    const a = [...numbers];
    let permfinal: number | numberProperties | undefined = DIVIDE(a[0], a[1]);

    for (let i = 2; i < a.length; i++) {
        if (permfinal === undefined) return;
        permfinal = DIVIDE(permfinal, a[i]);
    }

    return typeof permfinal === "object" ? formatOutput(permfinal.numbers, permfinal.decimals, permfinal.isNegative) : permfinal;
}

/*function divide(...numbers: string[]): string {
    function temp(num1:string|Define, num2:string|Define, maxD: number, i: number, getDec: boolean) {
        if (typeof num1 !== "number" && typeof num2 !== "number" && shouldRun(num1, num2)) {
            let parsedNums = parse(num1, num2, 4),
                neg = [parsedNums.isNegative, parsedNums.numbers1.isNegative, parsedNums.numbers2.isNegative],
                num: any = [parsedNums.numbers1.numbers, parsedNums.numbers2.numbers],
                decimals = parsedNums.decimals,
                final: any = "0";
            if (num[0].numbers === ["0"]) return "0";
            if (isLessThanEqual(num[1], num[0]))
                while (isLessThanEqual(num[1], num[0])) num[0] = subtract(num[0], num[1]), final = add(final, { numbers: ["1"], isNegative: false, decimals: 0});
            else final = "0";
            if (maxD > decimals && isGreaterThan(num[1], num[0]) && num[0] !== "0" && subtract(num[0], num[1]) !== "0") {
                if (num[0] !== "0") num[0] = num[0] + "0";
                if (num[1][0] !== "0" && num[1].length !== 1) num[1].push("0");
                final = final.split("").reverse().join("");
                if (i !== 1) i++;
                decimals++;
                let decimal = temp(num[0], num[1], maxD - decimals, i, true);
                decimals += decimal.decimal - parsedNums.decimals;
                decimal = decimal.final.replace(".", ""); // .replace(/^0/g, "");
                for (let j = 0; j < i; j++) decimal += "0";
                // console.varinfo({final});
                // console.varinfo({add:add(final, decimal).split("")});
                final = add(final, decimal).split("");
            } else {
                final = final.split("");
            }
            // console.varinfo({decimals});
            // if (i === 1) decimals++;
            while (decimals > final.length) final.push("0");
            final = formatOutput(final, decimals, neg);
            return getDec ? {
                final,
                decimal: decimals
            } : final;
        }
    
    return String(toNumber(num1) / toNumber(num2));
    }
    let a = [...numbers], permfinal = temp(a[0], a[1], maxDecimal, 1, false);
    for (let i = 2; i < a.length - 1; i++) permfinal = temp(permfinal, a[i], maxDecimal, 1, false);
    return permfinal;
}*/

// function EXPONENT(num1: string | number | numberProperties, num2: string | number | numberProperties, maxD?: any): number | numberProperties {
//     if (shouldRun(num1, num2)) {
//         if (typeof num1 === "number") num1 = define(num1 + "");
//         else if (typeof num2 === "number") num2 = define(num2 + "");

//         if (typeof num1 === "string") num1 = define(num1);
//         if (typeof num2 === "string") num2 = define(num2);
//         if (!maxD) maxD = maxDecimalLength;

//         if (num1.decimals > 0) {
//             // root_of_decimal2*10(num1)**(num2*(10*decimal2))
//             throw new TypeError("Decimal exponents aren't supported yet");
//         } else {
//             if (num2.numbers.length === 1 && num2.numbers[0] === "1" && !num2.isNegative) return { numbers: num1.numbers, isNegative: false, decimals: num1.decimals };
//             else if ((num2.numbers.length === 1 && +num2.numbers[0] === 0) || num1.numbers.length === 1 && +num1.numbers[0] === 1 && !num1.isNegative) return { numbers: ["1"], isNegative: false, decimals: 0 };
//             else if (num2.isNegative) {
//                 num2.isNegative = false;
//                 return DIVIDE({ numbers: ["1"], isNegative: false, decimals: 0 }, num2, maxD);
//             } else if (num1.isNegative) {
//                 num2.isNegative = false;
//                 return DIVIDE("1", EXPONENT(num1, num2), maxD)
//             } else {
//                 let final: number | numberProperties = MULTIPLY(num1, num1),
//                     num2Filtered = num2.numbers.join('').replace(/^0+/g, '').split('');
//                 varinfo({ final });
//                 for (let i: number | numberProperties = { numbers: ["2"], isNegative: false, decimals: 0 }; isLessThanEqual(i, { numbers: num2Filtered, isNegative: false, decimals: 0 }); i = ADD(i, { numbers: ["1"], isNegative: false, decimals: 0 })) {
//                     final = MULTIPLY(final, num1);
//                     varinfo({ i });
//                 }

//                 return final;
//             }
//         }
//     } else return toNumber(num1) ** toNumber(num2);
// }

// export function exponent(...numbers: (string | number | numberProperties)[]): string | number {
//     const a = [...numbers];
//     let permfinal: number | numberProperties = EXPONENT(a[0], a[1]);

//     for (let i = 2; i < a.length; i++) permfinal = EXPONENT(permfinal, a[i]);

//     return typeof permfinal === "number" ? permfinal : formatOutput(permfinal.numbers, permfinal.decimals, permfinal.isNegative);
// }

// function FACTORIAL(item: string | number | numberProperties): number | numberProperties {
//     return +item < 0 ? { numbers: ["1"], isNegative: true, decimals: 0 } : +item === 0 ? { numbers: ["1"], isNegative: false, decimals: 0 } : MULTIPLY(item, FACTORIAL(SUBTRACT(item, { numbers: ["1"], isNegative: false, decimals: 0 })));
// }

// export function factorial(number: string | number | numberProperties): string | number {
//     const final = FACTORIAL(number);
//     return typeof final == "number" ? final : formatOutput(final.numbers, final.decimals, final.isNegative);
//     /*
//     The following is a method for calculating Factorials up to 15 decimals

//     const g = 7, <- Precision, must be 1 to 15
//         C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 0.0000099843695780195716, 0.00000015056327351493116];

//     function gamma(z) {

//         if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
//         else {
//             z -= 1;

//             let x = C[0];
//             for (var i = 1; i < g + 2; i++)
//             x += C[i] / (z + i);

//             const t = z + g + 0.5;
//             return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
//         }
//     }
//     */
// }

export {
    // exponent as pow,
    roundUp as ceil,
    roundDown as floor
}