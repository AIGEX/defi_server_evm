const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? "6379", 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

const IS_PRODUCTION = (process.env.IS_PRODUCTION ?? "false") === "true";
const GRPC_HOST = process.env.GRPC_HOST as string;
const GRPC_PORT = parseInt(process.env.GRPC_PORT as string);

export { GRPC_HOST, GRPC_PORT, IS_PRODUCTION, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT };
