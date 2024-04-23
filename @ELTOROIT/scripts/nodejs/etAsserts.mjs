export default class ET_Asserts {
	static equals({ expected, actual, message }) {
		message = `Assertion failed | Expecting EQUALS | Expected: [${expected}] | Actual: [${actual}] | ${message}`;
		ET_Asserts.#assert({ trueValue: expected === actual, message });
	}

	static notEquals({ expected, actual, message }) {
		message = `Assertion failed | Expecting NOT EQUALS | Expected: [${expected}] | Actual: [${actual}] | ${message}`;
		ET_Asserts.assert({ trueValue: expected !== actual, message });
	}

	static hasData({ value, message }) {
		if (!['string', 'number', 'boolean'].includes(typeof value)) {
			if (!value) {
				message = `Assertion failed | Validating if data is present | ${message}`;
				throw new Error(JSON.stringify({ value, message }));
			}
		}
	}

	static includes({ value, listValues, message }) {
		if (!Array.isArray(listValues)) {
			message = `Assertion failed | [listValues] must be an array! | ${message}`;
			throw new Error(JSON.stringify({ value, listValues, message }));
		}
		if (!listValues.includes(value)) {
			message = `Assertion failed | Value [${value}] is not in list [${listValues}] | ${message}`;
			throw new Error(JSON.stringify({ value, listValues, message }));
		}
	}

	static #assert({ trueValue, message }) {
		if (typeof trueValue !== 'boolean') {
			message = `Assertion failed | Boolean expression was expected! [${trueValue}] | ${message}`;
			throw new Error(JSON.stringify({ trueValue, message }));
		}
		if (!trueValue) {
			throw new Error(JSON.stringify({ message }));
		}
	}
}
