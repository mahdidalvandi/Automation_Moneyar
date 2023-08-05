
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useIssued = () => {
    const [issuedData, setIssuedData] = useState([]);
    const [isIssuedLoading, setIsIssuedLoading] = useState(true);

    const getIssued = async (uuid) => {
        setIsIssuedLoading(true)
        axios
        .get(`/api/v1/mailroom/issued/info/uuid`, {
            params: {
              uuid: uuid
            }
          })
            .then((res) => {
                setIssuedData(res.data.data)
                setIsIssuedLoading(false)
            })
            .catch((error) => {
            })
    }

    return { getIssued, issuedData, isIssuedLoading }
}

