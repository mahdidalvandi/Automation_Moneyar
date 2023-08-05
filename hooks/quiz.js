import useSWR from 'swr'
import axios from '../lib/axios'
import { useState } from 'react'
import { useRouter } from 'next/router'

export const useQuiz = () => {

    const router = useRouter()

    const { token } = router.query

    const [ quizList, setQuizList] = useState([]);
    const [ quiz, setQuiz] = useState([]);

    const getQuizList = async ({ setErrors, setStatus, setLoading, ...props }) => {

        setStatus(null)
        setLoading(true)
        setErrors([])

        axios
            .get('/quiz/GetActivequiz', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setQuizList(response.data.data)
                setLoading(false)
            })
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const getQuiz = async ({ setErrors, setStatus, setLoading, ...props }) => {

        setStatus(null)
        setLoading(true)
        setErrors([])

        axios
            .get(`/quiz/Getquiz?id=${props.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setQuiz(response.data.data.questions)
                setLoading(false)
            })
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const sendAnswers = async ({ setErrors, setStatus, setLoading, ...props }) => {

        setStatus(null)
        setLoading(true)
        setErrors([])

        axios
            .post(`/quiz/AnswerQuiz`, {
                quizid: props.id,
                answers: props.answers
            }, {
                headers: { Authorization: `Bearer ${token}` }

            })
            .then(response => {
                setLoading(false)
            })
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    return {
        getQuizList,
        quizList,

        getQuiz,
        quiz,

        sendAnswers
    }
}