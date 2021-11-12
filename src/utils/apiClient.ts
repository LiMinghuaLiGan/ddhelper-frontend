import Axios from 'axios';
import { useCallback, useMemo } from 'react';
import {
  LoginValues,
  LoginApiReturn,
  RegisterValues,
  UserModel,
  UserMetadatumModel
} from './apiModels';

/**
 * Access api endpoints.
**/
export function useApi(token?: string) {
  const axios = useMemo(() => {
    const axios = Axios.create({
      // baseURL: process.env.REACT_APP_API_BASE,
      baseURL: 'http://yapi.phystack.top/mock/11'
    });

    axios.interceptors.request.use((req) => {
      token && (req.headers = {
        authorization: `Bearer ${token}`,
      });
      return req;
    });

    axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response.data.message && err.response.status !== 500)
          err.id = err.response.data.message[0].messages[0].id;
        else if (err.response.status === 500) {
          err.id = err.response.data.error;
          err.message = err.response.data.message;
        } else err.id = err.message;
        throw err;
      }
    );

    return axios;
  }, [token]);

  return {
    postLogin: useCallback(
      async (values: LoginValues): Promise<LoginApiReturn> =>
        (await axios.post<LoginApiReturn>('/auth/login', values)).data,
      [axios]
    ),
    postRegister: useCallback(
      async (values: RegisterValues): Promise<LoginApiReturn> =>
        (await axios.post<LoginApiReturn>('/auth/register', values))
          .data,
      [axios]
    ),
    getUserMe: useCallback(
      async (token?: string): Promise<UserModel> =>
        (
          await axios.get<UserModel>(
            '/users/me',
            token
              ? {
                headers: { authorization: `Bearer ${token}` },
              }
              : {}
          )
        ).data,
      [axios]
    ),
    putUserMetadataMe: useCallback(
      async (
        data: Partial<UserMetadatumModel>
      ): Promise<UserMetadatumModel> => {
        return (
          await axios.put<UserMetadatumModel>(
            '/user-metadata/me',
            Object.assign(
              {},
              data
            )
          )
        ).data;
      },
      [axios]
    ),
    postForgotPassword: useCallback(
      async (email: string) =>
        (
          await axios.post(`/auth/forgot-password`, {
            email,
          })
        ).data,
      [axios]
    ),
    postResetPassword: useCallback(
      async (code: string, password: string, passwordConfirmation: string) =>
        (
          await axios.post(`/auth/reset-password`, {
            code,
            password,
            passwordConfirmation,
          })
        ).data,
      [axios]
    ),
  };
}


const axiosFetcher = async (url: string, params?: any) =>
  (await Axios.get(url, { params })).data;
/**
 * Access api.sekai.best endpoints.
 */
  // export function useApi() {
  //   const axios = Axios.create({
  //     baseURL: process.env.REACT_APP_API_BACKEND_BASE,
  //   });
  // }