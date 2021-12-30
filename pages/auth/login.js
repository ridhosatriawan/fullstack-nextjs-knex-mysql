import { useState } from 'react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import cookies from 'next-cookies';

export async function getServerSideProps(ctx) {
    const { token } = cookies(ctx);

    if (token) {
        return {
            redirect: {
                destination: '/posts',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default function Login() {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    })

    const [status, setStatus] = useState('normal');

    async function loginHandler(e) {
        e.preventDefault();

        setStatus('loading')

        const loginReq = await fetch('/api/auth/login', {
            method: "POST",
            body: JSON.stringify(fields),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!loginReq.ok) return setStatus('error' + loginReq.status)

        const loginRes = await loginReq.json();

        Cookies.set('token', loginRes.token)

        setStatus('succes')

        Router.push('/posts')
    }

    function handleField(e) {
        const name = e.target.name
        setFields({
            ...fields,
            [name]: e.target.value
        })
    }

    return (
        <div>
            <h1>
                login
            </h1>
            <form onSubmit={loginHandler.bind(this)}>
                <input type="text" name='email' onChange={handleField.bind(this)} placeholder="Email" /><br />
                <input type="password" name='password' onChange={handleField.bind(this)} placeholder="Password" />
                <button type="submit">login</button><br />
                <div>{status}</div>
            </form>
        </div>
    )
}