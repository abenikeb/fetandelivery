![Software Developer](https://github.com/abenikeb/abenikeb/blob/main/My_first_banner_small.png)


## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This project is simple Lorem ipsum dolor generator.
	
## Technologies
Project is created with:
* Lorem version: 12.3
* Ipsum version: 2.33
* Ament library version: 999


## Introduction

fetandelivery |
ፈጣን በአዲስ አበባ ውስጥ የሚገኝ የምግብ ሸቀጣ ሸቀጦችን እና ሌሎች አስፈላጊ የቤት ነገሮችን የእጅ ስልክ መተግበሪያ በመጠቀም ባሉበት ድረስ ማቅረብ የሚያስችል የግሮሰሪ ወይም አስቤዛ ማቅረቢያ የኦንላይን አገልግሎት መድረክ ነው።ይህ በዲጅታል ቴክኖሎጂ የሚመራው የፈጣን ኦንላይን ንግድ ሸቀጣ ሸቀጦችን በ አንድ(1) ሰዓት ውስጥ ለደንበኞች ማድረስን ያስችላል ፣ ይህም በጣም ተስፋ ሰጭ እንዲሆን ያደርገዋል በተጨማሪም በኢኮኖሚ ሞዴል ማጋራት ላይ የተመሠረተ የወደፊቱ የኢትዮጵያ ትልቅ ኩባንያ ነው።

FETAN is an on-demand grocery delivery platform facilitating doorstep deliveries of groceries and other home essentials in Addis Ababa. The technology-driven business model of FETAN boosts of delivering groceries to customers in as little as 1 hour, making it one of the most promising and futuristic company of Ethiopia which is based on sharing economy model


This is the implementation of fetandelivery in Node.js.

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

http://localhost:3900/api/employee

You should see the list of genres. That confirms that you have set up everything successfully.



