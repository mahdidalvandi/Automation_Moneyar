
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useUser = () => {
    const [ userData, setUserData] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(true);

    const getUser = async(uuid) => {
        setIsUserLoading(true)
        axios
                .get(`/api/v1/user/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setUserData(res.data.data)
                    setIsUserLoading(false)
                })
                .catch((error) => {                   
                })
    }

    return { getUser , userData ,isUserLoading }
}