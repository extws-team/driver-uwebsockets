
import createServer from '@extws/test-driver/server'; // eslint-disable-line import/no-unresolved, import/extensions
import '@extws/test-driver/client'; // eslint-disable-line import/no-unresolved, import/extensions

import ExtWSUWebSocketsDriver from '../src/main.js';

createServer(
	new ExtWSUWebSocketsDriver({
		port: 18365,
	}),
);
