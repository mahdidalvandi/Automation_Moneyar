import { useState } from "react";

export default function Status(props) {
    return props.status == 1 ? (
        <button disabled>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="gray"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                color="gray"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M 19.980469 5.9902344 A 1.0001 1.0001 0 0 0 19.292969 6.2929688 L 9 16.585938 L 5.7070312 13.292969 A 1.0001 1.0001 0 1 0 4.2929688 14.707031 L 8.2929688 18.707031 A 1.0001 1.0001 0 0 0 9.7070312 18.707031 L 20.707031 7.7070312 A 1.0001 1.0001 0 0 0 19.980469 5.9902344 z"
                />
            </svg>
        </button>
    ) : (
        <button disabled>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="gray"
                viewBox="0 0 122 74"
                stroke="currentColor"
                strokeWidth={2}
                color="gray"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M1.87,47.2a6.33,6.33,0,1,1,8.92-9c8.88,8.85,17.53,17.66,26.53,26.45l-3.76,4.45-.35.37a6.33,6.33,0,0,1-8.95,0L1.87,47.2ZM30,43.55a6.33,6.33,0,1,1,8.82-9.07l25,24.38L111.64,2.29c5.37-6.35,15,1.84,9.66,8.18L69.07,72.22l-.3.33a6.33,6.33,0,0,1-8.95.12L30,43.55Zm28.76-4.21-.31.33-9.07-8.85L71.67,4.42c5.37-6.35,15,1.83,9.67,8.18L58.74,39.34Z"
                />
            </svg>
        </button>
    );
}
