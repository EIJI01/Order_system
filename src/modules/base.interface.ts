export interface Response<T = null> {
  success: boolean;
  data?: T;
}
