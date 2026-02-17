document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTOS GERAIS ---
    const header = document.querySelector('.cabecalho');
    const logo = document.querySelector('.logo');
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.nav-menu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    // --- ELEMENTOS DO LIGHTBOX (Zoom) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    const fechar = document.querySelector('.fechar');
    

    function atualizarHeader() {
        const menuAberto = navMenu && navMenu.classList.contains('ativo');

        if (window.scrollY > 50 || menuAberto) {

            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.height = '100px'; 
            
            if(logo) {
                logo.style.height = '90px'; // Aumentado de 50 para 90 para não cortar
                logo.style.marginTop = '0px'; // Ajuste fino para alinhar
            }

        } else {

            header.style.backgroundColor = 'transparent';
            header.style.height = '120px'; // Tamanho grande original
            
            if(logo) {
                logo.style.height = '100px'; // Tamanho grande original
                logo.style.marginTop = '10px'; // O efeito de "vazar" um pouco
            }
        }
    }

    if (header) {
        window.addEventListener('scroll', atualizarHeader);
    }

    if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', function() {
            navMenu.classList.toggle('ativo');
            atualizarHeader();
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('ativo');
                atualizarHeader();
            });
        });
    }

    if (lightbox && lightboxImg) {
        
        const imagens = document.querySelectorAll('.galeria-container img');

        imagens.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede bugs de clique
                
                lightbox.classList.add('ativo'); 
                lightboxImg.src = img.src; 
                
                const pai = img.parentElement;
                const overlayTitle = pai.querySelector('.overlay h3');
                
                if(caption && overlayTitle) {
                    caption.innerText = overlayTitle.innerText;
                } else if (caption) {
                    caption.innerText = ""; 
                }
            });
        });

        function fecharLightbox() {
            lightbox.classList.remove('ativo');
        }

        if(fechar) {
            fechar.addEventListener('click', fecharLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                fecharLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fecharLightbox();
            }
        });
    }
});