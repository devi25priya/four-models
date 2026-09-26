const API="http://127.0.0.1:8000";
let current="";
let chart=null;

const projects={
weather:{
title:"Weather Prediction",type:"PROJECT 01 · REGRESSION",icon:"🌦️",
description:"Predict temperature using atmospheric and weather-related measurements.",
instruction:"Enter the current weather conditions and the model will estimate temperature.",
algorithm:"Linear Regression",learning:"Supervised",output:"Temperature (°C)",
explanation:"Linear Regression learns the relationship between weather variables and temperature. The model uses a training dataset and estimates a continuous temperature value for new observations.",
fields:[
["humidity","Humidity (%)","number",65],["pressure","Pressure (hPa)","number",1012],["wind","Wind Speed (km/h)","number",12],["previous","Previous Temperature (°C)","number",30]
]
},
salary:{
title:"Salary Prediction",type:"PROJECT 02 · REGRESSION",icon:"💰",
description:"Estimate annual salary from professional and educational characteristics.",
instruction:"Enter employee information to estimate the annual salary.",
algorithm:"Random Forest Regression",learning:"Supervised",output:"Annual Salary (₹)",
explanation:"Random Forest combines many decision trees. Each tree learns patterns between employee characteristics and salary, and their predictions are combined to estimate a new employee's salary.",
fields:[
["experience","Years of Experience","number",4],["education","Education Level","select",["Bachelor's","Master's","PhD"]],["joblevel","Job Level","select",["Entry","Mid","Senior","Manager"]],["age","Age","number",27]
]
},
house:{
title:"House Price Prediction",type:"PROJECT 03 · REGRESSION",icon:"🏠",
description:"Estimate a property's market price from its physical characteristics.",
instruction:"Enter property details to estimate the house price.",
algorithm:"Decision Tree Regression",learning:"Supervised",output:"Estimated Price (₹)",
explanation:"A Decision Tree splits the training data into increasingly similar groups based on property features. The final leaf gives the estimated price for the new property.",
fields:[
["area","Area (sq ft)","number",1200],["bedrooms","Bedrooms","number",3],["bathrooms","Bathrooms","number",2],["age","House Age (years)","number",5],["location","Location Score (1-10)","number",8]
]
},
student:{
title:"Student Segmentation",type:"PROJECT 04 · CLUSTERING",icon:"🎓",
description:"Discover groups of students with similar academic performance.",
instruction:"Enter student information to discover which performance group the student belongs to.",
algorithm:"K-Means Clustering",learning:"Unsupervised",output:"Student Cluster",
explanation:"K-Means is an unsupervised algorithm. It does not require a target label. It groups students according to similarity across study hours, attendance, previous marks, assignments and final marks.",
fields:[
["study","Study Hours","number",7],["attendance","Attendance (%)","number",85],["previous","Previous Marks","number",70],["assignment","Assignment Score","number",78],["final","Final Marks","number",75]
]
}
};

function openProject(name){
current=name;
const p=projects[name];
document.getElementById("home").classList.remove("active");
document.getElementById("about").classList.remove("active");
document.getElementById("project").classList.add("active");
document.getElementById("pType").textContent=p.type;
document.getElementById("pTitle").textContent=p.title;
document.getElementById("pDescription").textContent=p.description;
document.getElementById("pIcon").textContent=p.icon;
document.getElementById("pInstruction").textContent=p.instruction;
document.getElementById("pExplanation").textContent=p.explanation;
document.getElementById("pAlgorithm").textContent=p.algorithm;
document.getElementById("pLearning").textContent=p.learning;
document.getElementById("pOutput").textContent=p.output;
document.getElementById("formArea").innerHTML=`<div class="form-grid">${p.fields.map(f=>fieldHTML(f)).join("")}</div>`;
resetOutput();
window.scrollTo({top:0,behavior:"smooth"});
}

function fieldHTML(f){
if(f[2]==="select"){
return `<div class="field"><label>${f[1]}<select id="${f[0]}">${f[3].map(x=>`<option>${x}</option>`).join("")}</select></label></div>`;
}
return `<div class="field"><label>${f[1]}<input id="${f[0]}" type="${f[2]}" value="${f[3]}" step="0.1"></label></div>`;
}

function showHome(){
document.getElementById("project").classList.remove("active");
document.getElementById("about").classList.remove("active");
document.getElementById("home").classList.add("active");
window.scrollTo({top:0,behavior:"smooth"});
}

function showAbout(){
document.getElementById("home").classList.remove("active");
document.getElementById("project").classList.remove("active");
document.getElementById("about").classList.add("active");
window.scrollTo({top:0,behavior:"smooth"});
}

async function predict(){
try{
let result;
if(current==="weather"){
const payload={humidity:+val("humidity"),pressure:+val("pressure"),wind_speed:+val("wind"),previous_temperature:+val("previous")};
result=await post("/weather",payload);
showResult(result.prediction+" °C","Predicted Temperature","The Linear Regression model estimated the temperature.");
drawChart(["Humidity","Pressure","Wind","Previous Temp"],[payload.humidity,payload.pressure,payload.wind_speed,payload.previous_temperature]);
}
else if(current==="salary"){
const payload={experience:+val("experience"),education:val("education"),job_level:val("joblevel"),age:+val("age")};
result=await post("/salary",payload);
showResult("₹ "+Number(result.prediction).toLocaleString("en-IN"),"Estimated Salary","The Random Forest model estimated the annual salary.");
drawChart(["Experience","Age"],[payload.experience,payload.age]);
}
else if(current==="house"){
const payload={area:+val("area"),bedrooms:+val("bedrooms"),bathrooms:+val("bathrooms"),age:+val("age"),location_score:+val("location")};
result=await post("/house",payload);
showResult("₹ "+Number(result.prediction).toLocaleString("en-IN"),"Estimated House Price","The Decision Tree model estimated the property price.");
drawChart(["Area","Bedrooms","Bathrooms","Age","Location"],[payload.area,payload.bedrooms,payload.bathrooms,payload.age,payload.location_score]);
}
else{
const payload={study_hours:+val("study"),attendance:+val("attendance"),previous_marks:+val("previous"),assignments_score:+val("assignment"),final_marks:+val("final")};
result=await post("/student",payload);
showResult("Cluster "+result.cluster,"Student Group: "+result.group,"K-Means assigned the student to the closest performance cluster.");
drawChart(["Study","Attendance","Previous","Assignment","Final"],[payload.study_hours,payload.attendance,payload.previous_marks,payload.assignments_score,payload.final_marks]);
}
}catch(e){alert("R backend is not running. Start backend/run_api.R first.");}
}

function val(id){return document.getElementById(id).value}

async function post(path,payload){
const r=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
if(!r.ok)throw new Error("API error");
return await r.json();
}

function showResult(value,title,text){
document.getElementById("outTitle").textContent=title;
document.getElementById("outText").textContent=text;
document.getElementById("outValue").textContent=value;
document.getElementById("outIcon").textContent="✓";
}

function resetOutput(){
document.getElementById("outTitle").textContent="Ready";
document.getElementById("outText").textContent="Enter your values and run the model.";
document.getElementById("outValue").textContent="—";
document.getElementById("outIcon").textContent="⌁";
}

function drawChart(labels,data){
if(chart)chart.destroy();
chart=new Chart(document.getElementById("projectChart"),{
type:"bar",
data:{labels,datasets:[{label:"Input Values",data}]},
options:{responsive:true,scales:{y:{beginAtZero:true}}}
});
}

fetch(API+"/health").catch(()=>{});
