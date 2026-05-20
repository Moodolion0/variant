import config from '../config';

const API_URL = config.API_BASE_URL;

export const dashboardService = {
  /**
   * Get admin dashboard stats
   */
  async getStats() {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: "application/json",
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  },
};

export default dashboardService;
