
import axios from '../lib/axios'
import { useState,useEffect } from "react";

export const useAnnouncements = () => {
    const [ announcementsData, setAnnouncementsData] = useState([]);
    const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(true);

    const getAnnouncements= async(uuid) => {
      setIsAnnouncementsLoading(true)
        axios
                .get(`/api/v1/announcements/get`, {
                    params: {
                      uuid: uuid
                    }
                  })
                .then((res) => {setAnnouncementsData(res.data.data)
                  setIsAnnouncementsLoading(false)
                })
                .catch((error) => {
                })
    }

    return { getAnnouncements , announcementsData ,setIsAnnouncementsLoading }
}