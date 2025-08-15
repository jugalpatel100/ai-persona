// server.js
import express from "express";
import cors from "cors";
import { OpenAI } from "openai/client.js";
import 'dotenv/config'
import { HC_SYS_PROMPT, PG_SYS_PROMPT } from "./constants.js";

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// In-memory chat storage
const personaChats = {
  persona1: [],
  persona2: []
};

const systemPromptMessage = {
  persona1: HC_SYS_PROMPT,
  persona2: PG_SYS_PROMPT
}

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});


//route to get chat output
app.post("/chat", async (req, res) => {
  const { persona, message } = req.body;

  if (!persona || !message) {
    return res.status(400).json({ error: "Persona and message are required" });
  }

  try {
    // Store user message
    personaChats[persona].push({ role: "user", content: message });

    // Call LLM
    const messages = [
      {role: "system", content: systemPromptMessage[persona]},
      ...personaChats[persona]
    ]
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages,
    });

    const aiReply = response.choices[0].message.content;

    // Store assistant message
    personaChats[persona].push({ role: "assistant", content: aiReply });

    res.json({ success: true, reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//route to clear all chat
app.post("/reset", async (req, res) => {
  personaChats.persona1 = [];
  personaChats.persona2 = [];
  res.json({ message: "Chats cleared" });
});

//route to clear chat for selected persona
app.post("/clear", async (req, res) => {
  const {persona} = req.body;

  if (!persona ) {
    return res.status(400).json({ error: "Persona are required" });
  }

  if (persona !== "persona1" && persona !== "persona2") {
    return res.status(400).json({ error: "Persona does not exist" });
  }

  try {
    personaChats[persona] = []

    res.json({success: true, messages: personaChats[persona]})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }

})

app.listen(3000, () => console.log("Server running on port 3000"));