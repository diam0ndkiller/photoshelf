export class Logger {
    public static info(...args: unknown[]) {
        console.log("[INFO]:", ...args);
    }

    public static debug(...args: unknown[]) {
        console.log("[DEBUG]:", ...args);
    }
}