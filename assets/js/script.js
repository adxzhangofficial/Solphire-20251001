/* ===================================
   Website Functionality with Bootstrap
   =================================== */

window.addEventListener("load", function () {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) {
        loadingSpinner.classList.add("hidden");
        setTimeout(() => {
            loadingSpinner.style.display = "none";
        }, 500);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    /* ===================================
       Bootstrap Modal - Search (only on pages with modal)
       =================================== */

    const searchModalEl = document.getElementById("searchModal");
    if (searchModalEl) {
        const searchModal = new bootstrap.Modal(searchModalEl);
        const searchInput = document.getElementById("searchInput");

        const searchButton = document.getElementById("searchBtn");
        if (searchButton) {
            searchButton.addEventListener("click", function (e) {
                e.stopPropagation();
                searchModal.show();
            });
        }

        searchModalEl.addEventListener("shown.bs.modal", function () {
            searchInput.focus();
        });

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                const query = this.value.toLowerCase();
                const listItems =
                    searchModalEl.querySelectorAll(".list-group-item");

                listItems.forEach((item) => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(query) || query === "") {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        }
    }

    /* ===================================
       Styled Dropdowns - Language & User (only on pages with dropdowns)
       =================================== */

    const languageDropdown = document.getElementById("languageDropdown");
    const userDropdown = document.getElementById("userDropdown");
    const languageBtn = document.getElementById("languageBtn");
    const userBtn = document.getElementById("userBtn");

    if (languageDropdown && userDropdown && languageBtn && userBtn) {
        // Language dropdown toggle
        languageBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (languageDropdown.classList.contains("active")) {
                languageDropdown.classList.remove("active");
            } else {
                userDropdown.classList.remove("active");
                languageDropdown.classList.add("active");
            }
        });

        // User dropdown toggle
        userBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (userDropdown.classList.contains("active")) {
                userDropdown.classList.remove("active");
            } else {
                languageDropdown.classList.remove("active");
                userDropdown.classList.add("active");
            }
        });

        // Language dropdown items
        const languageItems =
            languageDropdown.querySelectorAll(".dropdown-item");
        languageItems.forEach((item) => {
            item.addEventListener("click", function (e) {
                e.preventDefault();

                languageItems.forEach((i) => i.classList.remove("active"));
                this.classList.add("active");

                const lang = this.getAttribute("data-lang");
                const langText = this.textContent.trim();
                alert(`语言切换到 | Language switched to: ${langText}`);
                languageDropdown.classList.remove("active");
            });
        });

        // User dropdown items (non-links)
        const userItems = userDropdown.querySelectorAll(
            ".dropdown-item:not(a)",
        );
        userItems.forEach((item) => {
            item.addEventListener("click", function (e) {
                e.preventDefault();
                const actionText = this.textContent.trim();
                alert(`${actionText}\n即将推出 | Coming soon!`);
                userDropdown.classList.remove("active");
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".dropdown-wrapper")) {
                languageDropdown.classList.remove("active");
                userDropdown.classList.remove("active");
            }
        });
    }

    /* ===================================
       Smooth Scrolling for Navigation Links
       =================================== */

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = 120;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        });
    });

    window.addEventListener("scroll", function () {
        let current = "";
        const sections = document.querySelectorAll("section[id]");

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    /* ===================================
       CTA & Chat Buttons
       =================================== */

    const ctaButton = document.querySelector(".cta-button");
    if (ctaButton) {
        ctaButton.addEventListener("click", function () {
            const aboutSection = document.querySelector("#about");
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    /* ===================================
       Chat Modal Functionality - Enhanced
       =================================== */

    const chatButton = document.querySelector(".chat-button");
    const chatModal = document.getElementById("chatModal");
    const chatModalClose = document.getElementById("chatModalClose");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const chatSend = document.getElementById("chatSend");
    const fileInput = document.getElementById("fileInput");
    const fileUploadBtn = document.getElementById("fileUploadBtn");
    const voiceInputBtn = document.getElementById("voiceInputBtn");
    const emojiBtn = document.getElementById("emojiBtn");
    const chatClear = document.getElementById("chatClear");
    const chatSettings = document.getElementById("chatSettings");
    const fileDropZone = document.getElementById("fileDropZone");
    const attachmentsPreview = document.getElementById("attachmentsPreview");
    const charCount = document.getElementById("charCount");
    const quickActionBtns = document.querySelectorAll(".quick-action-btn");

    let attachedFiles = [];
    let isRecording = false;
    const MAX_CHARS = 500;

    const aiResponses = {
        geooptix支持哪些文件格式:
            "GeoOptix支持多种3D文件格式，包括STEP、IGES、STL、OBJ等常见工程文件格式，能够智能识别和处理各类零件模型。",
        价格如何:
            "GeoOptix提供灵活的定价方案，包括按需订阅和企业级定制服务。具体价格请联系我们的销售团队获取详细报价方案。",
        如何开始使用:
            "开始使用GeoOptix非常简单！您可以：1) 注册账户 2) 上传您的3D模型文件 3) 使用AI助手进行智能分析。我们也提供详细的使用教程和技术支持。",
        支持: "GeoOptix提供全方位的技术支持服务，包括在线文档、视频教程、邮件支持和企业级专属技术顾问。您可以随时联系我们！",
        功能: "GeoOptix的核心功能包括：3D零件智能识别、自动化质量检测、数据分析与优化、多模态AI处理、以及与现有系统的无缝集成。",
        ai: "我们的AI引擎结合了计算机视觉、机器学习和深度学习技术，能够精准识别零件特征，预测制造缺陷，并提供优化建议。",
        部署: "我们提供灵活的部署方式：云端SaaS服务、私有化本地部署、以及混合云解决方案，满足不同企业的安全和性能需求。",
        默认: "感谢您的提问！我是GeoOptix AI助手，专注于帮助您了解我们的AI智能制造解决方案。您可以询问关于产品功能、价格、技术支持等任何问题。",
    };

    // Remove welcome message
    function removeWelcomeMessage() {
        const welcomeMsg = document.querySelector(".chat-welcome-message");
        if (welcomeMsg) {
            welcomeMsg.style.animation = "fadeOut 0.3s ease";
            setTimeout(() => welcomeMsg.remove(), 300);
        }
    }

    // Add message with attachments
    function addMessage(text, type, attachments = []) {
        removeWelcomeMessage();

        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${type}`;

        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = "chat-message-bubble";

        // Add text if present
        if (text) {
            const textSpan = document.createElement("span");
            textSpan.textContent = text;
            bubbleDiv.appendChild(textSpan);
        }

        // Add attachments if present
        if (attachments && attachments.length > 0) {
            const attachmentsContainer = document.createElement("div");
            attachmentsContainer.className = "message-attachments";
            attachmentsContainer.style.cssText =
                "display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;";

            attachments.forEach((fileData) => {
                const chip = document.createElement("div");
                chip.style.cssText =
                    "display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(0,0,0,0.1); border-radius: 12px; font-size: 13px;";

                if (fileData.type === "image") {
                    chip.innerHTML = `
                        <img src="${fileData.data}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" alt="${fileData.name}">
                        <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fileData.name}</span>
                    `;
                } else {
                    chip.innerHTML = `
                        <span>📄</span>
                        <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fileData.name}</span>
                    `;
                }

                attachmentsContainer.appendChild(chip);
            });

            bubbleDiv.appendChild(attachmentsContainer);
        }

        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);

        scrollToBottom();
    }

    // Typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-message ai";
        typingDiv.id = "typingIndicator";

        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "typing-indicator";
        indicatorDiv.innerHTML =
            '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

        typingDiv.appendChild(indicatorDiv);
        chatMessages.appendChild(typingDiv);

        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById("typingIndicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get AI response
    function getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        for (let key in aiResponses) {
            if (lowerMessage.includes(key)) {
                return aiResponses[key];
            }
        }

        return aiResponses["默认"];
    }

    // Character count update
    function updateCharCount() {
        if (charCount && chatInput) {
            const count = chatInput.value.length;
            charCount.textContent = `${count}/${MAX_CHARS}`;

            if (count > MAX_CHARS * 0.9) {
                charCount.style.color = "#ef4444";
            } else {
                charCount.style.color = "#999";
            }
        }
    }

    // Auto-resize textarea
    function autoResizeTextarea() {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
    }

    // File handling
    function handleFiles(files) {
        for (let file of files) {
            if (attachedFiles.length >= 5) {
                alert("最多只能上传5个文件");
                break;
            }

            attachedFiles.push(file);
            displayAttachment(file);
        }
    }

    function displayAttachment(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const attachmentItem = document.createElement("div");
            attachmentItem.className = "attachment-item";

            if (file.type.startsWith("image/")) {
                attachmentItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="attachment-remove" onclick="removeAttachment(this)">×</button>
                `;
            } else {
                attachmentItem.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f5f5f5;font-size:12px;padding:8px;text-align:center;">
                        📄<br>${file.name.substring(0, 10)}...
                    </div>
                    <button class="attachment-remove" onclick="removeAttachment(this)">×</button>
                `;
            }

            attachmentsPreview.appendChild(attachmentItem);
        };
        reader.readAsDataURL(file);
    }

    window.removeAttachment = function (btn) {
        const item = btn.parentElement;
        const index = Array.from(attachmentsPreview.children).indexOf(item);
        attachedFiles.splice(index, 1);
        item.remove();
    };

    // Send message
    function handleSendMessage() {
        const message = chatInput.value.trim();

        if (message === "" && attachedFiles.length === 0) return;

        if (message.length > MAX_CHARS) {
            alert(`消息长度不能超过${MAX_CHARS}个字符`);
            return;
        }

        // Capture attachments data before clearing
        const attachmentPromises = [];

        attachedFiles.forEach((file) => {
            const promise = new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    resolve({
                        name: file.name,
                        type: file.type.startsWith("image/") ? "image" : "file",
                        data: e.target.result,
                    });
                };
                reader.readAsDataURL(file);
            });
            attachmentPromises.push(promise);
        });

        // Wait for all files to be read, then send message
        Promise.all(attachmentPromises).then((fileDataArray) => {
            // Add user message with attachments
            addMessage(message || "", "user", fileDataArray);

            // Clear input and attachments
            chatInput.value = "";
            chatInput.style.height = "auto";
            updateCharCount();
            attachedFiles = [];
            attachmentsPreview.innerHTML = "";

            // Show AI response
            showTypingIndicator();

            setTimeout(() => {
                removeTypingIndicator();
                if (fileDataArray.length > 0) {
                    addMessage(
                        `我看到您发送了 ${fileDataArray.length} 个文件。目前文件分析功能正在开发中，敬请期待！`,
                        "ai",
                    );
                } else {
                    const aiResponse = getAIResponse(message);
                    addMessage(aiResponse, "ai");
                }
            }, 1500);
        });
    }

    // Quick actions
    quickActionBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const action = this.getAttribute("data-action");
            chatInput.value = action;
            chatInput.focus();
            updateCharCount();
        });
    });

    // File upload
    if (fileUploadBtn && fileInput) {
        fileUploadBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", function (e) {
            handleFiles(this.files);
        });
    }

    // Drag and drop
    if (chatModal && fileDropZone) {
        chatModal.addEventListener("dragenter", function (e) {
            e.preventDefault();
            e.stopPropagation();
            fileDropZone.classList.add("active");
        });

        fileDropZone.addEventListener("dragleave", function (e) {
            if (e.target === fileDropZone) {
                fileDropZone.classList.remove("active");
            }
        });

        fileDropZone.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        fileDropZone.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            fileDropZone.classList.remove("active");
            handleFiles(e.dataTransfer.files);
        });
    }

    // Voice input
    if (voiceInputBtn) {
        voiceInputBtn.addEventListener("click", function () {
            isRecording = !isRecording;

            if (isRecording) {
                this.classList.add("recording");
                addMessage("🎤 语音输入功能即将推出...", "ai");
                setTimeout(() => {
                    isRecording = false;
                    this.classList.remove("recording");
                }, 3000);
            } else {
                this.classList.remove("recording");
            }
        });
    }

    // Emoji button
    if (emojiBtn) {
        emojiBtn.addEventListener("click", function () {
            const emojis = ["😊", "👍", "❤️", "🎉", "✨", "🚀", "💡", "📱"];
            const randomEmoji =
                emojis[Math.floor(Math.random() * emojis.length)];
            chatInput.value += randomEmoji;
            updateCharCount();
            chatInput.focus();
        });
    }

    // Clear chat
    if (chatClear) {
        chatClear.addEventListener("click", function () {
            if (confirm("确定要清空对话吗？")) {
                chatMessages.innerHTML =
                    '<div class="chat-welcome-message"><div class="welcome-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div><h4>欢迎使用 AI Agent 助手</h4><p>我可以帮您了解GeoOptix产品功能、技术支持和更多信息</p></div>';
            }
        });
    }

    // Settings
    if (chatSettings) {
        chatSettings.addEventListener("click", function () {
            addMessage("⚙️ 设置功能即将推出，敬请期待！", "ai");
        });
    }

    // Modal open/close
    if (chatButton && chatModal) {
        chatButton.addEventListener("click", function () {
            chatModal.classList.add("active");
            setTimeout(() => chatInput.focus(), 600);
        });
    }

    if (chatModalClose) {
        chatModalClose.addEventListener("click", function () {
            chatModal.classList.remove("active");
        });
    }

    if (chatModal) {
        chatModal.addEventListener("click", function (e) {
            if (e.target === chatModal) {
                chatModal.classList.remove("active");
            }
        });
    }

    // Send button
    if (chatSend) {
        chatSend.addEventListener("click", handleSendMessage);
    }

    // Keyboard handling
    if (chatInput) {
        chatInput.addEventListener("input", function () {
            updateCharCount();
            autoResizeTextarea();
        });

        chatInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    /* ===================================
       Team Section Horizontal Slider Auto-scroll
       =================================== */

    const teamMembers = document.querySelector(".team-members");
    if (teamMembers) {
        let isScrolling = false;
        let scrollDirection = 1;
        let scrollPosition = 0;

        function autoScroll() {
            if (
                !isScrolling &&
                teamMembers.scrollWidth > teamMembers.clientWidth
            ) {
                scrollPosition += scrollDirection * 0.5;
                teamMembers.scrollLeft = scrollPosition;

                if (
                    scrollPosition >=
                    teamMembers.scrollWidth - teamMembers.clientWidth
                ) {
                    scrollDirection = -1;
                } else if (scrollPosition <= 0) {
                    scrollDirection = 1;
                }
            }
        }

        const autoScrollInterval = setInterval(autoScroll, 30);

        teamMembers.addEventListener("mouseenter", function () {
            isScrolling = true;
        });

        teamMembers.addEventListener("mouseleave", function () {
            isScrolling = false;
            scrollPosition = teamMembers.scrollLeft;
        });

        teamMembers.addEventListener("touchstart", function () {
            isScrolling = true;
        });

        teamMembers.addEventListener("touchend", function () {
            setTimeout(() => {
                isScrolling = false;
                scrollPosition = teamMembers.scrollLeft;
            }, 1000);
        });

        teamMembers.addEventListener("scroll", function () {
            if (isScrolling) {
                scrollPosition = teamMembers.scrollLeft;
            }
        });
    }

    /* ===================================
       Portfolio Cards Slider Enhancement
       =================================== */

    const portfolioCards = document.querySelector(".portfolio-cards");
    if (portfolioCards) {
        let isPaused = false;
        let autoScrollPos = 0;
        let autoScrollDir = 1;

        function autoScrollPortfolio() {
            if (
                !isPaused &&
                portfolioCards.scrollWidth > portfolioCards.clientWidth
            ) {
                autoScrollPos += autoScrollDir * 0.5;
                portfolioCards.scrollLeft = autoScrollPos;

                if (
                    autoScrollPos >=
                    portfolioCards.scrollWidth - portfolioCards.clientWidth
                ) {
                    autoScrollDir = -1;
                } else if (autoScrollPos <= 0) {
                    autoScrollDir = 1;
                }
            }
        }

        const portfolioScrollInterval = setInterval(autoScrollPortfolio, 30);

        portfolioCards.addEventListener("mouseenter", function () {
            isPaused = true;
        });

        portfolioCards.addEventListener("mouseleave", function () {
            isPaused = false;
            autoScrollPos = portfolioCards.scrollLeft;
        });

        portfolioCards.addEventListener("touchstart", function () {
            isPaused = true;
        });

        portfolioCards.addEventListener("touchend", function () {
            setTimeout(() => {
                isPaused = false;
                autoScrollPos = portfolioCards.scrollLeft;
            }, 1000);
        });

        portfolioCards.addEventListener("scroll", function () {
            if (isPaused) {
                autoScrollPos = portfolioCards.scrollLeft;
            }
        });
    }

    /* ===================================
       Intersection Observer for Animations
       =================================== */

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    const sectionsToAnimate = document.querySelectorAll(
        ".pain-point, .solution, .team-member, .portfolio-card",
    );

    sectionsToAnimate.forEach((section) => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(section);
    });

    /* ===================================
       Hamburger Menu - Mobile Navigation
       =================================== */

    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const mobileNavMenu = document.getElementById("mobileNavMenu");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");

    if (hamburgerMenu && mobileNavMenu && mobileNavOverlay) {
        hamburgerMenu.addEventListener("click", function () {
            hamburgerMenu.classList.toggle("active");
            mobileNavMenu.classList.toggle("active");
            mobileNavOverlay.classList.toggle("active");
        });

        mobileNavOverlay.addEventListener("click", function () {
            hamburgerMenu.classList.remove("active");
            mobileNavMenu.classList.remove("active");
            mobileNavOverlay.classList.remove("active");
        });

        const mobileNavLinks = mobileNavMenu.querySelectorAll("a");
        mobileNavLinks.forEach((link) => {
            link.addEventListener("click", function () {
                hamburgerMenu.classList.remove("active");
                mobileNavMenu.classList.remove("active");
                mobileNavOverlay.classList.remove("active");
            });
        });
    }

    /* ===================================
       Console Log
       =================================== */

    console.log("溯湃科技网站已加载完成 | Website loaded successfully");
    console.log("✅ Bootstrap Modal (search) ready");
    console.log("✅ Styled Dropdowns (language & user) ready");
    console.log("✅ Auto-scroll sliders active");
    console.log("✅ Responsive typography with clamp() active");
    console.log("✅ Smooth scrollbar on hover");
    console.log("✅ Mobile hamburger navigation ready");
    console.log("如有任何问题，请联系：solpire@outlook.com");
});
