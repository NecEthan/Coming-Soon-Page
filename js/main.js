// Navigation scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Close mobile menu when clicking on a link (if needed for any future mobile menu)
const navLinksItems = document.querySelectorAll('.nav-links a');

// Highlight active page link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinksItems.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

// Form handling with Resend
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const submitButton = contactForm.querySelector('.submit-button');
        
        // Basic validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // Determine API endpoint based on environment
            // For local development with Express server, use port 3000
            // For production/deployed, use relative path
            const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocalDev && window.location.port !== '3000' 
                ? 'http://localhost:3000/api/send-email'
                : '/api/send-email';
            
            // Send email using Resend API via serverless function
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });
            
            // Check if response is ok before parsing JSON
            if (!response.ok) {
                let errorMessage = 'Failed to send message';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error(data.message || data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            let errorMsg = error.message || 'Sorry, there was an error sending your message. Please try again or call us directly.';
            
            // Provide helpful message for domain verification errors
            if (errorMsg.includes('domain is not verified') || errorMsg.includes('not verified')) {
                errorMsg = 'Email service configuration issue. Please contact support or use the phone number to reach us directly.';
            }
            
            showMessage(errorMsg, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

function showMessage(text, type) {
    if (!formMessage) return;
    
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Video autoplay handling for mobile devices
const videoBackground = document.querySelector('.video-background');
if (videoBackground) {
    // Ensure video is muted and set to autoplay
    videoBackground.muted = true;
    videoBackground.setAttribute('playsinline', '');
    videoBackground.setAttribute('webkit-playsinline', '');
    
    // Try to play the video programmatically
    const playVideo = async () => {
        try {
            await videoBackground.play();
            // If play succeeds, hide any controls
            videoBackground.controls = false;
        } catch (error) {
            // If autoplay fails (mobile restriction), try again on user interaction
            console.log('Autoplay prevented, will play on user interaction');
            
            // Add a one-time click handler to start video on first user interaction
            const startVideoOnInteraction = () => {
                videoBackground.play().catch(e => console.log('Video play failed:', e));
                // Remove listeners after first interaction
                document.removeEventListener('touchstart', startVideoOnInteraction);
                document.removeEventListener('click', startVideoOnInteraction);
            };
            
            document.addEventListener('touchstart', startVideoOnInteraction, { once: true });
            document.addEventListener('click', startVideoOnInteraction, { once: true });
        }
    };
    
    // Try to play when video is loaded
    if (videoBackground.readyState >= 2) {
        playVideo();
    } else {
        videoBackground.addEventListener('loadeddata', playVideo, { once: true });
    }
    
    // Also try on page load
    if (document.readyState === 'complete') {
        playVideo();
    } else {
        window.addEventListener('load', playVideo);
    }
    
    // Ensure video stays playing and looped
    videoBackground.addEventListener('pause', () => {
        if (!videoBackground.ended) {
            videoBackground.play().catch(e => console.log('Video resume failed:', e));
        }
    });
    
    videoBackground.addEventListener('ended', () => {
        videoBackground.currentTime = 0;
        videoBackground.play().catch(e => console.log('Video loop failed:', e));
    });
}

