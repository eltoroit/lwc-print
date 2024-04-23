// import OS2 from "./lowLevelOs.js";
import Colors2 from './colors.mjs';
import ET_Asserts from './etAsserts.mjs';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export default class Logs {
	static reportException({ config, msg, ex }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: msg, message: 'msg' });
		ET_Asserts.hasData({ value: ex, message: 'ex' });

		let error = { test: config.currentStep, msg, ...ex };
		if (ex.message) error.message = ex.message;
		if (ex.stack) error.stack = ex.stack;
		if (config.debugMessages) Colors2.debug({ msg: 'ERROR FOR: ' + Colors2.getPrettyJson({ obj: error }) });
		Colors2.sfdxShowError({ msg: Colors2.getPrettyJson({ obj: error }) });
	}

	static reportErrorMessage({ config, msg }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: msg, message: 'msg' });

		Colors2.sfdxShowError({ msg });
	}

	static async promptYesNo({ config, question }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: question, message: 'question' });

		Colors2.sfdxPromptMessage({ msg: question });
		const rl = readline.createInterface({ input, output });

		// Can't use async/await because I need a loop
		return new Promise((resolve) => {
			async function loop() {
				const answer = await rl.question(Colors2.getPromptMessage({ msg: '[Y/N] > ' }));
				if (answer[0].toUpperCase() === 'Y') {
					rl.close();
					resolve(true);
				} else if (answer[0].toUpperCase() === 'N') {
					rl.close();
					resolve(false);
				} else {
					loop();
				}
			}

			loop();
		});
	}
}
