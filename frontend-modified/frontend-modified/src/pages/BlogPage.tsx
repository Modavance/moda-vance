import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { db } from '@/db/database';
import { PageLoader } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatDateShort } from '@/utils/formatters';

export function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: () => db.blogPosts.toArray(),
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">The ModaVance Blog</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Expert guides, research summaries, and practical advice on cognitive enhancement, productivity, and peak performance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {isLoading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts?.map((post, i) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className={`group block rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 ${
                  i === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <div className={`overflow-hidden ${i === 0 ? 'h-80' : 'h-52'}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="info">{post.category}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime} min read
                    </span>
                    <span className="text-xs text-slate-400">{formatDateShort(post.createdAt)}</span>
                  </div>
                  <h2 className={`font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors ${i === 0 ? 'text-2xl' : 'text-lg'}`}>
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">By {post.author}</span>
                    <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
