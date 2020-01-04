# Express Auth

This is boilerplate code for projects. This is bare bones Node/express app with basic local user authentication. *It exists so that I don't have to start from scratch on my projects*.

## What it includes

* Sequelize user model / migration
* Settings for PostgreSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes | 
| ---------------- | ------------- | ----------------------------- |
| id | Integer | Serial Primary Key |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |
| firstname | String | Required |
| lastname | String | - |
| username | String | - |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| photoURL | String | Profile Picture |
| admin | Boolean | Defaults to false |
| bio | Text | - |
| birthday | Date | - |


### Default Routes

| Method | Path | Location | Purpose |
| ------ | --------------- | -------------- | ----------------- |
| GET | / | index.js | homepage |
| GET | * | index.js | Render error page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates user |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | profile.js | Regular user profile |
| GET | /profile/admin | profile.js | Admin profile |


### Steps To Use
