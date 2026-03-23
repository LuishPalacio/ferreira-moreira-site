document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. ELEMENTOS GERAIS (Header e Menu Mobile)
    // ==========================================
    const header = document.querySelector('.cabecalho');
    const logo = document.querySelector('.logo');
    const menuIcon = document.querySelector('.menu-icon');
    const navMenu = document.querySelector('.menu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    function atualizarHeader() {
        const menuAberto = navMenu && navMenu.classList.contains('ativo');

        if (window.scrollY > 50 || menuAberto) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            header.style.height = '100px'; 
            
            if(logo) {
                logo.style.height = '90px'; 
                logo.style.marginTop = '0px'; 
            }
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.height = '120px'; 
            
            if(logo) {
                logo.style.height = '100px'; 
                logo.style.marginTop = '10px'; 
            }
        }
    }

    if (header) {
        window.addEventListener('scroll', atualizarHeader);
    }

  if (menuIcon && navMenu) {
        menuIcon.addEventListener('click', function() {
            navMenu.classList.toggle('ativo');
            menuIcon.classList.toggle('ativo'); /* <-- ADICIONE ESSA LINHA AQUI */
            atualizarHeader();
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('ativo');
                menuIcon.classList.remove('ativo'); /* <-- ADICIONE ESSA LINHA AQUI TAMBÉM */
                atualizarHeader();
            });
        });
    }

    // ==========================================
    // 2. LIGHTBOX COM NAVEGAÇÃO POR GRUPO (ÁLBUM)
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    const counter = document.getElementById('counter');
    const fechar = document.querySelector('.fechar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Variáveis de estado do álbum atual
    let imagensDoAlbum = []; 
    let indiceAtual = 0;

    if (lightbox && lightboxImg) {
        
        // CORREÇÃO 1: Atualizado para '.mosaico-album img'
        const gatilhosImagens = document.querySelectorAll('.galeria-container img, .mosaico-album img');

        gatilhosImagens.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                // --- LÓGICA DE AGRUPAMENTO (ÁLBUM) ---
                
                // CORREÇÃO 2: Atualizado para buscar o '.mosaico-album'
                const containerPai = img.closest('.mosaico-album') || img.closest('.galeria-container');
                
                if (containerPai) {
                    // Criar a lista de imagens deste álbum específico
                    imagensDoAlbum = Array.from(containerPai.querySelectorAll('img'));
                    
                    // Se estivermos na roleta da home (que tem clones), precisamos filtrar
                    if (containerPai.classList.contains('galeria-container')) {
                        const totalOriginais = containerPai.querySelectorAll('.galeria-item').length || (imagensDoAlbum.length / 2);
                        imagensDoAlbum = imagensDoAlbum.slice(0, totalOriginais);
                    }

                    // Encontrar o índice da imagem clicada dentro deste álbum
                    indiceAtual = imagensDoAlbum.indexOf(img);
                    
                    if (indiceAtual === -1) indiceAtual = 0;

                    abrirLightbox();
                } else {
                    // Fallback caso não esteja num grupo
                    imagensDoAlbum = [img];
                    indiceAtual = 0;
                    abrirLightbox();
                }
            });
        });

        // --- FUNÇÕES DE NAVEGAÇÃO ---

        function abrirLightbox() {
            lightbox.classList.add('ativo');
            atualizarConteudoLightbox();
        }

        function fecharLightbox() {
            lightbox.classList.remove('ativo');
        }

        function atualizarConteudoLightbox() {
            const imagemAtiva = imagensDoAlbum[indiceAtual];
            if (!imagemAtiva) return;

            // Define a fonte da imagem grande
            lightboxImg.src = imagemAtiva.src; 
            
            // Tenta pegar a legenda (h3 dentro do overlay se existir)
            const pai = imagemAtiva.parentElement;
            const overlayTitle = pai ? pai.querySelector('.overlay h3, h3') : null;
            
            if(caption) {
                caption.innerText = overlayTitle ? overlayTitle.innerText : "";
            }

            // Atualiza o contador (ex: 2 / 5)
            if (counter) {
                counter.innerText = `${indiceAtual + 1} / ${imagensDoAlbum.length}`;
            }

            // Esconde setas se houver apenas uma imagem no grupo
            if (imagensDoAlbum.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        }

        function proximaImg() {
            indiceAtual = (indiceAtual + 1) % imagensDoAlbum.length;
            atualizarConteudoLightbox();
        }

        function imgAnterior() {
            indiceAtual = (indiceAtual - 1 + imagensDoAlbum.length) % imagensDoAlbum.length;
            atualizarConteudoLightbox();
        }

        // --- EVENT LISTENERS (CLIQUES) ---
        if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); proximaImg(); });
        if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); imgAnterior(); });

        if(fechar) fechar.addEventListener('click', fecharLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-footer')) {
                fecharLightbox();
            }
        });

        // --- NAVEGAÇÃO POR TECLADO ---
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('ativo')) return; 

            if (e.key === 'Escape') fecharLightbox();
            if (e.key === 'ArrowRight') proximaImg();
            if (e.key === 'ArrowLeft') imgAnterior();
        });
    }

    // ==========================================
    // 3. ROLETA INTERATIVA (Arrastar e Rolar Automático)
    // ==========================================
    const roleta = document.querySelector('.galeria-container.roleta-track');

    if (roleta) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let roletaInterval;

        const imagensRoleta = roleta.querySelectorAll('img');
        imagensRoleta.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        const itens = Array.from(roleta.children);
        itens.forEach(item => {
            const clone = item.cloneNode(true);
            roleta.appendChild(clone);
        });

        function startRoleta() {
            stopRoleta(); 
            roletaInterval = setInterval(() => {
                roleta.scrollLeft += 1.5; 
                if (roleta.scrollLeft >= roleta.scrollWidth / 2) {
                    roleta.scrollLeft = 0;
                }
            }, 20); 
        }

        function stopRoleta() {
            clearInterval(roletaInterval);
        }

        startRoleta();

        roleta.addEventListener('mouseenter', stopRoleta);
        roleta.addEventListener('touchstart', stopRoleta, { passive: true });

        roleta.addEventListener('mouseleave', () => {
            isDown = false;
            roleta.style.cursor = 'grab';
            startRoleta();
        });
        roleta.addEventListener('touchend', startRoleta);

        roleta.addEventListener('mousedown', (e) => {
            isDown = true;
            roleta.style.cursor = 'grabbing';
            startX = e.pageX - roleta.offsetLeft;
            scrollLeft = roleta.scrollLeft;
            stopRoleta(); 
        });

        roleta.addEventListener('mouseup', () => {
            isDown = false;
            roleta.style.cursor = 'grab';
            startRoleta();
        });

        roleta.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); 
            const x = e.pageX - roleta.offsetLeft;
            const walk = (x - startX) * 2; 
            roleta.scrollLeft = scrollLeft - walk;
        });
    }
});