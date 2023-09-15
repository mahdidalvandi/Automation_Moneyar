import { useState,useEffect } from "react";
import axios from "../../lib/axios";
import { StarIcon } from "@heroicons/react/outline";
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
            const response = await axios({
                method: "post",
                url: "/api/v1/cartable/bookmark",
                data: UserFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                if (bookMarkState == '0') setBookMarkState(1);
                else setBookMarkState(0);
            }
        } catch (error) {
        }
    };
    return (
        <button onClick={(e) => handleChange()} className="ml-2" >
            {bookMarkState ?
                <StarIcon
                    className="h-5 w-5 fill-current text-amber-500 border-amber-500 "
                    aria-hidden="true"
                ></StarIcon> :
                <StarIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                ></StarIcon>}
        </button>
    );
}
