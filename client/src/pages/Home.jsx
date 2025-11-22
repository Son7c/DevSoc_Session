import { useEffect } from 'react';
import usePostStore from '../store/postStore';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const Home = () => {
  const { posts, getPosts, isLoading, isError, message, deletePost } =
    usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Unable to load stories
          </h2>
          <p className="text-red-500 mb-6">{message}</p>
          <button
            onClick={() => getPosts()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Discover stories that matter to you.
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A space for writers, thinkers, and creators to share their ideas with the world.
          </p>
          {!user && (
            <Link
              to="/register"
              className="btn-primary inline-block"
            >
              Start Reading
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Latest Stories
          </h2>
          {user && (
            <Link
              to="/create-post"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Write a story &rarr;
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-3">
              No stories yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              The canvas is empty. Be the first to paint it with your words.
            </p>
            {user && (
              <Link
                to="/create-post"
                className="btn-primary"
              >
                Write a Story
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {post.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {post.user?.name || 'Unknown Author'}
                    </span>
                  </div>
                  
                  <Link to={`/edit-post/${post._id}`} className="block group-hover:text-blue-600 transition-colors">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    
                    {user && user._id === post.user?._id && (
                      <div className="flex gap-3">
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
