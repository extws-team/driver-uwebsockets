
import ExtWSDriver from '@extws/server/driver'; // eslint-disable-line import/no-unresolved, import/extensions
import IP          from '@kirick/ip';
import uWebSockets from 'uWebSockets.js';

import ExtWSUWebSocketsClient from './client.js';

export default class ExtWSUWebSocketsDriver extends ExtWSDriver {
	#server;

	constructor({
		path = '/ws',
		port,
		payload_max_length,
	}) {
		super();

		this.#server = uWebSockets.App();

		this.#server.ws(
			path,
			{
				compression: 1,
				maxPayloadLength: payload_max_length,
				upgrade(response, request, context) {
					const headers = new Headers();
					// eslint-disable-next-line unicorn/no-array-for-each
					request.forEach((key, value) => {
						headers.append(key, value);
					});

					response.upgrade(
						{
							url: new URL(
								request.getUrl() + '?' + request.getQuery(),
								'ws://' + headers.host,
							),
							headers,
						},
						request.getHeader('sec-websocket-key'),
						request.getHeader('sec-websocket-protocol'),
						request.getHeader('sec-websocket-extensions'),
						context,
					);
				},
				open: (uwebsockets_client) => {
					const client = new ExtWSUWebSocketsClient(
						uwebsockets_client,
						this,
						{
							url: uwebsockets_client.url,
							headers: uwebsockets_client.headers,
							ip: new IP(
								uwebsockets_client.getRemoteAddress(),
							),
						},
					);

					uwebsockets_client._extws_client_id = client.id;

					this.onConnect(client);
				},
				message: (uwebsockets_client, payload) => {
					const client = this.clients.get(
						uwebsockets_client._extws_client_id,
					);

					if (client) {
						if (typeof payload !== 'string' && Buffer.isBuffer(payload) !== true) {
							payload = Buffer.from(payload);
						}

						this.onMessage(
							client,
							payload,
						);
					}
				},
				close: (uwebsockets_client) => {
					const client = this.clients.get(
						uwebsockets_client._extws_client_id,
					);

					if (client) {
						client.disconnect(
							true, // is_already_disconnected
						);
					}
				},
			},
		);

		this.#server.listen(
			port,
			() => {},
		);
	}

	publish(channel, payload) {
		console.log('publish', channel, payload);
		this.#server.publish(
			channel,
			payload,
		);
	}
}
