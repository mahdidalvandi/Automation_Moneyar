export default function InputBox(props) {
    const { className, title, style, inputStyle, titleStyle, error } = props;
    return (
        <div
            className={`${style ?? ""} ${error ? "text-red-500 border-red-500 ring-red-500" : ""
                }`}
        >
            <label
                htmlFor="email"
                className={`${titleStyle} ${error ? "text-red-500" : null
                    } block text-sm font-medium  text-gray-700`}
            >
                {title}
            </label>
            <div className="mt-1"></div>
            <input
                id={props.name}
                name={props.name}
                type={props.type}
                value={props.value}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onFocus={props.onFocus}
                onChange={props.onChange}
                {...(props.isrequired ? "required" : null)}
                className={`${inputStyle ?? ""} ${error ? "border-red-500 ring-red-500" : ""
                    } appearance-none ${props.disabled && !props.notGrayDisable ? "text-gray-400" : "" } block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
            />
            {error ? (
                <span className="text-sm text-red-500">{error}</span>
            ) : null}
        </div>
    );
}
