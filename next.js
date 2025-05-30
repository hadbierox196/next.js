// package.json
{
  "name": "sew-wall",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@vercel/kv": "^1.0.1",
    "nanoid": "^5.0.4"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SEW Wall',
  description: 'Anonymous posting and polling platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// app/globals.css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: #000;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.orbitron {
  font-family: 'Orbitron', monospace;
}

.btn-primary {
  background: linear-gradient(135deg, #ff0000, #cc0000);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #cc0000, #990000);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #ff0000;
  color: #ff0000;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #ff0000;
  color: white;
}

.card {
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #ff0000;
  box-shadow: 0 4px 20px rgba(255, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #1a1a1a;
  border: 2px solid #ff0000;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.input-field {
  width: 100%;
  padding: 12px;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
  margin-bottom: 15px;
  font-size: 16px;
}

.input-field:focus {
  outline: none;
  border-color: #ff0000;
  box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
}

.textarea-field {
  width: 100%;
  padding: 12px;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
  margin-bottom: 15px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.textarea-field:focus {
  outline: none;
  border-color: #ff0000;
  box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
}

.plus-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff0000, #cc0000);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 0, 0, 0.4);
  transition: all 0.3s ease;
  z-index: 100;
}

.plus-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(255, 0, 0, 0.6);
}

.poll-option {
  background: #2a2a2a;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poll-option:hover {
  border-color: #ff0000;
  background: #333;
}

.poll-option.selected {
  border-color: #ff0000;
  background: linear-gradient(135deg, #330000, #220000);
}

.vote-bar {
  height: 6px;
  background: linear-gradient(90deg, #ff0000, #cc0000);
  border-radius: 3px;
  margin-top: 8px;
  transition: width 0.5s ease;
}

@media (max-width: 768px) {
  .plus-btn {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .modal {
    margin: 10px;
    padding: 20px;
  }
  
  .card {
    padding: 15px;
    margin-bottom: 15px;
  }
}

// lib/kv.js
import { kv } from '@vercel/kv';

export async function createPost(type, data) {
  const id = Math.random().toString(36).substr(2, 9);
  const timestamp = Date.now();
  
  const post = {
    id,
    type, // 'text' or 'poll'
    timestamp,
    ...data,
    replies: [],
    votes: type === 'poll' ? {} : undefined
  };
  
  await kv.set(`post:${id}`, post);
  
  // Add to posts list
  const posts = await kv.get('posts') || [];
  posts.unshift(id);
  await kv.set('posts', posts);
  
  return post;
}

export async function getPosts() {
  const postIds = await kv.get('posts') || [];
  const posts = [];
  
  for (const id of postIds) {
    const post = await kv.get(`post:${id}`);
    if (post) {
      posts.push(post);
    }
  }
  
  return posts;
}

export async function getPost(id) {
  return await kv.get(`post:${id}`);
}

export async function addReply(postId, reply) {
  const post = await kv.get(`post:${postId}`);
  if (!post) return null;
  
  const newReply = {
    id: Math.random().toString(36).substr(2, 9),
    content: reply,
    timestamp: Date.now()
  };
  
  post.replies.push(newReply);
  await kv.set(`post:${postId}`, post);
  
  return post;
}

export async function voteOnPoll(postId, optionIndex) {
  const post = await kv.get(`post:${postId}`);
  if (!post || post.type !== 'poll') return null;
  
  if (!post.votes[optionIndex]) {
    post.votes[optionIndex] = 0;
  }
  post.votes[optionIndex]++;
  
  await kv.set(`post:${postId}`, post);
  return post;
}

// app/components/PostCard.js
'use client';

import { useState } from 'react';

export default function PostCard({ post, onReply, onVote }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onReply(post.id, replyText);
    setReplyText('');
  };

  const handleVote = async (optionIndex) => {
    if (selectedOption !== null) return; // Already voted
    setSelectedOption(optionIndex);
    await onVote(post.id, optionIndex);
  };

  const getTotalVotes = () => {
    return Object.values(post.votes || {}).reduce((sum, votes) => sum + votes, 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? (votes / total) * 100 : 0;
  };

  return (
    <div className="card">
      <h3 className="orbitron" style={{ color: '#ff0000', marginBottom: '12px', fontSize: '1.4rem' }}>
        {post.title}
      </h3>
      
      {post.type === 'text' && (
        <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#ddd' }}>
          {post.content}
        </p>
      )}
      
      {post.type === 'poll' && (
        <div style={{ marginBottom: '20px' }}>
          {post.options.map((option, index) => (
            <div key={index} className="poll-option" onClick={() => handleVote(index)}>
              <span>{option}</span>
              <span style={{ color: '#ff0000', fontWeight: 'bold' }}>
                {post.votes?.[index] || 0} votes
              </span>
              {post.votes && (
                <div className="vote-bar" style={{ 
                  width: `${getVotePercentage(post.votes[index] || 0)}%` 
                }} />
              )}
            </div>
          ))}
          <div style={{ marginTop: '10px', color: '#888', fontSize: '0.9rem' }}>
            Total votes: {getTotalVotes()}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          className="btn-secondary"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? 'Hide' : 'Show'} Replies ({post.replies?.length || 0})
        </button>
        <span style={{ color: '#888', fontSize: '0.9rem', alignSelf: 'center' }}>
          {new Date(post.timestamp).toLocaleString()}
        </span>
      </div>
      
      {showReplies && (
        <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <textarea
              className="textarea-field"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
            />
            <button className="btn-primary" onClick={handleReply}>
              Post Reply
            </button>
          </div>
          
          {post.replies?.map((reply) => (
            <div key={reply.id} style={{ 
              background: '#2a2a2a', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '10px',
              borderLeft: '3px solid #ff0000'
            }}>
              <p style={{ marginBottom: '8px' }}>{reply.content}</p>
              <small style={{ color: '#888' }}>
                {new Date(reply.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// app/components/CreateModal.js
'use client';

import { useState } from 'react';

export default function CreateModal({ isOpen, onClose, onCreate }) {
  const [mode, setMode] = useState(null); // 'text' or 'poll'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [options, setOptions] = useState(['', '']);

  const resetForm = () => {
    setMode(null);
    setTitle('');
    setContent('');
    setOptions(['', '']);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    if (mode === 'text') {
      if (!content.trim()) return;
      await onCreate('text', { title, content });
    } else if (mode === 'poll') {
      const validOptions = options.filter(opt => opt.trim());
      if (validOptions.length < 2) return;
      await onCreate('poll', { title, options: validOptions });
    }
    
    handleClose();
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {!mode ? (
          <div>
            <h2 className="orbitron" style={{ color: '#ff0000', marginBottom: '20px' }}>
              Create New Post
            </h2>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                className="btn-primary" 
                onClick={() => setMode('text')}
                style={{ flex: 1 }}
              >
                Text Post
              </button>
              <button 
                className="btn-primary" 
                onClick={() => setMode('poll')}
                style={{ flex: 1 }}
              >
                Poll
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="orbitron" style={{ color: '#ff0000', marginBottom: '20px' }}>
              Create {mode === 'text' ? 'Text Post' : 'Poll'}
            </h2>
            
            <input
              className="input-field"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            {mode === 'text' && (
              <textarea
                className="textarea-field"
                placeholder="Write your content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            )}
            
            {mode === 'poll' && (
              <div>
                <h4 style={{ marginBottom: '15px', color: '#ddd' }}>Poll Options:</h4>
                {options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      className="input-field"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    {options.length > 2 && (
                      <button 
                        className="btn-secondary"
                        onClick={() => removeOption(index)}
                        style={{ padding: '8px 12px' }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="btn-secondary" 
                  onClick={addOption}
                  style={{ marginBottom: '20px' }}
                >
                  + Add Option
                </button>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={handleSubmit}>
                Create Post
              </button>
              <button className="btn-secondary" onClick={() => setMode(null)}>
                Back
              </button>
              <button className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// app/page.js
'use client';

import { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import CreateModal from './components/CreateModal';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (type, data) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
      });
      
      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReply = async (postId, content) => {
    try {
      const response = await fetch(`/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleVote = async (postId, optionIndex) => {
    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex })
      });
      
      if (response.ok) {
        loadPosts();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 className="orbitron" style={{ 
          fontSize: '3rem', 
          color: '#ff0000', 
          textShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
          marginBottom: '10px'
        }}>
          SEW WALL
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>
          Anonymous posting and polling platform
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div className="orbitron">Loading posts...</div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div className="orbitron" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            No posts yet
          </div>
          <p>Be the first to create a post!</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReply={handleReply}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      <button 
        className="plus-btn"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  );
}

// app/api/posts/route.js
import { getPosts, createPost } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, ...data } = await request.json();
    const post = await createPost(type, data);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// app/api/posts/[id]/reply/route.js
import { addReply } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { content } = await request.json();
    const post = await addReply(params.id, content);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}

// app/api/posts/[id]/vote/route.js
import { voteOnPoll } from '../../../lib/kv';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { optionIndex } = await request.json();
    const post = await voteOnPoll(params.id, optionIndex);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found or not a poll' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
