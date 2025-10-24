## Installation

Install node and npm from [here](https://nodejs.org/en/download/) if you don't have them already. we recommend using the latest LTS version of node. at the time of writing this, that is v16.15.0. if you have node and npm installed, you can check their versions with `node -v`.

**If you face any issues with the latest version, please install the 16.15.0 version of node from [here](https://nodejs.org/download/release/v16.15.0/).**

Follow the steps below to run the project locally:

1. Clone the repository
2. Install packages with `npm install`
3. Change the backend api domain in `src/utility/http/httpConfig.ts` and save the file
4. Run the server with `npm start`
5. Open the browser to `localhost:3000`
6. You can build production files with `npm run build`, please do not forgot to change the backend api domain in `src/utility/http/httpConfig.ts` before building the project
7. Copy the files in the `dist` folder to your server

To run the production build locally, first install serve with `npm install -g serve` and then run `serve -s dist`. This will serve the production build on localhost.


Install Dependencies:-
  npm install 
  or 
  npm install --legacy-peer-deps

Build for Production:-
 npm run build	

Environment Variables (.env)
# Skip type-check warnings during development
SKIP_PREFLIGHT_CHECK=true
# Base URL for front-end routing (without ending slash)
VITE_BASE_URL=/dolvidpr

# API endpoint for backend requests (change for backend Api url as for requirement)
VITE_API_URL=jsw.pivot.kpmg.com/dolvidprapi/public

# Encryption key and IV for secure data
VITE_ENCRYPTION_KEY=770258e0109c75b778a30e5d79b152a5a66fade7d032c915884f3e0c0d049d46
VITE_IV=d58c312e7fbd72bc4065db961f53e80b
# Enable SSL for requests 
VITE_SSL=true

Deployment Notes:-
•  Build the project using npm run build
•  Serve the dist folder on a web server
•  Ensure the .env file is configured correctly for the environment
•  Enable SSL if VITE_SSL=true

Recommended Node & React Versions:-
      Tool	         Version
      Node.js	            >= 18.x
	
      React	             18.2.0
     React DOM	            18.2.0