
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useAccess = () => {
    const [ accessData, setAccessData] = useState([]);
    const [isAccessLoading, setIsAccessLoading] = useState(true);

    const getAccess= async(uuid) => {
      setIsAccessLoading(true)
        axios
                .get(`/api/v1/user/role/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setAccessData(res.data.data)
                  setIsAccessLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getAccess , accessData ,setIsAccessLoading }
}