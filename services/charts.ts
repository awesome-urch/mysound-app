import api from "../utils/api";

const TOKEN = `Bearer ${process.env.EXPO_PUBLIC_LIFETIME_TOKEN}`;

export default class ChartsService {
  static async getChartsWith50Songs() {
    try {
      const response = await api.get("/api/charts", {
        headers: {
          Authorization: TOKEN,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}
