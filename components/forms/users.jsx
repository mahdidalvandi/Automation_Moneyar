import { UsersIcon } from "@heroicons/react/outline";

export default function Edit(props) {
  const { link, uuid } = props;
  const handleClick = (link, uuid) => {
    window.location.assign(link + uuid);
  };
  return (
    <button onClick={(e) => handleClick(link, uuid)} className="ml-4">
      <UsersIcon className="h-5 w-5" aria-hidden="true"></UsersIcon>
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
            </svg> */}
    </button>
  );
}
