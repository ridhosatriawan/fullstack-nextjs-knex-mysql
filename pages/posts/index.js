import cookies from "next-cookies";
import { useState } from 'react'
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
    const { token } = cookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }


    const postReq = await fetch('http://localhost:3000/api/posts', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })


    const postRes = await postReq.json()

    return {
        props: {
            token,
            posts: postRes.data
        }
    }
}

export default function Posts(props) {
    const [posts, setPosts] = useState(props.posts);

    async function deleteHandler(id, e) {
        e.preventDefault();

        const { token } = props

        const ask = confirm('yakin dihapus?')

        if (ask) {
            const deletePost = await fetch('/api/posts/delete/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }

            });

            const res = await deletePost.json();

            const filteredPosts = posts.filter(post => {
                return post.id !== id && post;
            })

            setPosts(filteredPosts);
            console.log(res);
        }
    }

    function editHandler(id, e) {
        e.preventDefault();

        Router.push('/posts/edit/' + id)
    }

    return (
        <div>
            <h1>
                Posts
            </h1>

            <Nav />

            {
                posts.map(post => (
                    <div key={post.id}>
                        <h1>{post.id} {post.title}</h1>
                        <p> {post.content}</p>
                        <button onClick={editHandler.bind(this, post.id)}>Edit</button>
                        <button onClick={deleteHandler.bind(this, post.id)}>Delete</button>
                        <hr />
                    </div>
                ))
            }
        </div>
    );
}