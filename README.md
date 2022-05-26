# AI For You

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.0.

## Steps to Run the Project on local machine.

## Installing Node (For Linux)
Run `sudo apt update`.

Run `sudo apt install nodejs`.

Run `sudo apt install npm`.

## Confirm Node Installation
Run `nodejs -v`.

## Install Angular
Run `npm install -g @angular/cli`.

## Confirm Angular Installation
Run `ng --version`.

## Install Dependencies
Navigate to project directory.

Run `npm install` or `npm -f install`.

## To Run Development server
Run `ng serve`. 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

> Note:- if you are trying to run the application without docker paste the below line of code in `src/global.ts` and comment the previous ones.

>`export const environment.API_URL_HEAD = 'http://'+ location.hostname +':8000/api/';`

## To Create Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Steps to Build Docker Image
Navigate to project directory. Note:- It should contain a `Dockerfile`.

Run `sudo docker build -t aiforyou:frontend --build-arg environment=development .` Note:- Use staging instead of development to build staging image or production to build production image

## Steps to run Docker Image
Run `sudo docker run --name aiforyoufrontend -p 80:80 aiforyou:frontend`

## Steps to push Docker Image to docker hub
Run `sudo docker tag <imageid> <dockerid>/<repositoryname>:frontend`- used to change image name and tag as they should match with the repo on docker hub.

Run `sudo docker login`

Enter username

Enter password

Run `sudo docker push <dockerid>/<repositoryname>:frontend`

## Steps to pull Docker Image from docker hub
Run `sudo docker pull <dockerid>/<repositoryname>:frontend`

## Steps to run Docker Image
Run `sudo docker run --name aiforyoufrontend -p 80:80 <dockerid>/<repositoryname>:frontend`
`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
