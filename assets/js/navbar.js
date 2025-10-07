    // Smooth Navbar Scroll Animation
    (function () {
        const navbar = document.querySelector(".navbar");
        let lastScrollTop = 0;
        let scrollTimer = null;
        const scrollThreshold = 5;

        // Initialize navbar as visible
        navbar.classList.add("navbar-visible");

        function handleScroll() {
            const currentScroll =
                window.pageYOffset ||
                document.documentElement.scrollTop;

            // Don't hide navbar at the very top
            if (currentScroll <= 50) {
                navbar.classList.remove("navbar-hidden");
                navbar.classList.add("navbar-visible");
                lastScrollTop = currentScroll;
                return;
            }

            // Only trigger if scroll difference is significant (prevents jitter)
            if (
                Math.abs(currentScroll - lastScrollTop) <
                scrollThreshold
            ) {
                return;
            }

            // Scrolling down
            if (currentScroll > lastScrollTop) {
                navbar.classList.remove("navbar-visible");
                navbar.classList.add("navbar-hidden");
            }
            // Scrolling up
            else if (currentScroll < lastScrollTop) {
                navbar.classList.remove("navbar-hidden");
                navbar.classList.add("navbar-visible");
            }

            lastScrollTop = currentScroll;
        }

        // Throttle scroll events for smooth performance with immediate upward response
        function throttleScroll() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Immediate response for scrolling up
            if (currentScroll < lastScrollTop && currentScroll > 50) {
                navbar.classList.remove("navbar-hidden");
                navbar.classList.add("navbar-visible");
            }
            
            if (scrollTimer === null) {
                scrollTimer = setTimeout(function () {
                    handleScroll();
                    scrollTimer = null;
                }, 30);
            }
        }

        // Add scroll event listener
        window.addEventListener("scroll", throttleScroll, {
            passive: true,
        });
    })();
