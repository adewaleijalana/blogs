import React, { useState, useEffect } from "react";
import CreateComments from "./CreateComments";
import ListComments from "./ListComments";
import axios from "axios";

const ListPosts = () => {

    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        try {
            const resp = await axios.get('http://localhost:4002/posts');
            console.log(resp.data);
            setPosts(resp.data);
        } catch (error) {
            console.log(error);
        }
    
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    // console.log(posts);
    const renderedPosts = Object.values(posts)
        .map(post => {
            return <div className="card" 
            style={{ width: '30%', marginBottom: '20px' }}
            key={post.id}>
                <div className="card-body">
                    <h3> {post.title}</h3>
                    <ListComments comments={post.comments} />
                    <CreateComments postId={post.id}/>
                </div>
            </div>;
        })

    return <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts}
    </div>
}

export default ListPosts;