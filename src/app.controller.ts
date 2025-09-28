import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  getHome(@Res() res: Response) {
    res.send(`
       <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Wisal-API</title>
        <!-- Google Font -->
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
          }
          .card {
            background: rgba(0,0,0,0.25);
            padding: 3rem 4rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          }
          h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.5rem;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Welcome to Wisal-API!</h1>
          <p>Your API is running successfully 🚀</p>
        </div>
      </body>
      </html>
    `);
  }
}
