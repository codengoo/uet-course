import { CrawlerError, ValidatorCrawlerError } from "@/errors";
import Crawler from "@/index";
import { CrawlerOptions } from "@/types";

describe("Base Crawler Func", () => {
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

            super(host, map, { semesterID, limit, stt2: "Text" });
        }
    }

    const sample = new Sample("http://localhost/admin.php", "050", 10, {
        limit: "_limit",
        semesterID: "_semesterID",
        stt1: "sothutu1",
        stt2: "sothutu2"
    });

    test("Test filterOptions", () => {
        expect(sample['filterOptions']()).toEqual({
            limit: 10,
            semesterID: "050"
        })

        // @ts-ignore
        expect(sample['filterOptions']({ limit: 20, aa: 10, stt1: 1 })).toEqual({
            limit: 20,
            semesterID: "050",
            stt1: 1
        })
    })

    test("Test joinParameters", () => {
        expect(sample['joinParameters']()).toBe("?_semesterID=050&_limit=10");
        expect(sample['joinParameters']({ limit: 2 })).toBe("?_semesterID=050&_limit=2");
    })

    test("Test setOptions/getOptions", () => {
        sample.setOptions({ limit: 20 });
        expect(sample.getOptions()).toEqual({
            limit: 20,
            semesterID: "050",
        });
    })

    test("Test setHost/getHost", () => {
        sample.setHost("http://localhost");
        expect(sample.getHost()).toBe("http://localhost");
    })

    test("Test setMap/getMap", () => {
        sample.setMap({
            limit: "limit",
            semesterID: "semesterID",
            stt1: "statusCode",
            stt2: "code"
        })

        expect(sample.getMap()).toEqual(
            new Map(Object.entries({
                limit: "limit",
                semesterID: "semesterID",
                stt1: "statusCode",
                stt2: "code"
            })));
    })

    test("Test fetchData", async () => {
        sample.setHost("http://localhost:9000/base");
        sample.setMap({
            limit: "limit",
            semesterID: "semesterID",
            stt1: "statusCode",
            stt2: "contentType"
        })
        sample.setOptions({
            limit: 10,
            semesterID: "050",
            stt1: 200,
            stt2: "text/plain"
        });

        expect(await sample['fetchData']()).toEqual({
            status: 200,
            data: "OK: {\"statusCode\":\"200\",\"contentType\":\"text/plain\"}",
            message: "OK"
        });

        expect(await sample['fetchData']({ stt2: "json" })).toEqual({
            status: 200,
            data: {
                statusCode: "200",
                contentType: "json"
            },
            message: "OK"
        });

        expect(await sample['fetchData']({ stt1: 500 })).toEqual({
            status: 500,
            data: "Axios error: Request failed with status code 500",
            message: "OK"
        });

        expect(await sample['fetchData']({ stt1: 201 })).toEqual({
            status: 201,
            data: "Axios error: Request failed with status code 500",
            message: "OK"
        });
    });
});
