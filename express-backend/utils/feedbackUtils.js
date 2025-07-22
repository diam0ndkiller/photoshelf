export default class FeedbackUtils {
    static throwConsoleError(errorMsg, errorCode) {
        console.error(errorMsg);
        this.logRouteCallEndError(errorCode);
    }

    static throwHTTPResError(res, errorMsg, errorCode) {
        res.status(errorCode ? errorCode : 400).json({ error: errorMsg });
    }

    static throwHTTPResConsoleError(res, errorMsg, errorCode) {
        this.throwConsoleError("Error: " + errorMsg, errorCode);
        this.throwHTTPResError(res, errorMsg);
    }

    static returnHTTPResSuccess(res, data) {
        this.logRouteCallEndSuccess();
        return res.json(data)
    }

    static logRouteCallStart(route, method = "GET") {
        console.log("=== " + method + " " + route + " ===");
    }

    static logRouteCallEndSuccess() {
        console.log("=== return 200 ===");
    }

    static logRouteCallEndError(errorCode) {
        console.log("=== return " + (errorCode ? errorCode : 400) + " ===");
    }
}