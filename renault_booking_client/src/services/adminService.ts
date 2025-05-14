import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/admin/user`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getAllRDVs = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/rdv`);
    return response.data;
  } catch (error) {
    console.error('Error fetching RDVs:', error);
    throw error;
  }
};

// Change RDV status
// export const changeRDVStatus = async (userId: string, carId: string, rdvId: string, newStatus: string) => {
//   try {
//     const response = await axios.put(`${API_URL}/admin/${userId}/${carId}/${rdvId}`, { status: newStatus });
//     return response.data;
//   } catch (error) {
//     console.error('Error changing RDV status:', error);
//     throw error;
//   }
// };

export const changeRDVStatus = async (
  userId: string | null, 
  carId: string, 
  rdvId: string, 
  newStatus: string
) => {
  try {
    const endpoint = userId 
      ? `${API_URL}/admin/${userId}/${carId}/${rdvId}`
      : `${API_URL}/admin/guest/${carId}/${rdvId}`;
    
    const response = await axios.put(endpoint, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error changing RDV status:', error);
    throw error;
  }
};
