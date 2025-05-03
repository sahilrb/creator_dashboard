import React, { useState, useEffect, useCallback } from 'react';

const TAILWIND_CDN_LINK = "https://cdn.tailwindcss.com";

// Load Tailwind CSS dynamically
const loadTailwind = () => {
  if (!document.getElementById("tailwind-cdn")) {
    const script = document.createElement("script");
    script.src = TAILWIND_CDN_LINK;
    script.id = "tailwind-cdn";
    document.head.appendChild(script);
  }
};
loadTailwind();

// Helper: mock API fetch for Reddit posts
const fetchRedditPosts = async () => {
  try {
    const res = await fetch('https://www.reddit.com/r/javascript/top.json?limit=5');
    const data = await res.json();
    return data.data.children.map(child => ({
      id: 'reddit-' + child.data.id,
      title: child.data.title,
      url: 'https://reddit.com' + child.data.permalink,
      source: 'Reddit',
      content: child.data.selftext || '',
    }));
  } catch (e) {
    return [];
  }
};

// Helper: mock fetch for Twitter recent tweets (simulate, as Twitter API needs auth)
const fetchTwitterPosts = async () => {
  // Since Twitter API now requires authentication, simulate some tweets
  return [
    {
      id: 'twitter-1',
      title: 'Check out the latest React features!',
      url: 'https://twitter.com/reactjs/status/12345',
      source: 'Twitter',
      content: 'React 18 is awesome with concurrent features.',
    },
    {
      id: 'twitter-2',
      title: 'JavaScript ES2024 proposals',
      url: 'https://twitter.com/js/status/67890',
      source: 'Twitter',
      content: 'New exciting ECMAScript proposals for 2024.',
    }
  ];
};

export default function App() {
  // User auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'User');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Credits and saved posts
  const [credits, setCredits] = useState(0);
  const [feed, setFeed] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  // Activity log
  const [activityLog, setActivityLog] = useState([]);
  // Active tab for feed source
  const [activeTab, setActiveTab] = useState('All');

  // Simulate login/register (mock backend)
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    // Simple mock: any username/password returns token
    const mockToken = 'mock-jwt-token-' + username;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('role', username === 'admin' ? 'Admin' : 'User');
    setToken(mockToken);
    setUserRole(username === 'admin' ? 'Admin' : 'User');
    setCredits(10); // Mock initial credits
    setActivityLog(log => [...log, "Logged in"]);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setUserRole('User');
    setCredits(0);
    setFeed([]);
    setSavedPosts([]);
    setReportedPosts([]);
    setActivityLog([]);
  };

  // Fetch feeds from two sources and combine
  const fetchFeeds = useCallback(async () => {
    const redditPosts = await fetchRedditPosts();
    const twitterPosts = await fetchTwitterPosts();
    const combined = [...redditPosts, ...twitterPosts];
    // Sort by id string to mock chronological order
    combined.sort((a, b) => a.id.localeCompare(b.id));
    setFeed(combined);
  }, []);

  // Save a post
  const savePost = (post) => {
    if (!savedPosts.find(p => p.id === post.id)) {
      setSavedPosts([...savedPosts, post]);
      setActivityLog(log => [...log, `Saved post: ${post.title}`]);
      setCredits(c => c + 2); // Earn 2 credits for saving
    }
  };

  // Share post (copy link simulated)
  const sharePost = (post) => {
    navigator.clipboard.writeText(post.url);
    setActivityLog(log => [...log, `Shared post: ${post.title}`]);
    alert('Post link copied to clipboard!');
  };

  // Report post (mark reported)
  const reportPost = (post) => {
    if (!reportedPosts.includes(post.id)) {
      setReportedPosts([...reportedPosts, post.id]);
      setActivityLog(log => [...log, `Reported post: ${post.title}`]);
    }
  };

  // Load feeds on mount and user login
  useEffect(() => {
    if (token) fetchFeeds();
  }, [token, fetchFeeds]);

  // Mock earning credits for daily login/profile completion
  useEffect(() => {
    if (token) {
      // Simulate earning points for logging in daily
      setCredits(c => c + 5);
      setActivityLog(log => [...log, "Earned 5 credits for daily login"]);
      // Simulate profile completion points if username has more than 3 chars
      if (username.length > 3) {
        setCredits(c => c + 10);
        setActivityLog(log => [...log, "Earned 10 credits for completing profile"]);
      }
    }
  }, [token]);

  // Admin analytics: simple summary of users and feed (mocked)
  // Since no real backend, show static placeholders
  const AdminPanel = () => (
    <div className="p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-bold mb-2">Admin Panel</h2>
      <p>Total Users: 42 (mocked)</p>
      <p>Total Credits Outstanding: 4200 (mocked)</p>
      <p>Reported Posts: {reportedPosts.length}</p>
      <button
        className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
        onClick={() => alert('Admin update credits feature not implemented - backend needed')}
      >
        Update User Credits
      </button>
    </div>
  );

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Creator Dashboard Login</h1>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="mt-4 text-center text-gray-600">
          Use username <b>admin</b> for Admin role, anything else for User.
        </div>
      </div>
    );
  }

  // Filter posts by active tab
  const filteredFeed = activeTab === 'All' ? feed : feed.filter(post => post.source === activeTab);

  // Tabs list includes 'All' + sources dynamically from feed
  const sources = ['All', ...Array.from(new Set(feed.map(post => post.source)))];

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {userRole} {username || 'User'}</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits and Activity */}
        <div className="col-span-1 p-4 border rounded shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Credits</h2>
          <p className="text-4xl font-bold text-green-600">{credits}</p>
          <h3 className="mt-6 mb-2 font-semibold">Recent Activity</h3>
          <div className="overflow-y-auto max-h-48 border p-2 rounded bg-gray-50">
            {activityLog.length === 0 && <p className="text-gray-400">No recent activity.</p>}
            <ul className="list-disc pl-5 space-y-1">
              {[...activityLog].reverse().map((log, idx) => (
                <li key={idx} className="text-sm text-gray-700">{log}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feed with Tabs */}
        <div className="col-span-2 p-4 border rounded shadow bg-white max-h-[600px] overflow-y-auto flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
          {/* Tabs */}
          <div className="mb-4 border-b border-gray-300">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {sources.map(source => (
                <button
                  key={source}
                  onClick={() => setActiveTab(source)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === source
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  aria-current={activeTab === source ? 'page' : undefined}
                >
                  {source} ({source === 'All' ? feed.length : feed.filter(post => post.source === source).length})
                </button>
              ))}
            </nav>
          </div>
          {/* Posts */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredFeed.length === 0 && <p>No posts in this category.</p>}
            {filteredFeed.map(post => (
              <div key={post.id} className={`p-3 border rounded ${reportedPosts.includes(post.id) ? 'bg-red-100 opacity-70' : 'bg-white'}`}>
                <a href={post.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">
                  {post.title}
                </a>
                <p className="text-sm text-gray-600 mb-2">Source: {post.source}</p>
                {post.content && <p className="mb-2 text-gray-700">{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>}
                <div className="flex space-x-2">
                  <button
                    disabled={savedPosts.find(p => p.id === post.id)}
                    onClick={() => savePost(post)}
                    className={`px-2 py-1 rounded text-white ${savedPosts.find(p => p.id === post.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {savedPosts.find(p => p.id === post.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => sharePost(post)}
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Share
                  </button>
                  <button
                    disabled={reportedPosts.includes(post.id)}
                    onClick={() => reportPost(post)}
                    className={`px-2 py-1 rounded text-white ${reportedPosts.includes(post.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {reportedPosts.includes(post.id) ? 'Reported' : 'Report'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Posts */}
        <div className="col-span-3 mt-6 p-4 border rounded shadow bg-white max-h-[300px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Saved Posts</h2>
          {savedPosts.length === 0 && <p>No saved posts yet.</p>}
          <ul className="list-disc pl-5 space-y-2">
            {savedPosts.map(post => (
              <li key={post.id}>
                <a href={post.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {post.title}
                </a> ({post.source})
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Panel */}
        {userRole === 'Admin' && (
          <div className="col-span-3 mt-6">
            <AdminPanel />
          </div>
        )}
      </div>
    </div>
  );
}

