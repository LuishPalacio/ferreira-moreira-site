document.addEventListener('DOMContentLoaded', function() {
    

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
            menuIcon.classList.toggle('ativo');
            menuIcon.setAttribute('aria-expanded', navMenu.classList.contains('ativo'));
            atualizarHeader();
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('ativo');
                menuIcon.classList.remove('ativo');
                menuIcon.setAttribute('aria-expanded', 'false');
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
        
        // --- 2.1 ABRIR LIGHTBOX DA ROLETA NA HOME ---
        const imagensRoleta = document.querySelectorAll('.galeria-container.roleta-track img');
        imagensRoleta.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const containerPai = img.closest('.galeria-container');
                if (containerPai) {
                    imagensDoAlbum = Array.from(containerPai.querySelectorAll('img'));
                    // Filtra clones
                    const totalOriginais = containerPai.querySelectorAll('.foto-item').length || (imagensDoAlbum.length / 2);
                    imagensDoAlbum = imagensDoAlbum.slice(0, totalOriginais);
                    
                    indiceAtual = imagensDoAlbum.indexOf(img);
                    if (indiceAtual === -1) indiceAtual = 0;
                    abrirLightbox();
                }
            });
        });

        // --- 2.2 ABRIR LIGHTBOX DOS ÁLBUNS/LIVROS (Página de Galeria) ---
        const albunsDeLivro = document.querySelectorAll('.livro-container');
        
        albunsDeLivro.forEach(album => {
            const capa = album.querySelector('.livro-capa');
            
            if(capa) {
                capa.addEventListener('click', (e) => {
                    e.stopPropagation();
                    imagensDoAlbum = []; // Reseta a lista
                    
                    // 1. Pega a foto da capa
                    const imgCapa = capa.querySelector('img');
                    if (imgCapa) imagensDoAlbum.push(imgCapa);
                    
                    // 2. Pega todas as fotos ocultas deste álbum específico
                    const fotosOcultas = album.querySelectorAll('.foto-oculta');
                    fotosOcultas.forEach(foto => {
                        imagensDoAlbum.push(foto);
                    });

                    // Define o índice para a primeira foto e abre
                    indiceAtual = 0;
                    abrirLightbox();
                });
            }
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
            
            // Tenta pegar a legenda
            // Se for do álbum de livro, usa o atributo "alt" da imagem para a legenda
            if (imagemAtiva.closest('.livro-container')) {
                if(caption) {
                    caption.innerText = imagemAtiva.alt || "";
                }
            } else {
                // Legenda padrão da roleta
                const pai = imagemAtiva.parentElement;
                const overlayTitle = pai ? pai.querySelector('.overlay h3, h3') : null;
                if(caption) {
                    caption.innerText = overlayTitle ? overlayTitle.innerText : "";
                }
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

    // ==========================================
    // 4. ANIMAÇÕES AO SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealEls.length > 0) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObs.observe(el));
    }

    // ==========================================
    // 5. CONTADOR ANIMADO DE NÚMEROS
    // ==========================================
    function animarContador(el) {
        const alvo = parseInt(el.getAttribute('data-target'));
        const duracao = 2000;
        const passo = alvo / (duracao / 16);
        let atual = 0;
        const timer = setInterval(() => {
            atual += passo;
            if (atual >= alvo) {
                atual = alvo;
                clearInterval(timer);
            }
            el.textContent = Math.floor(atual).toLocaleString('pt-BR');
        }, 16);
    }

    const numerosSection = document.querySelector('#numeros');
    if (numerosSection) {
        let numerosAnimados = false;
        const numerosObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !numerosAnimados) {
                numerosAnimados = true;
                document.querySelectorAll('.numero').forEach(animarContador);
            }
        }, { threshold: 0.5 });
        numerosObs.observe(numerosSection);
    }

    // ==========================================
    // 6. SLIDER ANTES / DEPOIS
    // ==========================================
    const sliderWrapper = document.querySelector('.antes-depois-wrapper');
    if (sliderWrapper) {
        const antesContainer = sliderWrapper.querySelector('.img-antes-container');
        const imgAntes = sliderWrapper.querySelector('.img-antes');
        const divisor = sliderWrapper.querySelector('.slider-divisor');
        let arrastando = false;

        function initSlider() {
            imgAntes.style.width = sliderWrapper.offsetWidth + 'px';
        }

        function moverSlider(clientX) {
            const rect = sliderWrapper.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 2), 98);
            antesContainer.style.width = pct + '%';
            divisor.style.left = pct + '%';
        }

        initSlider();
        window.addEventListener('resize', initSlider);

        sliderWrapper.addEventListener('mousedown', (e) => { arrastando = true; moverSlider(e.clientX); });
        document.addEventListener('mousemove', (e) => { if (arrastando) moverSlider(e.clientX); });
        document.addEventListener('mouseup', () => { arrastando = false; });

        sliderWrapper.addEventListener('touchstart', (e) => { arrastando = true; moverSlider(e.touches[0].clientX); }, { passive: true });
        document.addEventListener('touchmove', (e) => { if (arrastando) moverSlider(e.touches[0].clientX); }, { passive: true });
        document.addEventListener('touchend', () => { arrastando = false; });
    }

    // ==========================================
    // 7. FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-pergunta').addEventListener('click', () => {
            const isAtivo = item.classList.contains('ativo');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('ativo'));
            if (!isAtivo) item.classList.add('ativo');
        });
    });

    // ==========================================
    // 8. BACK TO TOP
    // ==========================================
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visivel', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 9. FILTROS DA GALERIA
    // ==========================================
    const filtros = document.querySelectorAll('.filtro-btn');
    if (filtros.length > 0) {
        const blocos = document.querySelectorAll('.bloco-cliente');
        filtros.forEach(btn => {
            btn.addEventListener('click', () => {
                filtros.forEach(b => b.classList.remove('ativo'));
                btn.classList.add('ativo');
                const cat = btn.getAttribute('data-filtro');
                blocos.forEach(bloco => {
                    const match = cat === 'todos' || bloco.getAttribute('data-categoria') === cat;
                    bloco.classList.toggle('oculto', !match);
                });
            });
        });
    }
});