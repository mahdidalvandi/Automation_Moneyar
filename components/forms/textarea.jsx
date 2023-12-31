export default function Textarea(props) {
  const {
    className,
    title,
    style,
    inputStyle,
    titleStyle,
    error,
    readOnly,
    disabled,
    placeholder,
  } = props;
  return (
    <div
      className={`${style} ${
        error ? "text-red-500 border-red-500 ring-red-500" : null
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
      <textarea
        placeholder={props.placeholder}
        id={props.name}
        name={props.name}
        type={props.type}
        rows={props.rows}
        readOnly={props.readOnly}
        disabled={props.disabled}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        {...(props.isrequired ? "required" : null)}
        className={`${inputStyle} ${
          error ? "border-red-500 ring-red-500" : null
        } appearance-none block ${
          disabled ? "text-gray-700" : ""
        } w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
      />
      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </div>
  );
}
