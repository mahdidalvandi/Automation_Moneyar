
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useIncomeHeadings = () => {
    const [ incomeHeadingsData, setIncomeHeadingsData] = useState([]);
    const [isIncomeHeadingsLoading, setIsIncomeHeadingsostLoading] = useState(true);

    const getIncomeHeadings= async(uuid) => {
      setIsIncomeHeadingsostLoading(true)
        axios
                .get(`/api/v1/company/income_headings/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setIncomeHeadingsData(res.data.data)
                  setIsIncomeHeadingsostLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getIncomeHeadings , incomeHeadingsData ,setIsIncomeHeadingsostLoading }
}