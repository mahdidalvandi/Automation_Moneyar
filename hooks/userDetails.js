
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useUserDetails = () => {
  const [userDetailsData, setUserDetailsData] = useState([]);
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(true);

  const getUserDetails = async (uuid) => {
    setIsUserDetailsLoading(true)
    axios
      .get(`/api/v1/company/full_list/uuid`, {
        params: {
          uuid: uuid
        }
      })
      .then((res) => {
        setUserDetailsData(res.data.data)
        setIsUserDetailsLoading(false)
      })
      .catch((error) => {

      })
  }

  return { getUserDetails, userDetailsData, isUserDetailsLoading }
}