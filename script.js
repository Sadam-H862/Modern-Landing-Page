 // ===========================================
// GEMINI AI CONFIGURATION
// ===========================================

// Your Gemini API Key (from default project)
const GEMINI_API_KEY = 'AIzaSyBMGepsBr9Zbb4Fk_jktya5_Vxzq9U61z4';

// ===========================================
// INITIALIZE AOS ANIMATIONS
// ===========================================
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===========================================
// AI BACKGROUND CANVAS
// ===========================================
const canvas = document.getElementById('ai-background');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    setCanvasSize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
            this.color = rgba(139, 92, 246, $|{Math:random() * 0.5});
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections between particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = rgba(139, 92, 246, $|{0.2 :(1 - distance / 100)});
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        setCanvasSize();
    });
}

// ===========================================
// GEMINI AI CHAT FUNCTION
// ===========================================

/**
 * Main AI Chat Function - Uses Google Gemini AI
 * @param {string} userMessage - The message from user
 * @returns {string} - AI response
 */
async function chatWithGemini(userMessage) {
    try {
        // Show loading state in console
        console.log('🤖 Sending message to Gemini AI...');
        
        const response = await fetch({
            https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY},
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an AI assistant for Sadam Hussein. 
                            
                            PERSONAL INFORMATION:
[3/5/2026 11:49 PM] @SDM.H: - Name: Sadam Hussein
                            - Role: Computer Science Student & Web Developer
                            - Email: sadamhussein1250@gmail.com
                            - Phone: 0713270110
                            - Skills: AI Integration, Web Development, HTML, CSS, JavaScript, React, Node.js, Python
                            - Projects: TaskFlow To-Do App, AI Chat Assistant, E-Commerce Platform, Weather Dashboard
                            
                            INSTRUCTIONS:
                            - Be friendly, professional, and helpful
                            - Answer questions about Sadam's skills and experience
                            - If asked for contact info, provide the email and phone above
                            - Keep responses concise but informative
                            - If you don't know something, say so honestly
                            
                            USER QUESTION: ${userMessage}
                            
                            RESPONSE:`
                        }]
                    }]
                })
            }
    });

        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Error:', errorData);
            return "I'm having trouble connecting right now. Please try again in a moment.";
        }

        const data = await response.json();
        
        // Validate response structure
        if (data.candidates && 
            data.candidates[0] && 
            data.candidates[0].content && 
            data.candidates[0].content.parts && 
            data.candidates[0].content.parts[0]) {
            
            const aiResponse = data.candidates[0].content.parts[0].text;
            console.log('✅ AI Response received:', aiResponse.substring(0, 50) + '...');
            return aiResponse;
        } else {
            console.error('Unexpected API response structure:', data);
            return "I received an unexpected response. Please try asking differently.";
        }

    } catch (error) {
        console.error('❌ Gemini AI Error:', error);
        
        // User-friendly error messages
        if (error.message.includes('Failed to fetch')) {
            return "⚠️ Network error. Please check your internet connection.";
        } else if (error.message.includes('API key')) {
            return "⚠️ API key error. Please check configuration.";
        } else {
            return "😔 Sorry, I encountered an error. Please try again later.";
        }
    }
}

// ===========================================
// TEST AI CONNECTION
// ===========================================

async function testAIConnection() {
    console.log('🔍 Testing Gemini AI connection...');
    console.log('Using API Key:', GEMINI_API_KEY.substring(0, 15) + '...');
    
    const response = await chatWithGemini("Hello! Please introduce yourself briefly.");
    console.log('📨 Test Response:', response);
    
    if (response && !response.includes('error')) {
        console.log('✅ Gemini AI is working perfectly!');
    } else {
        console.log('❌ Gemini AI test failed');
    }
}

// Run test when page loads (but don't show to user)
setTimeout(testAIConnection, 2000);

// ===========================================
// QUICK CHAT WIDGET (Bottom Right)
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatWithAI = document.getElementById('chatWithAI');
    const quickChat = document.getElementById('quickChat');
    const closeChat = document.querySelector('.close-chat');
    const sendMessage = document.getElementById('sendMessage');
 const userMessage = document.getElementById('userMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    // Check if elements exist
    if (!chatWithAI || !quickChat||  !closeChat || !sendMessage || !userMessage || !chatMessages) {
        console.log('Chat elements not found - continuing without chat');
        return;
    }
    
    // Toggle chat window
    chatWithAI.addEventListener('click', () => {
        quickChat.classList.toggle('active');
    });
    
    // Close chat
    closeChat.addEventListener('click', () => {
        quickChat.classList.remove('active');
    });
    
    // Send message function
    async function handleSendMessage() {
        const message = userMessage.value.trim();
        if (!message) return;
        
        // Clear input
        userMessage.value = '';
        
        // Add user message
        addMessage('user', message);
        
        // Show typing indicator
        const typingId = addMessage('ai', '🤔 Thinking...', true);
        
        try {
            // Get AI response
            const response = await chatWithGemini(message);
            
            // Remove typing indicator
            removeMessage(typingId);
            
            // Add AI response
            addMessage('ai', response);
            
        } catch (error) {
            // Remove typing indicator
            removeMessage(typingId);
            
            // Show error
            addMessage('ai', '😔 Sorry, I encountered an error. Please try again.');
        }
    }
    
    // Send button click
    sendMessage.addEventListener('click', handleSendMessage);
    
    // Enter key to send
    userMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Helper function to add message
    function addMessage(sender, text, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = message |$|{sender}-message;
        
        if (isLoading) {
            messageDiv.innerHTML = 
                <div class="message-content loading">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            ;
        } else {
            messageDiv.innerHTML = <div class="message-content">${text}</div>;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return messageDiv;
    }
    
    // Helper function to remove message
    function removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }
});

// ===========================================
// MAIN AI ASSISTANT SECTION (Center)
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const aiChatInput = document.getElementById('aiChatInput');
    const sendAIMessage = document.getElementById('sendAIMessage');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiTabs = document.querySelectorAll('.ai-tab');
    const aiContents = document.querySelectorAll('.ai-content');
    
    // AI Tabs functionality
    if (aiTabs.length > 0 && aiContents.length > 0) {
        aiTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                // Remove active class from all tabs
                aiTabs.forEach(t => t.classList.remove('active'));
                
                // Remove active class from all contents
 aiContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                document.getElementById(tabId + 'Tab')?.classList.add('active');
            });
        });
    }
    
    // Main AI Chat functionality
    if (aiChatInput && sendAIMessage && aiChatMessages) {
        
        async function handleMainAIChat() {
            const message = aiChatInput.value.trim();
            if (!message) return;
            
            // Add user message
            const userDiv = document.createElement('div');
            userDiv.className = 'message user';
            userDiv.innerHTML = 
                '<div class="avatar"><i class="fas fa-user"></i></div>'
                '<div class="bubble">${message}</div>'
            ;
            aiChatMessages.appendChild(userDiv);
            
            aiChatInput.value = '';
            
            // Show loading
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai';
            loadingDiv.innerHTML = 
                '<div class="avatar"><i class="fas fa-robot"></i></div>'
                '<div class="bubble">...</div>'
            ;
            aiChatMessages.appendChild(loadingDiv);
            
            // Scroll to bottom
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            
            // Get AI response
            const response = await chatWithGemini(message);
            
            // Remove loading
            aiChatMessages.removeChild(loadingDiv);
            
            // Add AI response
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai';
            aiDiv.innerHTML = 
                '<div class="avatar"><i class="fas fa-robot"></i></div>'
               ' <div class="bubble">${response}</div>'
            ;
            aiChatMessages.appendChild(aiDiv);
            
            // Scroll to bottom
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        }
        
        sendAIMessage.addEventListener('click', handleMainAIChat);
        
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleMainAIChat();
            }
        });
    }
});

// ===========================================
// CODE GENERATOR (Mock - Replace with real AI)
// ===========================================

const generateCode = document.getElementById('generateCode');
const codeInput = document.getElementById('codeInput');
const codeOutput = document.getElementById('codeOutput');

if (generateCode && codeInput && codeOutput) {
    generateCode.addEventListener('click', async () => {
        const prompt = codeInput.value.trim();
        if (!prompt) return;
        
        codeOutput.innerHTML = '<div class="loading">Generating code with AI...</div>';
        
        // Use Gemini to generate code
        const response = await chatWithGemini(
            Generate |code_for. $|{prompt}. Provide |clean, working |code_with |comments
        );
        
        codeOutput.innerHTML = <pre><code>${response.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>;
    });
}

// ===========================================
// TEXT ANALYZER
// ===========================================

const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeInput = document.getElementById('analyzeInput');
const analyzeResult = document.getElementById('analyzeResult');

if (analyzeBtn && analyzeInput && analyzeResult) {
    analyzeBtn.addEventListener('click', async () => {
        const text = analyzeInput.value.trim();
         if (!text) return;
        
        analyzeResult.innerHTML = '<div class="loading">Analyzing text with AI...</div>';
        
        // Use Gemini to analyze
        const response = await chatWithGemini((
            Analyze |this |text |and |provide ,1) [Main |topic , Sentiment, Key_points, 4||Summary|nText], $text
        );
        
        analyzeResult.innerHTML = <div class="analysis-result">${response.replace(/\n/g, '<br>')}</div>;
    });
}

// ===========================================
// THEME TOGGLE
// ===========================================

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (icon) icon.className = 'fas fa-sun';
    }
}

// ===========================================
// MOBILE MENU
// ===========================================

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

// ===========================================
// CLOSE MOBILE MENU WHEN CLICKING LINKS
// ===========================================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    });
});

// ===========================================
// ACTIVE NAVIGATION ON SCROLL
// ===========================================

const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === $|{current}) {
            item.classList.add('active');
        }
    });
});

// ===========================================
// SMOOTH SCROLL FOR NAVIGATION
// ===========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================================
// CONTACT FORM HANDLER
// ===========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
 e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const interest = document.getElementById('interest')?.value;
        const message = document.getElementById('message')?.value;
        
        if (!name || !email  ||!interest || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Success message
        alert('✅ Message sent! Sadam will get back to you soon.\n\nThank you for reaching out!');
        contactForm.reset();
    });
}
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 1000,
    once: true
  });
});

// Remove loader after full load
window.addEventListener("load", function () {
  const loader = document.querySelector(".loader-wrapper");
  if (loader) {
    loader.style.display = "none";
  }
});
window.addEventListener("scroll", function() {
    const btn = document.getElementById("backToTop");
    if (window.scrollY > 300) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
});
// ===========================================
// SCHEDULE CALL BUTTON
// ===========================================

