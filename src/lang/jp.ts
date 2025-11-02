import type { fi } from "./fi";

export const jp: typeof fi = {
	localeName: "日本語",

	/** Welcome message */
	welcome: "Kalkkiへようこそ – 使いやすくて高速な関数電卓！",
	welcomeStart: "まずは、下のフィールドに式を入力してください。",
	welcomePwaPrompt:
		'<span id="pwa-install-prompt" hidden>デスクトップで最高の体験を得るには、<a href="#" onclick="installPWA()">KalkkiをPWAアプリとしてインストールしてください</a>。',
	/** Options */
	options: "設定",
	optionsSelected: "（選択中）",
	optionsAngleUnit: "角度単位",
	optionsAngleUnitDeg: "度",
	optionsAngleUnitRad: "ラジアン",
	optionsLanguage: "言語",
	optionsPrecision: "結果の精度",
	optionsPrecisionNumber: "桁",
	optionsPreserveSession: "セッションを保持",
	optionsFullScreen: "フルスクリーン表示",
	optionsYes: "はい",
	optionsNo: "いいえ",
	optionsTheme: "テーマ",

	/** Help menu */
	help: "ヘルプ",
	helpSendFeedback: "フィードバックを送る",
	helpInfo: "Kalkkiについて",
	helpCopyrights: "ライセンス",
	helpReset: "データをリセット",
	helpResetAreYouSure: "本当によろしいですか？（%s秒お待ちください）",
	helpResetConfirm: "ユーザーデータをリセット",
	/** Updater */
	updateAvailable: "新バージョンがあります。",
	updateAvailableDescription:
		"古いバージョンのKalkkiを使用しています。下のボタンを押して、アップデートしてください。",
	updateAvailableButton: "アップデート",
	/** Misc / ARIA */
	ariaMathInput: "数式を入力してください。",
	feedbackLink:
		"https://docs.google.com/forms/d/e/1FAIpQLSd2_St9--RZk8zn2Q6JSoJw4G-_SUTskqr18XdiBHYL1gXohg/viewform",

	/** About page */
	aboutVersion: "バージョン",
	aboutFromStudents:
		"学生が学生のために開発した電卓アプリ。Kalkkiは、Roni Äikäsが高校在学中に開発しました。",
	aboutOpenSource:
		'Kalkkiはオープンソースなので、<a href="https://github.com/raikasdev/kalkki" rel="noreferrer" target="_blank">https://github.com/raikasdev/kalkki</a>でソースコードを自由に調べることができます。',
	aboutThanks: "特別な感謝",
	aboutThanksTsry: "Testausserveri ryとその他のソフトウェアテスター。",
	aboutThanksYTL:
		"Abicusの数学エンジンを開発したフィンランドの大学入学試験委員会。",
	aboutLicense: "ライセンス",
	aboutLicenseGPL:
		"このプログラムはオープンソースであり、AGPLv3ライセンスの下で提供されており、いかなる保証もありません。",

	/** Copyright page */
	copyrightOSS: "オープンソースライセンス",
	copyrightKalkki:
		"Kalkkiはオープンソースであり、以下のライセンスに基づいて使用、変更、再配布する権利があります：",
	copyrightKalkkiUses: "Kalkkiで使用されるツールとライブラリ：",
	copyrightLicense: "ライセンス：",
	copyrightAuthor: "作者：",
	copyrightAuthorDefault: "'%s'の開発者",
	copyrightFullLicense:
		'<a href="/third-party-licenses.txt" target="_blank" rel="noreferrer">ここ</a>で言及されているパッケージの完全なライセンスをご確認いただけます。',

	/** Errors */
	errorUnknownSymbol: "%sに不明な記号。",
	errorInfinity: "値大きすぎるか、無限大。",
	errorInvalidArgCount: "関数に無効な数の引数が渡されました。",
	errorNaN: "答えが数値ではありません。",
	errorNoLhsBracket: "左括弧がありません。",
	errorNoRhsBracket: "右括弧がありません。",
	errorTrigPrecision: "三角関数の精度エラー。",
	errorUnexpectedEOF: "入力の予期しない終了。",
	errorUnexpectedToken: "予期しないトークン。",
	errorPrecisionOverflow: "数値が大きすぎて計算できません。",
	errorTimeout: "エラー：操作がタイムアウトしました。",
	errorUnknownName: "%s：不明な変数または関数。",
	errorReservedName: "%sは予約済みの名前。",
	errorRecursion: "無限ループ。",
	errorUnknown: "不明なエラー。",
};
