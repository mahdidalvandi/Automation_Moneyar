
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useProfile = () => {
    const [ profileData, setProfileData] = useState([]);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    const getProfile = async(uuid) => {
        setIsProfileLoading(true)
        axios
                .get(`/api/v1/user/profile`)
                .then((res) => {setProfileData(res.data.data)
                    setIsProfileLoading(false)
                })
                .catch((error) => {                   
                })
    }

    return { getProfile , profileData ,isProfileLoading }
}