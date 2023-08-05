
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useDepartment = () => {
    const [ departmentData, setDepartmentData] = useState([]);
    const [isDepartmentLoading, setIsDepartmentostLoading] = useState(true);

    const getDepartment= async(uuid) => {
      setIsDepartmentostLoading(true)
        axios
                .get(`/api/v1/company/department/info/uuid`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setDepartmentData(res.data.data)
                  setIsDepartmentostLoading(false)
                })
                .catch((error) => {
                   
                })
    }

    return { getDepartment , departmentData ,setIsDepartmentostLoading }
}