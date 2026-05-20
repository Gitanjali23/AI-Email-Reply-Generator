console.log("Email Writer Extension Active");

// Function to find compose text box and insert generated text
function insertTextIntoCompose(composeWindow, text) {
    const textBox = composeWindow.querySelector('div[role="textbox"]');
    if (!textBox) return false;
    
    textBox.focus();
    // Gmail text boxes use paragraphs or divs for lines. Setting innerText directly updates it safely.
    textBox.innerText = text;
    
    // Trigger input event so Gmail enables the "Send" button and processes the text
    const event = new Event('input', { bubbles: true });
    textBox.dispatchEvent(event);
    return true;
}

// Function to extract email content for context
function extractEmailContent(composeWindow) {
    // 1. Check if the user has typed anything inside the compose box itself (as a prompt)
    const textBox = composeWindow.querySelector('div[role="textbox"]');
    if (textBox && textBox.innerText.trim()) {
        return textBox.innerText.trim();
    }
    
    // 2. If compose textbox is empty, try to get the text from the email thread
    // In Gmail, the email message body has the class "a3s"
    const emailBodies = document.querySelectorAll('.a3s');
    if (emailBodies.length > 0) {
        // Get the last message in the thread
        const lastEmail = emailBodies[emailBodies.length - 1];
        return lastEmail.innerText.trim();
    }
    
    return "";
}

// Global click listener to close popups when clicking outside
document.addEventListener('click', (e) => {
    const activePopup = document.querySelector('.ai-reply-popup');
    if (activePopup && !activePopup.contains(e.target) && !e.target.classList.contains('ai-reply-btn')) {
        activePopup.remove();
    }
});

// Function to toggle the tone selection popup
function togglePopup(btn, toolbar, composeWindow) {
    // Remove any existing popups first
    const existingPopup = document.querySelector('.ai-reply-popup');
    if (existingPopup) {
        existingPopup.remove();
        if (existingPopup.dataset.btnId === btn.id) {
            return; // Clicked the same button, just close it
        }
    }
    
    const popupId = 'popup-' + Date.now();
    btn.id = popupId;
    
    const popup = document.createElement('div');
    popup.className = 'ai-reply-popup';
    popup.dataset.btnId = popupId;
    popup.innerHTML = `
        <h4>✨ AI Reply Assistant</h4>
        <select class="ai-reply-select">
            <option value="">Select Tone (Optional)</option>
            <option value="Professional">💼 Professional</option>
            <option value="Casual">😊 Casual</option>
            <option value="Friendly">👋 Friendly</option>
            <option value="Urgent">🚨 Urgent / Action Required</option>
            <option value="Apologetic">🙏 Apologetic</option>
        </select>
        <button class="ai-reply-submit">Generate Reply</button>
        <div class="ai-reply-error" style="color: #ef4444; font-size: 11px; margin-top: 4px; display: none;"></div>
    `;
    
    // Position the popup relative to the toolbar container
    toolbar.appendChild(popup);
    
    const select = popup.querySelector('.ai-reply-select');
    const submitBtn = popup.querySelector('.ai-reply-submit');
    const errorDiv = popup.querySelector('.ai-reply-error');
    
    submitBtn.addEventListener('click', async () => {
        const tone = select.value;
        const emailContent = extractEmailContent(composeWindow);
        
        if (!emailContent) {
            errorDiv.innerText = "Please write a prompt in the email body or open an email thread first.";
            errorDiv.style.display = 'block';
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="ai-reply-spinner"></div> Generating...';
        errorDiv.style.display = 'none';
        
        try {
            const response = await fetch('http://localhost:8080/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailContent, tone })
            });
            
            if (!response.ok) {
                throw new Error(`Server returned code ${response.status}`);
            }
            
            const replyText = await response.text();
            
            if (replyText.startsWith('Error generating email:')) {
                throw new Error(replyText);
            }
            
            const success = insertTextIntoCompose(composeWindow, replyText);
            if (success) {
                popup.remove(); // Close popup on success
            } else {
                throw new Error("Could not find the compose edit box to insert reply.");
            }
        } catch (error) {
            console.error("AI Reply Generator error:", error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Generate Reply';
            errorDiv.innerText = "Error: " + (error.message || "Failed to generate reply. Make sure the Spring Boot backend is running.");
            errorDiv.style.display = 'block';
        }
    });
}

// Function to inject buttons into compose windows
function injectAIButtons() {
    // In Gmail, the compose footer toolbar is typically inside elements with class 'btC'
    const toolbars = document.querySelectorAll('.btC');
    
    toolbars.forEach(toolbar => {
        // If button is already injected in this toolbar, skip
        if (toolbar.querySelector('.ai-reply-btn')) return;
        
        // Find the matching compose window container
        // Usually, the toolbar is part of the compose dialog or reply box
        const composeWindow = toolbar.closest('.M9') || toolbar.closest('table') || toolbar.parentElement;
        if (!composeWindow) return;
        
        // Create the button
        const btn = document.createElement('button');
        btn.className = 'ai-reply-btn';
        btn.type = 'button';
        btn.innerText = 'AI Reply';
        
        // Find the send button container to place our button next to it
        // The send button is inside class 'gU Up'
        const sendBtnContainer = toolbar.querySelector('.gU.Up');
        if (sendBtnContainer) {
            sendBtnContainer.appendChild(btn);
        } else {
            toolbar.appendChild(btn);
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePopup(btn, toolbar, composeWindow);
        });
    });
}

// Set up MutationObserver to watch for dynamically added compose windows
const observer = new MutationObserver((mutations) => {
    injectAIButtons();
});

// Start observing the page
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Run once initially
injectAIButtons();