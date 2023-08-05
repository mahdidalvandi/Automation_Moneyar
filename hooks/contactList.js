
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useContactList = () => {
    const [ contactListData, setContactListData] = useState([]);
    const [isContactListLoading, setIsContactListostLoading] = useState(true);

    const getContactList= async(uuid) => {
      setIsContactListostLoading(true)
        axios
                .get(`/api/v1/company/contactlist/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setContactListData(res.data.data)
                  setIsContactListostLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getContactList , contactListData ,setIsContactListostLoading }
}