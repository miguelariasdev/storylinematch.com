const OpenAI = require('openai').default;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const https = require('https');

exports.generateResponse = async (req, res) => {
    const story = req.body.prompt;

    if (!story) return res.status(400).send('No prompt provided');

    const prompt = `
    You are a movie expert.
    I am going to give you a description of a story and I want you to give me a list of 10 movies that most closely resemble the story I am going to give you.
    Give me only one json, I don't want any message before or after it.
    Your input will always be a story of a movie. If not, respond with:
    {
      "error": "The input provided does not appear to be a movie story."
    }

    movie_list: [...]
    input: I want movies about ${story}`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('OpenAI error');
    }
};

exports.searchMovie = (req, res) => {
    const { title, year } = req.query;
    if (!title || !year) return res.status(400).send('Title and year required');

    const options = {
        method: 'GET',
        hostname: 'moviesdatabase.p.rapidapi.com',
        path: `/titles/search/title/${encodeURIComponent(title)}?exact=true&info=base_info&year=${year}&titleType=movie`,
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    const apiReq = https.request(options, apiRes => {
        let data = [];
        apiRes.on('data', chunk => data.push(chunk));
        apiRes.on('end', () => res.send(Buffer.concat(data).toString()));
    });

    apiReq.on('error', err => {
        console.error(err);
        res.status(500).send(err.message);
    });

    apiReq.end();
};
