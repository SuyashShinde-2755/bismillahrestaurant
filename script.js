document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7WvWaZvKwSch08BESrPg92lcBe6EqLv-0aR8lnuear7oiInJwrAAK_2J87WHtxCGH/exec'; // User to replace this

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('span');
        icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('span').textContent = 'menu';
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.padding = '8px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '16px 0';
        }
    });

    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('span').textContent = 'light_mode';
    }

    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.body.getAttribute('data-theme') !== 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('span').textContent = 'light_mode';
            theme = 'dark';
        } else {
            document.body.removeAttribute('data-theme');
            themeToggle.querySelector('span').textContent = 'dark_mode';
        }
        localStorage.setItem('theme', theme);
    });

    // Menu Logic
    const menuGrid = document.getElementById('menu-grid');
    const tabs = document.querySelectorAll('.tab');
    const filterChips = document.querySelectorAll('.chip input');

    // Use the global variable from menu_data.js
    const menuItems = typeof MENU_DATA !== 'undefined' ? MENU_DATA : [];

    if (menuItems.length === 0) {
        console.error('Menu data not loaded. Check menu_data.js');
        menuGrid.innerHTML = '<p class="body-medium" style="grid-column: 1/-1; text-align: center;">Failed to load menu data.</p>';
    }

    function renderMenu() {
        const activeCategory = document.querySelector('.tab.active').dataset.category;
        const activeFilters = Array.from(filterChips)
            .filter(chip => chip.checked)
            .map(chip => chip.value);

        menuGrid.innerHTML = '';

        const filteredItems = menuItems.filter(item => {
            const matchesCategory = item.category === activeCategory;
            const matchesFilters = activeFilters.every(filter => item.tags.includes(filter));
            return matchesCategory && matchesFilters;
        });

        if (filteredItems.length === 0) {
            menuGrid.innerHTML = '<p class="body-medium" style="grid-column: 1/-1; text-align: center;">No items match your filters.</p>';
            return;
        }

        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'menu-item fade-in-up';
            div.innerHTML = `
                <div class="menu-info">
                    <h4>${item.name}</h4>
                    <p class="body-medium">${item.description}</p>
                    <div style="margin-top: 8px;">
                        ${item.tags.map(tag => `<span style="font-size: 0.75rem; background: var(--md-sys-color-surface-variant); padding: 2px 8px; border-radius: 4px; margin-right: 4px; text-transform: capitalize;">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="menu-price">${item.price}</div>
            `;
            menuGrid.appendChild(div);
        });
    }

    // Initial Render
    renderMenu();

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderMenu();
        });
    });

    // Filter Switching
    filterChips.forEach(chip => {
        chip.addEventListener('change', renderMenu);
    });

    // Testimonials Carousel
    const testimonials = [
        {
            text: "The best food I've had. The Butter Chicken is absolute heaven!",
            author: "Sarah Jenkins"
        },
        {
            text: "Incredible ambiance and service. Chef Ahmed's modern take on classics is refreshing.",
            author: "Michael Chen"
        },
        {
            text: "A true culinary gem. The flavors are authentic yet sophisticated. Highly recommended!",
            author: "Priya Patel"
        }
    ];

    const track = document.getElementById('testimonial-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    // Render Testimonials
    testimonials.forEach(t => {
        const div = document.createElement('div');
        div.className = 'testimonial-card';
        div.innerHTML = `
            <p class="display-medium" style="font-size: 1.5rem; font-style: italic; margin-bottom: 16px;">"${t.text}"</p>
            <p class="label-large text-primary">- ${t.author}</p>
        `;
        track.appendChild(div);
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateCarousel();
    });

    // Auto-play (optional)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateCarousel();
    }, 5000);

    // Reservation Form
    const form = document.getElementById('reservation-form');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Booking...';
        btn.disabled = true;

        const formData = new FormData(form);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        // If user hasn't set the URL, fallback to simulation
        if (GOOGLE_SCRIPT_URL === 'REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL') {
            console.warn('Google Script URL not set. Simulating submission.');
            setTimeout(() => {
                modal.classList.add('show');
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1500);
            return;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: data
        })
            .then(() => {
                // With no-cors, we get an opaque response, so we assume success
                modal.classList.add('show');
                form.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            })
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
        if (e.target === orderModal) {
            orderModal.classList.remove('show');
        }
    });

    // Order Online Modal
    const orderBtn = document.getElementById('order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeOrderModal = document.getElementById('close-order-modal');

    if (orderBtn && orderModal && closeOrderModal) {
        orderBtn.addEventListener('click', () => {
            orderModal.classList.add('show');
        });

        closeOrderModal.addEventListener('click', () => {
            orderModal.classList.remove('show');
        });
    }
});
