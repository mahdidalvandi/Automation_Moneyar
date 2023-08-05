import { TrashIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import axios from "../../lib/axios";

export default function Archive(props) {

    const handleClick = () => {
        axios
            .get(`/api/v1/letter/draft/delete`, {
                params: {
                    uuid: props.uuid
                }
            })
            .then((res) => {
                props.setClicked(props.uuid);
            })
            .catch((err) => {
            }
            );
    };
    return (
        <Tooltip title="حذف">
            < button
                onClick={(e) => handleClick()
                }
                className="mr-2" >
                <TrashIcon className="h-5 w-5"
                    aria-hidden="true"></TrashIcon>
                {/* <svg height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M41.09 10.45l-2.77-3.36c-.56-.66-1.39-1.09-2.32-1.09h-24c-.93 0-1.76.43-2.31 1.09l-2.77 3.36c-.58.7-.92 1.58-.92 2.55v25c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-25c0-.97-.34-1.85-.91-2.55zm-17.09 24.55l-11-11h7v-4h8v4h7l-11 11zm-13.75-25l1.63-2h24l1.87 2h-27.5z" /><path d="M0 0h48v48h-48z" fill="none" /></svg> */}
            </button >
        </Tooltip >
    );
}
