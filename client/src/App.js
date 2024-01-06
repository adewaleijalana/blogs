import React from "react";
import CreatePost from "./CreatePost";
import ListPosts from "./ListPosts";

const App = () => {
    return <div className="container">
        <h1>Create Post</h1>
        <CreatePost />
        <hr />
        <h1>Posts</h1>
        <ListPosts />
    </div>
}

export default App;