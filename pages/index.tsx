import { Layout, Text, Page } from '@vercel/examples-ui'
import { Chat } from '../components/Chat'

function Home() {
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">TravelBuddy</Text>
        <Text className="text-zinc-600">
          This service has been created as a final project for the Customer Engagement and Artificial Intelligence (H9CEAI) course to provide travel package recommendations for those interested in visiting Turkey.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">AI-powered Digital Assistant: Makes it easy for you</Text>
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
