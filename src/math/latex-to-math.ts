/**
 * Turns a LaTeX string into evaluation compatible format.
 * @param latex LaTeX String
 * @returns Math string (like (1/2)^5*2+1)
 */
export function latexToMath(latex: string): string {
	// Replace \left( with ( and \right) with )
	latex = latex.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");

	// Remove LaTeX syntax for fractions
	latex = latex.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)");

	// Convert powers
	latex = latex.replace(/\(([^)]+)\)\^\{([^}]+)\}/g, "($1)^($2)");
	latex = latex.replace(/\^\{([^}]+)\}/g, "^($1)"); // Handle simple exponents

	// Convert multiplication and remove unnecessary symbols
	latex = latex.replace(/\\cdot/g, "*");

	// Handle trigonometric functions with parentheses
	latex = latex.replace(/\\sin\s*\({0,1}([^\s)]+)\){0,1}/g, "sin($1)");
	latex = latex.replace(/\\cos\s*\({0,1}([^\s)]+)\){0,1}/g, "cos($1)");
	latex = latex.replace(/\\tan\s*\({0,1}([^\s)]+)\){0,1}/g, "tan($1)");

	// Remove degree symbol
	latex = latex.replace(/°/g, "");

	// Handle logarithms with parentheses and correct base notation
	// Logarithm with base
	latex = latex.replace(
		/\\log\s*_\{{0,1}([^}]*)\}{0,1}\s*\(([^)]+)\)/g,
		"log($1; $2)",
	);
	// Logarithm without base (assuming base 10)
	latex = latex.replace(/\\log\s*\(([^)]+)\)/g, "lg($1)");

	// Clean up any remaining LaTeX syntax that wasn't covered
	latex = latex.replace(/\\(?!\\)/g, ""); // Remove backslashes not part of escaped sequences

	return latex;
}
