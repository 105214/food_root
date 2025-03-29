import { useState } from "react"
import axiosInstance from "../config/axiosinstance"
import { useEffect } from "react"

const useFetch=(url)=>{
    const[data,setData]=useState()
    const[isLoading,setLoading]=useState(true)
    const[error,setError]=useState(null)
   
    const fetchData=async()=>{ 
        try{ 

    const response=await axiosInstance({ 
        method:"GET",
        url:url,
    })
    setTimeout(()=>{

    setData(response?.data?.data)
    isLoading(false)
    },1000)
} catch(error){
    console.log(error)
    setError(error)
}
    }

useEffect(()=>{
    fetchData()
},[])
return [data,isLoading,error]
}


export default useFetch