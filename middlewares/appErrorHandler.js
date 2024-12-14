import httpStatusCodes from "../shared/httpstatuscodes.js";

const appErrorhandler = (err, req, res, next) => {
  res.status(err.status || httpStatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    error: err.message || "Internal Server Error",
    status: err.status || httpStatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: err.isOperational || false
  });
}

export default appErrorhandler;