// This file loads and exports environment variables

// A central place for all environment variables
export const config = {
  port: process.env.PORT || 3005, // Port for this microservice
  jwtSecret: process.env.JWT_SECRET, // Secret to verify tokens from hpc_user
  userServiceUrl: process.env.USER_SERVICE_URL, // URL for hpc_user service
};

// Validate that critical environment variables are set
if (!config.jwtSecret || !config.userServiceUrl) {
  throw new Error(
    "Missing critical environment variables: JWT_SECRET, USER_SERVICE_URL",
  );
}
