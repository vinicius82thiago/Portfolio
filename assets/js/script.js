 const menuButton = document.querySelector(".menu-button");
        const nav = document.querySelector(".navbar nav");
        const navLinks = document.querySelectorAll(".navbar nav a");

        menuButton.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
            });
        });

        const animatedElements = document.querySelectorAll(
            ".project-card, .about-content, .contact-box"
        );

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });