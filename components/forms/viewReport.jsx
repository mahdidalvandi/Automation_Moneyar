export default function ViewReport(props) {
  const { color, text, style, link, uuid } = props;
  console.log(link);
  const handleClick = (link, uuid) => {
    window.location.assign(link + uuid);
  };

  return (
    <button
      onClick={(e) => handleClick(link, uuid)}
      className="inline-block bg-[#22AA5B] rounded-md bg-success px-6 pb-2 pt-2.5 text-sm uppercase
       leading-normal font-semibold text-white shadow-[0_4px_9px_-4px_#14a44d] 
       transition duration-150 ease-in-out hover:bg-success-600 
       focus:bg-success-600 focus:outline-none focus:ring-0"
    >
      مشاهده گزارش
    </button>
  );
}
