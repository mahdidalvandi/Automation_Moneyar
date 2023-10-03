import Penpic from "../../public/images/pen.png";
import Image from "next/image";

export default function Pen(props) {
  const { color, text, style, link, uuid } = props;
  const handleClick = (link, uuid) => {
    window.location.assign(link + uuid);
  };
  return (
    <button onClick={(e) => handleClick(link, uuid)} className="mr-2">
      <Image src={Penpic} />
    </button>
  );
}
