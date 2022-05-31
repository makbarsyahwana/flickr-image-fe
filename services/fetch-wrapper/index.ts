import getConfig from 'next/config';
import {IResponseAPI} from "../interface/api.interface";
import {NextRouter} from "next/router";

const {publicRuntimeConfig} = getConfig();

export interface IOptionFetch {
    abort?: AbortController,
    router?: NextRouter,
    token: string,
}

export const fetchWrapper = {
    get,
    getFile,
    post,
    postFormData,
    patch,
    put,
    delete: _delete
};

function get(opt: IOptionFetch, url: string) {
    const requestOptions = {
        method: 'GET',
        headers: authBearer(url, opt.token),
        signal: opt?.abort?.signal,
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

function getFile(opt: IOptionFetch, url: string) {
    const requestOptions = {
        method: 'GET',
        headers: authBearer(url, opt.token),
        signal: opt?.abort?.signal,
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponseFile).catch(e => handleErrors(e, opt));
}

function post(opt: IOptionFetch, url: string, body: any) {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', ...authBearer(url, opt.token)},
        credentials: 'include',
        body: JSON.stringify(body)
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

function postFormData(opt: IOptionFetch, url: string, body: any) {
    const requestOptions = {
        method: 'POST',
        headers: {...authBearer(url, opt.token)},
        credentials: 'include',
        body: body
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

function patch(opt: IOptionFetch, url: string, body: any) {
    const requestOptions = {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json', ...authBearer(url, opt.token)},
        credentials: 'include',
        body: JSON.stringify(body)
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

function put(opt: IOptionFetch, url: string, body: any) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', ...authBearer(url, opt.token)},
        body: JSON.stringify(body)
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(opt: IOptionFetch, url: string) {
    const requestOptions = {
        method: 'DELETE',
        headers: authBearer(url, opt.token)
    } as RequestInit;
    return fetch(url, requestOptions).then(handleResponse).catch(e => handleErrors(e, opt));
}

// helper functions

function authBasic(url: string, token: string) {
    // return auth header with basic auth credentials if user is logged in and request is to the api url
    const isApiUrl = url.startsWith(`${process.env.NEXT_PUBLIC_API_HOST}`);

    if (isApiUrl && token !== "") {
        return {Authorization: `Basic ${token}`};
    } else {
        return {};
    }
}

function authBearer(url: string, token: string) {
    // return auth header with bearer auth credentials if user is logged in and request is to the api url
    const isApiUrl = url.startsWith(`${process.env.NEXT_PUBLIC_API_HOST}`);

    if (isApiUrl && token !== "") {
        return {Authorization: `Bearer ${token}`};
    } else {
        return {};
    }
}

function handleResponse(response: any): IResponseAPI {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject({
                status: response.status,
                message: error,
                error: true,
            });
        }

        return {data} as any;
    });
}

function handleResponseFile(response: any) {
    if (!response.ok) {
        const data = response.text() && JSON.parse(response.text());
        const error = (data && data.message) || response.statusText;
        return Promise.reject({
            status: response.status,
            message: error,
            error: true,
        });
    }

    return {
        message: response.headers.get('content-disposition')
            .split(';')
            .find((n: any) => n.includes('filename='))
            .replace('filename=', '')
            .trim(),
        data: response.arrayBuffer()
    };
}

function handleErrors(e: any, opt: IOptionFetch): any {
    throw new Error('Function not implemented.');
}

