
import axios from '../lib/axios'
import { useState} from "react";

export const useCompany = () => {
    const [companyData, setCompanyData] = useState([]);
    const [isCompanyLoading, setIsCompanyLoading] = useState(true);

    const getCompany = async(uuid) => {
        setIsCompanyLoading(true)
        axios
                .get(`/api/v1/company/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setCompanyData(res.data.data)
                    setIsCompanyLoading(false)
                })
                .catch((error) => {
                })
    }
    return { getCompany , companyData ,isCompanyLoading }
}