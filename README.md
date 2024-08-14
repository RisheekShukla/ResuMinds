
# ResuMinds 

ResuMinds is an innovative tool that revolutionizes the way we prepare for interviews by leveraging state-of-the-art Generative and Prompt Technology. Designed for individuals looking to sharpen their interview skills, ResuMinds processes your resume and generates a tailored set of interview questions, providing a unique and personalized preparation experience.


## Live Demo
Try it with your resume: 

https://resuminds.vercel.app/

## Features

- Instant Question Generation: Upload your resume in PDF or DOCX format, and ResuMinds will immediately analyze the content to generate interview questions tailored to your experience and skills.
- Dynamic Regeneration: Not satisfied with the generated questions? Use the "Regenerate" feature to get a fresh set of questions instantly.
- Cutting-Edge Technology: Powered by the latest advancements in Gen and Prompt Tech, including the LLaMA model from Groq, ResuMinds ensures that the questions generated are highly relevant and varied.
- User-Friendly Interface: ResuMinds offers a sleek and intuitive interface, making it easy to navigate and use for all levels of users.


## Deployment

ResuMinds is deployed on Vercel. For deploying your own instance, follow these steps:
1. Fork the Repository and clone it to your local machine.
2. Push to GitHub:
```bash
  git add
  git commit -m "Initial commit"
  git push origin main
```
3. Deploy to Vercel using the Vercel CLI or connect your GitHub repository to Vercel.


## API Reference

#### Get all items

```http
  npm install --save groq-sdk
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `GROQ_API_KEY` | `string` | **Required**. Your API key |



## Installation

Clone the Repository:

```bash
  git clone https://github.com/RisheekShukla/ResuMinds.git
  cd ResuMinds

```
Install ResuMinds with npm:
```bash
  npm install
```
Create a .env file in the root directory and add your API keys:
```bash
  GROQ_API_KEY=your-groq-api-key
```
Run the Application:
```bash
  npm start
```
## Collaboration

ResuMinds is open for collaboration! Whether you're interested in contributing to the codebase, enhancing the UI/UX, or integrating new features, feel free to fork the repo and submit a pull request.

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@tambit_14](https://www.github.com/RisheekShukla)

