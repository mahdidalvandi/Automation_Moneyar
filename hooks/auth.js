import useSWR from 'swr'
import axios from '../lib/axios'
import { useRouter } from 'next/router'
import { Fragment, useState, useEffect } from "react";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const [isLoading, setisLoading] = useState(true);

    const { data: user, error, mutate } = useSWR('/api/v1/user', () =>
        axios
            .get('/api/v1/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status != 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setStatus(null)
        setErrors([])
        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status == 500) throw error
                setErrors(error.response.data.message)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()
        setStatus(null)
        setErrors([])

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setStatus(null)
        setErrors([])

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response => router.push('/login?reset=' + btoa(response.data.status)))
            .catch(error => {
                if (error.response.status != 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout')
            mutate()
        }

        window.location.pathname = '/'
    }

    useEffect(() => {
        if (user || error) { setisLoading(false) }
        if (middleware == 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if (middleware == 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        isLoading,
    }
}