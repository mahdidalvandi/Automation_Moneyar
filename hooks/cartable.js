
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useCartable = () => {
    const [letterData, setLetterData] = useState([]);
    const [isCartableLoading, setIsCartableLoading] = useState(true);

    const getMail = async (uuid) => {
        setIsCartableLoading(true)
        axios
            .get(`/api/v1/letter/view/uuid/${uuid}`)
            .then((res) => {
                setLetterData(res.data.data.reverse())
                setIsCartableLoading(false)
            })
            .catch((error) => {
            })
    }

    return { getMail, letterData, isCartableLoading }
}

