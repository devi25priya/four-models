# ML Project Hub — All in One

This project is one website containing four different real-world machine-learning projects.

## Projects

1. Weather Prediction
   - Algorithm: Linear Regression
   - Type: Supervised Learning
   - Output: Temperature

2. Salary Prediction
   - Algorithm: Random Forest Regression
   - Type: Supervised Learning
   - Output: Annual Salary

3. House Price Prediction
   - Algorithm: Decision Tree Regression
   - Type: Supervised Learning
   - Output: House Price

4. Student Segmentation
   - Algorithm: K-Means Clustering
   - Type: Unsupervised Learning
   - Output: Student Cluster

## Run

### Install R packages

In R/RStudio:

```r
install.packages(c("randomForest","rpart","cluster","plumber","jsonlite"))
```

### Train models

Open `backend` in R/RStudio:

```r
source("model.R")
```

### Start API

```r
source("run_api.R")
```

API: http://localhost:8000

### Start website

Use VS Code Live Server on `frontend/index.html`.

Or from the project root:

```bash
python -m http.server 5500
```

Open:

http://localhost:5500/frontend/

IMPORTANT: `source("model.R")` is an R command and must be run inside R/RStudio, not directly in PowerShell.
