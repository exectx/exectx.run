import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';

export class LiveVisitors extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async broadcast(message: string): Promise<void> {
		for (const ws of this.ctx.getWebSockets()) {
			this.printState(ws);
			ws.send(message);
		}
	}

	async webSocketClose(ws: WebSocket): Promise<void> {
		this.broadcast(`${this.ctx.getWebSockets().length - 1}`);
		ws.close();
	}

	async webSocketMessage(ws: WebSocket, _message: string | ArrayBuffer): Promise<void> {
		ws.send(`${this.ctx.getWebSockets().length}`);
	}

	async printState(ws: WebSocket) {
		switch (ws.readyState) {
			case WebSocket.CONNECTING:
				console.log('CONNECTING');
				break;
			case WebSocket.OPEN:
				console.log('OPEN');
				break;
			case WebSocket.CLOSING:
				console.log('CLOSING');
				break;
			case WebSocket.CLOSED:
				console.log('CLOSED');
				break;
			default:
				console.log('UNKNOWN');
				break;
		}
	}

	async sanitize(): Promise<void> {
		const webSockets = this.ctx.getWebSockets();
		for (const ws of webSockets) {
			// if (ws.readyState !== WebSocket.OPEN && ws.readyState !== WebSocket.)
			// 	ws.close();
		}
	}

	async alarm(): Promise<void> {
		// Math.floor(Math.random() * (300 - 200 + 1)) + 200;
		// this.broadcast(`${Math.floor(Math.random() * (300 - 200 + 1)) + 200}`);
		this.broadcast(`${Math.floor(Math.random() * (500 - 10 + 1)) + 10}`);
	}

	async fetch(_request: Request) {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);
		this.ctx.acceptWebSocket(server);
		this.broadcast(`${this.ctx.getWebSockets().length}`);
		// (await this.ctx.storage.getAlarm()) ?? this.ctx.storage.setAlarm(Date.now() + 1000 * 5);
		// this.ctx.waitUntil(
		// 	new Promise((r) => setTimeout(r, 7000)).then(() => this.broadcast(`${Math.floor(Math.random() * (500 - 10 + 1)) + 10}`)),
		// );

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}
}

const app = new Hono<{ Bindings: Env }>();

app.get('/ws/live-visitors', (c) => {
	const upgrade = c.req.header('Upgrade');
	if (upgrade !== 'websocket') {
		c.status(426);
		return c.body('Durable Object expected Upgrade: websocket');
	}
	const id = c.env.LIVE_VISITORS.idFromName('live-visitors');
	const socket = c.env.LIVE_VISITORS.get(id);
	return socket.fetch(c.req.raw);
});

export default {
	async fetch(...params) {
		return app.fetch(...params);
	},
} satisfies ExportedHandler<Env>;
