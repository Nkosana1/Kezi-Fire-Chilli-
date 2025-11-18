// Hamburger Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle nav menu active class
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Only close on mobile (when hamburger is visible)
                if (window.innerWidth < 768) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && window.innerWidth < 768) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
        
        // Handle window resize - ensure menu state is correct
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
});

