import axios from "axios"

export default function axiosClient() {
    const axiosClient = axios.create({
        baseURL: "http://localhost:5228",
        
    })

    axiosClient.interceptors.request.use((config)=>{
        config.headers.Authorization = `Bearer ${localStorage.getItem("TOKEN")}`
        return config
    } , (config)=> {
        return config
    })
  return axiosClient
}
