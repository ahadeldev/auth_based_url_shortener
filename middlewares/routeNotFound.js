import httpStatusCodes from "../shared/httpstatuscodes.js"

const routeNotFound = (req, res, next) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    status: false,
    message: `Route ${req.originalUrl} Not Found`,
  })
}

export default routeNotFound;