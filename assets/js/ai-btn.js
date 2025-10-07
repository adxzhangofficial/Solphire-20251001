    document.addEventListener('DOMContentLoaded', function() {
        const floatingAiBtn = document.getElementById('floatingAiBtn');
        const chatModal = document.getElementById('chatModal');

        if (floatingAiBtn && chatModal) {
            floatingAiBtn.addEventListener('click', function() {
                chatModal.classList.add('active');
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = '';
                    setTimeout(() => {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'chat-message ai';
                        const bubbleDiv = document.createElement('div');
                        bubbleDiv.className = 'chat-message-bubble';
                        bubbleDiv.textContent = '您好！我是GeoOptix AI助手。请问有什么可以帮助您的？';
                        messageDiv.appendChild(bubbleDiv);
                        chatMessages.appendChild(messageDiv);
                    }, 300);
                }
                setTimeout(() => {
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) chatInput.focus();
                }, 600);
            });
        }
    });
