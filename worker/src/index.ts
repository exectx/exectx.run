import { DurableObject } from 'cloudflare:workers';
import { Hono } from 'hono';

export class LiveVisitors extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async broadcast(message: string): Promise<void> {
		for (const ws of this.ctx.getWebSockets()) {
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

	async alarm(): Promise<void> {
		this.broadcast(`${Math.floor(Math.random() * 1000)}`);
	}

	async fetch(_request: Request) {
		const webSocketPair = new WebSocketPair();
		const [client, server] = Object.values(webSocketPair);
		this.ctx.acceptWebSocket(server);
		this.broadcast(`${this.ctx.getWebSockets().length}`);
		// (await this.ctx.storage.getAlarm()) ?? this.ctx.storage.setAlarm(Date.now() + 1000 * 5);

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
