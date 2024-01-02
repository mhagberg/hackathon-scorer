const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const API_KEY = OPENAI_API_KEY // Replace with your actual OpenAI API key
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

app.post('/getScore', async (req, res) => {
    try {
        const { projectName, projectCodeCheckedIn, projectPurpose, numberOfSlides, numberOfTests } = req.body;

        const model = 'gpt-3.5-turbo'; // Specify the GPT model you want to use

        const messages = [
            { role: 'system', content: 'You are a helpful assistant that gives project scores.' },
            { role: 'user', content: `Score project: ${projectName}` },
            { role: 'assistant', content: `Sure, I can help you score your project.\n\nProject Name: ${projectName}\nProject Code Checked In: ${projectCodeCheckedIn}\nProject Purpose: ${projectPurpose}\nNumber of Slides in Presentations: ${numberOfSlides}\nNumber of Tests: ${numberOfTests}` },
            // Provide additional details about scoring criteria
            { role: 'user', content: 'Always score each category regardless of what is given.\n0. Please score the project based on the following criteria default to a score of 5 if no score can be determined. \n1. The Project code projectCodeCheckedIn uses LLMs or AI\n2. Test Coverage with a goal of giving 1 point per test where 0 tests get 0 points\n3. the number of slides should be Less than 11 and greater than 5 to get 1 points per slide. If greater than 10 take subtract 1 point per slide from the base value of 10 .\n4. The project name should be creative and have something to do with LLM\n5. Always generate a total score between 0 and 60.' },
            { role: 'user', content: 'This result is wrong: the number of slides should have gotten a 9 out of 10 because it had one slide too many: Project Score: Based on the given criteria, here is the score for the project "ScanScribe": 1. Creativity and Innovation: 8/10 The project demonstrates some creativity and innovation by utilizing AWS services and integrating with PDF libraries for document analysis and processing. 2. Technical Complexity: 9/10 The project involves working with AWS S3, utilizing SDKs for file manipulation, and integrating with PDF extraction and analysis tools. The code includes asynchronous operations and error handling. 3. Presentation Quality: 7/10 The presentation of the project is not mentioned, so it is unclear how well the project is presented. For the purpose of scoring, we assume an average presentation quality. 4. Test Coverage: 0/10 No tests are mentioned or implemented for the project. 5. Number of Slides: 0/10 The project\'s slide count is not mentioned, or it does not fall within the required range of 10-11 slides. 6. Project Name: 0/10 The project name "ScanScribe" does not have any obvious connection to LLM, as mentioned in the criteria. Total Score: (8 + 9 + 7 + 0 + 0 + 0) = 24/50 Note: Please provide more information or clarify any missing details to obtain a more accurate score.' },
        ];

        const response = await axios.post(API_ENDPOINT, {
            model: model,
            messages: messages,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        const assistantReply = response.data.choices[0]?.message?.content;

        if (assistantReply) {
            // const score = parseInt(assistantReply.match(/\d+/)[0]);
            res.json({ assistantReply } );
        } else {
            res.json({ assistantReply: 'N/A' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
