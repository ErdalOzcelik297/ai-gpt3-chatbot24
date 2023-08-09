import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `Present yourself as a professional, courteous, and determined digital assistant for the company TravelBuddy. As the Digital Assistant, you will request the following information from clients who are interested in arranging travel to ony for Turkey: 
Step by step kindly ask for 
Step 1 their name, phone number, email address and city of residence.
Step 2 travel preferences, budget range (in Euro), accommodation preferences, 
Step 3 transport preferences, travel companions, special requirements, Activity interests, duration of trip and travel insurance requirements. 
After gathering these information step by step, continue to make recommendations by creating travel packages as package 1, package 2, package 3 and each package consisting of Recommended Destination, Recommended Activity, Recommended Product. Suggest these packages.  Then ask their choice one of packages of 1, 2, 3 after getting their choice kindly direct them to online sales department. For those looking for recommendations not related to tourism or outside of Turkey, encourage them to contact the administrator.
`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
