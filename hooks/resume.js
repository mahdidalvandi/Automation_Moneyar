
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useResume = () => {
    const [resumeData, setResumeData] = useState();
    const [isResumeLoading, setIsResumeLoading] = useState(true);
    const getResume = async (uuid) => {
        setIsResumeLoading(true)
        axios
            .get(`/api/v1/interview/view/uuid`, {
                params: {
                  uuid: uuid
                }
              })
            .then((res) => {
                setResumeData(res.data.data)
                setIsResumeLoading(false)
            })
            .catch((error) => {
            })
    }

    return { getResume, resumeData, isResumeLoading }
}

