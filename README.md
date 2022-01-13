# Fetan - Delivery Service App 
An Ecommerce platform mobile and web app built in React, React native and NodeJS 

## Table of contents
* [Introduction](#introduction)
* [Technologies](#technologies)
* [Setup](#setup)

## Introduction
FETAN is an on-demand grocery delivery platform facilitating doorstep deliveries of groceries and other home essentials in Addis Ababa. The technology-driven business model of FETAN boosts of delivering groceries to customers in as little as 1 hour, making it one of the most promising and futuristic company of Ethiopia which is based on sharing economy model

<!-- ![Software Developer](https://github.com/abenikeb/fetandelivery/blob/main/fetan_mock_2.png) -->
<img src="https://github.com/abenikeb/fetandelivery/blob/main/fetan_mock_2.png" />
	
## Technologies
Project is created with:
* ⚛ React
* 📱 React Native
* 🖥 Type Script
* 🖥 HTML, CSS & JS
* 🖥 Node JS & Express JS
* 💻 Mongo DB

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Populate the Database

    node seed.js

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    npm test

All tests should pass.

### Start the Server

    node index.js

This will launch the Node server on port 3900. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3900/api/

You should see the list of genres. That confirms that you have set up everything successfully.



