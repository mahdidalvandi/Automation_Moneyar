export default function Button(props) {
    const { color, text, style, link, uuid } = props;
    const handleClick = (link, uuid) => {
        window.location.assign(link + uuid);
    };

    return (
        <button
            onClick={(e) => handleClick(link, uuid)}
            className={`${style} flex justify-center py-2 px-4 mx-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${color}-500 hover:bg-${color}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
        >
            {text}
        </button>
    );
}
