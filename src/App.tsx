import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from 'react-router-dom';
import UpdateCreditModal from './modals/updateCreditModal';

// Load Tailwind CSS dynamically
const TAILWIND_CDN_LINK = "https://cdn.tailwindcss.com";

const loadTailwind = () => {
  if (!document.getElementById("tailwind-cdn")) {
    const script = document.createElement("script");
    script.src = TAILWIND_CDN_LINK;
    script.id = "tailwind-cdn";
    document.head.appendChild(script);
  }
};
loadTailwind();

interface Post {
  id: string;
  title: string;
  url: string;
  source: string;
  content: string;
}

const fetchRedditPosts = async (afterParam: string | null = null): Promise<{ posts: Post[]; after: string | null }> => {
  try {
    const url = `https://www.reddit.com/r/javascript/top.json?limit=5${afterParam ? `&after=${afterParam}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    const after = data.data.after;
    const posts: Post[] = data.data.children.map((child: any) => ({
      id: 'reddit-' + child.data.id,
      title: child.data.title,
      url: 'https://reddit.com' + child.data.permalink,
      source: 'Reddit',
      content: child.data.selftext || '',
    }));
    return { posts, after };
  } catch (e) {
    return { posts: [], after: null };
  }
};

// Simulated Twitter posts for demo
const fetchTwitterPosts = async (): Promise<Post[]> => {
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

interface User {
  username: string;
  role: 'User' | 'Admin';
  credits: number;
  savedPosts: Post[];
}

function Login({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // fetch user data
  const fetchUserData = async (username: string, token: string) => {
    try {
      const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to fetch user data:', data.message);
        return;
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data, token);
      } catch (err) {
        console.error('An error occurred while fetching user data:', err);
      }
    };

    const updateCredit = async (user: User) => {
      try {
        const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/update/${user.username}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credits: user.credits,
            role: user.role,
            savedPosts: user.savedPosts,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          console.error('Failed to update credit:', data.message);
          return;
        }
        console.log('Credit updated successfully:', data);
      } catch (err) {
        console.error('An error occurred while updating the user:', err);
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    try {
      const response = await fetch('https://backend-service-697743824184.us-central1.run.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Check if the user is logging in for the first time today
      const lastLoginDate = localStorage.getItem('lastLoginDate');
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      if (lastLoginDate !== today) {
        // Add 10 credits and update the backend
        const updatedUser = { ...data, credits: data.credits + 10 };
        await updateCredit(updatedUser);

        // Save today's date as the last login date
        localStorage.setItem('lastLoginDate', today);
      }

      const token = data.token;
      // Fetch user data from the server
      fetchUserData(username, token);
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred while logging in');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
      <p className="mt-2 text-center text-gray-600">
        Use username <b>admin</b> for Admin role, anything else for User.
      </p>
    </div>
  );
}

function Register({ onRegister }: { onRegister: (user: User, token: string) => void }) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    try {
      const response = await fetch('https://backend-service-697743824184.us-central1.run.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      const token = data.token;
      const role = 'User'; 
      const user: User = { username, role, credits: 0, savedPosts: [] };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onRegister(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred while registering');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}

function Dashboard({
  user,
  token,
  onLogout,
  updateUser,
}: {
  user: User;
  token: string;
  onLogout: () => void;
  updateUser: (u: User) => void;
}) {
  const [redditPosts, setRedditPosts] = useState<Post[]>([]);
  const [twitterPosts, setTwitterPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>(user.savedPosts || []);
  const [reportedPosts, setReportedPosts] = useState<string[]>([]);
  const [credits, setCredits] = useState<number>(user.credits || 0);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [allUserData, setAllUserData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);

  const fetchMoreRedditPosts = async () => {
    if (loading) return;
    setLoading(true);
    const { posts, after: nextAfter } = await fetchRedditPosts(after);
    setRedditPosts(prev => [...prev, ...posts]);
    setAfter(nextAfter);
    setLoading(false);
  };

  const loadTwitterPosts = useCallback(async () => {
    const posts = await fetchTwitterPosts();
    setTwitterPosts(posts);
  }, []);

  const fetchAllUserData = async () => {
    try {
      const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to fetch user data:', data.message);
        return;
      }
      console.log('User data fetched successfully:', data);
      setAllUserData(data);
    } catch (err) {
      console.error('An error occurred while fetching user data:', err);
    }
  }

  useEffect(() => {
    fetchMoreRedditPosts();
    loadTwitterPosts();
    fetchAllUserData();
  }, [loadTwitterPosts]);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setNewCredits(user.credits);
    setIsModalOpen(true);
  };

  const updateCredit = async (user: User) => {
    try {
      const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/update/${user.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: user.credits,
          role: user.role,
          savedPosts: user.savedPosts,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Failed to update credit:', data.message);
        return;
      }
      console.log('Credit updated successfully:', data);
    } catch (err) {
      console.error('An error occurred while updating the user:', err);
    }
  }

  const handleUpdateCredits = (e: any) => {
    if (selectedUser) {
      e.preventDefault();
      const updatedUser = { ...selectedUser, credits: newCredits };
      updateCredit(updatedUser);
      setAllUserData((prev) =>
        prev.map((u) => (u.username === selectedUser.username ? updatedUser : u))
      );
      setIsModalOpen(false);
    }
  };

  // Save a post, update user savedPosts and credits with persistence
  const savePost = (post: Post) => {
    if (!savedPosts.find(p => p.id === post.id)) {
      const newSaved = [...savedPosts, post];
      setSavedPosts(newSaved);
      setActivityLog(log => [...log, `Saved post: ${post.title}`]);
      const newCredits = credits + 2;
      setCredits(newCredits);
      // Update user state and persist
      const updatedUser = { ...user, savedPosts: newSaved, credits: newCredits };
      updateUser(updatedUser);
    }
  };

  const sharePost = (post: Post) => {
    navigator.clipboard.writeText(post.url);
    setActivityLog(log => [...log, `Shared post: ${post.title}`]);
    alert('Post link copied to clipboard!');
  };

  const reportPost = (post: Post) => {
    if (!reportedPosts.includes(post.id)) {
      setReportedPosts([...reportedPosts, post.id]);
      setActivityLog(log => [...log, `Reported post: ${post.title}`]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (user.role === 'Admin') {
    return (
      <div className="max-w-6xl mx-auto mt-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel - Welcome, {user.username}</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-bold mb-2">User Analytics</h2>
          {allUserData.map((u, idx) => (
            <div key={idx} className="mb-2 p-2 border-b">
              <p><strong>Username:</strong> {u.username}</p>
              <p><strong>Credits:</strong> {u.credits}</p>
              <p><strong>Saved Posts:</strong> {u.savedPosts.length}</p>
              <button
                onClick={() => handleOpenModal(u)}
                className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
              >
                Update User Credits
              </button>
            </div>
          ))}
        </div>

        {/* Modal for updating credits */}
      <UpdateCreditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Update Credits for {selectedUser?.username}</h2>
        <input
          type="number"
          value={newCredits}
          onChange={(e) => setNewCredits(parseInt(e.target.value, 10))}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={(e) => handleUpdateCredits(e)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update
        </button>
      </UpdateCreditModal>
      </div>
    );
  }

  // <p>Total Users: 42</p>
  // <p>Total Credits Outstanding: 4200</p>
  // <p>Saved Posts Count: {savedPosts.length}</p>
  // <p>Reported Posts: {reportedPosts.length}</p>
  // <p>Activity Log Count: {activityLog.length}</p>

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard - Welcome, {user.username.toUpperCase()}</h1>
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
        {/* Feed */}
        <div className="col-span-2 p-4 border rounded shadow bg-white max-h-[600px] overflow-y-auto flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Feed</h2>
          <h3 className="font-semibold mb-2">Reddit Posts</h3>
          <div>
            {redditPosts.length === 0 && <p>Loading Reddit posts...</p>}
            <ul>
              {redditPosts.map((post, index) => (
                <li key={`${post.id}-${index}`} className="mb-4 border-b pb-2">
                  <a href={post.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">{post.title}</a>
                  {post.content && <p>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>}
                  <div className="mt-1 space-x-2">
                    <button
                      onClick={() => savePost(post)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={savedPosts.find(p => p.id === post.id) !== undefined}
                    >
                      {savedPosts.find(p => p.id === post.id) ? 'Saved' : 'Save'}
                    </button>
                    <button onClick={() => sharePost(post)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Share</button>
                    <button
                      onClick={() => reportPost(post)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={reportedPosts.includes(post.id)}
                    >
                      {reportedPosts.includes(post.id) ? 'Reported' : 'Report'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {after && !loading && (
              <button onClick={fetchMoreRedditPosts} className="mt-2 px-4 py-1 bg-gray-700 text-white rounded">Load More Reddit Posts</button>
            )}
            {loading && <p>Loading more posts...</p>}
          </div>
          <hr className="my-4" />
          <h3 className="font-semibold mb-2">Twitter Posts</h3>
          <ul>
            {twitterPosts.map(post => (
              <li key={post.id} className="mb-4 border-b pb-2">
                <a href={post.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">{post.title}</a>
                {post.content && <p>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>}
                <div className="mt-1 space-x-2">
                  <button
                    onClick={() => savePost(post)}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={savedPosts.find(p => p.id === post.id) !== undefined}
                  >
                    {savedPosts.find(p => p.id === post.id) ? 'Saved' : 'Save'}
                  </button>
                  <button onClick={() => sharePost(post)} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Share</button>
                  <button
                    onClick={() => reportPost(post)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={reportedPosts.includes(post.id)}
                  >
                    {reportedPosts.includes(post.id) ? 'Reported' : 'Report'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState<User>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : { username: '', role: 'User', credits: 0, savedPosts: [] };
  });

  const onLogin = (u: User, t: string) => {
    setUser(u);
    setToken(t);
  };

  const onLogout = () => {
    setUser({ username: '', role: 'User', credits: 0, savedPosts: [] });
    setToken('');
  };

  // fetch user data
  const fetchUserData = async () => {
  try {
    const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/${user.username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Failed to fetch user data:', data.message);
      return;
    }
    console.log('User data fetched successfully:', data);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      console.error('An error occurred while fetching user data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token, user.username]);

  const updateUser = async (u: User) => {
    try {
      // Make a PUT request to update the user data
      const response = await fetch(`https://backend-service-697743824184.us-central1.run.app/api/users/update/${u.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: u.credits,
          role: u.role,
          savedPosts: u.savedPosts,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Failed to update user:', data.message);
        return;
      }
  
      // Update the user state and persist it locally
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('User updated successfully:', data.user);
    } catch (err) {
      console.error('An error occurred while updating the user:', err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={onLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register onRegister={onLogin} />} />
        <Route path="/dashboard" element={token ? (
            <Dashboard user={user} token={token} onLogout={onLogout} updateUser={updateUser} />
          ) : (
            <Navigate to="/login" />
          )} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}
