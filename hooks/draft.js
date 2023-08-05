
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useDraft = () => {
    const [ draftData, setDraftData] = useState();
    const [isDraftLoading, setIsDraftLoading] = useState(true);

    const getDraft= async(uuid) => {
      setIsDraftLoading(true)
        axios
                .get(`/api/v1/letter/draft/info`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {
                  setDraftData(JSON.parse(res.data.data))
                  setIsDraftLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getDraft , draftData ,setIsDraftLoading }
}