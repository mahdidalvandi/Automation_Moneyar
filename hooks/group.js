
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useGroup = () => {
    const [ groupData, setGroupData] = useState([]);
    const [isGroupLoading, setIsGroupLoading] = useState(true);

    const getGroup= async(uuid) => {
      setIsGroupLoading(true)
        axios
                .get(`/api/v1/group/list/byGroup`, {
                    params: {
                      group_uuid: uuid
                    }
                  })
                .then((res) => {setGroupData(res.data.data)
                  setIsGroupLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getGroup , groupData ,setIsGroupLoading }
}