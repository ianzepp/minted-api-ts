

export class ErrorTrace extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        console.trace('ErrorTrace:', message);
    }
}