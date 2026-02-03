// Live Chat Widget JavaScript with AI Integration
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userProfilePic = localStorage.getItem('chatUserProfilePic') || null;
        this.userName = localStorage.getItem('chatUserName') || 'You';

        // AI Configuration - Using Hugging Face Free Inference
        this.aiEnabled = true;
        this.HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';

        this.init();
    }

    init() {
        this.createChatHTML();
        this.attachEventListeners();
        this.checkUserProfile();
    }

    createChatHTML() {
        const chatHTML = `
            <!-- Chat Button -->
            <button class="chat-button" id="chatButton" aria-label="Open chat">
                <i class="fas fa-comments"></i>
                <i class="fas fa-times"></i>
                <span class="chat-badge">1</span>
            </button>

            <!-- Chat Container -->
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <img src="logo/logo-final.png" alt="LEBALLECO" class="chat-header-logo">
                    <div class="chat-header-info">
                        <h3>LEBALLECO Support</h3>
                        <p><span class="chat-status"></span>Online - We reply instantly</p>
                    </div>
                </div>

                <div class="chat-body" id="chatBody">
                    <!-- Messages will be inserted here -->
                </div>

                <div class="chat-footer">
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            class="chat-input" 
                            id="chatInput" 
                            placeholder="Type your message..."
                            aria-label="Chat message input"
                        >
                        <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profile Setup Modal -->
            <div class="chat-profile-modal" id="chatProfileModal">
                <div class="profile-modal-content">
                    <h3>Welcome to LEBALLECO Chat! 👋</h3>
                    <p>Let's personalize your chat experience</p>
                    
                    <div class="profile-upload-section">
                        <div class="profile-preview" id="profilePreview">
                            <i class="fas fa-user"></i>
                        </div>
                        <input type="file" id="profilePicInput" accept="image/*" style="display: none;">
                        <button class="upload-btn" id="uploadProfileBtn">
                            <i class="fas fa-camera"></i> Add Profile Picture
                        </button>
                    </div>

                    <div class="profile-name-section">
                        <label for="userNameInput">Your Name (Optional)</label>
                        <input 
                            type="text" 
                            id="userNameInput" 
                            placeholder="Enter your name"
                            maxlength="30"
                        >
                    </div>

                    <div class="profile-modal-actions">
                        <button class="skip-btn" id="skipProfileBtn">Skip for now</button>
                        <button class="continue-btn" id="continueProfileBtn">Continue</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const chatButton = document.getElementById('chatButton');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatInput = document.getElementById('chatInput');
        const uploadProfileBtn = document.getElementById('uploadProfileBtn');
        const profilePicInput = document.getElementById('profilePicInput');
        const skipProfileBtn = document.getElementById('skipProfileBtn');
        const continueProfileBtn = document.getElementById('continueProfileBtn');

        chatButton.addEventListener('click', () => this.toggleChat());
        chatSendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Profile setup listeners
        uploadProfileBtn.addEventListener('click', () => profilePicInput.click());
        profilePicInput.addEventListener('change', (e) => this.handleProfilePicUpload(e));
        skipProfileBtn.addEventListener('click', () => this.skipProfileSetup());
        continueProfileBtn.addEventListener('click', () => this.saveProfileSetup());
    }

    checkUserProfile() {
        // Check if user has already set up their profile
        if (!this.userProfilePic && !localStorage.getItem('chatProfileSkipped')) {
            // Show profile setup modal when chat is first opened
            const originalToggle = this.toggleChat.bind(this);
            this.toggleChat = () => {
                originalToggle();
                if (this.isOpen) {
                    setTimeout(() => this.showProfileSetup(), 500);
                    this.toggleChat = originalToggle; // Restore original function
                }
            };
        } else {
            this.showWelcomeMessage();
        }
    }

    showProfileSetup() {
        const modal = document.getElementById('chatProfileModal');
        modal.classList.add('active');
    }

    handleProfilePicUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('profilePreview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
                this.userProfilePic = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    skipProfileSetup() {
        const modal = document.getElementById('chatProfileModal');
        modal.classList.remove('active');
        localStorage.setItem('chatProfileSkipped', 'true');
        this.showWelcomeMessage();
    }

    saveProfileSetup() {
        const nameInput = document.getElementById('userNameInput');
        const name = nameInput.value.trim();

        if (name) {
            this.userName = name;
            localStorage.setItem('chatUserName', name);
        }

        if (this.userProfilePic) {
            localStorage.setItem('chatUserProfilePic', this.userProfilePic);
        }

        const modal = document.getElementById('chatProfileModal');
        modal.classList.remove('active');
        this.showWelcomeMessage();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatContainer = document.getElementById('chatContainer');
        const chatButton = document.getElementById('chatButton');
        const badge = document.querySelector('.chat-badge');

        chatContainer.classList.toggle('active');
        chatButton.classList.toggle('active');

        if (this.isOpen && badge) {
            badge.style.display = 'none';
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addBotMessage(`
                <div class="welcome-message">
                    <h4>👋 Welcome to LEBALLECO!</h4>
                    <p>How can we help you today? Ask about our services, pricing, or get a free consultation!</p>
                </div>
            `);
            this.showQuickReplies();
        }, 1000);
    }

    showQuickReplies() {
        const quickReplies = `
            <div class="quick-replies">
                <button class="quick-reply-btn" onclick="chatWidget.handleQuickReply('pricing')">
                    💰 View Pricing
                </button>
                <button class="quick-reply-btn" onclick="chatWidget.handleQuickReply('services')">
                    🎨 Our Services
                </button>
                <button class="quick-reply-btn" onclick="chatWidget.handleQuickReply('consultation')">
                    📞 Free Consultation
                </button>
                <button class="quick-reply-btn" onclick="chatWidget.handleQuickReply('help')">
                    ❓ How We Help
                </button>
            </div>
        `;

        const chatBody = document.getElementById('chatBody');
        chatBody.insertAdjacentHTML('beforeend', quickReplies);
        this.scrollToBottom();
    }

    handleQuickReply(type) {
        // Remove quick replies
        const quickReplies = document.querySelector('.quick-replies');
        if (quickReplies) quickReplies.remove();

        switch (type) {
            case 'pricing':
                this.addUserMessage('Show me your pricing');
                this.showPricing();
                break;
            case 'services':
                this.addUserMessage('What services do you offer?');
                this.showServices();
                break;
            case 'consultation':
                this.addUserMessage('I want a free consultation');
                this.showConsultation();
                break;
            case 'help':
                this.addUserMessage('How can you help my business?');
                this.showHelp();
                break;
        }
    }

    showPricing() {
        setTimeout(() => {
            this.addBotMessage(`
                <p><strong>Our Pricing Plans:</strong></p>
                <p>We offer flexible, risk-free pricing. You only pay when 100% satisfied!</p>
            `);

            setTimeout(() => {
                this.addBotMessage(`
                    <div class="pricing-card">
                        <h4><i class="fas fa-laptop-code service-icon"></i>Web Design & Development</h4>
                        <div class="price">From $1,500 <span>/ project</span></div>
                        <ul>
                            <li>✓ Custom responsive design</li>
                            <li>✓ SEO optimized</li>
                            <li>✓ Free prototype phase</li>
                            <li>✓ Mobile-friendly</li>
                            <li>✓ Pay only if satisfied</li>
                        </ul>
                        <button class="select-btn" onclick="chatWidget.selectService('web-design')">Get Started</button>
                    </div>
                `);
            }, 800);

            setTimeout(() => {
                this.addBotMessage(`
                    <div class="pricing-card">
                        <h4><i class="fas fa-palette service-icon"></i>Brand Identity Design</h4>
                        <div class="price">From $800 <span>/ project</span></div>
                        <ul>
                            <li>✓ Logo design</li>
                            <li>✓ Color palette & typography</li>
                            <li>✓ Brand guidelines</li>
                            <li>✓ Multiple concepts</li>
                            <li>✓ Unlimited revisions</li>
                        </ul>
                        <button class="select-btn" onclick="chatWidget.selectService('branding')">Get Started</button>
                    </div>
                `);
            }, 1600);

            setTimeout(() => {
                this.addBotMessage(`
                    <div class="pricing-card">
                        <h4><i class="fas fa-tools service-icon"></i>Website Support & Maintenance</h4>
                        <div class="price">From $200 <span>/ month</span></div>
                        <ul>
                            <li>✓ Regular updates</li>
                            <li>✓ Security monitoring</li>
                            <li>✓ Performance optimization</li>
                            <li>✓ Content updates</li>
                            <li>✓ Priority support</li>
                        </ul>
                        <button class="select-btn" onclick="chatWidget.selectService('maintenance')">Get Started</button>
                    </div>
                `);

                setTimeout(() => {
                    this.addBotMessage(`<p>💡 <strong>Special Offer:</strong> Get a free website audit when you book a consultation today!</p>`);
                    this.showQuickReplies();
                }, 800);
            }, 2400);
        }, 1000);
    }

    showServices() {
        setTimeout(() => {
            this.addBotMessage(`
                <p><strong>We specialize in:</strong></p>
                <p><i class="fas fa-laptop-code service-icon"></i> <strong>Web Design & Development</strong><br>
                High-performance, custom websites that follow SEO best practices.</p>
                
                <p><i class="fas fa-palette service-icon"></i> <strong>Brand Identity Design</strong><br>
                Memorable brand identities that perfectly capture your company's values.</p>
                
                <p><i class="fas fa-tools service-icon"></i> <strong>Website Support & Growth</strong><br>
                Continuous support and updates to keep your website secure and fast.</p>
                
                <p><i class="fas fa-shopping-cart service-icon"></i> <strong>E-Commerce Solutions</strong><br>
                Secure and user-friendly online stores that drive sales.</p>
            `);

            setTimeout(() => {
                this.addBotMessage(`<p>Would you like to see our pricing or book a free consultation?</p>`);
                this.showQuickReplies();
            }, 1000);
        }, 1000);
    }

    showConsultation() {
        setTimeout(() => {
            this.addBotMessage(`
                <p>🎉 <strong>Great choice!</strong> Our free consultation includes:</p>
                <ul>
                    <li>✓ 30-minute strategy session</li>
                    <li>✓ Website audit (if applicable)</li>
                    <li>✓ Custom recommendations</li>
                    <li>✓ Project timeline & pricing</li>
                    <li>✓ No obligation whatsoever</li>
                </ul>
                <p>Ready to get started?</p>
            `);

            setTimeout(() => {
                this.addBotMessage(`
                    <div style="margin-top: 12px;">
                        <button class="select-btn" onclick="window.location.href='contact.html'">
                            Book Free Consultation Now
                        </button>
                    </div>
                `);

                setTimeout(() => {
                    this.showQuickReplies();
                }, 500);
            }, 1000);
        }, 1000);
    }

    showHelp() {
        setTimeout(() => {
            this.addBotMessage(`
                <p><strong>How LEBALLECO helps your business:</strong></p>
                
                <p>🎯 <strong>Increase Online Presence</strong><br>
                Professional websites that make great first impressions and convert visitors into customers.</p>
                
                <p>🚀 <strong>Stand Out from Competition</strong><br>
                Unique brand identities that make your business memorable and trustworthy.</p>
                
                <p>💰 <strong>Risk-Free Investment</strong><br>
                Our unique model means you only pay when you're 100% satisfied with our work.</p>
                
                <p>⚡ <strong>Fast & Reliable</strong><br>
                Quick turnaround times with ongoing support to keep your business growing.</p>
            `);

            setTimeout(() => {
                this.addBotMessage(`<p>What would you like to explore next?</p>`);
                this.showQuickReplies();
            }, 1000);
        }, 1000);
    }

    selectService(service) {
        const serviceNames = {
            'web-design': 'Web Design & Development',
            'branding': 'Brand Identity Design',
            'maintenance': 'Website Support & Maintenance'
        };

        this.addUserMessage(`I'm interested in ${serviceNames[service]}`);

        setTimeout(() => {
            this.addBotMessage(`
                <p>Excellent choice! ${serviceNames[service]} is one of our most popular services.</p>
                <p>Let's get you started with a free consultation to discuss your specific needs.</p>
                <div style="margin-top: 12px;">
                    <button class="select-btn" onclick="window.location.href='contact.html?service=${service}'">
                        Schedule Free Consultation
                    </button>
                </div>
            `);

            setTimeout(() => {
                this.showQuickReplies();
            }, 1000);
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Process message and respond
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processUserMessage(message);
        }, 1500);
    }

    async processUserMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for specific quick actions first
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            this.showPricing();
            return;
        } else if (lowerMessage.includes('service') && lowerMessage.includes('what')) {
            this.showServices();
            return;
        } else if (lowerMessage.includes('consult') || lowerMessage.includes('meeting') || lowerMessage.includes('book')) {
            this.showConsultation();
            return;
        }

        // Try AI response if enabled
        if (this.aiEnabled) {
            try {
                const aiResponse = await this.getAIResponse(message);
                if (aiResponse) {
                    this.addBotMessage(`<p>${aiResponse}</p>`);
                    setTimeout(() => this.showQuickReplies(), 500);
                    return;
                }
            } catch (error) {
                console.log('AI response failed, using fallback:', error);
            }
        }

        // Fallback to predefined responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            this.addBotMessage(`
                <p>Hello! 👋 Thanks for reaching out to LEBALLECO!</p>
                <p>I'm here to help you with information about our web design, branding, and maintenance services.</p>
            `);
            setTimeout(() => this.showQuickReplies(), 500);
        } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
            this.showHelp();
        } else {
            this.addBotMessage(`
                <p>Thanks for your message! I'd be happy to help you with that.</p>
                <p>For detailed assistance, please choose one of the options below or contact us directly:</p>
                <div style="margin-top: 12px;">
                    <button class="select-btn" onclick="window.location.href='contact.html'">
                        Contact Us Directly
                    </button>
                </div>
            `);
            setTimeout(() => this.showQuickReplies(), 500);
        }
    }

    async getAIResponse(userMessage) {
        try {
            // Context about LEBALLECO for AI
            const context = `You are a helpful customer support assistant for LEBALLECO, a web design and branding agency. 
            
Our services include:
- Web Design & Development (from $1,500/project): Custom responsive design, SEO optimized, mobile-friendly
- Brand Identity Design (from $800/project): Logo design, color palette, brand guidelines
- Website Support & Maintenance (from $200/month): Regular updates, security monitoring, performance optimization

Our unique value: Risk-free pricing - clients only pay when 100% satisfied.

Keep responses concise (2-3 sentences), friendly, and professional. If asked about pricing or services in detail, suggest they use the quick reply buttons or contact us directly.`;

            const response = await fetch(this.HF_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `<|system|>\n${context}<|end|>\n<|user|>\n${userMessage}<|end|>\n<|assistant|>`,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data[0] && data[0].generated_text) {
                return data[0].generated_text.trim();
            }

            return null;
        } catch (error) {
            console.error('Inference API Error:', error);
            return null;
        }
    }

    addUserMessage(message) {
        const time = this.getCurrentTime();
        const userInitials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        const avatarHTML = this.userProfilePic
            ? `<div class="message-avatar user" style="background-image: url('${this.userProfilePic}'); background-size: cover; background-position: center;"></div>`
            : `<div class="message-avatar user">${userInitials}</div>`;

        const messageHTML = `
            <div class="chat-message user">
                ${avatarHTML}
                <div>
                    <div class="message-content">${message}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;

        const chatBody = document.getElementById('chatBody');
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const time = this.getCurrentTime();
        const messageHTML = `
            <div class="chat-message bot">
                <div class="message-avatar bot-logo">
                    <img src="logo/logo-final.png" alt="LEBALLECO">
                </div>
                <div>
                    <div class="message-content">${message}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;

        const chatBody = document.getElementById('chatBody');
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingHTML = `
            <div class="chat-message bot typing-message">
                <div class="message-avatar bot-logo">
                    <img src="logo/logo-final.png" alt="LEBALLECO">
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        const chatBody = document.getElementById('chatBody');
        chatBody.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        const chatBody = document.getElementById('chatBody');
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 100);
    }
}

// Initialize chat widget when DOM is loaded
let chatWidget;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatWidget = new ChatWidget();
    });
} else {
    chatWidget = new ChatWidget();
}
