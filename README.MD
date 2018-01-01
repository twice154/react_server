# React-Web-Server & Central-Server (dev)

## About

Dev branch contains unstable build including several experimental implementation, So download master branch for testing!
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
- bcryptjs
- orientjs
- socket.io
- react
- react-router
- react-addons-css-transition-group
- react-addons-update
- redux
- redux-thunk
- materializecss
- react-hot-loader
- webpack
- webpack-dev-server
- style-loader
- css-loader


## Prerequisites
OrientDB and NodeJS should be installed

```
npm install -g webpack babel nodemon cross-env
npm install
```

## Scripts

- `node dbInit.js` Initializes Database Settings (orientDB is needed)
- `node centralServer` Start Central Control Server
- `npm run clean` Deletes Build files of Web Server
- `npm run build` Builds Web Server
- `npm run start` Start Web Server in production environment
- `npm run development` Start Web server in development environment

Express server runs on port 3000, and development server runs on port 4000.
