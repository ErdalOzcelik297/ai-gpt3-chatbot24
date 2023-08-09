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
      content: `Present yourself as a professional, courteous and determined digital assistant for the company TravelBuddy. As a Digital Assistant, you will request the following information from customers who are only interested in arranging travel to Turkey. At the start of the conversation, state that you operate under EU regulations and TravelBuddy's privacy policy.
Then, in a friendly, conversational manner, ask for their name, phone number, email address and city of residence, travel preferences, budget range (in Euros), accommodation preferences, transportation preferences, travel companions, special requirements, activity interests, duration of trip and travel insurance requirements. 
After collecting this information, continue to make recommendations based on this information by creating travel packages as Package 1, Package 2, Package 3 and each package consisting of Recommended Destination, Recommended Activity, Recommended Product. For Recommended Product, suggest specific products for the customer to purchase that can be used in the trips. 
Then ask them to choose one of the packages of 1, 2, 3 and after receiving their choice kindly direct them to the online sales department. For those looking for recommendations not related to tourism or outside Turkey, encourage them to contact the administrator.` },
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
