import { useState } from 'react'

export default function Register() {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    })

    const [status, setStatus] = useState('normal');

    async function registerHandler(e) {
        e.preventDefault();

        setStatus('loading')

        const registerReq = await fetch('/api/auth/register', {
            method: "POST",
            body: JSON.stringify(fields),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!registerReq.ok) return setStatus('error' + registerReq.status)

        const registerRes = await registerReq.json();

        setStatus('succes')
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
                Register
            </h1>
            <form onSubmit={registerHandler.bind(this)}>
                <input type="text" name='email' onChange={handleField.bind(this)} placeholder="Email" /><br />
                <input type="password" name='password' onChange={handleField.bind(this)} placeholder="Password" />
                <button type="submit">Register</button><br />
                <div>{status}</div>
            </form>
        </div>
    )
}