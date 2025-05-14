import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export interface CarData {
  carType: "LocalCar" | "InternationalCar";
  model: string;
  chassisNumber: string;
  plateNumber: string;
  registrationCard: File;
  registrationCountry?: string; 
  internationalInsurance?: string; 
}


export interface RdvData {
  date: string;
  location: string;
  service: string;
  status?: "en attente" | "terminé" | "annulé";
}

// Get user info
export const getUserInfo = async (userId: string) => {
  const res = await axios.get(`${API}/user/${userId}`);
  return res.data;
};

// Get all cars
export const getAllCars = async (userId: string) => {
  const res = await axios.get(`${API}/user/${userId}/cars`);
  return res.data;
};


export const createCar = async (userId: string, carData: FormData) => {
  const res = await axios.post(`${API}/user/${userId}/car`, carData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createGuestCar = async (carData: FormData) => {
  const response = await axios.post(`${API}/user/cars/guest`, carData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


export const deleteCar = async (userId: string, carId: string) => {
  const res = await axios.delete(`${API}/user/${userId}/car/${carId}`);
  return res.data;
};

export const createRDV = async (
  userId: string ,
  carId: string,
  rdvData: RdvData
) => {
  const res = await axios.post(`${API}/user/${userId}/${carId}/rdv`, rdvData);
  return res.data;
};

export const createGuestRDV = async (carId: string, rdvData: RdvData) => {
  const res = await axios.post(`${API}/user/${carId}/rdv`, rdvData);
  return res.data;
};


export const editRDV = async (
  userId: string,
  carId: string,
  rdvId: string,
  rdvData: RdvData
) => {
  const res = await axios.put(`${API}/user/${userId}/${carId}/${rdvId}`, rdvData);
  return res.data;
};

// Delete an RDV
export const deleteRDV = async (userId: string, rdvId: string) => {
  const res = await axios.delete(`${API}/user/${userId}/rdv/${rdvId}`);
  return res.data;
};

// Get all RDVs
export const getAllRDV = async (userId: string) => {
  const res = await axios.get(`${API}/user/${userId}/rdv`);
  return res.data;
};
