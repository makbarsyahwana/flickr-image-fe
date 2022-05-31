import getConfig from 'next/config';
import {fetchWrapper, IOptionFetch} from "./fetch-wrapper";
import {
    IResImageData,
    
} from "./interface/image.interface";

const {publicRuntimeConfig} = getConfig();
const baseUrl = `${process.env.NEXT_PUBLIC_API_HOST}`;

export const imageServices = {
    getImageFeed,
};

async function getImageFeed(opt: IOptionFetch) {
    const url = `${baseUrl}/image`

    interface IResponseEndpoint {
        status: number;
        message: string;
        error: boolean;
        data: IResImageData;
    }

    const res = await fetchWrapper.get(opt, url);
    return res as IResponseEndpoint;
}