class apierrorhandler extends Error{
    constructor(
        message = "error message in apierror",
        statuscode = 0,
        stack = [],
        errors = []

    ){
        super(message)
        this.statuscode = statuscode
        this.errors = errors
        this.data = null
        

    }
}
