import { useEffect, useRef } from "preact/hooks";
import HistoryLine, { type HistoryLineData } from "./components/HistoryLine";
import Logo from "./components/Logo";
import MathInput from "./components/MathInput";
import { type Options, TopBar } from "./components/TopBar";
import { useObjectState } from "./util/use-object-state";
import "./styles/app.scss";
import { AutoUpdate } from "@/components/AutoUpdate";
import { getDefaultLanguage, translate } from "@/lang";
import { prepareWorker } from "@/math";
import type { UserObject } from "@/math/internal/evaluator";
import { LargeNumber } from "@/math/internal/large-number";
import AboutPage from "@/pages/About";
import CopyrightPage from "@/pages/Copyright";
import { deserializeUserspace, serializeUserspace } from "@/util";

export type AppState = {
	answer: LargeNumber;
	userSpace: Map<string, UserObject>;
	answers: HistoryLineData[];
	extraInfo: string | null;
	latex: boolean;
	history: string[];
	workHistory: string[];
	historyIndex: number;
	pageOpen: null | "about" | "copyright";
};

const DEFAULT_OPTIONS = {
	angleUnit: "deg",
	resultAccuracy: 8,
	language: getDefaultLanguage(),
	preserveSessions: true,
	fullScreen: import.meta.env.VITE_DESKTOP_BUILD === "true",
	theme: "default",
};

function getDefaultAppState(): AppState {
	const appState: AppState = {
		answer: new LargeNumber(0),
		userSpace: new Map(),
		answers: [],
		extraInfo: null,
		latex: false,
		history: [], // Only past commands
		workHistory: [], // User may edit these
		historyIndex: -1,
		pageOpen: null,
	};

	if (localStorage.getItem("kalkki-history") === null) return appState;
	try {
		const { history, answers, userSpace } = JSON.parse(
			localStorage.getItem("kalkki-history") ?? "{}",
		);
		if (!history || !answers) throw new Error("Invalid history data");
		appState.history = history;
		appState.workHistory = history;
		if (userSpace) {
			appState.userSpace = deserializeUserspace(userSpace);
		}
		appState.answers = answers.map((i: Record<string, string>) => ({
			...i,
			answer: !i.answer ? undefined : new LargeNumber(i.answer),
		}));
	} catch (e) {
		console.error("Loading history from local storage failed!", e);
		localStorage.removeItem("kalkki-history");
	}

	return appState;
}

export function App() {
	const [options, setOptions] = useObjectState<Options>({
		...DEFAULT_OPTIONS,
		...JSON.parse(localStorage.getItem("kalkki-options") ?? "{}"),
	});
	const [appState, setAppState] = useObjectState<AppState>(
		getDefaultAppState(),
	);

	// Prepare one math worker to be ready in the pool
	useEffect(() => {
		prepareWorker();
	}, []);

	// Save options and history to localStorage
	useEffect(() => {
		localStorage.setItem("kalkki-options", JSON.stringify(options));
		if (!options.preserveSessions) {
			localStorage.removeItem("kalkki-history");
			return;
		}

		localStorage.setItem(
			"kalkki-history",
			JSON.stringify({
				history: appState.history,
				answers: appState.answers.map((i) => ({
					...i,
					answer: i.answer?.toSignificantDigits(100),
				})), // Class value needs to be serialized
				userSpace: serializeUserspace(appState.userSpace),
			}),
		);
	}, [appState, options]);

	// Set full-screen body class
	useEffect(() => {
		if (
			import.meta.env.VITE_DESKTOP_BUILD === "true" ||
			window.matchMedia("(display-mode: standalone)").matches
		)
			return;
		if (options.fullScreen) {
			document.body.classList.remove("limit-size");
		} else {
			document.body.classList.add("limit-size");
		}
	}, [options]);

	// Set theme class
	useEffect(() => {
		document.body.classList.remove(
			...document.body.classList.values().filter((i) => i.startsWith("theme-")),
		);
		document.body.classList.add(`theme-${options.theme}`);
	}, [options]);

	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<AboutPage
				language={options.language}
				visible={appState.pageOpen === "about"}
				setVisible={(v) => setAppState({ pageOpen: v ? "about" : null })}
			/>
			<CopyrightPage
				language={options.language}
				visible={appState.pageOpen === "copyright"}
				setVisible={(v) => setAppState({ pageOpen: v ? "copyright" : null })}
			/>
			<TopBar
				options={options}
				setOptions={setOptions}
				setAppState={setAppState}
			/>
			<div class="history">
				<div
					className={`welcome-message${appState.answers.length > 0 ? " hidden" : ""}`}
					{...(appState.answers.length ? { "aria-hidden": true } : {})}
				>
					<Logo height="128" width="128" />
					<h1>Kalkki</h1>
					<p>{translate("welcome", options.language)}</p>
					<p>{translate("welcomeStart", options.language)}</p>
					{import.meta.env.VITE_DESKTOP_BUILD !== "true" && (
						<p
							class="hide-pwa-prompt"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Localisation
							dangerouslySetInnerHTML={{
								__html: translate("welcomePwaPrompt", options.language),
							}}
						/>
					)}
				</div>
				{appState.answers.map((line, index) => (
					<HistoryLine
						// biome-ignore lint/suspicious/noArrayIndexKey: Array only gets appended so it's fine
						key={`line-${index}`}
						inputRef={inputRef}
						{...line}
						accuracy={options.resultAccuracy}
					/>
				))}
			</div>
			<MathInput
				inputRef={inputRef}
				state={appState}
				setState={setAppState}
				options={options}
			/>
			{import.meta.env.VITE_DESKTOP_BUILD !== "true" && (
				<AutoUpdate language={options.language} />
			)}
		</>
	);
}
