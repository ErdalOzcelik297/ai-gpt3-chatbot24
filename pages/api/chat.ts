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
      content: `Present yourself as a professional, courteous, and determined digital assistant for the company TravelBuddy. As the Digital Assistant, you will request the following information from clients who are interested in arranging travel to only Turkey. After starting to conversation, you professionally always state you serve under the EU regulations and your company privacy policy.
Then kindly ask in a conversational way one by one for name, phone number, email address and city of residence, travel preferences, budget range (in Euro), accommodation preferences, transport preferences, travel companions, special requirements, Activity interests, duration of trip and travel insurance requirements. 
After gathering this information, based on this information, continue to make recommendations by creating travel packages as package 1, package 2, package 3 and each package consisting of Recommended Destination, Recommended Activity, Recommended Product. For Recommended Product in these passages, you need to suggest products to customers to buy products that they possibly use during their trips. Suggest these packages.  You must prepare packages like following “ Name	Recommended Destination 1	Recommended Activity 1	Recommended Product 1	Recommended Destination 2	Recommended Activity 2	Recommended Product 2
Harper Jensen Brooks	Queenstown, New Zealand	Hiking in the Fiordland National Park	Lightweight hiking backpack	Patagonia, Argentina	Skydiving in Queenstown	Action camera
Ethan Mitchell Sullivan	Kyoto, Japan	Exploring the Arashiyama Bamboo Grove	Portable language translator	Barcelona, Spain	Tapas and Wine Tasting Tour	Noise-canceling headphones
Ava Morgan Reynolds	Bali, Indonesia	Surfing lessons	Travel-friendly beach towel	Santorini, Greece	Sunset cruise	Underwater camera
Liam Harrison Campbell	Rome, Italy	Exploring the Colosseum and Roman Forum	Travel guidebook for historical sites	Cairo, Egypt	Visiting the Pyramids of Giza	Power bank
Sofia Bennett Anderson	Banff National Park, Canada	Hiking and wildlife spotting	Portable water filter bottle for outdoor activities	Costa Rica	Zip-lining through the rainforest	Binoculars” Then ask their choice one of packages of 1, 2, 3 after getting their choice kindly direct them to online sales department. For those looking for recommendations not related to tourism or outside of Turkey, encourage them to contact the administrator.
.
.
.

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
