// Espera a que todo el contenido del HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    /*
    ============================================================
    1. FUNCIONALIDAD DEL MENÚ MÓVIL
    ============================================================
    */
    const menuButton = document.getElementById('mobile-menu-button');
    const navMenu = document.getElementById('nav-menu');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });
    }

    /*
    ============================================================
    2. FUNCIONALIDAD DE SCROLL SUAVE (SMOOTH SCROLL)
    ============================================================
    */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                if (window.innerWidth < 768 && !navMenu.classList.contains('hidden')) {
                    navMenu.classList.add('hidden');
                }
            }
        });
    });

    /*
    ============================================================
    3. ANIMACIÓN DE SCROLL (Intersection Observer)
    ============================================================
    */
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    /*
    ============================================================
    4. [NUEVO] FUNCIONALIDAD DE FILTROS DEL PORTAFOLIO (Opción B)
    ============================================================
    */
    const filterButtonsContainer = document.getElementById('portfolio-filters');
    const portfolioGrid = document.getElementById('portfolio-grid');
    // Seleccionamos las tarjetas desde el nuevo grid
    const portfolioCards = portfolioGrid ? portfolioGrid.querySelectorAll('.portfolio-card') : [];

    if (filterButtonsContainer && portfolioGrid && portfolioCards.length > 0) {
        
        filterButtonsContainer.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.filter-btn');
            if (!filterBtn || filterBtn.classList.contains('active-filter')) {
                return; // Si no es un botón o ya está activo, no hacer nada
            }

            // 1. Quitar 'active' a todos los botones
            filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active-filter', 'bg-primary-dark', 'text-white', 'hover:bg-dark-hover');
                // Añadir clases de inactivo (con el hover oliva)
                btn.classList.add('border', 'border-gray-medium', 'text-primary-dark', 'hover:bg-accent-olive', 'hover:text-white', 'hover:border-accent-olive');
            });

            // 2. Añadir 'active' solo al botón clickeado
            filterBtn.classList.add('active-filter', 'bg-primary-dark', 'text-white', 'hover:bg-dark-hover');
            // Quitar clases de inactivo
            filterBtn.classList.remove('border', 'border-gray-medium', 'text-primary-dark', 'hover:bg-accent-olive', 'hover:text-white', 'hover:border-accent-olive');

            // 3. Filtrar las tarjetas (Mostrar/Ocultar)
            const filterValue = filterBtn.dataset.filter;
            
            portfolioCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hidden'); // Mostrar
                } else {
                    card.classList.add('hidden'); // Ocultar
                }
            });
        });
    }

    /*
    ============================================================
    5. FUNCIONALIDAD DEL CARRUSEL DE TESTIMONIOS (Sin cambios)
    ============================================================
    */
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialPrevBtn = document.getElementById('testimonial-prev-btn');
    const testimonialNextBtn = document.getElementById('testimonial-next-btn');

    if (testimonialTrack && testimonialPrevBtn && testimonialNextBtn) {
        // ... (La lógica del carrusel de testimonios sigue igual) ...
        const slides = testimonialTrack.querySelectorAll('.grid');
        const slideCount = slides.length;
        let currentIndex = 0;
        let slideWidth = 0;

        function initializeTestimonialCarousel() {
            const container = testimonialTrack.parentElement;
            slideWidth = container.clientWidth;
            slides.forEach(slide => {
                slide.style.minWidth = `${slideWidth}px`;
            });
            updateTestimonialCarousel();
        }
        initializeTestimonialCarousel();
        window.addEventListener('resize', initializeTestimonialCarousel);

        function updateTestimonialCarousel() {
            const offset = -currentIndex * slideWidth;
            testimonialTrack.style.transform = `translateX(${offset}px)`;
            testimonialPrevBtn.disabled = (currentIndex === 0);
            testimonialNextBtn.disabled = (currentIndex === slideCount - 1);
        }
        testimonialNextBtn.addEventListener('click', () => {
            if (currentIndex < slideCount - 1) {
                currentIndex++;
                updateTestimonialCarousel();
            }
        });
        testimonialPrevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateTestimonialCarousel();
            }
        });
    }

    /*
    ============================================================
    6. FUNCIONALIDAD DEL FORMULARIO DE CONTACTO (Sin cambios)
    ============================================================
    */
    const contactForm = document.querySelector('#contacto form');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && submitButton) {
        // ... (La lógica del formulario de contacto sigue igual) ...
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            const formData = new FormData(contactForm);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                mensaje: formData.get('mensaje'),
            };
            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    contactForm.reset();
                    submitButton.innerHTML = '¡Mensaje Enviado!';
                    submitButton.classList.remove('bg-primary-dark', 'hover:bg-dark-hover');
                    submitButton.classList.add('bg-green-500');
                } else {
                    throw new Error('Hubo un problema con el envío.');
                }
            } catch (error) {
                submitButton.innerHTML = 'Error al Enviar';
                submitButton.classList.remove('bg-primary-dark', 'hover:bg-dark-hover');
                submitButton.classList.add('bg-red-500');
                console.error(error);
            } finally {
                setTimeout(() => {
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('bg-green-500', 'bg-red-500');
                    submitButton.classList.add('bg-primary-dark', 'hover:bg-dark-hover');
                }, 3000);
            }
        });
    }

    /*
    ============================================================
    7. FUNCIONALIDAD DE LIGHTBOX DEL PORTAFOLIO (CORREGIDO)
    ============================================================
    */
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    
    // [CORREGIDO] Seleccionamos las tarjetas desde el nuevo '#portfolio-grid'
    const allPortfolioCards = document.querySelectorAll('#portfolio-grid .portfolio-card'); 

    if (lightbox && allPortfolioCards.length > 0) {

        function openLightbox(card) {
            const imgSrc = card.querySelector('img').src;
            const title = card.querySelector('h3').textContent;
            const description = card.getAttribute('data-description-long');
            lightboxImg.src = imgSrc; 
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = description || "No hay descripción disponible.";
            lightbox.classList.remove('hidden');
            setTimeout(() => {
                lightbox.classList.add('opacity-100');
                lightboxContent.classList.add('opacity-100', 'scale-100');
                lightboxContent.classList.remove('scale-95');
            }, 10);
        }

        function closeLightbox() {
            lightbox.classList.remove('opacity-100');
            lightboxContent.classList.remove('opacity-100', 'scale-100');
            lightboxContent.classList.add('scale-95');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                lightboxImg.src = "";
            }, 300);
        }

        // [MODIFICADO] Asignamos el evento a TODAS las tarjetas.
        allPortfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                openLightbox(card);
            });
        });

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    /*
    ============================================================
    8. FUNCIONALIDAD DE ACORDEÓN (FAQ)
    ============================================================
    */
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const toggleButton = item.querySelector('.faq-toggle');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            toggleButton.addEventListener('click', () => {
                // Comprueba si el acordeón actual está abierto
                const isOpen = item.classList.contains('active');

                // Opcional: Cierra todos los demás acordeones
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                        otherItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                    }
                });

                // Abre o cierra el acordeón actual
                if (isOpen) {
                    // Cierra
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    // Abre
                    item.classList.add('active');
                    // Establece la altura máxima al contenido real para la animación
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

}); // Fin del DOMContentLoaded