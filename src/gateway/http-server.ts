import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'node:http';

type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;

const routes = new Map<string, RequestHandler>();
let _server: Server | null = null;

export function registerHttpRoute(path: string, handler: RequestHandler): void {
  routes.set(path, handler);
}

export async function startSharedHttpServer(port: number): Promise<Server> {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const handler = routes.get(req.url ?? '');
    if (handler) {
      try {
        await Promise.resolve(handler(req, res));
      } catch {
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Internal Server Error');
        }
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  _server = server;
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => resolve(server));
  });
}

export function getSharedHttpServer(): Server | null {
  return _server;
}
