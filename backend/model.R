# Train the four independent ML projects
set.seed(42)

packages <- c("randomForest","rpart","cluster")
for(p in packages){
  if(!requireNamespace(p,quietly=TRUE)) install.packages(p,repos="https://cloud.r-project.org")
}
library(randomForest)
library(rpart)
library(cluster)

# 1. WEATHER - Linear Regression
weather <- read.csv("../data/weather.csv")
weather_model <- lm(
  Temperature ~ Humidity + Pressure + Wind_Speed + Previous_Temperature,
  data=weather
)

# 2. SALARY - Random Forest
salary <- read.csv("../data/salary.csv")
salary$Education <- factor(salary$Education)
salary$Job_Level <- factor(salary$Job_Level)
salary_model <- randomForest(
  Salary ~ Experience + Education + Job_Level + Age,
  data=salary,
  ntree=250
)

# 3. HOUSE - Decision Tree
house <- read.csv("../data/house.csv")
house_model <- rpart(
  Price ~ Area + Bedrooms + Bathrooms + Age + Location_Score,
  data=house,
  method="anova"
)

# 4. STUDENT - K-Means
student <- read.csv("../data/students.csv")
student_matrix <- scale(student[,c("Study_Hours","Attendance","Previous_Marks","Assignments_Score","Final_Marks")])
student_model <- kmeans(student_matrix,centers=3,nstart=25)

save(weather_model,salary_model,house_model,student_model,
     weather,salary,house,student,
     file="models.RData")

cat("All four models trained successfully.\n")
