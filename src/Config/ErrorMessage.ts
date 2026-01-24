
export default function getErrorMessage(error : unknown): string{
    if (error instanceof Error){
        return error.message
    }

    if(typeof error === 'string'){
        return error
    }

    /*fall back if none of the match's checkout*/

    return "An unexpected Error occured"
}   


