const API_URL ="http://localhost:8000/api";

export const dashboardService = {
  /**
   * Get admin dashboard stats
   */
  async getStats(token) {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  },
};

export default dashboardService;
