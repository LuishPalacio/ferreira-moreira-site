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
    
    // --- 1. LÓGICA DO CABEÇALHO (Scroll e Cor) ---
    function atualizarHeader() {
        const menuAberto = navMenu && navMenu.classList.contains('ativo');

        if (window.scrollY > 50 || menuAberto) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.height = '70px';
            if(logo) logo.style.height = '50px';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.height = '100px';
            if(logo) logo.style.height = '80px';
        }
    }

    if (header) {
        window.addEventListener('scroll', atualizarHeader);
    }

    // --- 2. LÓGICA DO MENU MOBILE ---
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

    // --- 3. LÓGICA DO LIGHTBOX (ZOOM NA ROLETA) ---
    // Esta é a parte mais importante para o seu problema atual
    if (lightbox && lightboxImg) {
        
        // Seleciona TODAS as imagens (incluindo os clones da roleta)
        // O seletor '.galeria-container img' garante que pegue tudo
        const imagens = document.querySelectorAll('.galeria-container img');

        imagens.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede bugs de clique
                
                // Abre o Lightbox adicionando a classe 'ativo' (definida no CSS)
                lightbox.classList.add('ativo'); 
                lightboxImg.src = img.src; 
                
                // Busca o texto da legenda
                const pai = img.parentElement;
                const overlayTitle = pai.querySelector('.overlay h3');
                
                if(caption && overlayTitle) {
                    caption.innerText = overlayTitle.innerText;
                } else if (caption) {
                    caption.innerText = ""; 
                }
            });
        });

        // Função para fechar
        function fecharLightbox() {
            lightbox.classList.remove('ativo');
        }

        // Fechar ao clicar no X
        if(fechar) {
            fechar.addEventListener('click', fecharLightbox);
        }

        // Fechar ao clicar no fundo preto
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                fecharLightbox();
            }
        });

        // Fechar com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fecharLightbox();
            }
        });
    }
});