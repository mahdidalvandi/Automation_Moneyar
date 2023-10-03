import Tooltip from "@mui/material/Tooltip";
import axios from "../../lib/axios";
import SaveinDoc from "../../public/images/saveindoc.png";
import Link from "next/link";
import Image from "next/image";

export default function Archive(props) {
  const { isArchived } = props;

  const handleClick = () => {
    if (!isArchived) {
      axios
        .post("/api/v1/interview/resume/archive", {
          applicant_uuid: props.uuid,
        })
        .then((res) => {
          props.setClicked(props.uuid);
        })
        .catch((err) => {});
    } else {
      axios
        .post("/api/v1/interview/resume/unarchive", {
          applicant_uuid: props.uuid,
        })
        .then((res) => {
          props.setClicked(props.uuid);
        })
        .catch((err) => {});
    }
  };
  return !isArchived ? (
    <Tooltip title="ذخیره در آرشیو">
      <button onClick={(e) => handleClick()} className="mr-2">
        <Image src={SaveinDoc} />
      </button>
    </Tooltip>
  ) : (
    <Tooltip title="خارج کردن از آرشیو">
      <button onClick={(e) => handleClick()} className="mr-2">
        <svg
          height="24"
          viewBox="0 0 48 48"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M41.09 10.45l-2.77-3.36C37.76 6.43 36.93 6 36 6H12c-.93 0-1.76.43-2.31 1.09l-2.77 3.36C6.34 11.15 6 12.03 6 13v25c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V13c0-.97-.34-1.85-.91-2.55zM24 19l11 11h-7v4h-8v-4h-7l11-11zm-13.75-9l1.63-2h24l1.87 2h-27.5z" />
          <path d="M0 0h48v48H0V0z" fill="none" />
        </svg>
      </button>
    </Tooltip>
  );
}
