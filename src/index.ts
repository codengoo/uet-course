import { CrawlerOptions, CrawlerResponse } from "@/types"
import axios, { AxiosError } from "axios";
import { ZodError, z } from "zod";
import { CrawlerError, ValidatorCrawlerError } from "@/errors";

type RenameMap<T> = Map<keyof Required<T>, string>
// type RenameObject<T> = { [key in keyof Required<T>]: string }; // optional
type RenameObject<T> = Record<keyof Required<T>, string> // required
export default abstract class Crawler<T extends CrawlerOptions> {
    private readonly MaxLimit = 5000;

    protected _host: string;
    protected _map: RenameMap<T>;
    protected _options: T;

    constructor(host: string, map: RenameObject<T>, options: T) {
        try {
            this._host = "";
            this._map = new Map();

            this.setHost(host);
            this.setMap(map);

            this._options = z.object({
                semesterID: z.string().regex(/^\d{1,}$/),
                limit: z.number().positive().max(this.MaxLimit)
            }).parse(options, { path: ['options'] }) as T;
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ValidatorCrawlerError(error);
            } else {
                throw new CrawlerError("Have a crashed error while constructing crawler: " + (error as Error).message, error as Error);
            }
        }
    }

    public setHost(host: string) {
        this._host = z.string().url().parse(host, { path: ["host"] });
    }

    public getHost() {
        return this._host;
    }

    public setOptions(options: Partial<T>) {
        this._options = { ...this._options, ...this.filterOptions(options) };
    }

    public getOptions() {
        return this._options;
    }

    public setMap(map: RenameObject<T>) {
        this._map = z.map(z.string(), z.string()).parse(
            new Map(Object.entries(map) as []),
            { path: ['map'] }
        ) as RenameMap<T>;
    }

    public getMap() {
        return this._map;
    }

    /**
     * Eliminates elements that not exist in _map or their values are undefined. 
     * Override option fields with newest values
     * @param modifiedOptions 
     * @returns 
     */
    private filterOptions(modifiedOptions?: Partial<T>): Partial<T> {
        const mergedOptions = { ...this._options, ...(modifiedOptions ? modifiedOptions : {}) }; // merge options
        const fields = Object.keys(mergedOptions) as (keyof T)[];
        const options = {} as Partial<T>;

        fields.forEach(key => {
            if (this._map.get(key) && mergedOptions[key] !== undefined) {
                options[key] = mergedOptions[key];
            }
        })

        return options
    }

    /**
     * Convert options to query string
     * @param options 
     * @returns 
     */
    private joinParameters(options?: Partial<T>): string {
        const queries = this.filterOptions(options ? options : this._options);

        return "?" + (Object
            .keys(queries) as (keyof T)[])
            .map(key => this._map.get(key) + "=" + queries[key])
            .join("&");
    }

    /**
     * Fetching data from UET portal
     * @param options 
     * @returns 
     */
    protected async fetchData(options?: Partial<T>): Promise<CrawlerResponse<string>> {
        try {
            const response = await axios.get(this._host + this.joinParameters(options));

            return {
                status: response.status,
                data: (response.status === 200) ? response.data : undefined,
                message: response.statusText
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    status: error.response?.status || 500,
                    message: "Axios error: " + error.message
                }
            } else {
                return {
                    status: 500,
                    message: "Unknown error: " + (error as Error).message
                }
            }
        }
    }

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
