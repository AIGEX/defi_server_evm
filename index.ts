import { GRPC_HOST, GRPC_PORT, IS_PRODUCTION } from "@/constants";
import { ReflectionService } from "@grpc/reflection";
import fs from "fs";
import { join } from "path";
import { SwapServiceService } from "./src/generated/swap";
import { PinoLogger } from "./src/PinoLogger";
import GrpcServer, { getPackageDefinition } from "./src/server";
import { executeSwap } from "./src/services/executeSwap";

const logger = PinoLogger.getInstance();
logger.info("Starting server");

const server = new GrpcServer();
server.addService(SwapServiceService, { executeSwap });

// only add reflection service if in development for debugging
if (!IS_PRODUCTION) {
    const protoDir = join(__dirname, "../proto");
    const protoFiles = fs.readdirSync(protoDir).filter((file) => file.endsWith(".proto"));

    const packageDefinition = protoFiles
        .map((file) => {
            return getPackageDefinition(file);
        })
        .reduce((acc, def) => {
            return { ...acc, ...def };
        }, {});
    const reflection = new ReflectionService(packageDefinition);
    reflection.addToServer(server);
}

server.start(GRPC_HOST, GRPC_PORT);
