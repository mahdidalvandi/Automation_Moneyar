export default function TextWithLabel(props) {
    const { className, title, style, titleStyle, error, text } = props;
    return (
        <div
            className={`${style ?? ""} ${error ? "text-red-500 border-red-500 ring-red-500" : ""
                }`}
        >
            <label
                htmlFor="email"
                className={`${titleStyle} ${
                    error ? "text-red-500" : null
                } block text-sm font-medium  text-gray-700`}
            >
                {title}
            </label>
            <div className="mt-1"></div>
            <p className={text ? "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-500 sm:text-sm" : ""}>{text}</p>
            </div>
    );
}
