# React-Web-Server & Central-Server

## About

React-Web-Server is a live streaming app implemented using React.js, Redux, Express.js
Central-Server is a tcp Server controlling communication between React-Web-Server & CONNETO

## Features
React-Web-Server
- Authentication (Sign Up / Sign In)
- View Streaming & Chatting
- CONNETO Control Interface

## Following technologies are used
- axios
- babel
- express
- orientjs
- socket.io
- react
- react-router
- redux
- redux-thunk
- materializecss
- react-hot-loader
- webpack
- webpack-dev-server
- style-loader
- css-loader


## Prerequisites
OrientDB, NodeJS, and Yarn should be installed

```
yarn global add webpack babel-cli nodemon cross-env concurrently react-scripts  
yarn add
cd server && yarn add 
```

## Scripts

- `node dbInit.js` Initializes Database Settings (orientDB is needed)
- `node centralServer` Start Central Control Server
- `npm run build` Builds Web Server
- `npm run start` Start Web Server in production environment
- `npm run development` Start Web server in development environment

production server runs on port 3000, and development server runs on port 4000.
