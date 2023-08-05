
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useCostHeadings = () => {
    const [ costHeadingsData, setCostHeadingsData] = useState([]);
    const [isCostHeadingsLoading, setIsCostHeadingsostLoading] = useState(true);

    const getCostHeadings= async(uuid) => {
      setIsCostHeadingsostLoading(true)
        axios
                .get(`/api/v1/company/cost_headings/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setCostHeadingsData(res.data.data)
                  setIsCostHeadingsostLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getCostHeadings , costHeadingsData ,setIsCostHeadingsostLoading }
}