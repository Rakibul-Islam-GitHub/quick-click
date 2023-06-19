import React, { useEffect, useState } from "react";
import "./Homepage.css";
import Navbar from './Navbar';
import Feed from './Feed';
import Upload from './Upload';
import { getPost } from "./api-call/api";


const Homepage = () => {
  const [posts, setPosts]= useState([])

  useEffect(()=>{
    getPost((res) => {
      setPosts(res.reverse())
  });
  },[])
  return (
    <>
     <Navbar/>
     <Upload setPosts={setPosts}/>
     <Feed posts={posts} setPosts={setPosts}/>

    </>
  );
};

export default Homepage;
