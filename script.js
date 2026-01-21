// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du fond d'étoiles
    initStars();
    
    // Éléments DOM
    const navItems = document.querySelectorAll('.nav-item');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navCircle = document.querySelector('.nav-circle');
    const joinButtons = document.querySelectorAll('.join-now, .main-join');
    const discordButtons = document.querySelectorAll('.discord-connect, .discord-btn');
    const copyButtons = document.querySelectorAll('.copy-btn'); // RETIRÉ .glow-btn
    const modal = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalCloseBtn = document.querySelector('.modal-footer .border-btn');
    const ruleItems = document.querySelectorAll('.rule-item');
    const statCircles = document.querySelectorAll('.circle-value');

    // Navigation active
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer active de tous
            navItems.forEach(i => i.classList.remove('active'));
            
            // Ajouter active au cliqué
            this.classList.add('active');
            
            // Navigation vers la section
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Menu mobile
    mobileToggle?.addEventListener('click', function() {
        navCircle.style.display = navCircle.style.display === 'flex' ? 'none' : 'flex';
        if (navCircle.style.display === 'flex') {
            navCircle.style.position = 'absolute';
            navCircle.style.right = '0';
            navCircle.style.top = '100%';
            navCircle.style.flexDirection = 'column';
            navCircle.style.background = 'rgba(0, 0, 0, 0.95)';
            navCircle.style.backdropFilter = 'blur(20px)';
            navCircle.style.padding = '20px';
            navCircle.style.border = '1px solid rgba(139, 0, 0, 0.5)';
            navCircle.style.zIndex = '1001';
        }
    });

    // Join buttons - ouvre modal
    joinButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    // Discord buttons - ouvre Discord
    discordButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Simuler l'ouverture de Discord
            window.open('https://discord.gg/aul', '_blank');
            
            // Feedback visuel
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);
        });
    });

    // Copy buttons - SEULEMENT les boutons copy-btn
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Empêche la propagation
            const ip = 'dayz.unfinishedlife.com:2302';
            
            // Copier dans le presse-papier
            navigator.clipboard.writeText(ip).then(() => {
                // Feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> COPIED';
                this.style.background = '#00aa00';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });
    });

    // Modal - CORRECTION: Ajout des deux boutons Close
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Bouton CLOSE dans le footer du modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Bouton COPY IP dans le modal
    const modalCopyBtn = document.querySelector('.modal-footer .glow-btn');
    if (modalCopyBtn) {
        modalCopyBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Important
            const ip = 'dayz.unfinishedlife.com:2302';
            
            navigator.clipboard.writeText(ip).then(() => {
                const originalHTML = this.innerHTML;
                const originalBackground = this.style.background;
                
                this.innerHTML = '<i class="fas fa-check"></i> COPIED';
                this.style.background = '#00aa00';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = originalBackground;
                }, 2000);
            });
        });
    }

    // Animation des cartes de règles au scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animer les règles
    ruleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Animation des cercles de statistiques (version corrigée)
    statCircles.forEach(circle => {
        const originalText = circle.textContent;
        
        // Vérifier si c'est un nombre ou un texte spécial
        if (originalText.includes('+') || originalText.includes('/')) {
            // Pour "57+" et "24/7", on garde le texte tel quel
            circle.textContent = originalText;
            return; // Pas d'animation pour ces cas
        }
        
        // Pour les nombres normaux (comme "2.5k")
        const isK = originalText.includes('k');
        const targetValue = isK ? 
            parseFloat(originalText.replace('k', '')) * 1000 : 
            parseInt(originalText) || 2500;
        
        circle.textContent = '0';
        
        const circleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (isK) {
                        animateCounter(circle, targetValue, 100);
                    } else {
                        animateCounter(circle, targetValue, 1);
                    }
                    circleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        circleObserver.observe(circle);
    });

    // Status pulse animation
    const pulseCircle = document.querySelector('.pulse-circle');
    if (pulseCircle) {
        setInterval(() => {
            pulseCircle.style.animation = 'none';
            setTimeout(() => {
                pulseCircle.style.animation = 'pulse 2s infinite';
            }, 10);
        }, 4000);
    }

    // Mise à jour du nombre de joueurs
    const playerCount = document.querySelector('.info-value');
    if (playerCount && playerCount.textContent.includes('/')) {
        setInterval(() => {
            const parts = playerCount.textContent.split('/');
            let current = parseInt(parts[0]);
            const max = parseInt(parts[1]);
            
            // Fluctuation aléatoire
            const change = Math.random() > 0.6 ? 1 : (Math.random() > 0.3 ? -1 : 0);
            current = Math.min(max, Math.max(1, current + change));
            
            playerCount.textContent = `${current}/${max}`;
        }, 30000);
    }

    // Effet de parallaxe sur les étoiles
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const stars = document.querySelectorAll('#stars, #stars2, #stars3');
        
        stars.forEach((star, index) => {
            const speed = 0.5 * (index + 1);
            star.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });

    // Tooltips permanents sur desktop
    if (window.innerWidth > 768) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const tooltip = this.getAttribute('data-tooltip');
                if (tooltip) {
                    // Créer tooltip
                    let tooltipEl = document.createElement('div');
                    tooltipEl.className = 'tooltip-active';
                    tooltipEl.textContent = tooltip;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.top = '-40px';
                    tooltipEl.style.left = '50%';
                    tooltipEl.style.transform = 'translateX(-50%)';
                    tooltipEl.style.background = 'rgba(0, 0, 0, 0.9)';
                    tooltipEl.style.color = 'white';
                    tooltipEl.style.padding = '5px 10px';
                    tooltipEl.style.borderRadius = '5px';
                    tooltipEl.style.fontSize = '12px';
                    tooltipEl.style.border = '1px solid #8b0000';
                    tooltipEl.style.zIndex = '1002';
                    
                    this.appendChild(tooltipEl);
                    
                    // Supprimer au mouseleave
                    this.addEventListener('mouseleave', function() {
                        if (tooltipEl && tooltipEl.parentNode) {
                            tooltipEl.parentNode.removeChild(tooltipEl);
                        }
                    }, { once: true });
                }
            });
        });
    }
});

// Fonction pour initialiser les étoiles
function initStars() {
    const layers = [document.querySelector('#stars'), 
                   document.querySelector('#stars2'), 
                   document.querySelector('#stars3')];
    
    layers.forEach((layer, layerIndex) => {
        // Nettoyer les étoiles existantes
        layer.innerHTML = '';
        
        // Créer les étoiles
        const starCount = 100 + (layerIndex * 50);
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Position aléatoire
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Taille aléatoire
            const size = Math.random() * 2 + (layerIndex * 0.5);
            
            // Opacité
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Couche différente
            let color = '#fff';
            if (layerIndex === 1) color = '#888';
            if (layerIndex === 2) color = '#444';
            
            // Appliquer styles
            star.style.position = 'absolute';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = color;
            star.style.borderRadius = '50%';
            star.style.opacity = opacity.toString();
            star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            
            // Animation
            const duration = 3 + Math.random() * 7;
            const delay = Math.random() * 5;
            star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
            
            layer.appendChild(star);
        }
    });
}

// Animation compteur corrigée
function animateCounter(element, target, step = 1) {
    let current = 0;
    const increment = target / 50;
    const isK = step === 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (isK) {
                element.textContent = (target / 1000).toFixed(1).replace('.0', '') + 'k';
            } else {
                element.textContent = Math.floor(target);
            }
            clearInterval(timer);
        } else {
            if (isK) {
                element.textContent = Math.floor(current / 100) / 10 + 'k';
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, 30);
}

// Smooth scroll pour tous les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Mise à jour automatique de l'année
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        yearSpan.textContent = yearSpan.textContent.replace('2023', new Date().getFullYear());
    }
});

// Effet de glow au survol des boutons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        if (!this.classList.contains('pulse-btn')) {
            this.style.transform = 'translateY(-3px)';
        }
    });
    
    btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('pulse-btn')) {
            this.style.transform = 'translateY(0)';
        }
    });
});