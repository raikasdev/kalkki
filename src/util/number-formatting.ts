/**
 * Write me a JavaScript function that has four parameters:
 * 	1) a float as a string. It may be have e-notation. It may be millions of characters long, so this needs to be optimized.
 *  2) Number of significant characters to round to
 *  3) Boolean (showAll) to include zeroes up to the rounding (5 significant numbers, 2 => 2, 0,5 => 0,50000). This should NOT remove zeroes from numbers, just the redundant zeroes after the decimal! Like 0,500000000 -> 0,5
 *  4) Normal or engineering e-notation (normal = any exponent, engineering = multiple of 3) ('normal' | 'engineering')
 * You should then format the number to an presentable string to the user. If the value is an integer or 0, it should not have any decimals.
 * If the number is extremely large or small, you should use e-notation.
 * And input in e-notation in lower precision (like 10e3 in 50 digit precision should be just 10000) should be parsed like they were full numbers
 * DO NOT USE NATIVE FLOAT TYPE or Number.parseFloat! The number may have millions of digits but it still needs to give a precise e-notation!!
 */

type ENotationType = "normal" | "engineering";

/**
 * Formats a number string according to specified parameters
 * @param valueStr - The number as a string (can be in e-notation)
 * @param significantDigits - Number of significant digits to round to
 * @param showAll - Whether to include trailing zeros up to significant digits
 * @param eType - Type of e-notation to use ('normal' or 'engineering')
 * @returns Formatted number as a string
 */
export function formatNumber(
	valueStr: string,
	significantDigits: number,
	showAll: boolean,
	eType: ENotationType,
): string {
	// Normalize input: replace comma with dot for decimal separator
	valueStr = valueStr.replace(",", ".");

	// Split the number into coefficient and exponent if it's in e-notation
	let coefficient = "";
	let exponent = 0;

	if (valueStr.toLowerCase().includes("e")) {
		const parts = valueStr.toLowerCase().split("e");
		coefficient = parts[0];
		exponent = Number.parseInt(parts[1], 10);
	} else {
		coefficient = valueStr;
	}

	// Remove leading/trailing whitespace from coefficient
	coefficient = coefficient.trim();

	// If coefficient is empty or just a decimal point, treat as zero
	if (!coefficient || coefficient === ".") {
		return "0";
	}

	// Split coefficient into integer and decimal parts
	let intPart = "0";
	let decPart = "";

	if (coefficient.includes(".")) {
		const parts = coefficient.split(".");
		intPart = parts[0] === "" ? "0" : parts[0];
		decPart = parts[1];
	} else {
		intPart = coefficient;
	}

	// Combine integer and decimal parts into a normalized form without decimal point
	let normalizedNum = intPart.replace(/^0+/, "") + decPart;
	if (normalizedNum === "") normalizedNum = "0";

	// Calculate the actual decimal point position considering the exponent
	let decimalPos = intPart.replace(/^0+/, "").length + exponent;
	if (intPart === "0" || intPart === "-0") {
		// Find the first non-zero digit in decimal part
		const firstNonZero = decPart.search(/[1-9]/);
		if (firstNonZero !== -1) {
			decimalPos = -(firstNonZero + 1) + exponent;
		} else {
			decimalPos = 0; // All zeros
		}
	}

	// Handle negative numbers
	const isNegative = coefficient.startsWith("-");
	if (isNegative) {
		normalizedNum = normalizedNum.substring(1);
	}

	// Round to specified significant digits
	if (normalizedNum.length > significantDigits) {
		const roundPos = significantDigits;
		const roundDigit = Number.parseInt(normalizedNum.charAt(roundPos), 10);

		if (roundDigit >= 5) {
			// Perform rounding up
			let carry = 1;
			let roundedNum = "";

			for (let i = roundPos - 1; i >= 0; i--) {
				let digit = Number.parseInt(normalizedNum.charAt(i), 10) + carry;
				if (digit === 10) {
					digit = 0;
					carry = 1;
				} else {
					carry = 0;
				}
				roundedNum = `${digit}${roundedNum}`;
			}

			if (carry === 1) {
				roundedNum = `1${roundedNum}`;
				decimalPos++; // Adjust decimal position due to carry
			}

			normalizedNum = roundedNum;
		} else {
			normalizedNum = normalizedNum.substring(0, roundPos);
		}
	}

	// Format the result based on magnitude
	let formattedResult = "";

	// Determine if e-notation should be used
	const useENotation = decimalPos > normalizedNum.length + 4 || decimalPos < -4;

	if (useENotation) {
		// Use e-notation
		let adjustedExponent = decimalPos - 1;

		// For engineering notation, adjust exponent to be a multiple of 3
		if (eType === "engineering" && normalizedNum !== "0") {
			const remainder = ((adjustedExponent % 3) + 3) % 3;
			adjustedExponent -= remainder;
			decimalPos = 1 + remainder;
		} else {
			decimalPos = 1;
		}

		// Format coefficient part
		if (decimalPos <= 0) {
			formattedResult = `0.${"0".repeat(-decimalPos)}${normalizedNum}`;
		} else if (decimalPos >= normalizedNum.length) {
			formattedResult = `${normalizedNum}${"0".repeat(decimalPos - normalizedNum.length)}`;
		} else {
			formattedResult = `${normalizedNum.substring(0, decimalPos)}${
				decimalPos < normalizedNum.length
					? `.${normalizedNum.substring(decimalPos)}`
					: ""
			}`;
		}

		// Handle trailing zeros for e-notation based on showAll parameter
		if (formattedResult.includes(".")) {
			if (!showAll) {
				formattedResult = formattedResult.replace(/\.?0+$/, "");
			} else {
				// Keep trailing zeros up to significant digits for e-notation
				const parts = formattedResult.split(".");
				const intDigits =
					parts[0].replace(/^0+/, "").length ||
					(parts[0] === "0" ? 0 : parts[0].length);
				const desiredDecimalDigits = Math.max(0, significantDigits - intDigits);

				if (parts[1].length < desiredDecimalDigits) {
					formattedResult = `${parts[0]}.${parts[1]}${"0".repeat(desiredDecimalDigits - parts[1].length)}`;
				} else if (parts[1].length > desiredDecimalDigits) {
					formattedResult = `${parts[0]}${desiredDecimalDigits > 0 ? `.${parts[1].substring(0, desiredDecimalDigits)}` : ""}`;
				}
			}
		}

		// Add exponent part - always show e-notation for large/small numbers regardless of showAll
		if (adjustedExponent !== 0) {
			formattedResult = `${formattedResult}e${adjustedExponent}`;
		}
	} else {
		// Regular notation
		if (decimalPos <= 0) {
			formattedResult = `0.${"0".repeat(-decimalPos)}${normalizedNum}`;
		} else if (decimalPos >= normalizedNum.length) {
			formattedResult = `${normalizedNum}${"0".repeat(decimalPos - normalizedNum.length)}`;
		} else {
			formattedResult = `${normalizedNum.substring(0, decimalPos)}${
				decimalPos < normalizedNum.length
					? `.${normalizedNum.substring(decimalPos)}`
					: ""
			}`;
		}

		// Handle trailing zeros based on showAll parameter (only for regular notation)
		if (formattedResult.includes(".")) {
			if (!showAll) {
				formattedResult = formattedResult.replace(/\.?0+$/, "");
			} else {
				// Keep trailing zeros up to significant digits
				const parts = formattedResult.split(".");
				const intDigits =
					parts[0].replace(/^0+/, "").length ||
					(parts[0] === "0" ? 0 : parts[0].length);
				const desiredDecimalDigits = Math.max(0, significantDigits - intDigits);

				if (parts[1].length < desiredDecimalDigits) {
					formattedResult = `${parts[0]}.${parts[1]}${"0".repeat(desiredDecimalDigits - parts[1].length)}`;
				} else if (parts[1].length > desiredDecimalDigits) {
					formattedResult = `${parts[0]}${desiredDecimalDigits > 0 ? `.${parts[1].substring(0, desiredDecimalDigits)}` : ""}`;
				}
			}
		}
	}

	// Add negative sign if needed
	if (isNegative && normalizedNum !== "0") {
		formattedResult = `-${formattedResult}`;
	}

	// If result is an integer (no decimal part after cleanup), remove decimal point
	// But don't apply this to e-notation numbers to preserve trailing zeros
	if (!formattedResult.includes("e") && formattedResult.includes(".")) {
		formattedResult = formattedResult.replace(/\.0+$/, "");
	}

	return formattedResult;
}
