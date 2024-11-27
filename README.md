# Mahtiumerojahti: Number Guessing Game

This is a full-stack implementation of a number guessing game using a backend written with NestJS, and a frontend built with Angular. PostgreSQL is being used as the database, and Docker is used to containerize the application making it portable and easier to deploy.

## Setting Up The Application

### Backend Setup (NestJS)

1. Navigate to `app.module.ts` and set it up according to your needs.

2. Navigate to `jwt.strategy.ts` and `user.module.ts` and set up your secret key.

3. Install the necessary Node packages using npm. In your terminal, navigate to your project's root directory and run:
   npm install

4. To set up docker adjust docker-compose.yml and in your terminal navigate to your project's root directory and run:
   docker-compose up --build

This README walks through the steps needed to set up the Back-end (NestJS), Front-end (Angular), PostgreSQL database and Docker instances required for your project.