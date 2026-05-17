import axios from "axios"
import { getHeaders } from "../auth/authService"
const BASE = import.meta.env.VITE_API_URL
// const BASE = "http://localhost:8000"
export const login = (d) => axios.post(`${BASE}/login`, d)
export const signup = (d) => axios.post(`${BASE}/signup`, d)
export const changePassword = (d) => axios.post(`${BASE}/changePassword`, d)
export const getCategories = () => axios.get(`${BASE}/categories`)
export const getItems = (params) => axios.get(`${BASE}/items`, { params })
export const getItemDetails = (id) => axios.get(`${BASE}/items/${id}`)
export const getSizes = () => axios.get(`${BASE}/sizes`)
export const getFeedbacks = () => axios.get(`${BASE}/feedbacks`)
export const getProfile = () => axios.get(`${BASE}/user/profile`, { headers: getHeaders() })
export const updateProfile = (d) => axios.post(`${BASE}/user/updateProfile`, d, { headers: getHeaders() })
export const placeOrder = (d) => axios.post(`${BASE}/user/placeOrder`, d, { headers: getHeaders() })
export const myOrders = () => axios.get(`${BASE}/user/myOrders`, { headers: getHeaders() })
export const cancelOrder = (d) => axios.post(`${BASE}/user/cancelOrder`, d, { headers: getHeaders() })
export const genOrderId = (d) => axios.post(`${BASE}/user/genOrderId`, d, { headers: getHeaders() })
export const verifyPayment = (d) => axios.post(`${BASE}/user/verifyPayment`, d, { headers: getHeaders() })
export const addFeedback = (d) => axios.post(`${BASE}/user/addFeedback`, d, { headers: getHeaders() })
export const generatePenaltyOrder = (d) =>
  axios.post(
    `${BASE}/user/generatePenaltyOrder`,
    d,
    { headers: getHeaders() }
  )

export const verifyPenaltyPayment = (d) =>
  axios.post(
    `${BASE}/user/verifyPenaltyPayment`,
    d,
    { headers: getHeaders() }
  )