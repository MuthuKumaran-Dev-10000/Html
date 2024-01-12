// Home.js

import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Add any state variables as needed
    };
  }

  render() {
    return (
      <div className="container">
        {
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="home.css">
                <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
                <title>Bottom Tab Bar</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Roboto', sans-serif;
                        background-color: #f9f9f9;
                    }
            
                    .container {
                        position: relative;
                        min-height: 100vh;
                        background-color: #f9f9f9;
                        overflow: hidden; /* Hide horizontal scroll due to box-shadow on top bar */
                    }
            
                    .top-bar {
                        position: fixed;
                        top: 0;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        background-color: #fff;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        z-index: 1; /* Ensure top bar stays above content */
                    }
            
                    .profile {
                        display: flex;
                        align-items: center;
                    }
            
                    .profile box-icon {
                        font-size: 24px;
                        margin-right: 8px;
                        color: #606060;
                    }
            
                    .search-bar {
                        flex: 1;
                        text-align: center;
                        position: relative;
                    }
            
                    .search-input {
                        width: calc(100% - 40px);
                        padding: 8px;
                        box-sizing: border-box;
                        border: none;
                        border-radius: 5px;
                        outline: none;
                        background-color: #f2f2f2;
                        color: #333;
                        font-size: 14px;
                        transition: background-color 0.3s;
                    }
            
                    .search-input:hover,
                    .search-input:focus {
                        background-color: #e0e0e0;
                    }
            
                    .search-button {
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 0 5px 5px 0;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
            
                    .search-button:hover {
                        background-color: #0056b3;
                    }
            
                    .content {
                        padding: 60px 20px 20px; /* Adjusted padding to allow space for top bar */
                        overflow-y: auto; /* Enable vertical scroll for content */
                    }
            
                    .video-card {
                position: relative;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                display: flex; /* Use flexbox for layout */
                box-sizing: border-box; /* Include padding and borders in the total width and height */
            }
            
            .video-player {
                flex: 1; /* Take remaining space */
                width: 100%; /* Ensure the video takes up 100% of the width */
                height: 100%; /* Adjust the height of the video player */
            }
            
                    .video-details {
                        flex: 0 0 200px; /* Fixed width for video details */
                        padding: 0 20px;
                    }
            
                    .video-details h2 {
                        margin-top: 0;
                    }
            
                    .video-controls {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px;
                        background-color: rgba(255, 255, 255, 0.8);
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
            
                    .video-controls button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-size: 16px;
                    }
            
                    .bottom-tab {
                        position: fixed;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #fff;
                        width: 100%;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        height: 50px;
                        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
                    }
            
                    .tab-item {
                        text-align: center;
                        text-decoration: none;
                        color: #333;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                        transition: color 0.3s;
                    }
            
                    .tab-item span {
                        font-size: 12px;
                        margin-top: 3px;
                    }
            
                    .tab-item:hover,
                    .tab-item.active {
                        color: #007bff;
                    }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <div class="top-bar">
                        <div class="profile">
                            <box-icon name='user-circle'></box-icon>
                            <span>Your Name</span>
                        </div>
                        <div class="search-bar">
                            <input type="text" class="search-input" placeholder="Search...">
                            <button class="search-button">
                                <box-icon name='search'></box-icon>
                            </button>
                        </div>
                    </div>
                    <div class="content">
                        <!-- Your main content goes here -->
                        <!-- Placeholder for Video 1 -->
                        <div class="video-card" id="video1">
                            <iframe class="video-player" src="trial.mp4" frameborder="0" allowfullscreen></iframe>
                            <div class="video-details">
                                <h2>Video Title 1</h2>
                                <p>Views: 1000</p>
                                <p>Channel: Channel Name 1</p>
                            </div>
                            <div class="video-controls">
                                <button onclick="togglePlay('video1')">Play/Pause</button>
                                <button onclick="prevVideo('video1')">Prev</button>
                                <button onclick="nextVideo('video1')">Next</button>
                            </div>
                        </div>
                        <!-- Add more video placeholders as needed -->
                        <!-- Repeat the structure below for each additional video -->
                        <div class="video-card" id="video2">
                            <iframe class="video-player" src="trial.mp4" frameborder="0" allowfullscreen></iframe>
                            <div class="video-details">
                                <h2>Video Title 2</h2>
                                <p>Views: 2000</p>
                                <p>Channel: Channel Name 2</p>
                            </div>
                            <div class="video-controls">
                                <button onclick="togglePlay('video2')">Play/Pause</button>
                                <button onclick="prevVideo('video2')">Prev</button>
                                <button onclick="nextVideo('video2')">Next</button>
                            </div>
                        </div>
                        <!-- Repeat the structure above for each additional video -->
                        <!-- Add 10 more video placeholders as needed -->
                        <div class="video-card" id="video3">
                            <iframe class="video-player" src="trial.mp4" frameborder="0" allowfullscreen></iframe>
                            <div class="video-details">
                                <h2>Video Title 3</h2>
                                <p>Views: 3000</p>
                                <p>Channel: Channel Name 3</p>
                            </div>
                            <div class="video-controls">
                                <button onclick="togglePlay('video3')">Play/Pause</button>
                                <button onclick="prevVideo('video3')">Prev</button>
                                <button onclick="nextVideo('video3')">Next</button>
                            </div>
                        </div>
                        <div class="video-card" id="video1">
                            <iframe class="video-player" src="trial.mp4" frameborder="0" allowfullscreen></iframe>
                            <div class="video-details">
                                <h2>Video Title 1</h2>
                                <p>Views: 1000</p>
                                <p>Channel: Channel Name 1</p>
                            </div>
                            <div class="video-controls">
                                <button onclick="togglePlay('video1')">Play/Pause</button>
                                <button onclick="prevVideo('video1')">Prev</button>
                                <button onclick="nextVideo('video1')">Next</button>
                            </div>
                        </div>
                        <!-- Placeholder for Video 2 -->
                        <div class="video-card" id="video2">
                            <video class="video-player" src="trial.mp4" allowfullscreen controls></video>
                            <div class="video-details">
                                <h2>Video Title 2</h2>
                                <p>Views: 2000</p>
                                <p>Channel: Channel Name 2</p>
                            </div>
                            <div class="video-controls">
                                <button onclick="togglePlay('video2')">Play/Pause</button>
                                <button onclick="prevVideo('video2')">Prev</button>
                                <button onclick="nextVideo('video2')">Next</button>
                            </div>
                        </div>
                        <!-- Add more video placeholders as needed -->
                    </div>
                    <nav class="bottom-tab">
                        <a href="#" class="tab-item" onclick="changeTab('home')">
                            <box-icon name='home'></box-icon>
                            <span>Home</span>
                        </a>
                        <a href="#" class="tab-item" onclick="changeTab('post')">
                            <box-icon name='message-square-detail'></box-icon>
                            <span>Post</span>
                        </a>
                        <a href="#" class="tab-item" onclick="changeTab('chat')">
                            <box-icon name='chat'></box-icon>
                            <span>Chat</span>
                        </a>
                        <a href="#" class="tab-item" onclick="changeTab('subscription')">
                            <box-icon name='credit-card'></box-icon>
                            <span>Subscription</span>
                        </a>
                        <a href="#" class="tab-item" onclick="changeTab('history')">
                            <box-icon name='history'></box-icon>
                            <span>History</span>
                        </a>
                    </nav>
                </div>
            
                <script>
                    function changeTab(tabName) {
                        // Implement your page transition logic here
                        console.log(`Switching to ${tabName} tab`);
                        // For simplicity, you can update the content dynamically or navigate to different pages.
                    }
            
                    function togglePlay(videoId) {
                        var video = document.getElementById(videoId).querySelector('.video-player');
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    }
            
                    function nextVideo(videoId) {
                        // Implement logic to load the next video
                        console.log(`Loading next video for ${videoId}`);
                    }
            
                    function prevVideo(videoId) {
                        // Implement logic to load the previous video
                        console.log(`Loading previous video for ${videoId}`);
                    }
                </script>
            </body>
            
            </html>
            
        }
      </div>
    );
  }
}

export default Home;
