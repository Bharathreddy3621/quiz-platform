const sendResponse = (res, message, success, data, status = 200) => {
  const payload = {
    message,
    success,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(status).send(payload);
};

const sendSuccess = (res, message, data, status = 200) => {
  return sendResponse(res, message, true, data, status);
};

const sendFailure = (res, message, data, status = 200) => {
  return sendResponse(res, message, false, data, status);
};

const sendError = (res, error, status = 500) => {
  return res.status(status).send({
    message: error.message,
    data: error,
    success: false,
  });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendFailure,
  sendError,
};
