This website was a test for my front and back end skills while also testing my skills with AWS

link: thomasdalzell.co.uk
For this i used fastapi and weatherstack to display and get the weather data.

if the site is not loading the weather I may have ran out of my free uses on weatherstack

DEV LOG -
problem - the website is working using aws EC2 but the api wont work when closed
solved - using the ran the command linux terminal to run website permantly in the 
used nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
instead of uvicorn main:app --host 0.0.0.0 --port 8000 --reload

problem - website showing wrong time
solved - imported pytz for timezone handling used git to get my updated python file and restarted fastapi
