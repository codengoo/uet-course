import { ZodError } from "zod";

export class CrawlerError extends Error {
    public original?: Error;

    constructor(message: string, original?: Error) {
        super(message);
        this.name = this.constructor.name;
        this.original = original;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidatorCrawlerError extends CrawlerError {
    public description: string;

    constructor(error: ZodError) {
        super("Invalid " + error.issues[0].path.join("/"));
        this.name = this.constructor.name;
        this.description = error.issues[0].message;

        Error.captureStackTrace(this, this.constructor);
    }
}