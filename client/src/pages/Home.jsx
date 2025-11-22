import { useEffect, useState } from 'react';
import usePostStore from '../store/postStore';
import useAuthStore from '../store/authStore';
import { Link, useNavigate } from 'react-router';
import PostModal from '../components/PostModal';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../axios';

const Home = () => {
  const { posts, getPosts, isLoading, isError, message, deletePost } =
    usePostStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [summary, setSummary] = useState('');
  const [translated, setTranslated] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      deletePost(id);
      setSelectedPost(null);
    }
  };

  const handleEdit = (id) => {
    setSelectedPost(null);
    navigate(`/edit-post/${id}`);
  };

  const handleSummarize = async () => {
    if (!selectedPost) return;
    setIsLoadingAI(true);
    try {
      const response = await API.post('/ai/summarize', {
        title: selectedPost.title,
        content: selectedPost.content,
      });
      setSummary(response.data.summary);
    } catch (error) {
      alert('Failed to generate summary');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleTranslate = async (language) => {
    if (!selectedPost) return;
    setIsLoadingAI(true);
    try {
      const response = await API.post('/ai/translate', {
        title: selectedPost.title,
        content: selectedPost.content,
        targetLanguage: language,
      });
      setTranslated(response.data);
      setShowTranslate(false);
    } catch (error) {
      alert('Failed to translate');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setSummary('');
    setTranslated(null);
    setShowTranslate(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading stories..." />;
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
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-serif font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            Discover stories that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">matter to you.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            A curated space for writers, thinkers, and creators to share their most profound ideas with the world.
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl inline-block"
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
                className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors inline-block"
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
                onClick={() => setSelectedPost(post)}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer hover:-translate-y-1"
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                      {post.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {post.user?.name || 'Unknown Author'}
                      </p>
                      <p className="text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      Read story &rarr;
                    </span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {Math.ceil(post.content.length / 1000)} min read
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <PostModal
        post={selectedPost}
        onClose={closeModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUser={user}
        summary={summary}
        translated={translated}
        isLoadingAI={isLoadingAI}
        showTranslate={showTranslate}
        onSummarize={handleSummarize}
        onTranslate={handleTranslate}
        onToggleTranslate={() => setShowTranslate(!showTranslate)}
        onShowOriginal={() => setTranslated(null)}
      />
    </div>
  );
};

export default Home;
