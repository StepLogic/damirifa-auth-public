interface statusCode {
  GET_SUCCESS: number;
  NOT_FOUND: number;
  POST_SUCCESS: number;
  UNAUTHORIZED: number;
  BAD_REQUEST: number;
  INTERNAL_SERVER_ERROR: number;
}
const statusCodes: statusCode = {
  GET_SUCCESS: 200,
  NOT_FOUND: 404,
  POST_SUCCESS: 201,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};
export = statusCodes;
