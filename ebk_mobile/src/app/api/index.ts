import {AxiosError} from 'axios';
import useAxios from './useAxios';

export const file_url = `https://d31uetu06bkcms.cloudfront.net/`;
export const api_url = `https://ecclesiabook.org/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;
// export const api_url = `http://192.168.1.121:4000/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;
// export const api_url = `http://172.20.10.9:4000/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;

// export const api_url = `https://ecclesiabook.org/api_test/`;
// export const front_url = `https://ecclesiabook.org/`;
// export const front_url = `http://192.168.18.4:3000/`;

export const front_url = `https://ecclesiabook.org/`;

export async function HttpRequest(
  path: string,
  method: string = 'GET',
  data?: any,
  contentType: string = 'application/json',
) {
  const api = useAxios({contentType});

  const request = {
    url: `${path}`,
    method,
    data,
  };
  return await api(request)
    .then(r => {
      return r;
    })
    .catch((error: AxiosError) => {
      return error.response;
    });
}

export async function AuthHttpRequest(
  path: string,
  method: string,
  data?: any,
  params?: any,
) {
  try {
    const url = `${api_url}${path}`;

    // if (params) {
    //   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    // }

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function RequestApi(
  path: string,
  method: string,
  data?: any,
  params?: any,
) {
  try {
    const url = new URL(path);
    if (params) {
      Object.keys(params).forEach(key =>
        url.searchParams.append(key, params[key]),
      );
    }

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // document.location = 'https://ecclesiabook.org/AuthConnexionView';
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
