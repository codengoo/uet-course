import { CrawlerError, ValidatorCrawlerError } from "@/errors";
import Crawler from "@/index";
import { CrawlerOptions } from "@/types";

describe("Base Crawler", () => {
    interface ISample extends CrawlerOptions {
        stt1?: number,
        stt2: string
    }

    class Sample extends Crawler<ISample> {
        constructor(
            host: string,
            semesterID: string,
            limit: number,
            map: Record<keyof Required<ISample>, string>) {

            super(host, map, { semesterID, limit, stt2: "" });
        }
    }

    test("Creating constructor 1", () => {
        try {
            // @ts-ignore
            new Sample("localhost/admin.php", undefined, undefined, undefined);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatorCrawlerError);
            expect((e as Error).message).toBe("Invalid host");
            expect((e as ValidatorCrawlerError).description).toBe("Invalid url");
        }
    })

    test("Creating constructor 2", () => {
        try {
            // @ts-ignore
            new Sample("http://localhost/admin.php", "23", undefined, undefined);
        } catch (e) {
            expect(e).toBeInstanceOf(CrawlerError);
            expect((e as Error).message).toBe("Have a crashed error while constructing crawler: Cannot convert undefined or null to object");
        }
    })

    test("Creating constructor 3", () => {
        try {
            // @ts-ignore
            new Sample("http://localhost/admin.php", "50", undefined, {});
        } catch (e) {
            expect(e).toBeInstanceOf(ValidatorCrawlerError);
            expect((e as Error).message).toBe("Invalid options/limit");
            expect((e as ValidatorCrawlerError).description).toBe("Required");
        }
    })

    test("Creating constructor 4", () => {
        var sample = new Sample("http://localhost/admin.php", "50", 10, {
            stt1: "sothutu1",
            stt2: "sothutu2",
            limit: "limit",
            semesterID: "semesterID"
        });

        expect(sample).toEqual({
            "_host": "http://localhost/admin.php",
            "_map": new Map(Object.entries({
                "stt1": "sothutu1",
                "stt2": "sothutu2",
                "limit": "limit",
                "semesterID": "semesterID"
            })),
            "_options": {
                limit: 10,
                semesterID: "50"
            },
            "MaxLimit": 5000
        })
    })
});
