import type { Language } from "@/lang";

type Function = {
	description: Translatable;
	usage: string | Translatable;
};

type ResolvedFunction = {
	description: string;
	usage: string;
};

type Translatable = Partial<Record<Language, string>> & {
	fi: string;
	en: string;
};

const documentation: Record<string, Function> = {
	log: {
		description: {
			fi: "Logaritmi kantaluvulla",
			en: "Logarithm to Arbitrary base",
			sv: "Logaritm med bas",
		},

		usage: {
			fi: "log(kantaluku; x)",
			en: "log(base; x)",
			sv: "log(bas; x)",
		},
	},
	lg: {
		description: {
			fi: "Kymmenkantainen logaritmi",
			en: "Common Logarithm",
			sv: "Briggsk logaritm",
		},
		usage: "lg(x)",
	},
	sin: {
		description: {
			fi: "Sini",
			en: "Sine",
			sv: "Sinus",
		},
		usage: "sin(x)",
	},
	cos: {
		description: {
			fi: "Kosini",
			en: "Cosine",
			sv: "Cosinus",
		},
		usage: "cos(x)",
	},
	tan: {
		description: {
			fi: "Tangentti",
			en: "Tangent",
			sv: "Tangens",
		},
		usage: "tan(x)",
	},
	arcsin: {
		description: {
			fi: "Arkussini (käänteisfunktio sinille)",
			en: "Arc sine (inverse sine function)",
			sv: "Arcussinus (invers sinusfunktion)",
		},
		usage: "arcsin(x)",
	},
	arccos: {
		description: {
			fi: "Arkuskosini (käänteisfunktio kosinille)",
			en: "Arccosine (inverse cosine function)",
			sv: "Arcuscosinus (invers cosinusfunktion)",
		},
		usage: "arccos(x)",
	},
	arctan: {
		description: {
			fi: "Arkustangentti (käänteisfunktio tangentille)",
			en: "Arctangent (inverse tangent function)",
			sv: "Arcustangens (invers tangensfunktion)",
		},
		usage: "arctan(x)",
	},
	sqrt: {
		description: {
			fi: "Neliöjuuri",
			en: "Square root",
			sv: "Kvadratrot",
		},
		usage: "sqrt(x)",
	},
	ln: {
		description: {
			fi: "Luonnollinen logaritmi (kantaluku e)",
			en: "Natural logarithm (base e)",
			sv: "Naturlig logaritm (bas e)",
		},
		usage: "ln(x)",
	},
	nthroot: {
		description: {
			fi: "Juurifunktio",
			en: "n:th root",
			sv: "n:te rot",
		},

		usage: {
			fi: "nthroot(n; x)",
			en: "nthroot(n; x)",
			sv: "nthroot(n; x)",
		},
	},
};

export function getDocumentation(
	fn: string,
	lang = "fi" as Language,
): ResolvedFunction | null {
	const doc = documentation[fn];
	if (!doc) return null;
	const usage =
		typeof doc.usage === "object"
			? (doc.usage[lang] ?? doc.usage.en)
			: doc.usage;

	return {
		description: doc.description[lang] ?? doc.description.en,
		usage: usage,
	};
}
