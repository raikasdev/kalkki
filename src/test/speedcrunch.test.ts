import { expect, test } from "bun:test";
import { RESERVED_VARIABLES } from "@/math/internal/evaluator";

// Here's a list of all SpeedCrunch functions
const speedCrunchFunctions = [
	"abs",
	"absdev",
	// "and", // Binary/bitwise not planned
	"arccos",
	"arcosh",
	"arcsin",
	"arctan",
	"arctan2",
	"arsinh",
	"artanh",
	"average",
	// "bin", // Binary not supported
	"binomcdf",
	"binommean",
	"binompmf",
	"binomvar",
	// "cart", // Complex numbers not supported
	"cbrt",
	"ceil",
	"cos",
	"cosh",
	"cot",
	"csc",
	// "dec", // Non dec not supported
	"degrees",
	"erf",
	"erfc",
	"exp",
	"floor",
	"frac",
	"gamma",
	"gcd",
	"geomean",
	// "hex", // Hexadecimals not supported
	"hypercdf",
	"hypermean",
	"hyperpmf",
	"hypervar",
	"idiv",
	/*"ieee754_decode", // These are highly tech stuff, no one is going to use these realistically in an exam
  "ieee754_double_decode",
  "ieee754_double_encode",
  "ieee754_encode",
  "ieee754_half_decode",
  "ieee754_half_encode",
  "ieee754_quad_decode",
  "ieee754_quad_encode",
  "ieee754_single_decode",
  "ieee754_single_encode",*/
	// "imag",  // Complex numbers not supported
	"int",
	"lb",
	"lg",
	"ln",
	"lngamma",
	"log",
	// "mask", // Binary/bitwise not planned
	"max",
	"median",
	"min",
	"mod",
	"ncr",
	// "not", // Binary/bitwise not planned
	"npr",
	// "oct", // Octal not supported
	// "or", // Binary/bitwise not planned
	// "phase", // Complex numbers not supported
	"poicdf",
	"poimean",
	"poipmf",
	"poivar",
	//"polar", // Complex numbers not supported
	"product",
	"radians",
	// "real", // Complex numbers not supported
	"round",
	"sec",
	"sgn",
	//  "shl", // Bitwise/binary not planned
	// "shr",
	"sin",
	"sinh",
	"sqrt",
	"stddev",
	"sum",
	"tan",
	"tanh",
	"trunc",
	// "unmask", // Binary/bitwise not planned
	"variance",
	// "xor", // Binary/bitwise not planned
];

for (const func of speedCrunchFunctions) {
	test(`${func}()`, () => {
		const find = RESERVED_VARIABLES.find((i) => i === func);
		// Doing this so the output isn't filled with the entire array
		expect(find).not.toBeUndefined();
	});
}
