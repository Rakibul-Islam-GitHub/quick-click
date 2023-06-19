const API_URL= 'http://localhost:3001'

export const getPost = async(cb) => {
    fetch(`${API_URL}/api/post`, {
      method: "get",
    })
      .then((res) => res.json())
        .then((result) => {
          return cb(result)
      })
      .catch((err) => console.log(err.message));
  };


export const getComment = async(cb) => {
    fetch(`${API_URL}/api/comment`, {
      method: "get",
    })
      .then((res) => res.json())
        .then((result) => {
          return cb(result)
      })
      .catch((err) => console.log(err.message));
  };

  export const doLogin = async (formdata, cb) => {
  
  const res= await  fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        
        return cb(result)
      }else{
        return cb(false)
      }
   
  };
  export const doRegister = async (formdata, cb) => {
  
  const res= await  fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        return cb(result)
      }else{
        return cb(false)
      }
   
  };


  export const doComment = async (formdata, token, cb) => {
 
  const res= await  fetch(`${API_URL}/api/comment/add`, {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        return cb(result)
      }else{
        return cb(false)
      }
   
  };

  export const doAddPost = async (formdata, token, cb) => {
 
  const res= await  fetch(`${API_URL}/api/post/add`, {
        method: "POST",
        body: formdata,
        headers: {
          
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        return cb(result)
      }else{
        return cb(false)
      }
   
  };


  export const doLikeToComment = async (cmtid, token, cb) => {
 
  const res= await  fetch(`${API_URL}/api/comment/liketocomment/${cmtid}`, {
        method: "PUT",
        headers: {
          
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status===200) {
        const result=  await res.json()
       
        return cb(result)
      }else{
        return cb(false)
      }
   
  };
  export const doUpvote = async (postid, token, cb) => {
 
  const res= await  fetch(`${API_URL}/api/post/upvote/${postid}`, {
        method: "PUT",
        headers: {
          
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        return cb(result)
      }else{
        return cb(false)
      }
   
  };

  export const doDownvote = async (postid, token, cb) => {
 
  const res= await  fetch(`${API_URL}/api/post/downvote/${postid}`, {
        method: "PUT",
        headers: {
          
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status===200) {
        const result=  await res.json()
        return cb(result)
      }else{
        return cb(false)
      }
   
  };

  export const deletePost = async (id, token, cb) => {
 
    const res= await  fetch(`${API_URL}/api/post/delete/${id}`, {
          method: "DELETE",
          headers: {
            
            Authorization: `Bearer ${token}`
          }
        })
        if (res.status===200) {
          const result=  await res.json()
          return cb(result)
        }else{
          return cb(false)
        }
     
    };

    export const editPost = async (description,id, token, cb) => {

      const res= await  fetch(`${API_URL}/api/post/update/${id}`, {
            method: "PUT",
            body: JSON.stringify({description:description}),
            headers: {
              'Content-Type' : 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          if (res.status===200) {
            const result=  await res.json()
            return cb(result)
          }else{
            return cb(false)
          }
       
      };

      export const doReply = async (formdata, token, cb) => {
 
        const res= await  fetch(`${API_URL}/api/reply/add`, {
              method: "POST",
              body: JSON.stringify(formdata),
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            })
            if (res.status===200) {
              const result=  await res.json()
              return cb(result)
            }else{
              return cb(false)
            }
         
        };

        export const getReply = async(cb) => {
          fetch(`${API_URL}/api/reply`, {
            method: "get",
          })
            .then((res) => res.json())
              .then((result) => {
                return cb(result)
            })
            .catch((err) => console.log(err.message));
        };


        export const resetPassword = async (formdata, cb) => {
  
          const res= await  fetch(`${API_URL}/api/user/resetpassword`, {
                method: "POST",
                body: JSON.stringify(formdata),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                }
              })
              if (res.status===200) {

                return cb(true)
              }else{
                return cb(false)
              }
           
          };
        export const updatePassword = async (formdata, cb) => {
  
          const res= await  fetch(`${API_URL}/api/user/updatepassword`, {
                method: "PUT",
                body: JSON.stringify(formdata),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                }
              })
              if (res.status===200) {

                return cb(true)
              }else{
                return cb(false)
              }
           
          };