import axios from 'axios'

const API_URL = 'http://localhost:5000/api/groceries'

export const getGroceries = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : {message: 'Network Error'}
  }
}

export const addGrocery = async groceryData => {
  try {
    const response = await axios.post(API_URL, groceryData)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : {message: 'Network Error'}
  }
}
