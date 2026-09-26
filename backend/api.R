library(plumber)
library(jsonlite)
library(randomForest)
library(rpart)

load("models.RData")

#* API health
#* @get /health
#* @serializer json
function(){
  list(status="online")
}

#* Weather Prediction - Linear Regression
#* @post /weather
#* @serializer json
function(req){
  x<-fromJSON(req$postBody)
  d<-data.frame(
    Humidity=as.numeric(x$humidity),
    Pressure=as.numeric(x$pressure),
    Wind_Speed=as.numeric(x$wind_speed),
    Previous_Temperature=as.numeric(x$previous_temperature)
  )
  p<-as.numeric(predict(weather_model,d))
  list(algorithm="Linear Regression",prediction=round(p,2))
}

#* Salary Prediction - Random Forest
#* @post /salary
#* @serializer json
function(req){
  x<-fromJSON(req$postBody)
  d<-data.frame(
    Experience=as.numeric(x$experience),
    Education=factor(x$education,levels=levels(salary$Education)),
    Job_Level=factor(x$job_level,levels=levels(salary$Job_Level)),
    Age=as.numeric(x$age)
  )
  p<-as.numeric(predict(salary_model,d))
  list(algorithm="Random Forest",prediction=round(p,0))
}

#* House Price - Decision Tree
#* @post /house
#* @serializer json
function(req){
  x<-fromJSON(req$postBody)
  d<-data.frame(
    Area=as.numeric(x$area),
    Bedrooms=as.numeric(x$bedrooms),
    Bathrooms=as.numeric(x$bathrooms),
    Age=as.numeric(x$age),
    Location_Score=as.numeric(x$location_score)
  )
  p<-as.numeric(predict(house_model,d))
  list(algorithm="Decision Tree",prediction=round(p,0))
}

#* Student Segmentation - K-Means
#* @post /student
#* @serializer json
function(req){
  x<-fromJSON(req$postBody)
  raw<-student[,c("Study_Hours","Attendance","Previous_Marks","Assignments_Score","Final_Marks")]
  center<-attr(scale(raw),"scaled:center")
  scalev<-attr(scale(raw),"scaled:scale")
  values<-c(
    as.numeric(x$study_hours),
    as.numeric(x$attendance),
    as.numeric(x$previous_marks),
    as.numeric(x$assignments_score),
    as.numeric(x$final_marks)
  )
  z<-(values-center)/scalev
  d<-apply(student_model$centers,1,function(c)sum((z-c)^2))
  cluster<-which.min(d)
  means<-tapply(student$Final_Marks,student_model$cluster,mean)
  order_groups<-order(means)
  group_names<-character(3)
  group_names[order_groups]<-c("Needs Improvement","Average Performer","High Performer")
  list(algorithm="K-Means",cluster=cluster,group=group_names[cluster])
}
