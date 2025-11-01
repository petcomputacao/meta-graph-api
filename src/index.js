import fetch from 'node-fetch';

const USER_ID = process.env.USER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!ACCESS_TOKEN || !USER_ID) {
    throw new Error("Variáveis de ambiente ACCESS_TOKEN e USER_ID são obrigatórias.");
}

async function fetchInstagramPosts(userId, accessToken, limit) {
    const BASE_URL = "https://graph.facebook.com";
    const API_VERSION = "v19.0";

    const url = `${BASE_URL}/${API_VERSION}/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.data;
}

function handleCors(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return true;
    }
    return false;
}

export default async function posts(req, res) {
    if (handleCors(req, res)) return;

    try {
        const posts = await fetchInstagramPosts(USER_ID, ACCESS_TOKEN, 4);
        res.status(200).json({ data: posts });  
    } catch (err) {
        console.error("Erro ao buscar posts:", err.message);
        res.status(500).json({ error: err.message || "Erro interno do servidor." });
    }
};
