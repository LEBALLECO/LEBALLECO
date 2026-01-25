// LEBALLECO Core JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    // Sticky Header Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only reveal once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Simple Lightbox for Portfolio removed (unused)

    // Back to Top Button Logic
    const backToTop = document.createElement('div');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            // Create feedback element
            let feedback = newsletterForm.nextElementSibling;
            if (!feedback || !feedback.classList.contains('form-feedback')) {
                feedback = document.createElement('div');
                feedback.className = 'form-feedback';
                feedback.style.marginTop = '10px';
                feedback.style.color = '#4CAF50';
                feedback.style.fontSize = '0.9rem';
                newsletterForm.parentNode.insertBefore(feedback, newsletterForm.nextSibling);
            }
            feedback.textContent = `Thank you for subscribing, ${email}!`;
            newsletterForm.reset();
            setTimeout(() => { feedback.textContent = ''; }, 5000);
        });
    }

    // Contact Form Handler
    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Create feedback element
            let feedback = contactForm.querySelector('.form-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'form-feedback';
                feedback.style.marginTop = '15px';
                feedback.style.padding = '10px';
                feedback.style.borderRadius = '4px';
                feedback.style.textAlign = 'center';
                contactForm.appendChild(feedback);
            }

            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.textContent = 'Your inquiry has been sent successfully. We will get back to you within 24 hours!';

            contactForm.reset();
            setTimeout(() => { feedback.remove(); }, 5000);
        });
    }

    // Footer Accordion for Mobile
    const footerHeaders = document.querySelectorAll('.footer-links h4');
    footerHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                header.parentElement.classList.toggle('active');
            }
        });
    });
});
