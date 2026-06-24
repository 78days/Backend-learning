
const asynchandler =  (func) => async (req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status( error , res.json({
            success : false,
            message:error.message
            
        }))
    }
}
export default asynchandler 