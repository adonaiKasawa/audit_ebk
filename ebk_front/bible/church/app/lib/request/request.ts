import { auth } from "@/auth";
import { log } from "console";

export const file_url = `https://d31uetu06bkcms.cloudfront.net/`;

// export const api_url = `http://192.168.0.157:4000/api/`; // HOMEBOX ORANGE
// export const api_url = `http://172.20.10.2:4000/api/`; // IP IPHONE

export const api_url = `http://localhost:4000/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;

//export const api_url = `https://ecclesiabook.org/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API/`;
// export const api_url = `https://ecclesiabook.org/EhE7Aiheobj6gcBCZUsTkA5KliDrWvM_API_TEST/`;

// export const front_url = `http://localhost:3000/`;
// export const front_url = `https://ecclesiabook.linked-solution.net/`;
export const front_url = `https://ecclesiabook.org/`;

export async function HttpRequest(
  path: string,
  method: string = "GET",
  body?: any,
) {
  const session = await auth();

  const headers: any =
    body instanceof FormData
      ? {
          Authorization: `Bearer ${session?.token.access_token}`,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token.access_token}`,
        };

  try {
    const res = await fetch(`${api_url}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    // if (!res.ok) {

    //   return null;
    // }
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function AuthHttpRequest(
  path: string,
  method: string,
  data?: any,
  // params?: any,
) {
  try {
    // const url = new URL(`${api_url}${path}`);
    // if (params) {
    //   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    // }

    const response = await fetch(`${api_url}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });
    const res = await response.json();

    return res;
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
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key]),
      );
    }

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      // console.error("Response Error:", response);
      if (response.status === 401) {
        document.location = "https://ecclesiabook.org/AuthConnexionView";
      }

      return null;
    }

    return await response.json();
  } catch (error) {
    // console.error("Fetch Error:", error);
    throw error;
  }
}
