document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. General Reveal on Scroll
    // ---------------------------------------------------------
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Select all major sections and elements to animate
    const animatedElements = document.querySelectorAll(
        '.hero-content > *, .profile-card, .section-title, .about-text-content > *, .skill-category'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        revealObserver.observe(el);
    });

    // ---------------------------------------------------------
    // 2. Skill Bar Progress Animation
    // ---------------------------------------------------------
    const skillObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.5 }); // Wait until 50% visible

    document.querySelectorAll('.skill-progress-fill').forEach(bar => {
        skillObserver.observe(bar);
    });

    // ---------------------------------------------------------
    // 3. Smooth Scrolling
    // ---------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 4. Mobile Menu Toggle
    // ---------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        const isFlex = navLinks.style.display === 'flex';
        navLinks.style.display = isFlex ? 'none' : 'flex';

        if (!isFlex) {
            // Styling for mobile menu when active
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.height = '100vh'; // Full screen
            navLinks.style.background = 'rgba(15, 23, 42, 0.98)';
            navLinks.style.padding = '2rem';
            navLinks.style.backdropFilter = 'blur(10px)';
            navLinks.style.zIndex = '999';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }
    });

    // ---------------------------------------------------------
    // 5. Project Filtering
    // ---------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hidden');
                    // Add fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 6. Theme Toggle
    // ---------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    themeToggle.addEventListener('click', () => {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'light') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    });

    // ---------------------------------------------------------
    // 7. Contact Form Handler (Simulated)
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;

            // Check if access key is still default
            const accessKey = contactForm.querySelector('input[name="access_key"]').value;
            if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
                alert('Please update the Access Key in index.html to receive emails!');
                return;
            }

            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
                });

                const json = await response.json();

                if (response.status === 200) {
                    btn.innerText = 'Message Sent!';
                    btn.style.background = '#22c55e'; // success green
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 5000);
                } else {
                    console.log(response);
                    btn.innerText = 'Error!';
                    btn.style.background = '#ef4444'; // error red
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 3000);
                }
            } catch (error) {
                console.log(error);
                btn.innerText = 'Error!';
                btn.style.background = '#ef4444';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }
    // ---------------------------------------------------------
    // 8. Typing Animation
    // ---------------------------------------------------------
    const typingElement = document.getElementById('typing-text');
    const textToType = "Full Stack Developer | Building Web Apps & APIs";
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }

    if (typingElement) {
        setTimeout(typeText, 1000); // Start after 1s delay
    }

    // ---------------------------------------------------------
    // 9. Back to Top Button
    // ---------------------------------------------------------
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
