import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import { StarIcon } from "@heroicons/react/outline";
import Starimg from "../../public/images/star.png";
import Staryellow from "../../public/images/staryellow.png";
import Image from "next/image";
import _ from "lodash";

export default function Activation(props) {
  const { uuid } = props;
  const [bookMarkState, setBookMarkState] = useState(props.bookMarked);

  useEffect(() => {
    var bookMarkStateBuf = _.cloneDeep(props.bookMarked);
    setBookMarkState(bookMarkStateBuf);
  }, [props.bookMarked]);

  const handleChange = async () => {
    const UserFormData = new FormData();
    UserFormData.append("uuid", props.uuid);
    try {
      await axios({
        method: "post",
        url: "/api/v1/cartable/bookmark",
        data: UserFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((response) => {
        if (response.data.status == 200 || bookMarkState == "0") {
          setBookMarkState(!bookMarkState);
          console.log(bookMarkState);
        } else setBookMarkState(0);
      });
    } catch (error) {}
  };
  return (
    <button onClick={(e) => handleChange()} className="ml-2">
      {bookMarkState ? (
        <Image alt="image" src={Staryellow} aria-hidden="true" />
      ) : (
        <Image
          alt="image"
          src={Starimg}
          className="h-5 w-5"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
