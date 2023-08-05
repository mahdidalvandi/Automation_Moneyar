
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useInterview = () => {
    const [interviewData, setInterviewData] = useState();
    const [isInterviewLoading, setIsInterviewLoading] = useState(true);
    const [error, setError] = useState();
    const getInterview = async (uuid) => {
        setIsInterviewLoading(true)
        axios
            .get(`/api/v1/interview/show/uuid`, {
                params: {
                  uuid: uuid
                }
              })
            .then((res) => {
                setInterviewData(res.data.data)
                setIsInterviewLoading(false)
            })
            .catch((error) => {
                setError(error.response.data.message)
            })
    }

    return { getInterview, interviewData, isInterviewLoading, error }
}

