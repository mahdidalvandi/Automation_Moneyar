import { EyeIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Seen from "../../public/images/seen.png";
export default function View(props) {
  const { color, text, style, link, uuid } = props;
  const handleClick = (link, uuid) => {
    window.location.assign(link + uuid);
  };

  return (
    <button onClick={(e) => handleClick(link, uuid)} className="ml-2">
      <Image src={Seen} aria-hidden="true" />
      {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </svg> */}
    </button>
  );
}
