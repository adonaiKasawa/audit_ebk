import axios from 'axios';
import {store} from '../store';
import {loginUser, logoutUser} from '../store/auth/auth.slice';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';

// export const baseURL = `https://ecclesiabook.org/api_test/`;
export const baseURL = `https://ecclesiabook.org/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;
// export const baseURL = `http://192.168.1.121:4000/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;
// export const baseURL = `http://172.20.10.9:4000/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;

type UseAxiosProps = {contentType: string};

const useAxios = ({contentType}: UseAxiosProps) => {
  const stateGlobale = store.getState();
  const {auth} = stateGlobale;
  const dispatch = store.dispatch;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${auth.access_token}`,
    },
  });

  axiosInstance.interceptors.request.use(async (req: any) => {
    const time = moment().unix();
    const user: any = auth.access_token ? jwtDecode(auth.access_token) : null;
    let isExpired = false;
    if (user !== null) {
      if (time > user?.exp) {
        isExpired = true;
      }
    }
    if (!isExpired) return req;

    const response = await axios(`${baseURL}auth/refresh/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.refresh_token}`,
      },
    }).then(r => r);
    const {data} = response;
    if (data.access_token !== undefined && data.refresh_token !== undefined) {
      dispatch(
        loginUser({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          isAuthenticated: true,
        }),
      );

      req.headers.Authorization = `Bearer ${data.access_token}`;
      return req;
    } else {
      dispatch(logoutUser());
      // navigation.navigate("Login");
    }
  });

  return axiosInstance;
};

export default useAxios;
