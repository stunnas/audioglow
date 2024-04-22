import { JSX, SVGProps } from "react";

//https://www.svgrepo.com/svg/428835/audio-eq-media
export function EQIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            fill="#000000"
            width="800px" 
            height="800px"
            viewBox="0 0 48 48"
            style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round",strokeMiterlimit:"1.41421"}}
            version="1.1"
            xmlSpace="preserve" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="play_eq_trackbar">
                <g id="window">
                    <path d="M3.745,35.279L3.745,12.35C3.745,10.68 5.101,9.324 6.771,9.324L41.42,9.324C43.088,9.324 44.448,10.678 44.448,12.35L44.448,35.279C44.448,36.949 43.091,38.305 41.42,38.305L6.771,38.305C5.101,38.305 3.745,36.949 3.745,35.279ZM15.83,36.39L15.83,11.24L6.771,11.24C6.158,11.24 5.661,11.738 5.661,12.35L5.661,35.279C5.661,35.892 6.158,36.39 6.771,36.39L15.83,36.39ZM42.534,35.279L42.534,12.35C42.534,11.74 42.036,11.24 41.42,11.24L16.893,11.24L16.893,36.39L41.42,36.39C42.034,36.39 42.534,35.892 42.534,35.279Z" id="window1"/>
                    <path d="M7.107,13.163C7.107,12.657 7.52,12.243 8.026,12.243C8.533,12.243 8.944,12.657 8.944,13.163C8.944,13.667 8.533,14.08 8.026,14.08C7.52,14.08 7.107,13.667 7.107,13.163ZM9.707,13.163C9.707,12.657 10.119,12.243 10.625,12.243C11.131,12.243 11.544,12.657 11.544,13.163C11.544,13.667 11.131,14.08 10.625,14.08C10.119,14.08 9.707,13.667 9.707,13.163ZM12.306,13.163C12.306,12.657 12.718,12.243 13.223,12.243C13.729,12.243 14.142,12.657 14.142,13.163C14.142,13.667 13.729,14.08 13.223,14.08C12.718,14.08 12.306,13.667 12.306,13.163Z" id="window-actions"/>
                </g>
                <g id="trackbar">
                    <path d="M19.886,33.17C19.886,32.879 20.124,32.639 20.417,32.639L39.967,32.639C40.259,32.639 40.499,32.879 40.499,33.17C40.499,33.464 40.259,33.702 39.967,33.702L20.417,33.702C20.124,33.702 19.886,33.464 19.886,33.17Z" id="line"/>
                    <path d="M25.156,30.886C26.342,30.886 27.309,31.853 27.309,33.039C27.309,34.225 26.342,35.192 25.156,35.192C23.97,35.192 23.003,34.225 23.003,33.039C23.003,31.853 23.97,30.886 25.156,30.886Z" id="position"/>
                </g>
                <path d="M20.085,27.044L20.085,18.917C20.085,18.035 20.735,17.315 21.533,17.315L21.535,17.315C22.333,17.315 22.982,18.035 22.982,18.917L22.982,27.044C22.982,27.927 22.333,28.647 21.535,28.647L21.533,28.647C20.735,28.647 20.085,27.927 20.085,27.044ZM24.414,27.044L24.414,25.621C24.414,24.737 25.062,24.019 25.86,24.019L25.862,24.019C26.66,24.019 27.31,24.737 27.31,25.621L27.31,27.044C27.31,27.927 26.66,28.647 25.862,28.647L25.86,28.647C25.062,28.647 24.414,27.927 24.414,27.044ZM28.742,27.044L28.742,22.944C28.742,22.06 29.391,21.341 30.189,21.341L30.191,21.341C30.989,21.341 31.639,22.06 31.639,22.944L31.639,27.044C31.639,27.927 30.989,28.647 30.191,28.647L30.189,28.647C29.391,28.647 28.742,27.927 28.742,27.044ZM33.071,27.044L33.071,24.876C33.071,23.992 33.719,23.274 34.517,23.274L34.519,23.274C35.317,23.274 35.966,23.992 35.966,24.876L35.966,27.044C35.966,27.927 35.317,28.647 34.519,28.647L34.517,28.647C33.719,28.647 33.071,27.927 33.071,27.044ZM37.399,27.157L37.399,27.155C37.399,26.333 38.048,25.666 38.846,25.666L38.848,25.666C39.646,25.666 40.294,26.333 40.294,27.155L40.294,27.157C40.294,27.978 39.646,28.647 38.848,28.647L38.846,28.647C38.048,28.647 37.399,27.978 37.399,27.157Z" id="eq"/>
                <path d="M13.859,24.853L9.308,27.483C8.932,27.7 8.625,27.524 8.625,27.088L8.624,21.831C8.624,21.396 8.931,21.219 9.308,21.437L13.859,24.065C14.236,24.282 14.236,24.636 13.859,24.853Z" id="play"/>
            </g>
        </svg>
    )
}

export function ChevronLeftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}


export function PlayIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    )
}


export function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}


export function RepeatIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
    )
}


export function SkipBackIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" x2="5" y1="19" y2="5" />
        </svg>
    )
}


export function SkipForwardIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" x2="19" y1="5" y2="19" />
        </svg>
    )
}