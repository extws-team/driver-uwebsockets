
import ExtWSClient from '@extws/server/client'; // eslint-disable-line import/no-unresolved, import/extensions

export default class ExtWSUWebSocketsClient extends ExtWSClient {
	#uwebsockets_client;

	constructor(
		uwebsockets_client,
		...args
	) {
		super(...args);

		this.#uwebsockets_client = uwebsockets_client;
	}

	addToGroup(group) {
		try {
			this.#uwebsockets_client.subscribe(group);
		}
		catch {
			this.disconnect();
		}
	}

	removeFromGroup(group) {
		try {
			this.#uwebsockets_client.unsubscribe(group);
		}
		catch {
			this.disconnect();
		}
	}

	sendPayload(payload) {
		try {
			this.#uwebsockets_client.send(payload);
		}
		catch {
			this.disconnect();
		}
	}

	disconnect(
		is_already_disconnected = false,
		hard = false,
	) {
		if (hard === true) {
			try {
				this.#uwebsockets_client.close();
			}
			catch {}
		}
		else if (is_already_disconnected !== true) {
			try {
				this.#uwebsockets_client.end();
			}
			catch {}
		}

		super.disconnect();
	}
}
