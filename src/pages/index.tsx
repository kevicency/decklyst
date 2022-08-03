import { DeckcodeSearch } from '@/components/DeckcodeSearch'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="content-container flex flex-1   pb-8">
      <div className="flex flex-col flex-1 mt-[16%]">
        <h1 className="text-5xl text-center mt-8 mb-12">Duelyst Share</h1>
        <div className="flex-1 px-24">
          <DeckcodeSearch big />
        </div>
      </div>
    </div>
  )
}

export default Home
