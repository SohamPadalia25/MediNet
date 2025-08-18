const asyncHandler = (requestHandler) =>{
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
        };
    }; 


export default asyncHandler
/*const asyncHandler = (fn) => async(req, res, next) => {
try { 
await fn(req, res, next);
}catch(err) {

    res.status(500).json({
        status: "error",
        message: err.message,
    });
}
}
*/