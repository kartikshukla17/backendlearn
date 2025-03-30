const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}

// here we are using promises as async handler though can use try and catch as well!

//const asyncHandler = (fn) => {} //since yaha toh callback aagya yah atoh we cant work with fn na so we will write a higher order function for that! 



//const asyncHandler = (fn) => () => {} //to make it async ye second parentheses pe async laga do! 
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// } 