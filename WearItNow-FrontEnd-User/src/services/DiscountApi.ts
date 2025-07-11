import axios from 'axios';
import { DiscountCode } from '../stores/DiscountModel'; 

const BASE_URL = 'https://api.wearltnow.online';

const DiscountService = {
    getDiscountCodesByUser: async (userId: number): Promise<DiscountCode[]> => {
        try {
            const response = await axios.get(`${BASE_URL}/api/discount-codes/user/${userId}`);
            if (response.data && response.data.result) {
                return response.data.result;
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            console.error("Error fetching discount codes:", error);
            throw error;
        }
    }
};

export default DiscountService;
