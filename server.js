const express = require('express');
// const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');
const multer = require('multer');
const app = express();
// const { OpenAI } = require('openai');
// const { complete } = require('@anthropic-ai/sdk');
dotenv.config();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
  });


async function getGroqChatCompletion(text) {
  
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            " Generate 5 (number them) formal and relevant interview questions based on the following resume. Start directly with the questions, and do not include any introductory text, explanations, or prefatory phrases like 'Here are' or 'Based on the resume ",
        },
        {
          role: "user",
          content: text,
        },
      ],
      model: "llama3-8b-8192",
    });
  }

// const anthropic = new Client({
//     apiKey: process.env.CLAUDE_API_KEY, // Store your API key securely
//   });
  

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,  // This will now correctly load the API key
// });

// const generateQuestionsWithClaude = async (resumeText) => {
//     const prompt = `
//     I have the following resume:

//     "${resumeText}"

//     Based on this resume, generate a set of interview questions that will help evaluate the candidate's skills, experiences, and suitability for a technical role. Please make sure the questions are relevant to the content of the resume and cover a range of topics, including technical skills, problem-solving abilities, and project experience.
//     `;

//     try {
//         const response = await complete({
//             apiKey: process.env.CLAUDE_API_KEY,  // Provide the API key here
//             model: 'claude-2', // Specify the model
//             prompt: prompt,
//             max_tokens: 150,  // Adjust the max tokens based on your requirement
//             temperature: 0.7,
//             stop_sequences: ["\n"],
//         });

//         const questions = response.completion.trim();  // Adjusted to access the response
//         return questions.split('\n').filter(q => q.length > 0);

//     } catch (error) {
//         console.error('Error generating questions with Claude:', error);
//         return ['Sorry, an error occurred while generating questions.'];
//     }
// };

// const generateQuestionsWithAI = async (resumeText) => {
//     try {
//         const response = await openai.completions.create({
//             model: 'gpt-3.5-turbo',  // Or use a newer model like gpt-3.5-turbo
//             prompt: `Based on the following resume, generate a set of interview questions: \n\n${resumeText}`,
//             max_tokens: 100,
//             n: 5,  // Number of questions to generate
//             stop: null,
//             temperature: 0.6,  // Adjusts randomness in question generation
//         });

//         const questions = response.choices.map(choice => choice.text.trim());
//         return questions;

//     } catch (error) {
//         console.error('Error generating questions:', error);
//         return ['Sorry, an error occurred while generating questions.'];
//     }
// };

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const storage = multer.memoryStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// Function to extract text from PDF
const parsePDF = async (dataBuffer) => {
    // const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
};

// Function to extract text from DOCX
const parseDOCX = async (filePath) => {
    const { value } = await mammoth.extractRawText({buffer: filePath });
    return value;
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views','index.html'))
});


let extractedText = '';
app.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // const filePath = `public/uploads/${req.file.filename}`;

    // fs.readdir('public/uploads/', (err, files) => {
    //     if (err) {
    //         console.error('Error reading uploads directory:', err);
    //         return res.status(500).send('Error processing files.');
    //     }
    //     files.forEach(file => {
    //         if (file !== req.file.filename) {
    //             fs.unlink(path.join('public/uploads/', file), err => {
    //                 if (err) console.error('Error deleting old file:', err);
    //             });
    //         }
    //     });
    // });

    // try {
    //     if (req.file.mimetype === 'application/pdf') {
    //         extractedText = await parsePDF(filePath);
    //     } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    //         extractedText = await parseDOCX(filePath);
    //     } else {
    //         return res.status(400).send('Unsupported file type.');
    //     }

    //     // Log or process the extracted text
    //     // console.log(extractedText);
    //      // Generate questions using the extracted text
    //     //  const questions = await generateQuestionsWithAI(extractedText);
    //     // // Send the generated questions back to the client
    //     // res.json({ message: 'Resume parsed successfully!', questions });
    //      // Extract questions from the response
    //      const temp = await getGroqChatCompletion(extractedText);
    //      const questionsContent = temp.choices[0].message.content;
    //     //  const questions = questionsContent.split('\n').filter(q => q.trim().length > 0);
    //     const questions = questionsContent.split('\n').filter(q => q.trim());

    //     // Render the EJS page and pass the questions
    //     // res.send(questions);
    //     res.render('questions', { questions });
    //      // Render EJS page with the questions
    //     //  res.json({ message: 'Resume parsed successfully!', questionsContent });
    //     // res.send(questionsContent);
    //     //  res.render('questions', { questions });
    try {
        // Extract text directly from the uploaded file in memory
        if (req.file.mimetype === 'application/pdf') {
            extractedText = await parsePDF(req.file.buffer);
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            extractedText = await parseDOCX(req.file.buffer);
        } else {
            return res.status(400).send('Unsupported file type.');
        }

        // Generate questions using the extracted text
        const temp = await getGroqChatCompletion(extractedText);
        const questionsContent = temp.choices[0].message.content;
        const questions = questionsContent.split('\n').filter(q => q.trim());
        res.render('questions', { questions });


    } catch (err) {
        console.error(err);
        res.status(500).send('Error parsing the resume.');
    }
});

app.post('/regenerate', async (req, res) => {
    const temp = await getGroqChatCompletion(extractedText);
    const questionsContent = temp.choices[0].message.content;
   const questions = questionsContent.split('\n').filter(q => q.trim());
   res.render('questions', { questions });
});

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {})
    // .then(() => console.log('Connected to MongoDB'))
    // .catch((err) => console.error(err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
