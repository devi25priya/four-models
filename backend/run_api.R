library(plumber)

# Load API
api <- plumb("api.R")

# CORS filter
api$filter("cors", function(req, res) {

  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")

  # Handle browser preflight request
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }

  forward()
})

cat("Starting R API...\n")
cat("Health: http://127.0.0.1:8000/health\n")
cat("Swagger: http://127.0.0.1:8000/__docs__/\n")

api$run(
  host = "0.0.0.0",
  port = 8000
)