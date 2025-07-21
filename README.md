# photoshelf
A webserver to create albums of local photos to share and remember

## Development Setup
Run `install_dev.sh` to setup the server. You will be prompted to enter the URL of the backend for development (normally your current system).

Then run `express-backend/run.sh` and `vue-frontend/run.sh` to start the development server.

## Production Setup / Build
First run `install_dev.sh` and enter the backend URL.

#### Installing Backend Server
Manually copy the `express-backend` directory to your desired location. Set `node index.js` to run via `systemd` or similar.

#### Building Frontend Server
Enter `vue-frontend` and type `npm run build`. Then deploy the contents of the `dist` directory to your web server of choice.