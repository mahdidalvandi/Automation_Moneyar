
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const usePost = () => {
    const [ postData, setPostData] = useState([]);
    const [isPostLoading, setIsPostLoading] = useState(true);

    const getPost= async(uuid) => {
      setIsPostLoading(true)
        axios
                .get(`/api/v1/company/post/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setPostData(res.data.data)
                  setIsPostLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getPost , postData ,setIsPostLoading }
}