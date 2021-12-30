import db from '../../../libs/db';
import bycript from 'bcrypt';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, password } = req.body;
    const salt = bycript.genSaltSync(10);
    const passwordHash = bycript.hashSync(password, salt);

    const register = await db('users').insert({
        email,
        password: passwordHash
    })

    const registeredUser = await db('users').where({ id: register }).first();

    res.status(201);
    res.json({
        message: 'User Registered Successfully',
        data: registeredUser
    })
}