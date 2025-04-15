/**
 * This file contains the core algorithm implementations for the airline scheduling system.
 * These functions would be imported and used in the main application for optimizing schedules.
 */

/**
 * First-Order Logic representation of scheduling constraints
 * Implements predicates and rules for the scheduling domain
 */
class FirstOrderLogic {
  constructor() {
    this.predicates = {};
  }

  // Define a new predicate
  definePredicate(name, evaluator) {
    this.predicates[name] = evaluator;
  }

  // Evaluate a predicate with given arguments
  evaluate(predicateName, ...args) {
    if (!this.predicates[predicateName]) {
      throw new Error(`Unknown predicate: ${predicateName}`);
    }
    return this.predicates[predicateName](...args);
  }

  // Initialize with domain-specific predicates for airline scheduling
  initializeAirlinePredicates() {
    // Aircraft capacity constraint
    this.definePredicate("hasCapacityFor", (aircraft, cargo) => {
      return aircraft.maxPayload >= cargo.weight;
    });

    // Time slot availability
    this.definePredicate("hasAvailableSlot", (airport, time, duration) => {
      // Check if the airport has an available slot at the given time for the duration
      return !airport.slots.some(
        (slot) =>
          slot.time <= time &&
          time < slot.time + slot.duration &&
          slot.isOccupied
      );
    });

    // Crew rest requirements
    this.definePredicate("hasRestedCrew", (crew, flight) => {
      const lastDuty = crew.lastDutyEnd;
      const requiredRest = crew.requiredRestHours;
      const flightStart = flight.departureTime;

      // Convert times to comparable format (e.g., hours since epoch)
      const hoursSinceLastDuty = (flightStart - lastDuty) / (60 * 60 * 1000);
      return hoursSinceLastDuty >= requiredRest;
    });
  }
}

/**
 * Constraint Satisfaction Problem (CSP) solver for airline scheduling
 * Uses backtracking to find valid assignments
 */
class ConstraintSatisfactionSolver {
  constructor(variables, domains, constraints) {
    this.variables = variables; // E.g., flights to be scheduled
    this.domains = domains; // E.g., possible time slots for each flight
    this.constraints = constraints; // E.g., rules about flight scheduling
    this.assignment = {}; // Current assignment being built
    this.stats = {
      iterations: 0,
      backtracks: 0,
    };
  }

  // Check if an assignment is complete (all variables assigned)
  isComplete() {
    return Object.keys(this.assignment).length === this.variables.length;
  }

  // Select the next unassigned variable to assign
  selectUnassignedVariable() {
    // Using Minimum Remaining Values (MRV) heuristic
    let bestVariable = null;
    let minDomainSize = Infinity;

    for (const variable of this.variables) {
      if (!this.assignment[variable.id]) {
        const domainSize = this.getDomainSize(variable);
        if (domainSize < minDomainSize) {
          minDomainSize = domainSize;
          bestVariable = variable;
        }
      }
    }

    return bestVariable;
  }

  // Get the current domain size for a variable
  getDomainSize(variable) {
    return this.domains[variable.id].filter((value) =>
      this.isConsistent(variable, value)
    ).length;
  }

  // Check if a value is consistent with current assignments
  isConsistent(variable, value) {
    // Create a tentative assignment
    const tentativeAssignment = {
      ...this.assignment,
      [variable.id]: value,
    };

    // Check all applicable constraints
    for (const constraint of this.constraints) {
      if (constraint.variables.includes(variable.id)) {
        if (!constraint.isSatisfied(tentativeAssignment)) {
          return false;
        }
      }
    }

    return true;
  }

  // Order domain values by a heuristic (least constraining value)
  orderDomainValues(variable) {
    return this.domains[variable.id].sort((a, b) => {
      // Count how many values are ruled out by each choice
      const conflictsA = this.countConflicts(variable, a);
      const conflictsB = this.countConflicts(variable, b);
      return conflictsA - conflictsB; // Prefer values that rule out fewer options
    });
  }

  // Count conflicts caused by assigning value to variable
  countConflicts(variable, value) {
    let conflicts = 0;

    // For each unassigned variable
    for (const otherVar of this.variables) {
      if (!this.assignment[otherVar.id] && otherVar.id !== variable.id) {
        // Count values in otherVar's domain that would be eliminated
        for (const otherVal of this.domains[otherVar.id]) {
          const tentativeAssignment = {
            ...this.assignment,
            [variable.id]: value,
            [otherVar.id]: otherVal,
          };

          for (const constraint of this.constraints) {
            if (
              constraint.variables.includes(variable.id) &&
              constraint.variables.includes(otherVar.id)
            ) {
              if (!constraint.isSatisfied(tentativeAssignment)) {
                conflicts++;
                break;
              }
            }
          }
        }
      }
    }

    return conflicts;
  }

  // Backtracking search algorithm
  backtrackingSearch(maxIterations = 1000) {
    // Reset stats
    this.stats.iterations = 0;
    this.stats.backtracks = 0;
    this.assignment = {};

    return this._backtrack(maxIterations);
  }

  // Recursive backtracking procedure
  _backtrack(maxIterations) {
    this.stats.iterations++;

    // Check if we've reached the iteration limit
    if (this.stats.iterations > maxIterations) {
      return null; // Iteration limit reached
    }

    // Check if assignment is complete
    if (this.isComplete()) {
      return this.assignment;
    }

    // Select an unassigned variable
    const variable = this.selectUnassignedVariable();

    // Try each value in the domain
    for (const value of this.orderDomainValues(variable)) {
      if (this.isConsistent(variable, value)) {
        // Assign the value
        this.assignment[variable.id] = value;

        // Recursive call
        const result = this._backtrack(maxIterations);
        if (result) {
          return result; // Solution found
        }

        // If we get here, this assignment didn't work
        delete this.assignment[variable.id];
        this.stats.backtracks++;
      }
    }

    return null; // No solution found
  }
}

/**
 * Heuristic-based optimization for airline scheduling
 * Uses domain-specific knowledge to improve solutions
 */
class HeuristicOptimizer {
  constructor(schedule, parameters) {
    this.schedule = schedule;
    this.parameters = parameters;
  }

  // Optimize flight times to minimize fuel consumption
  optimizeForFuel() {
    // Sort flights by distance/fuel consumption potential
    const sortedFlights = [...this.schedule.flights].sort((a, b) => {
      // Example heuristic: longer flights have more optimization potential
      const distanceA = this.calculateDistance(a.origin, a.destination);
      const distanceB = this.calculateDistance(b.origin, b.destination);
      return distanceB - distanceA;
    });

    // Apply fuel-saving strategies to each flight
    for (const flight of sortedFlights) {
      // Adjust cruise speed and altitude for optimal fuel consumption
      this.adjustForOptimalFuelConsumption(flight);

      // Find optimal departure time considering weather conditions
      this.optimizeDepartureForWeather(flight);
    }

    return this.schedule;
  }

  // Optimize cargo distribution to maximize capacity utilization
  optimizeCargoDistribution() {
    // Group cargo by priority and weight
    const prioritizedCargo = this.groupAndPrioritizeCargo();

    // Clear current assignments
    this.clearCargoAssignments();

    // Use bin packing heuristic to assign cargo to flights
    for (const cargoItem of prioritizedCargo) {
      const bestFlight = this.findBestFlightForCargo(cargoItem);
      if (bestFlight) {
        this.assignCargoToFlight(cargoItem, bestFlight);
      }
    }

    return this.schedule;
  }

  // Helper: Calculate distance between airports
  calculateDistance(origin, destination) {
    // Simplified for demonstration
    // In a real system, this would use geographic coordinates
    const airportDistances = {
      "JFK-LAX": 2475,
      "LAX-ORD": 1745,
      "ORD-JFK": 740,
      // Add more airport pairs as needed
    };

    const key = `${origin}-${destination}`;
    return airportDistances[key] || 1000; // Default distance if not found
  }

  // Helper: Adjust flight parameters for optimal
  // Helper: Adjust flight parameters for optimal fuel consumption
  adjustForOptimalFuelConsumption(flight) {
    // Assumes flight has cruise speed and altitude properties
    // Based on aircraft type, adjust optimal settings
    if (flight.aircraft.includes("B737")) {
      flight.cruiseAltitude = 35000; // Optimal altitude in feet
      flight.cruiseSpeed = 0.78; // Optimal Mach number
    } else if (flight.aircraft.includes("A320")) {
      flight.cruiseAltitude = 36000;
      flight.cruiseSpeed = 0.76;
    } else if (flight.aircraft.includes("B777")) {
      flight.cruiseAltitude = 40000;
      flight.cruiseSpeed = 0.84;
    }

    // Calculate fuel savings
    const baselineFuel = this.calculateBaseFuelConsumption(flight);
    const optimizedFuel = this.calculateOptimizedFuelConsumption(flight);
    flight.fuelSavings = baselineFuel - optimizedFuel;
    flight.fuelEfficiencyScore = (1 - optimizedFuel / baselineFuel) * 100;
  }

  // Helper: Optimize departure time based on weather conditions
  optimizeDepartureForWeather(flight) {
    // In a real system, this would use weather forecast data
    // Simplified for demonstration
    const weatherPenalties = {
      morning: 0.05, // 5% fuel penalty
      afternoon: 0.02, // 2% fuel penalty
      evening: 0.08, // 8% fuel penalty
      night: 0.03, // 3% fuel penalty
    };

    // Determine time of day from departure time
    const hour = parseInt(flight.departureTime.split(":")[0]);
    let timeOfDay;

    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    // Apply weather penalty to fuel consumption
    flight.weatherPenalty = weatherPenalties[timeOfDay];

    // Suggest slight departure time adjustments if beneficial
    const adjustments = [-1, 0, 1, 2]; // Hours to shift
    let bestAdjustment = 0;
    let minPenalty = flight.weatherPenalty;

    for (const adj of adjustments) {
      const adjustedHour = (hour + adj + 24) % 24;
      let adjustedTimeOfDay;

      if (adjustedHour >= 5 && adjustedHour < 12) adjustedTimeOfDay = "morning";
      else if (adjustedHour >= 12 && adjustedHour < 17)
        adjustedTimeOfDay = "afternoon";
      else if (adjustedHour >= 17 && adjustedHour < 21)
        adjustedTimeOfDay = "evening";
      else adjustedTimeOfDay = "night";

      const penalty = weatherPenalties[adjustedTimeOfDay];
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestAdjustment = adj;
      }
    }

    // Apply the best adjustment if worthwhile
    if (bestAdjustment !== 0) {
      flight.suggestedTimeAdjustment = bestAdjustment;
      flight.potentialFuelSavings =
        (flight.weatherPenalty - minPenalty) *
        this.calculateBaseFuelConsumption(flight);
    }
  }

  // Helper: Group and prioritize cargo for assignment
  groupAndPrioritizeCargo() {
    const cargo = [...this.schedule.cargo];

    // Sort by priority first, then by weight (descending)
    return cargo.sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // If same priority, sort by weight (heaviest first for bin packing)
      return b.weight - a.weight;
    });
  }

  // Helper: Clear current cargo assignments
  clearCargoAssignments() {
    // Reset flight cargo lists
    for (const flight of this.schedule.flights) {
      flight.assignedCargo = [];
      flight.currentPayload = 0;
    }

    // Reset cargo assignments
    for (const item of this.schedule.cargo) {
      item.assignedFlight = null;
    }
  }

  // Helper: Find best flight for a cargo item
  findBestFlightForCargo(cargoItem) {
    let bestFlight = null;
    let bestScore = -Infinity;

    for (const flight of this.schedule.flights) {
      // Check if cargo fits (weight constraint)
      const availableCapacity = flight.maxPayload - flight.currentPayload;
      if (availableCapacity < cargoItem.weight) continue;

      // Calculate score based on multiple factors
      let score = 0;

      // Factor 1: Capacity utilization (prefer flights that would be closer to full)
      const utilizationAfter =
        (flight.currentPayload + cargoItem.weight) / flight.maxPayload;
      score += utilizationAfter * 10; // Weight this factor

      // Factor 2: Route appropriateness (prefer flights heading in right direction)
      if (this.isRouteSuitable(cargoItem, flight)) {
        score += 5;
      }

      // Factor 3: Special handling requirements
      if (cargoItem.type === "Perishable" && flight.hasCooledCargo) {
        score += 3;
      } else if (cargoItem.type === "Hazardous" && flight.canCarryHazardous) {
        score += 3;
      }

      // Update best flight if this is better
      if (score > bestScore) {
        bestScore = score;
        bestFlight = flight;
      }
    }

    return bestFlight;
  }

  // Helper: Check if a route is suitable for cargo
  isRouteSuitable(cargoItem, flight) {
    // In a real system, this would check if the flight's route
    // makes sense for the cargo's origin and destination
    // Simplified for demonstration
    return true;
  }

  // Helper: Assign cargo to flight
  assignCargoToFlight(cargoItem, flight) {
    cargoItem.assignedFlight = flight.id;
    flight.assignedCargo.push(cargoItem.id);
    flight.currentPayload += cargoItem.weight;

    // Calculate efficiency score
    cargoItem.efficiency = (
      (flight.currentPayload / flight.maxPayload) *
      100
    ).toFixed(1);
  }

  // Helper: Calculate base fuel consumption
  calculateBaseFuelConsumption(flight) {
    // Simplified model
    const distance = this.calculateDistance(flight.origin, flight.destination);
    const baseConsumption = {
      B737: 0.032, // gallons per passenger-mile
      A320: 0.031,
      B777: 0.028,
      A350: 0.027,
    };

    const aircraftType =
      Object.keys(baseConsumption).find((type) =>
        flight.aircraft.includes(type)
      ) || "B737";

    return distance * baseConsumption[aircraftType] * 150; // Assuming 150 passengers
  }

  // Helper: Calculate optimized fuel consumption
  calculateOptimizedFuelConsumption(flight) {
    const base = this.calculateBaseFuelConsumption(flight);
    // Apply optimizations
    const cruiseOptimizationFactor = 0.95; // 5% savings from cruise optimization
    const weatherFactor = 1 + (flight.weatherPenalty || 0);

    return base * cruiseOptimizationFactor * weatherFactor;
  }
}

/**
 * Main scheduler that combines all algorithms
 * Orchestrates the scheduling process
 */
class AirlineScheduler {
  constructor(flights, cargo, constraints, settings) {
    this.flights = flights;
    this.cargo = cargo;
    this.constraints = constraints;
    this.settings = settings;
    this.fol = new FirstOrderLogic();
    this.fol.initializeAirlinePredicates();
  }

  // Main optimization function
  optimizeSchedule() {
    // Step 1: Convert scheduling problem to CSP
    const cspProblem = this.formulateCSP();

    // Step 2: Solve CSP with backtracking
    const cspSolver = new ConstraintSatisfactionSolver(
      cspProblem.variables,
      cspProblem.domains,
      cspProblem.constraints
    );

    const solution = cspSolver.backtrackingSearch(
      this.settings.maxBacktrackingIterations
    );

    if (!solution) {
      return {
        success: false,
        message: "Could not find a valid schedule. Try relaxing constraints.",
        iterations: cspSolver.stats.iterations,
        backtracks: cspSolver.stats.backtracks,
      };
    }

    // Step 3: Apply solution to our flights
    this.applyCSPSolution(solution);

    // Step 4: Heuristic optimization
    this.applyHeuristicOptimizations();

    return {
      success: true,
      message: "Schedule successfully optimized",
      iterations: cspSolver.stats.iterations,
      backtracks: cspSolver.stats.backtracks,
      flights: this.flights,
      cargo: this.cargo,
    };
  }

  // Convert scheduling problem to CSP form
  formulateCSP() {
    const variables = this.flights.map((flight) => ({
      id: flight.id,
      type: "flight",
    }));

    // For demonstration, we'll use a simplified domain model
    // In real application, domains would be more complex (time slots, etc.)
    const domains = {};

    for (const flight of this.flights) {
      // Domain could be possible departure times
      domains[flight.id] = this.generatePossibleDepartureTimes(flight);
    }

    // Convert constraints to CSP form
    const cspConstraints = this.convertConstraintsToCSP();

    return {
      variables,
      domains,
      constraints: cspConstraints,
    };
  }

  // Generate possible departure times for a flight
  generatePossibleDepartureTimes(flight) {
    // Simplified: generate 4-hour window around current departure time
    const currentHour = parseInt(flight.departureTime.split(":")[0]);
    const currentMinute = parseInt(flight.departureTime.split(":")[1]);

    const times = [];
    for (let hourOffset = -2; hourOffset <= 2; hourOffset++) {
      const hour = (currentHour + hourOffset + 24) % 24;

      // Add options on the hour and half hour
      times.push(`${hour.toString().padStart(2, "0")}:00`);
      times.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    return times;
  }

  // Convert scheduling constraints to CSP constraints
  convertConstraintsToCSP() {
    const cspConstraints = [];

    // Process each constraint type
    for (const constraint of this.constraints) {
      // Fixed typo here
      switch (
        constraint.type // And here
      ) {
        case "Aircraft":
          cspConstraints.push(this.createAircraftConstraint(constraint));
          break;
        case "Crew":
          cspConstraints.push(this.createCrewConstraint(constraint));
          break;
        case "Airport":
          cspConstraints.push(this.createAirportConstraint(constraint));
          break;
        // Add other constraint types as needed
      }
    }

    // Add global constraints (apply to multiple flights)
    cspConstraints.push(this.createMinimumTurnaroundTimeConstraint());

    return cspConstraints;
  }

  // Create aircraft-specific constraint
  createAircraftConstraint(constraint) {
    return {
      variables: this.getFlightsByAircraft(
        constraint.description.split(" ")[0]
      ),
      isSatisfied: (assignment) => {
        // Extract aircraft ID from constraint description
        const aircraftId = constraint.description.split(" ")[0];

        // Get flights using this aircraft
        const relevantFlights = this.getFlightDetailsFromAssignment(
          assignment,
          this.getFlightsByAircraft(aircraftId)
        );

        // Sort flights by time
        relevantFlights.sort((a, b) => {
          return this.compareTimeStrings(a.time, b.time);
        });

        // Check minimum turnaround time (e.g., 45min)
        for (let i = 0; i < relevantFlights.length - 1; i++) {
          const currentFlight = relevantFlights[i];
          const nextFlight = relevantFlights[i + 1];

          // Calculate time between flights
          const timeDifference = this.calculateTimeDifference(
            currentFlight.time,
            nextFlight.time
          );

          // Minimum turnaround time in minutes
          const minTurnaround = 45;

          if (timeDifference < minTurnaround) {
            return false; // Constraint violated
          }
        }

        return true;
      },
    };
  }

  // Create crew-specific constraint
  createCrewConstraint(constraint) {
    return {
      variables: this.getFlightsByCrew(constraint.description.split(" ")[1]),
      isSatisfied: (assignment) => {
        // Extract crew ID from constraint description
        const crewId = constraint.description.split(" ")[1];

        // Get flights assigned to this crew
        const relevantFlights = this.getFlightDetailsFromAssignment(
          assignment,
          this.getFlightsByCrew(crewId)
        );

        // Sort flights by time
        relevantFlights.sort((a, b) => {
          return this.compareTimeStrings(a.time, b.time);
        });

        // Calculate total duty time
        let totalDutyTime = 0;
        for (const flight of relevantFlights) {
          // In a real system, this would use actual flight durations
          // Simplified for demonstration
          totalDutyTime += 3; // Assume 3 hours per flight
        }

        // Maximum duty time (e.g., 8 hours)
        const maxDutyTime = 8;

        return totalDutyTime <= maxDutyTime;
      },
    };
  }

  // Create airport-specific constraint
  createAirportConstraint(constraint) {
    return {
      variables: this.getFlightsByAirport(constraint.description.split(" ")[0]),
      isSatisfied: (assignment) => {
        // Extract airport code and restricted time window
        const parts = constraint.description.split(" ");
        const airportCode = parts[0];

        // Parse time window (e.g., "18:00-22:00")
        const timeWindow = constraint.description.match(/(\d+:\d+)-(\d+:\d+)/);
        if (!timeWindow) return true; // No time window specified

        const windowStart = timeWindow[1];
        const windowEnd = timeWindow[2];

        // Get flights using this airport
        const relevantFlights = this.getFlightDetailsFromAssignment(
          assignment,
          this.getFlightsByAirport(airportCode)
        );

        // Count flights in restricted time window
        let flightsInWindow = 0;
        for (const flight of relevantFlights) {
          if (this.isTimeInWindow(flight.time, windowStart, windowEnd)) {
            flightsInWindow++;
          }
        }

        // Maximum number of operations in window
        const maxOperations = 2; // Example limit

        return flightsInWindow <= maxOperations;
      },
    };
  }

  // Create global minimum turnaround time constraint
  createMinimumTurnaroundTimeConstraint() {
    return {
      variables: this.flights.map((f) => f.id),
      isSatisfied: (assignment) => {
        // Group flights by airport
        const flightsByAirport = {};

        // Get all flights with assigned times
        const allFlights = this.getFlightDetailsFromAssignment(
          assignment,
          this.flights.map((f) => f.id)
        );

        // Group by origin/destination
        for (const flight of allFlights) {
          const flightDetails = this.flights.find((f) => f.id === flight.id);
          if (!flightDetails) continue;

          // Add to origin airport departures
          if (!flightsByAirport[flightDetails.origin]) {
            flightsByAirport[flightDetails.origin] = {
              departures: [],
              arrivals: [],
            };
          }
          flightsByAirport[flightDetails.origin].departures.push({
            id: flight.id,
            time: flight.time,
          });

          // Add to destination airport arrivals
          // In a real system, would calculate arrival time based on departure + duration
          // Simplified for demonstration
          if (!flightsByAirport[flightDetails.destination]) {
            flightsByAirport[flightDetails.destination] = {
              departures: [],
              arrivals: [],
            };
          }

          // Estimate arrival time (departure + 3 hours for simplicity)
          const arrivalTime = this.addHoursToTime(flight.time, 3);
          flightsByAirport[flightDetails.destination].arrivals.push({
            id: flight.id,
            time: arrivalTime,
          });
        }

        // Check minimum separation between operations at each airport
        for (const airport in flightsByAirport) {
          const operations = [
            ...flightsByAirport[airport].departures.map((op) => ({
              ...op,
              type: "departure",
            })),
            ...flightsByAirport[airport].arrivals.map((op) => ({
              ...op,
              type: "arrival",
            })),
          ];

          // Sort by time
          operations.sort((a, b) => this.compareTimeStrings(a.time, b.time));

          // Check minimum separation (e.g., 15 minutes)
          for (let i = 0; i < operations.length - 1; i++) {
            const currentOp = operations[i];
            const nextOp = operations[i + 1];

            const timeDifference = this.calculateTimeDifference(
              currentOp.time,
              nextOp.time
            );

            const minSeparation = 15; // 15 minutes

            if (timeDifference < minSeparation) {
              return false; // Constraint violated
            }
          }
        }

        return true;
      },
    };
  }

  // Apply CSP solution to flights
  applyCSPSolution(solution) {
    for (const flightId in solution) {
      const flight = this.flights.find((f) => f.id === flightId);
      if (flight) {
        flight.departureTime = solution[flightId];

        // Update arrival time based on departure + duration
        // In a real system, would use flight duration
        // Simplified for demonstration
        flight.arrivalTime = this.addHoursToTime(flight.departureTime, 3);
      }
    }
  }

  // Apply heuristic optimizations
  applyHeuristicOptimizations() {
    const optimizer = new HeuristicOptimizer(
      { flights: this.flights, cargo: this.cargo },
      this.settings
    );

    // Optimize based on preference
    switch (this.settings.optimizationPreference) {
      case "fuel":
        optimizer.optimizeForFuel();
        break;
      case "capacity":
        optimizer.optimizeCargoDistribution();
        break;
      case "balanced":
        // Apply both optimizations with balanced weights
        optimizer.optimizeForFuel();
        optimizer.optimizeCargoDistribution();
        break;
      default:
        optimizer.optimizeForFuel();
    }

    // Calculate scores for each flight based on optimization results
    for (const flight of this.flights) {
      // Calculate score based on multiple factors
      const fuelScore = flight.fuelEfficiencyScore || 50;
      const capacityScore = flight.currentPayload
        ? (flight.currentPayload / flight.maxPayload) * 100
        : 50;

      // Weighted average based on preference
      let weightFuel, weightCapacity;

      switch (this.settings.optimizationPreference) {
        case "fuel":
          weightFuel = 0.8;
          weightCapacity = 0.2;
          break;
        case "capacity":
          weightFuel = 0.2;
          weightCapacity = 0.8;
          break;
        default:
          weightFuel = 0.5;
          weightCapacity = 0.5;
      }

      flight.score = (
        fuelScore * weightFuel +
        capacityScore * weightCapacity
      ).toFixed(1);
    }
  }

  // Utility: Get flights by aircraft type
  getFlightsByAircraft(aircraftId) {
    return this.flights
      .filter((flight) => flight.aircraft === aircraftId)
      .map((flight) => flight.id);
  }

  // Utility: Get flights by crew
  getFlightsByCrew(crewId) {
    return this.flights
      .filter((flight) => flight.crew === crewId)
      .map((flight) => flight.id);
  }

  // Utility: Get flights by airport
  getFlightsByAirport(airportCode) {
    return this.flights
      .filter(
        (flight) =>
          flight.origin === airportCode || flight.destination === airportCode
      )
      .map((flight) => flight.id);
  }

  // Utility: Get flight details from assignment
  getFlightDetailsFromAssignment(assignment, flightIds) {
    return flightIds
      .filter((id) => assignment[id]) // Only include flights with assignments
      .map((id) => ({
        id,
        time: assignment[id],
      }));
  }

  // Utility: Compare time strings
  compareTimeStrings(time1, time2) {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    if (hours1 !== hours2) {
      return hours1 - hours2;
    }

    return minutes1 - minutes2;
  }

  // Utility: Calculate time difference in minutes
  calculateTimeDifference(time1, time2) {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    // Handle crossing midnight
    if (totalMinutes2 < totalMinutes1) {
      return 24 * 60 - totalMinutes1 + totalMinutes2;
    }

    return totalMinutes2 - totalMinutes1;
  }

  // Utility: Check if time is within window
  isTimeInWindow(time, windowStart, windowEnd) {
    // Parse all time strings into minutes since midnight
    const timeInMinutes = this.convertToMinutes(time);
    const windowStartInMinutes = this.convertToMinutes(windowStart);
    const windowEndInMinutes = this.convertToMinutes(windowEnd);

    // Handle overnight time windows (where end time is earlier than start time)
    if (windowEndInMinutes < windowStartInMinutes) {
      return (
        timeInMinutes >= windowStartInMinutes ||
        timeInMinutes <= windowEndInMinutes
      );
    }

    // Normal case (time window within same day)
    return (
      timeInMinutes >= windowStartInMinutes &&
      timeInMinutes <= windowEndInMinutes
    );
  }

  // Add this method to the AirlineScheduler class
  convertToMinutes(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Utility: Add hours to time
  addHoursToTime(time, hoursToAdd) {
    const [hours, minutes] = time.split(":").map(Number);
    const newHours = (hours + hoursToAdd) % 24;
    return `${newHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
}

// Export the classes for use in the application
export {
  FirstOrderLogic,
  ConstraintSatisfactionSolver,
  HeuristicOptimizer,
  AirlineScheduler,
};
