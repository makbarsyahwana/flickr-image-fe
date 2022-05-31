import React from 'react';
import {IResImageData} from "../../services/interface";
import Image from 'next/image'

interface IProps {
    data: any,
    // pagination: IPagination,
    // setPage: any,
}

function ImageFeedComponent(props: IProps) {
    return (
        <>
            <div className="col-md-4">
                <div className="thumbnail">
                    <a href="/w3images/lights.jpg" target="_blank">
                    <Image src={props.data.media.m} alt="Lights" width={350} height={230}/>
                    {/* <div className="caption">
                        {props.data.description}
                    </div> */}
                    </a>
                </div>
            </div>
        </>
    )
}

export default ImageFeedComponent