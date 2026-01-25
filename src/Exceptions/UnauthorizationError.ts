export class UnathorizationError extends Error{
    constructor(message:string){
        super(message);
        this.name = 'UnathorizationError';


        Object.setPrototypeOf(this, UnathorizationError.prototype);
    }
}