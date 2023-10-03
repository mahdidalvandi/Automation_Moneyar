import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import Pinimg from "../../public/images/pin.png";
import PinBlue from "../../public/images/pinblue.png";
import Image from "next/image";
import _ from "lodash";

export default function PinButton(props) {
  const [bookMarkState, setBookMarkState] = useState(false);
  // useEffect(() => {
  //   var bookMarkStateBuf = _.cloneDeep(props.bookMarked);
  //   setBookMarkState(bookMarkStateBuf);
  // }, [props.bookMarked]);

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
        console.log(response.data.status);
        if (response.data.status == 200 || bookMarkState == "0") {
          setBookMarkState(1);
          console.log(bookMarkState);
        } else setBookMarkState(0);
      });
    } catch (error) {}
  };
  return (
    <button onClick={() => handleChange()} className="ml-2">
      {bookMarkState ? (
        <Image
          src={PinBlue}
          className="h-5 w-5 fill-current text-amber-500 border-amber-500 "
          aria-hidden="true"
        />
      ) : (
        <Image src={Pinimg} className="h-5 w-5" aria-hidden="true"></Image>
      )}
    </button>
  );
}
