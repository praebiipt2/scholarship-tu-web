import React from 'react'
import NewsCard from '../components/NewsCard'

const News = () => {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col'>
       <div className="mb-2 p-8">
        <h2 className="text-lg font-semibold text-center px-12 text-gray-900">ข่าวประชาสัมพันธ์</h2>
        <NewsCard />
      </div>

    </div>
  )
}

export default News
