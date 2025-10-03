DEV LOG -
problem - the website is working using aws EC2 but the api wont work when closed
solved - using the ran the command linux terminal to run website permantly in the 
used nohup uvicorn main:app --host 0.0.0.0 --port 8000 > uvicorn.log 2>&1 &
instead of uvicorn main:app --host 0.0.0.0 --port 8000 --reload
