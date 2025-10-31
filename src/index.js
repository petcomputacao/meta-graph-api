const fetch = require('node-fetch');

const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_USER_ID   = process.env.IG_USER_ID;

module.exports = async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		return res.status(200).end();
	}

	const limit = 4

	const url = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${ACCESS_TOKEN}&limit=${limit}`;
	try {
		const response = await fetch(url);
		const data     = await response.json();

		if (data.error) {
			return res.status(400).json({ error: data.error });
		}

		return res.status(200).json({ data: data.data });
	} catch (err) {
		console.error("Erro ao buscar por posts:", err);
		return res.status(500).json({ error: "Erro interno do servidor." });
	}
};

