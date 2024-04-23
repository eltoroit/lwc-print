/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import ET_Asserts from './etAsserts.mjs';

export default class Colors {
	static clearScreen() {
		console.log(clearScreenCode);
	}

	static debug({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });

		console.log(colorBgBlack + colorBright + colorFgGray + msg + colorReset);
	}

	static getPrettyJson({ obj }) {
		ET_Asserts.hasData({ value: obj, message: 'obj' });

		return JSON.stringify(obj, null, 4);
	}

	static sfdxShowCommand({ command }) {
		ET_Asserts.hasData({ value: command, message: 'command' });

		console.log(colorBgBlack + colorBright + colorFgYellow + command + colorReset);
	}

	static sfdxShowStatus({ status }) {
		ET_Asserts.hasData({ value: status, message: 'status' });

		console.log(colorBgBlack + colorBright + colorFgMagenta + status + colorReset);
	}

	static sfdxShowNote({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });

		console.log(colorBgBlack + colorBright + colorFgWhite + msg + colorReset);
	}

	static sfdxShowError({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });

		console.log(colorBgBlack + colorBright + colorFgRed + msg + colorReset);
	}

	static sfdxShowSuccess({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });

		console.log(colorBgBlack + colorBright + colorFgGreen + msg + colorReset);
	}

	static sfdxShowComplete() {
		console.log(colorBgBlack + colorBright + colorFgGreen + 'Task Completed' + colorReset);
		console.log(colorBgBlack + colorBright + colorFgGreen + new Date() + colorReset);
	}

	static sfdxShowMessage({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });
		console.log(colorBgBlack + colorBright + colorFgCyan + msg + colorReset);
	}

	static sfdxPromptMessage({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });
		console.log(this.getPromptMessage({ msg }));
	}

	static getPromptMessage({ msg }) {
		ET_Asserts.hasData({ value: msg, message: 'msg' });
		return colorBgBlack + colorBright + colorFgYellow + msg + colorReset;
	}
}

// Define variables
let clearScreenCode = '\x1B[2J';

// Color Modes
let colorReset = '\x1b[0m';
let colorBright = '\x1b[1m';
let colorDim = '\x1b[2m';
let colorUnderscore = '\x1b[4m';
let colorBlink = '\x1b[5m';
let colorReverse = '\x1b[7m';
let colorHidden = '\x1b[8m';

// Color Foreground
let colorFgBlack = '\x1b[30m';
let colorFgRed = '\x1b[31m';
let colorFgGreen = '\x1b[32m';
let colorFgYellow = '\x1b[33m';
let colorFgBlue = '\x1b[34m';
let colorFgMagenta = '\x1b[35m';
let colorFgCyan = '\x1b[36m';
let colorFgWhite = '\x1b[37m';
let colorFgGray = '\x1b[90m';

// Color Background
let colorBgBlack = '\x1b[40m';
let colorBgRed = '\x1b[41m';
let colorBgGreen = '\x1b[42m';
let colorBgYellow = '\x1b[43m';
let colorBgBlue = '\x1b[44m';
let colorBgMagenta = '\x1b[45m';
let colorBgCyan = '\x1b[46m';
let colorBgWhite = '\x1b[47m';
