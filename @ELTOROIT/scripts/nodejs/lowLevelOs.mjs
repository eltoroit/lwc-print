import Logs2 from './logs.mjs';
import { resolve } from 'path';
import Colors2 from './colors.mjs';
import * as fsExtra from 'fs-extra';
import * as fs from 'node:fs/promises';
import ET_Asserts from './etAsserts.mjs';
import { spawn } from 'node:child_process';

export default class LowLevelOS {
	static async getFullPath({ config, relativePath, skipCheck = false }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: relativePath, message: 'relativePath' });

		let path = resolve(relativePath);
		if (skipCheck) {
			return path;
		} else {
			if (await LowLevelOS.fsExists({ config, path })) {
				return path;
			} else {
				let msg = `${path} could not be found`;
				Logs2.reportErrorMessage({ config, msg });
				throw new Error(msg);
			}
		}
	}

	static async doesFileExist({ config, path }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: path, message: 'path' });

		const stat = await fs.stat(path);
		return stat.size > 0;
	}

	static async moveFile({ config, oldPath, newPath }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: oldPath, message: 'oldPath' });
		ET_Asserts.hasData({ value: newPath, message: 'newPath' });

		await fs.rename(oldPath, newPath);
	}

	static async readFile({ config, path, isCreate = false }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: path, message: 'path' });

		if (config.debugMessages) Colors2.debug({ msg: 'Reading file: ' + path });
		const fileExists = await LowLevelOS.doesFileExist({ config, path });
		if (fileExists) {
			const fileContents = await fs.readFile(path, 'utf8');
			return fileContents;
		} else {
			let err = 'Files does not exist: ' + path;
			Logs2.reportErrorMessage({ config, msg: err });
			if (isCreate) {
				await LowLevelOS.writeFile(path, '{}');
			}
			throw new Error(err);
		}
	}

	static async recreateFolder({ config, path }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: path, message: 'path' });

		if (config.debugMessages) Colors2.debug({ msg: 'Recreating folder: ' + path });
		await fsExtra.remove(path);
		await fsExtra.ensureDir(path);
	}

	static async writeFile({ config, path, data }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: path, message: 'path' });
		ET_Asserts.hasData({ value: data, message: 'data' });

		if (config.debugMessages) Colors2.debug({ msg: Colors2.getPrettyJson({ obj: { msg: 'Writing file: ' + path, data } }) });
		try {
			await fs.writeFile(path, data);
		} catch (ex) {
			let msg = `Error creating file: ${path}"`;
			Logs2.reportException({ config, msg, ex });
			throw ex;
		}
	}

	static async fsExists({ config, path }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: path, message: 'path' });

		if (config.debugMessages) Colors2.debug({ msg: 'Validating full path: ' + path });
		try {
			await fs.stat(path);
			return true;
		} catch (ex) {
			return false;
		}
	}

	static async executeAsync({ config, app, args, cwd, expectedCode, callbackAreWeDone }) {
		ET_Asserts.hasData({ value: config, message: 'config' });
		ET_Asserts.hasData({ value: app, message: 'app' });
		ET_Asserts.hasData({ value: expectedCode, message: 'expectedCode' });
		// ET_Asserts.hasData({ value: callbackAreWeDone, message: 'callbackAreWeDone' });

		if (!callbackAreWeDone) callbackAreWeDone = () => {};

		// Can't do async/await because it has events
		return new Promise((resolve, reject) => {
			let currentStep = config.currentStep;
			if (config.debugMessages) Colors2.debug({ msg: 'EXECUTING (Async): ' + Colors2.getPrettyJson({ obj: { app, args, cwd } }) });

			let response = {};

			const forceResolve = () => {
				execProcess.stdout.unref();
				execProcess.stderr.unref();
				execProcess.unref();
				resolve();
			};

			const reportData = ({ eventName, item }) => {
				ET_Asserts.hasData({ value: eventName, message: 'eventName' });
				ET_Asserts.hasData({ value: item, message: 'item' });

				// Save the response
				if (eventName === 'CLOSE') {
					if (response[eventName]) {
						// Why is closed called multiple times?
						debugger;
					} else {
						response[eventName] = { ...item };
					}
					item = Colors2.getPrettyJson({ obj: item });
				} else {
					if (!response[eventName]) response[eventName] = '';
					if (item.toString) {
						item = item.toString();
					} else {
						debugger;
					}
					response[eventName] += item;
				}

				// Notify
				let notification = { currentStep, eventName, app, args, cwd, item, response, forceResolve };
				if (config.debugMessages) Colors2.debug({ msg: `${notification.currentStep} | ${notification.item.trim()}` });
				callbackAreWeDone(notification);
			};

			const report = ({ eventName, data }) => {
				ET_Asserts.hasData({ value: eventName, message: 'eventName' });
				ET_Asserts.hasData({ value: data, message: 'data' });

				// More elements
				if (data.length > 1) {
					debugger;
					for (let item of data) {
						reportData({ eventName, item });
					}
				} else {
					// First element
					let item = data;
					reportData({ eventName, item });
				}
			};

			const printData = ({ eventName, data }) => {
				if (config.printData) {
					let data2 = data.toString();
					let data3 = data2.split('\n');
					let data4 = data3.filter((line) => line.trim().length > 0);
					console.log(data4.join('\n'));
					if (data4.length > 1) {
						// console.log(`\n--- ${eventName} ---\n`);
						console.log('--- --- --- --- --- --- --- --- ---\n');
					}
				}
			};

			const execProcess = spawn(app, args, { detach: true, shell: true, cwd });
			execProcess.on('spawn', (...data) => {
				if (config.debugMessages) {
					report({ eventName: 'SPAWN', data });
				}
			});

			execProcess.on('error', (...data) => {
				report({ eventName: 'ERROR', data });
			});

			execProcess.stdout.on('data', (...data) => {
				printData({ eventName: 'STDOUT', data });
				report({ eventName: 'STDOUT', data });
			});

			execProcess.stderr.on('data', (...data) => {
				printData({ eventName: 'STDERR', data });
				report({ eventName: 'STDERR', data });
			});

			execProcess.on('close', (code, signal) => {
				report({ eventName: 'CLOSE', data: { code, signal } });
				// Let ths process cool off, if running in debug mode. I saw that VS Code debugger chokes :-)
				const isDebug = !!process.execArgv.find((arg) => arg.includes('--inspect'));
				const timeout = isDebug ? 5e3 : 0;
				if (isDebug) {
					Colors2.debug({ msg: `Waiting ${timeout / 1000} seconds for the procees to cool off while the debugger catches up` });
				}
				setTimeout(() => {
					try {
						resolve(response);
					} catch (ex) {
						reject(response);
					}
				}, timeout);
			});
		});
	}
}
