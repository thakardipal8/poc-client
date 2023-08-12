# PayMate Payroll Management Application

![react](https://img.shields.io/badge/-React-blue) ![node](https://img.shields.io/badge/-Node-brightgreen) ![express](https://img.shields.io/badge/-Express-lightgrey) ![javascript](https://img.shields.io/badge/-JavaScript-yellow) ![mysql](https://img.shields.io/badge/-MySQL-blueviolet) ![html](https://img.shields.io/badge/-HTML-blue) ![css](https://img.shields.io/badge/-CSS-orange) ![sass](https://img.shields.io/badge/-Sass-ff69b4) ![docker](https://img.shields.io/badge/-Docker-blue)

Welcome to the PayMate Payroll Management Application!

![PayMate Screenshot](src/assets/PayMateScreenshot.jpg)

## Live Demo

## Introduction

My client needed a solution to streamline their payroll process, and I was happy to take on the challenge. The purpose of the application was to provide a convenient and efficient way for them and their freelance consultants to manage their bimonthly payments. Their consultants are based in Canada, Mexico and the USA.

## Features

Some key features of the application include:

### Time tracking / invoice creation

Allows freelance consultants to easily enter the hours they work and submit their timesheets for approval. Admins can review the timesheets and approve/deny and provide feedback.

### Automated pay calculations

Calculates pay and bonuses based on the hours worked, the hours expected and the agreed-upon base compensation rate, among other criteria. The specific calculations to be used were provided by the client. This automation eliminates the need for manual calculations and reduces the risk of errors. The calculations are able to be overridden manually to account for consultants located in three different countries with different time zones, holidays, time off needs and other individual allowances, etc.

### Secure access

Uses secure login credentials, protected routes and json web tokens to ensure that only authorized users can access protected information.

### Easy payment access

Allows users to easily view and download payment information. This transparency helps foster trust and build positive relationships.

## Roles and Permissions

### Admin / SuperAdmin

- Add and update consultant information, including compensation rate, preferred currency, account status.
- Add and manage administrators, including account status and permissions.
- Approve and decline consultant invoices.
- Calculate and generate payroll payments for each consultant.
- Automatically calculate the number of workable hours in a pay period or quarter, with override capability if needed.
- Calculate and generate quarterly bonus payments for each consultant.
- Mark approved payments as paid or edit the payment date.
- View and manage payment history.
- View payment and user analytics.
- Export data to CSV or PDF file.

### Consultants

- Generate and submit bimonthly timesheets/invoices.
- Manage and delete pending and declined invoices.
- View payment details and payment history.
- Add and update profile information, including contact information and preferred currency.
- Export data to CSV or PDF fle.

## Calculations

Payment calculations were done as provided by the client:

1. Payroll payments are calculated as: hoursWorked / hoursExpected \* baseCompensationRate
2. Quarterly Bonus payments are calculates as: hoursWorkedInQuarter / hoursExpectedInQuarter \* baseCompensationRate \* performanceScore / 4
3. HoursExpected are automatically calculated as: business days between start date and end date \* 8. Please note: Holidays and other considerations are not taken into acccount as they will be done on an individual basis as per the clients wishes.

## Stack

- React
- Node
- Express
- Javascript
- MySQL
- HTML
- CSS
- Sass
- Docker

## Third Party Dependencies

- Sass - CSS Preprocessor
- React Date-Picker - used to select payment date when creating an invoice
- Toastify - used to display success and error messages to the user
- NanoId - used to generate an id for each item added to an invoice
- Material-Table - used to display tabular payment data
- Argon2 - to generate hashes for password security
- Nodemon - automatically restarts the server when changes are made in the development environment.

## Authentication

### JSON Web Tokens

- A JSON Web Token is created upon login and stored in localStorage (expires in 120m and cleared upon logout). When the user makes a request the application will check for the presence of a token within localStorage. If found, the application will verify that the token is valid and extract the user's information from it. If it is not a valid token, the user will be denied access to that resource.

### Protected Routes

- Protected Routes grant access to resources based on a user's account permissions. Upon login, the permission type is stored in localStorage. The application will check if the permission type in localStorage matches the permission type specified by the Protected Route. If the permissions match, the user will be granted access. If they do not match, the user will be denied.

## Performance

- Gzip compression middleware with Node.js to reduce payload size.
- Code splitting with React to reduce the file bundle of the initial load.
- Webp image formats to reduce image sizes while preserving quality.

## Images

- The background image used on the Login, Signup and Reset Password pages as well as the Header component was provided via Unsplash.

## Usage

Suggestions, forks and pull requests are always welcome. Please give the repository a star on GitHub if you use and/or enjoy this project.

## Creator

Sarah Salvatore, Full Stack Developer

- Website:
- Email: sarah.h.salvatore@gmail.com
- LinkedIn: [https://www.linkedin.com/in/sarah-salvatore-full-stack-developer/]
- GitHub: [https://github.com/SarahSalvatore]

## License

MIT License

Copyright (c) [2022] [Sarah Salvatore]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
