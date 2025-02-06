import pino from "pino";

export class PinoLogger {
    private static instance: PinoLogger | null = null;
    private logger: pino.Logger;

    private constructor() {
        const logger = pino({
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
            },
            level: "debug",
        });
        this.logger = logger;
    }

    public static getInstance(): pino.Logger {
        if (this.instance === null) {
            this.instance = new PinoLogger();
        }
        return this.instance.logger;
    }
}
