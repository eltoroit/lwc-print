// # Execute using: npm install && npm run createOrg
import OS2 from './lowLevelOs.mjs';
import SFDX from './sfdx.mjs';
import Colors2 from './colors.mjs';
import { parse } from 'jsonc-parser';

const config = {
	debugMessages: false, // FALSE: To skip additional messages
	//
	// Possible values for [isDebugSkipSFDX] are
	// {code:0}		if you want all of the steps to succeed
	// {code:1}		if you want all of the steps to fail
	// isDebugSkipSFDX: { code: 0 }, // Comment this line if you do want to execute the actual commands
	steps: [],
	errors: [],
	commands: [],
	settings: {},
	stepNumber: 0,
	deployPage: '/lightning/setup/DeployStatus/home',
};

export default class OrgBuilder {
	sfdx;
	args = {};
	root = null;

	async start() {
		this.parseArgs();
		Colors2.clearScreen();
		this.sfdx = new SFDX(config);
		config.root = await OS2.getFullPath({ config, relativePath: '.' });
		await this._readConfigFile();
		await this._restartLogFolder();
		await this.sfdx.processSteps({ config });
		if (config.errors.length > 0) {
			process.exit(-2);
		}
	}

	async _readConfigFile() {
		Colors2.sfdxShowStatus({ status: 'Reading configuration file' });
		let configFileName = await OS2.getFullPath({ config, relativePath: this.args['config-file'] });
		let configJSONC = await OS2.readFile({ config, path: configFileName });
		config.file = parse(configJSONC);
		config.steps = config.file.steps;
		config.settings = config.file.settings;
	}

	async _restartLogFolder() {
		config.rootLogs = './etLogs';
		await OS2.recreateFolder({ config, path: config.rootLogs });
	}

	parseArgs() {
		this.args = {};
		process.argv.slice(2).forEach((arg) => {
			if (arg.startsWith('--')) {
				arg = arg.slice(2);
				const parts = arg.split('=');
				const key = parts[0];
				let value = parts[1] ? parts[1] : true;
				this.args[key] = value;
			}
		});
	}
}

let ob = new OrgBuilder();
ob.start();
