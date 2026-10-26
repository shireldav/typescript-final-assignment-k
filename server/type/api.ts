//same pattern for server res, for simplicity & so the client knows what to expect

export interface ApiSuccess<T> {
  success: true;
  data: T; //T (general), since data types can be different for each endpoint
}

export interface ApiError {
  success: false;
  error: string; //str so user can read the msg
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError; //success = true if successful, success = false if not

