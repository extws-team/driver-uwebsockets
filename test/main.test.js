
import ExtWSUWebSocketsDriver from '../src/main.js';

import runTests, {
	SERVER_PORT  } from '@extws/test-driver/mocha'; // eslint-disable-line import/no-unresolved, import/extensions

runTests(
	new ExtWSUWebSocketsDriver({
		port: SERVER_PORT,
	}),
);
