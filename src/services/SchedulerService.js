import { AirlineScheduler } from "../utils/core";

export class SchedulerService {
  static optimizeSchedule(flights, cargo, constraints, settings) {
    try {
      // Create scheduler instance
      const scheduler = new AirlineScheduler(
        flights,
        cargo,
        constraints,
        settings
      );

      // Run optimization
      const result = scheduler.optimizeSchedule();

      // If no solution found, return a failure response
      if (!result.success) {
        return {
          success: false,
          message: result.message || "No valid schedule found",
          flights: flights,
          cargo: cargo,
        };
      }

      return result;
    } catch (error) {
      console.error("Optimization error:", error);
      return {
        success: false,
        message: error.message,
        flights: flights,
        cargo: cargo,
      };
    }
  }
}
