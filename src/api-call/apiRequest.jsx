import React from 'react'
import axios from 'axios'


const ApiRequest = async (endpoint, body, method = 'get') => {
    // const url = 'https://backend.dolphinfurnishingindia.com'
    const url = 'https://valorant-api.com/v1'
    try {
        let data
        let token = localStorage.getItem("token")
        console.log("token", token);
        switch (method) {
            case "delete":
                data = await axios({
                    method: 'delete',
                    url: `${url}${endpoint}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                break;

            case "post":
                data = await axios({
                    method: 'post',
                    url: `${url}${endpoint}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: body
                })
                break;
            case "get":
                data = await axios.get(`${url}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                break;

            default:
                break;
        }
        return data
    } catch (error) {
        if (error.response.status === 401) return 401
        else return error.response.data
    }
}
export default ApiRequest;