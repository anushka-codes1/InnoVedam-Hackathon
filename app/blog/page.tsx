import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Safe Campus Trading",
    excerpt: "Learn how to stay safe while buying, selling, and borrowing on CampusSwap.",
    author: "Sarah Johnson",
    date: "November 25, 2025",
    category: "Safety",
    image: "/blog/safety-tips.jpg"
  },
  {
    id: 2,
    title: "How to Price Your Items for Quick Sales",
    excerpt: "Expert strategies for pricing items competitively while maximizing your earnings.",
    author: "Mike Chen",
    date: "November 20, 2025",
    category: "Tips & Tricks",
    image: "/blog/pricing.jpg"
  },
  {
    id: 3,
    title: "The Rise of Campus Sharing Economy",
    excerpt: "Exploring how students are embracing sustainable consumption through peer-to-peer sharing.",
    author: "Emma Williams",
    date: "November 15, 2025",
    category: "Trends",
    image: "/blog/sharing-economy.jpg"
  },
  {
    id: 4,
    title: "Top 10 Most Borrowed Items on Campus",
    excerpt: "Discover what items are in highest demand and how you can capitalize on trends.",
    author: "David Lee",
    date: "November 10, 2025",
    category: "Insights",
    image: "/blog/top-items.jpg"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">CampusSwap Blog</h1>
        <p className="text-xl text-gray-700 mb-12">
          Tips, stories, and insights from the campus sharing community
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <span className="text-white text-6xl">📝</span>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
                  {post.category}
                </span>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">More blog posts coming soon!</p>
          <p className="text-sm text-gray-500">
            Want to contribute? Email us at{' '}
            <a href="mailto:blog@campusswap.com" className="text-purple-600 hover:text-purple-700">
              blog@campusswap.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
