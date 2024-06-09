import { CrawlerOptions, CrawlerResponse } from "@/types"
import axios from "axios";
import { ZodError, z } from "zod";
import { CrawlerError, ValidatorCrawlerError } from "@/errors";

type RenameMap<T> = Map<keyof Required<T>, string>
export default abstract class Crawler<T extends CrawlerOptions> {
    private readonly MaxLimit = 5000;

    protected _host: string;
    protected _map: RenameMap<T>;
    protected _options: T;

    constructor(host: string, map: { [key in keyof Required<T>]: string }, options: T) {
        try {
            this._host = z.string().url().parse(host, { path: ["host"] });

            this._options = z.object({
                semesterID: z.string().regex(/^\d{1,}$/),
                limit: z.number().positive().max(this.MaxLimit)
            }).parse(options, { path: ['options'] }) as T;

            this._map = z.map(z.string(), z.string()).parse(
                new Map(Object.entries(map) as []),
                { path: ['map'] }
            ) as RenameMap<T>;
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ValidatorCrawlerError(error);
            } else {
                throw new CrawlerError("Have a crashed error while constructing crawler: " + (error as Error).message, error as Error);
            }
        }
    }

    // public setQuery(queries: T) {
    //     this._option = this.filterQuery(queries);
    // }

    // private filterQuery(queries: T): T {
    //     const cloned_queries = JSON.parse(JSON.stringify(this._option));

    //     Object.keys(queries).forEach(key => {
    //         if (this._map.get(key as keyof T) && queries[key as keyof T] !== undefined) {
    //             cloned_queries[key as keyof T] = queries[key as keyof T];
    //         } else {
    //             throw new Error("Invalid query key: " + key);
    //         }
    //     })

    //     return cloned_queries
    // }

    // public getQuery() {
    //     return this._option;
    // }

    // private joinParameters(queries?: T): string {
    //     const cloned_queries = queries ? this.filterQuery(queries) : this._option;

    //     return "?" + Object
    //         .keys(cloned_queries)
    //         .map(key => this._map.get(key as keyof T) + "=" + cloned_queries[key as keyof T])
    //         .join("&");
    // }

    // protected async fetchData(options?: T): Promise<CrawlerResponse<string>> {
    //     try {
    //         const response = await axios.get(this._host + this.joinParameters(options));

    //         return {
    //             status: response.status,
    //             data: (response.status === 200) ? response.data : undefined,
    //             message: response.statusText
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             return {
    //                 status: error.response.status,
    //                 data: undefined,
    //                 message: "Axios error: " + error.message
    //             }
    //         } else {
    //             return {
    //                 status: 500,
    //                 data: undefined,
    //                 message: "Unknown error: " + error.message
    //             }
    //         }
    //     }
    // }

    // protected abstract parseData(data: string): object

    // public async getData<R = T>(queries?: T, handler?: (data: string) => R[]): Promise<R[]> {
    //     try {
    //         const response = await this.fetchData(queries);

    //         if (response.status === 200) {
    //             return (handler)
    //                 ? handler(response.data)
    //                 : this.parseData(response.data) as R[]
    //         } else throw new Error(response.message)
    //     } catch (error) {
    //         // console.error(error);
    //         return undefined;
    //     }
    // }
}
