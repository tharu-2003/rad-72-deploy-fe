import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

export interface Post {
  _id: string;
  title: string;
  content: string;
  author:
    | {
        _id: string;
        email?: string;
      }
    | string;
  imageURL?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  console.log("Current User:", user);

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch("http://localhost:5000/api/v1/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch posts");
        }

        const data = await res.json();
        console.log("Fetched posts:", data);

        const postsArray = Array.isArray(data)
          ? data
          : data.posts || data.data || [];

        setPosts(postsArray);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  );

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Card with glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 mb-12 relative overflow-hidden group">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-block mb-4">
                <div className="relative">
                  <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-gradient">
                    Welcome Home
                  </h2>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </div>

              {user ? (
                <div className="space-y-6 mt-8">
                  <div className="inline-block backdrop-blur-md bg-white/10 rounded-2xl px-8 py-4 border border-white/20">
                    <p className="text-xs text-purple-300 uppercase tracking-widest mb-2 font-semibold">
                      Logged in as
                    </p>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <h1 className="text-2xl font-bold text-white">
                        {user.email}
                      </h1>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-red-500/50"
                  >
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <p className="text-purple-300 mt-6 text-lg">No user logged in.</p>
              )}
            </div>
          </div>

          {/* Posts Section */}
          {user && (
            <div>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
                  <span className="inline-block w-2 h-10 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>
                  Recent Posts
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/30 text-purple-300 text-lg font-bold">
                    {filteredPosts.length}
                  </span>
                </h3>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="mb-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                  <p className="text-purple-300 text-sm font-semibold mb-4 uppercase tracking-wide">Filter by tag</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedTag === null
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                          : "bg-white/10 text-purple-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      All Posts
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedTag === tag
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                            : "bg-white/10 text-purple-300 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading ? (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-16 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                  </div>
                  <p className="text-purple-300 text-lg font-semibold">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/50 rounded-3xl p-8 text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 font-bold text-lg">{error}</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-16 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full"></div>
                    <svg
                      className="relative w-24 h-24 text-purple-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-purple-300 text-xl font-semibold">
                    {selectedTag ? `No posts found with tag "${selectedTag}"` : "No posts found."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredPosts.map((post, index) => (
                    <article
                      key={post._id}
                      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-500 group hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transform"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {post.imageURL && (
                        <div className="relative overflow-hidden h-56">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                          <img
                            src={post.imageURL}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      )}

                      <div className="p-6 sm:p-8">
                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                          {post.title}
                        </h3>

                        <p className="text-purple-200 leading-relaxed mb-6 text-base line-clamp-3">
                          {post.content}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center text-sm font-bold bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 px-4 py-2 rounded-full border border-purple-400/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
                              {typeof post.author === "object" &&
                              post.author?.email
                                ? post.author.email[0].toUpperCase()
                                : "?"}
                            </div>
                            <p className="text-sm font-bold text-purple-200">
                              {typeof post.author === "object"
                                ? post.author?.email ?? "Unknown"
                                : "Unknown"}
                            </p>
                          </div>

                          <time className="text-sm text-purple-300 flex items-center gap-2 font-semibold">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Unknown"}
                          </time>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Home;