import { Response } from "express";

export default class FeedbackUtils {
    static throwConsoleError(errorMsg: string, errorCode: number) {
        console.error(errorMsg);
        this.logRouteCallEndError(errorCode);
    }

    static throwHTTPResError(res: Response, errorMsg: string, errorCode: number = 400) {
        if (errorMsg == undefined) errorMsg = "undefined";
        res.status(errorCode).json({ err: { message: errorMsg } });
    }

    static throwHTTPResConsoleError(res: Response, errorMsg: string, errorCode: number = 400) {
        this.throwConsoleError("Error: " + errorMsg, errorCode);
        this.throwHTTPResError(res, errorMsg);
    }

    static returnHTTPResSuccess(res: Response, data: any) {
        this.logRouteCallEndSuccess();
        return res.json(data)
    }

    static logRouteCallStart(route: string, method: string = "GET") {
        console.log("=== " + method + " " + route + " ===");
    }

    static logRouteCallEndSuccess() {
        console.log("=== return 200 ===");
    }

    static logRouteCallEndError(errorCode: number = 400) {
        console.log("=== return " + (errorCode) + " ===");
    }
}