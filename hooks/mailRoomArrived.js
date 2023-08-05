
import axios from '../lib/axios'
import { useState, useEffect } from "react";

export const useMailRoom = () => {
  const [mailRoomData, setMailRoomData] = useState([]);
  const [letterContetn, setLetterContent] = useState([]);
  const [isMailRoomLoading, setIsMailRoomLoading] = useState(true);

  const getMailRoom = async (uuid) => {
    setIsMailRoomLoading(true)
    axios
      .get(`/api/v1/mailroom/info/uuid`, {
        params: {
          uuid: uuid
        }
      })
      .then((res) => {
        setMailRoomData(res.data.data)
        if (res.data.data.letter_content.length > 2) {
          setLetterContent(JSON.parse(res.data.data.letter_content))
        }
        setIsMailRoomLoading(false)
      })
      .catch((error) => {

      })
  }

  return { getMailRoom, mailRoomData, letterContetn, isMailRoomLoading }
}