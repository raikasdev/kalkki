/**
 * This is an experimental number formatter designed to replace decimal.js
 */

/**
 * Format a number string to a specified number of significant digits
 * @param {string} numStr - The number as a string (can be very long)
 * @param {number} significantDigits - Number of significant digits to retain
 * @return {string} Formatted number as a string
 */
export function toSignificantDigits(numStr: string, significantDigits: number) {
	// Clean up the input
	numStr = numStr.trim();

	// Handle sign separately
	let sign = "";
	if (numStr[0] === "-" || numStr[0] === "+") {
		sign = numStr[0] === "-" ? "-" : "";
		numStr = numStr.substring(1);
	}

	// Split into integer and fractional parts
	let intPart = numStr;
	let fracPart = "";

	const dotIndex = numStr.indexOf(".");
	if (dotIndex >= 0) {
		intPart = numStr.substring(0, dotIndex);
		fracPart = numStr.substring(dotIndex + 1);
	}

	// Handle scientific notation in the input
	let exponent = 0;
	const eIndex = numStr.toLowerCase().indexOf("e");
	if (eIndex >= 0) {
		const expStr = numStr.substring(eIndex + 1);
		exponent = Number.parseInt(expStr, 10) || 0;

		numStr = numStr.substring(0, eIndex);

		// Recalculate int and frac parts
		const newDotIndex = numStr.indexOf(".");
		if (newDotIndex >= 0) {
			intPart = numStr.substring(0, newDotIndex);
			fracPart = numStr.substring(newDotIndex + 1);
		} else {
			intPart = numStr;
			fracPart = "";
		}

		// Adjust for exponent
		if (exponent > 0) {
			// Move decimal point right
			const digitsToMove = Math.min(exponent, fracPart.length);
			intPart += fracPart.substring(0, digitsToMove);
			fracPart = fracPart.substring(digitsToMove);
			exponent -= digitsToMove;

			// Add zeros if needed
			if (exponent > 0) {
				intPart += "0".repeat(exponent);
				exponent = 0;
			}
		} else if (exponent < 0) {
			// Move decimal point left
			exponent = -exponent;
			const digitsToMove = Math.min(exponent, intPart.length);
			fracPart = intPart.substring(intPart.length - digitsToMove) + fracPart;
			intPart = intPart.substring(0, intPart.length - digitsToMove);
			exponent -= digitsToMove;

			// Add zeros if needed
			if (exponent > 0) {
				fracPart = "0".repeat(exponent) + fracPart;
				exponent = 0;
			}
		}
	}

	// Strip leading zeros from integer part
	intPart = intPart.replace(/^0+/, "") || "0";

	// Find the first non-zero digit
	let firstNonZeroPos = 0;
	if (intPart === "0") {
		firstNonZeroPos = 0;

		// Find first non-zero in fractional part
		for (let i = 0; i < fracPart.length; i++) {
			if (fracPart[i] !== "0") {
				firstNonZeroPos = -(i + 1);
				break;
			}
		}

		// All zeros
		if (firstNonZeroPos === 0 && fracPart.replace(/0+/, "") === "") {
			return "0";
		}
	} else {
		firstNonZeroPos = intPart.length - 1;
	}

	// Combine all digits without the decimal point
	let allDigits = intPart === "0" ? "" : intPart;
	allDigits += fracPart;

	// Remove leading zeros
	allDigits = allDigits.replace(/^0+/, "");

	// Handle all zeros
	if (allDigits === "") {
		return "0";
	}

	// Calculate the exponent for scientific notation
	let eValue = 0;
	if (intPart !== "0") {
		eValue = intPart.length - 1;
	} else {
		// Find position of first non-zero digit in fraction
		for (let i = 0; i < fracPart.length; i++) {
			if (fracPart[i] !== "0") {
				eValue = -(i + 1);
				break;
			}
		}
	}

	// Round to significant digits
	let rounded = "";
	if (allDigits.length > significantDigits) {
		const digit = Number.parseInt(allDigits[significantDigits], 10);
		if (digit >= 5) {
			// Handle rounding up
			let carry = 1;
			for (let i = significantDigits - 1; i >= 0; i--) {
				let d = Number.parseInt(allDigits[i], 10) + carry;
				if (d === 10) {
					d = 0;
					carry = 1;
				} else {
					carry = 0;
				}
				rounded = d.toString() + rounded;
			}

			if (carry === 1) {
				rounded = `1${rounded}`;
				eValue++; // Adjust exponent when we get an extra digit from carry
			}
		} else {
			rounded = allDigits.substring(0, significantDigits);
		}
	} else {
		rounded = allDigits + "0".repeat(significantDigits - allDigits.length);
	}

	// Format the result
	let result = "";

	if (eValue >= 21 || eValue <= -7) {
		// Scientific notation
		result = rounded[0];
		if (significantDigits > 1) {
			result += `.${rounded.substring(1)}`;
		}
		result += `e${eValue >= 0 ? "+" : ""}${eValue}`;
	} else {
		// Regular notation
		if (eValue >= 0) {
			// Number >= 1
			if (eValue + 1 >= rounded.length) {
				result = rounded + "0".repeat(eValue + 1 - rounded.length);
			} else {
				result = rounded.substring(0, eValue + 1);
				if (eValue + 1 < rounded.length) {
					result += `.${rounded.substring(eValue + 1)}`;
				}
			}
		} else {
			// Number < 1
			result = `0.${"0".repeat(-(eValue + 1))}${rounded}`;
		}
	}

	return sign + result;
}
