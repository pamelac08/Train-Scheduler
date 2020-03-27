# Train Scheduler
Coding Boot-camp Homework #7: Intro to Firebase


### Deployed via Git Hub Pages:
https://pamelac08.github.io/Train-Scheduler/



### Project Description:

This project is a train schedule application that incorporates Firebase to host arrival and departure data and retrieves/manipulates this information with Moment.js

* This website provides up-to-date information about various trains - displaying their arrival times and how many minutes remain until the train arrives
* this application is from the perspective of an administrator with the ability to add train schedules with: train name, destination, first train time (in military time), and frequency (in minutes)
* the application will display the train name, destination, frequency, next arrival time, and how many minutes away the next train is relative to the current time 
* the application updates the train information on the webpage every minute automatically with the current local time displayed on the train schedule
* the application also allows the administrator to update existing train schedule information which updates the firebase database plus the ability to delete an existing train schedule from the displayed table on the webpage

(future updates: arrange table in alphabetical order when updated)


### Primarily used: 

Firebase Database to store data, moment.js, timers, click event listeners, conditional statements, and for loops to update table



