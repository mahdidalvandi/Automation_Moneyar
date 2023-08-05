import { useState } from "react";

export default function Attachment(props) {
    return props.status == 1 ? (
        <button disabled>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 40 40"
                stroke="currentColor"
                strokeWidth={1}
                color="gray"

            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M33.286,18.322c-0.14-0.133-0.321-0.206-0.524-0.206c-0.192,0.002-0.374,0.075-0.509,0.206L19.512,30.67
                    c-1.263,1.223-2.952,1.905-4.756,1.918h-0.054c-1.784,0-3.464-0.657-4.732-1.848c-1.279-1.202-1.992-2.81-2.006-4.523
                    c-0.014-1.715,0.674-3.333,1.935-4.554L23.169,8.8c0.913-0.886,2.134-1.379,3.438-1.388h0.039c1.287,0,2.503,0.473,3.421,1.336
                    c0.925,0.871,1.438,2.03,1.45,3.268c0.008,1.237-0.488,2.406-1.399,3.288L16.846,28.168c-0.563,0.547-1.315,0.851-2.12,0.856h-0.024
                    c-0.795,0-1.544-0.293-2.111-0.824c-0.569-0.534-0.886-1.248-0.892-2.013c-0.006-0.76,0.299-1.479,0.859-2.022l12.63-12.238
                    c0.139-0.134,0.216-0.313,0.216-0.5c0-0.189-0.077-0.368-0.216-0.503c-0.138-0.132-0.321-0.206-0.523-0.206
                    c-0.191,0.002-0.373,0.075-0.508,0.206L11.524,23.165c-0.839,0.813-1.296,1.891-1.287,3.034c0.008,1.143,0.483,2.214,1.334,3.017
                    c0.838,0.786,1.949,1.221,3.129,1.221h0.036c1.194-0.01,2.312-0.461,3.146-1.269l13.271-12.867c1.19-1.154,1.839-2.68,1.826-4.296
                    c-0.013-1.62-0.686-3.137-1.894-4.271C29.896,6.615,28.32,6,26.646,6h-0.051c-1.691,0.013-3.277,0.651-4.463,1.799L8.861,20.663
                    c-1.539,1.493-2.378,3.469-2.361,5.565c0.017,2.095,0.886,4.057,2.45,5.527C10.491,33.203,12.533,34,14.701,34h0.066
                    c2.192-0.017,4.244-0.845,5.778-2.33l12.743-12.349C33.571,19.046,33.57,18.599,33.286,18.322z"
                />
            </svg>
        </button>
    ) : (
        <button disabled>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                color="green"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.101,42.314c-1.87,0-3.628-0.729-4.95-2.051L7.736,38.85c-2.729-2.729-2.729-7.171,0-9.899l9.192-9.192     c1.322-1.322,3.08-2.051,4.95-2.051s3.628,0.729,4.949,2.051l1.414,1.414c0.391,0.391,0.391,1.023,0,1.414s-1.023,0.391-1.414,0     l-1.414-1.414c-0.944-0.944-2.2-1.465-3.535-1.465c-1.336,0-2.592,0.521-3.536,1.465L9.15,30.364     c-1.949,1.949-1.949,5.121,0,7.071l1.414,1.414c0.944,0.944,2.2,1.465,3.536,1.465c1.335,0,2.591-0.521,3.535-1.465L24,32.485     c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-6.364,6.364C17.729,41.586,15.971,42.314,14.101,42.314z"
                />
            </svg>
        </button>
    );
}
