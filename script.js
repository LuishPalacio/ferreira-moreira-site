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

    // ==========================================
    // 10. MODAL DE PROCESSO (COMO TRABALHAMOS)
    // ==========================================
    const modalProcesso = document.getElementById('modal-processo');
    if (modalProcesso) {
        const modalTitle = document.getElementById('modal-processo-title');
        const modalBody = document.getElementById('modal-processo-body');
        const modalClose = document.querySelector('.modal-processo-close');
        
        const conteudoFases = {
            1: {
                title: "1. Primeiro contato",
                html: `
                    <p>O atendimento inicial é realizado por telefone ou WhatsApp. Nesse momento, entendemos a necessidade do cliente, apresentamos como funciona a visita técnica, explicamos os custos envolvidos e informamos que o valor da visita poderá ser abatido em caso de fechamento do projeto e/ou da obra.</p>
                `
            },
            2: {
                title: "2. Reunião e visita técnica",
                html: `
                    <p>Realizamos uma reunião presencial para conhecer o local, entender os clientes e levantar as informações iniciais do imóvel. Essa etapa inclui:</p>
                    <ul>
                        <li>Levantamento técnico in loco;</li>
                        <li>Análise das necessidades e objetivos do cliente;</li>
                        <li>Avaliação preliminar do imóvel e do potencial construtivo;</li>
                        <li>Estudo inicial de layout, funcionalidade e aproveitamento dos espaços;</li>
                        <li>Orientações técnicas e arquitetônicas preliminares;</li>
                        <li>Registro fotográfico técnico do local;</li>
                        <li>Verificação inicial de condicionantes técnicas e legais;</li>
                        <li>Alinhamento conceitual para desenvolvimento da proposta comercial.</li>
                    </ul>
                `
            },
            3: {
                title: "3. Elaboração da proposta comercial",
                html: `
                    <p>Com base nas informações levantadas, desenvolvemos o escopo técnico das atividades necessárias, calculamos os serviços envolvidos e estruturamos uma proposta personalizada, clara e compatível com as necessidades do cliente.</p>
                `
            },
            4: {
                title: "4. Apresentação da proposta",
                html: `
                    <p>Realizamos uma reunião para apresentar nosso portfólio, explicar o escopo proposto, esclarecer dúvidas e detalhar os valores de investimento. É o momento de alinhar expectativas, prazos e próximos passos com total transparência.</p>
                `
            },
            5: {
                title: "5. Contrato de prestação de serviços: projeto",
                html: `
                    <p>Após a aprovação da proposta, formalizamos o contrato de prestação de serviços referente ao projeto. O documento define escopo, etapas, prazos, responsabilidades e condições comerciais, garantindo segurança para ambas as partes.</p>
                `
            },
            6: {
                title: "6. Desenvolvimento dos projetos",
                html: `
                    <p>Desenvolvemos o projeto arquitetônico, de interiores e/ou projetos complementares, conforme a necessidade de cada cliente. Essa etapa contempla plantas, cortes, detalhamentos, estudos técnicos e soluções pensadas para unir estética, funcionalidade e viabilidade executiva.</p>
                `
            },
            7: {
                title: "7. Aprovação do projeto",
                html: `
                    <p>O cliente revisa cada detalhe do projeto. Realizamos os ajustes necessários até que a proposta reflita o estilo, as necessidades e os objetivos desejados, reduzindo imprevistos e evitando surpresas durante a execução da obra.</p>
                `
            },
            8: {
                title: "8. Estudo para orçamento da execução",
                html: `
                    <p>Com o projeto aprovado, realizamos uma análise técnica completa para elaboração da proposta de execução. Nessa etapa, desenvolvemos o escopo dos serviços, estimativa de custos, cronograma físico e planejamento inicial da obra.</p>
                `
            },
            9: {
                title: "9. Apresentação da proposta de execução",
                html: `
                    <p>Apresentamos a proposta comercial para execução da obra, incluindo escopo, etapas, valores de investimento e prazos previstos. Também demonstramos nosso portfólio de execução, reforçando a qualidade técnica e o padrão de acabamento da Ferreira Moreira & Associados.</p>
                `
            },
            10: {
                title: "10. Contrato de prestação de serviços: execução",
                html: `
                    <p>Após aprovação da proposta de execução, formalizamos o contrato da obra. O documento detalha os serviços contratados, responsabilidades, prazos, condições de pagamento, garantias e diretrizes técnicas, trazendo segurança, organização e previsibilidade para todo o processo.</p>
                `
            },
            11: {
                title: "11. Execução da obra",
                html: `
                    <p>Executamos as atividades contratadas com responsabilidade técnica, planejamento e controle de qualidade. O cliente também pode contratar o gerenciamento e/ou acompanhamento da obra, garantindo controle rigoroso de prazo, custo, qualidade e fornecedores.</p>
                    <p>Durante essa etapa, o cliente recebe relatórios periódicos e acompanha a evolução de cada fase com clareza e confiança.</p>
                `
            },
            12: {
                title: "12. Entrega",
                html: `
                    <p>A entrega representa a concretização do sonho. Finalizamos a obra com atenção aos detalhes, segurança técnica, acabamento de qualidade e documentação regularizada quando aplicável.</p>
                    <p><strong>As chaves nas mãos. O projeto realizado. O sonho entregue.</strong></p>
                `
            }
        };

        document.querySelectorAll('.fase-icone').forEach(btn => {
            btn.addEventListener('click', () => {
                const fase = btn.getAttribute('data-fase');
                if (conteudoFases[fase]) {
                    modalTitle.innerText = conteudoFases[fase].title;
                    modalBody.innerHTML = conteudoFases[fase].html;
                    modalProcesso.classList.add('ativo');
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => modalProcesso.classList.remove('ativo'));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modalProcesso.classList.remove('ativo');
        });
        document.addEventListener('click', (e) => {
            if (!modalProcesso.classList.contains('ativo')) return;
            if (!e.target.closest('.janela-processo-content') && !e.target.closest('.fase-icone')) {
                modalProcesso.classList.remove('ativo');
            }
        });
    }

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
        let roletaAnimationId;
        let touchTimeoutId;

        const imagensRoleta = roleta.querySelectorAll('img');
        imagensRoleta.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        const itens = Array.from(roleta.children);
        itens.forEach(item => {
            const clone = item.cloneNode(true);
            roleta.appendChild(clone);
        });

        function rolar() {
            roleta.scrollLeft += 1; 
            if (roleta.scrollLeft >= roleta.scrollWidth / 2) {
                roleta.scrollLeft = 0;
            }
            roletaAnimationId = requestAnimationFrame(rolar);
        }

        function startRoleta() {
            stopRoleta(); 
            roletaAnimationId = requestAnimationFrame(rolar);
        }

        function stopRoleta() {
            cancelAnimationFrame(roletaAnimationId);
        }

        startRoleta();

        roleta.addEventListener('mouseenter', stopRoleta);
        roleta.addEventListener('touchstart', () => {
            clearTimeout(touchTimeoutId);
            stopRoleta();
        }, { passive: true });

        roleta.addEventListener('mouseleave', () => {
            isDown = false;
            roleta.style.cursor = 'grab';
            startRoleta();
        });
        roleta.addEventListener('touchend', () => {
            clearTimeout(touchTimeoutId);
            touchTimeoutId = setTimeout(startRoleta, 1000);
        });

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

    // ==========================================
    // DEPOIMENTOS — TOGGLE + NAVEGAÇÃO
    // ==========================================
    const depToggleBtn = document.querySelector('.dep-toggle-btn');
    const depConteudo  = document.getElementById('dep-conteudo');
    const depTrack     = document.querySelector('.dep-track');
    const depDotsEl    = document.querySelector('.dep-dots');

    let depAtual = 0;
    const depCards = depTrack ? Array.from(depTrack.querySelectorAll('.depoimento-card')) : [];

    function getCardsPorPagina() {
        return window.innerWidth > 768 ? 2 : 1;
    }

    function irParaDep(index) {
        if (!depCards.length) return;
        const cardsPorPagina = getCardsPorPagina();
        const numPaginas = Math.ceil(depCards.length / cardsPorPagina);

        depAtual = (index + numPaginas) % numPaginas;

        const startIndex = depAtual * cardsPorPagina;
        const endIndex = startIndex + cardsPorPagina;

        depCards.forEach((card, i) => {
            const isAtivo = i >= startIndex && i < endIndex;
            card.classList.toggle('dep-ativo', isAtivo);
        });

        if (depDotsEl) {
            depDotsEl.querySelectorAll('.dep-dot').forEach((d, i) => d.classList.toggle('ativo', i === depAtual));
        }
    }

    if (depTrack && depDotsEl) {
        const atualizarDots = () => {
            depDotsEl.innerHTML = '';
            const numPaginas = Math.ceil(depCards.length / getCardsPorPagina());
            for (let i = 0; i < numPaginas; i++) {
                const dot = document.createElement('button');
                dot.className = 'dep-dot' + (i === depAtual ? ' ativo' : '');
                dot.setAttribute('aria-label', 'Depoimentos página ' + (i + 1));
                dot.addEventListener('click', () => irParaDep(i));
                depDotsEl.appendChild(dot);
            }
        };

        atualizarDots();

        window.addEventListener('resize', () => {
            const numPaginasAtuais = Math.ceil(depCards.length / getCardsPorPagina());
            if (depDotsEl.children.length !== numPaginasAtuais) {
                depAtual = 0;
                atualizarDots();
                irParaDep(0);
            }
        });

        document.querySelector('.dep-prev')?.addEventListener('click', () => irParaDep(depAtual - 1));
        document.querySelector('.dep-next')?.addEventListener('click', () => irParaDep(depAtual + 1));

        irParaDep(0);
    }

    if (depToggleBtn && depConteudo) {
        depToggleBtn.addEventListener('click', () => {
            const aberto = depConteudo.classList.toggle('aberto');
            depToggleBtn.setAttribute('aria-expanded', aberto);
        });
    }

    // ==========================================
    // 11. MODAL DE ORÇAMENTO
    // ==========================================
    const btnOrcamento = document.getElementById('btn-orcamento');
    const modalOrcamento = document.getElementById('modal-orcamento');
    
    if (btnOrcamento && modalOrcamento) {
        const modalCloseOrcamento = modalOrcamento.querySelector('.modal-orcamento-close');
        const formOrcamento = document.getElementById('form-orcamento');
        const radiosNecessidade = document.getElementsByName('necessidade');
        const inputOutros = document.getElementById('orc-outros-especifique');
        const inputTelefone = document.getElementById('orc-telefone');
        const inputCep = document.getElementById('orc-cep');

        function resetarCampoOutros() {
            if (!inputOutros) return;
            inputOutros.style.display = 'none';
            inputOutros.required = false;
            inputOutros.value = '';
        }

        if (inputTelefone) {
            inputTelefone.addEventListener('input', function (e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            });
        }

        if (inputCep) {
            inputCep.addEventListener('input', function (e) {
                let rawValue = e.target.value.replace(/\D/g, ''); 
                let formattedValue = rawValue;
                
                if (rawValue.length > 5) {
                    formattedValue = rawValue.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = formattedValue;

                // Quando atingir os 8 números do CEP, faz a busca
                if (rawValue.length === 8) {
                    fetch(`https://viacep.com.br/ws/${rawValue}/json/`)
                        .then(res => res.json())
                        .then(data => {
                            if (!data.erro) {
                                document.getElementById('orc-rua').value = data.logradouro || '';
                                const inputBairro = document.getElementById('orc-bairro');
                                if (inputBairro) inputBairro.value = data.bairro || '';
                                document.getElementById('orc-cidade').value = data.localidade || '';
                                document.getElementById('orc-estado').value = data.uf || '';
                                document.getElementById('orc-pais').value = 'Brasil';
                                
                                // Move o foco para o campo "Rua" para o usuário digitar o número da casa
                                document.getElementById('orc-rua').focus();
                            }
                        })
                        .catch(err => console.error("Erro ao buscar CEP:", err));
                }
            });
        }

        btnOrcamento.addEventListener('click', (e) => {
            e.preventDefault();
            modalOrcamento.classList.add('ativo');
        });

        modalCloseOrcamento.addEventListener('click', () => {
            modalOrcamento.classList.remove('ativo');
        });

        modalOrcamento.addEventListener('click', (e) => {
            if (e.target === modalOrcamento) {
                modalOrcamento.classList.remove('ativo');
            }
        });

        radiosNecessidade.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'Outros') {
                    inputOutros.style.display = 'block';
                    inputOutros.required = true;
                } else {
                    inputOutros.style.display = 'none';
                    inputOutros.required = false;
                    inputOutros.value = '';
                }
            });
        });

        formOrcamento.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('orc-nome').value;
            const cep = document.getElementById('orc-cep').value;
            const pais = document.getElementById('orc-pais').value;
            const estado = document.getElementById('orc-estado').value;
            const cidade = document.getElementById('orc-cidade').value;
            const bairro = document.getElementById('orc-bairro') ? document.getElementById('orc-bairro').value : '';
            const rua = document.getElementById('orc-rua').value;
            const email = document.getElementById('orc-email').value;
            const visita = document.getElementById('orc-visita').value;
            const telefone = document.getElementById('orc-telefone').value;
            let necessidadeSelecionada = Array.from(radiosNecessidade).find(r => r.checked)?.value || '';
            if (necessidadeSelecionada === 'Outros') necessidadeSelecionada = 'Outros: ' + inputOutros.value;
            
            const enderecoCompleto = bairro ? `${rua}, ${bairro}, ${cidade} - ${estado}, ${cep}, ${pais}` : `${rua}, ${cidade} - ${estado}, ${cep}, ${pais}`;
            const msg = `Olá, gostaria de solicitar um orçamento!\n\n*Nome completo:* ${nome}\n*Endereço:* ${enderecoCompleto}\n*E-mail:* ${email}\n*Endereço da visita:* ${visita}\n*Contato telefônico:* ${telefone}\n*Necessidade prévia:* ${necessidadeSelecionada}`;
            window.open(`https://wa.me/5511991430703?text=${encodeURIComponent(msg)}`, '_blank');
            modalOrcamento.classList.remove('ativo');
            formOrcamento.reset();
            resetarCampoOutros();
        });
    }

    // ==========================================
    // 12. CARROSSEL DE PARCEIROS
    // ==========================================
    const parceirosCarousel = document.querySelector('.parceiros-carousel');
    const parceirosPrev = document.querySelector('.parceiros-prev');
    const parceirosNext = document.querySelector('.parceiros-next');

    if (parceirosCarousel && parceirosPrev && parceirosNext) {
        const parceirosTrack = parceirosCarousel.querySelector('.parceiros-track');
        
        let isDownParceiros = false;
        let startXParceiros;
        let scrollLeftParceiros;
        let parceirosAnimationId;
        let parceirosTouchTimeoutId;

        // Clona os parceiros para o loop infinito
        const parceirosItens = Array.from(parceirosTrack.children);
        parceirosItens.forEach(item => {
            const clone = item.cloneNode(true);
            parceirosTrack.appendChild(clone);
        });

        // Bloqueia o comportamento padrão de arrastar as imagens (bug visual)
        parceirosCarousel.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        function rolarParceiros() {
            parceirosCarousel.scrollLeft += 1;
            if (parceirosCarousel.scrollLeft >= parceirosCarousel.scrollWidth / 2) {
                parceirosCarousel.scrollLeft = 0;
            }
            parceirosAnimationId = requestAnimationFrame(rolarParceiros);
        }

        function startParceiros() {
            stopParceiros();
            parceirosAnimationId = requestAnimationFrame(rolarParceiros);
        }

        function stopParceiros() {
            cancelAnimationFrame(parceirosAnimationId);
        }

        startParceiros();

        parceirosCarousel.addEventListener('mouseenter', stopParceiros);
        parceirosCarousel.addEventListener('touchstart', () => {
            clearTimeout(parceirosTouchTimeoutId);
            stopParceiros();
        }, { passive: true });

        parceirosCarousel.addEventListener('mouseleave', () => {
            isDownParceiros = false;
            parceirosCarousel.style.cursor = 'grab';
            startParceiros();
        });

        parceirosCarousel.addEventListener('touchend', () => {
            clearTimeout(parceirosTouchTimeoutId);
            parceirosTouchTimeoutId = setTimeout(startParceiros, 1000);
        });

        parceirosCarousel.addEventListener('mousedown', (e) => {
            isDownParceiros = true;
            parceirosCarousel.style.cursor = 'grabbing';
            startXParceiros = e.pageX - parceirosCarousel.offsetLeft;
            scrollLeftParceiros = parceirosCarousel.scrollLeft;
            stopParceiros();
        });

        parceirosCarousel.addEventListener('mouseup', () => {
            isDownParceiros = false;
            parceirosCarousel.style.cursor = 'grab';
            startParceiros();
        });

        parceirosCarousel.addEventListener('mousemove', (e) => {
            if (!isDownParceiros) return;
            e.preventDefault();
            const x = e.pageX - parceirosCarousel.offsetLeft;
            const walk = (x - startXParceiros) * 2;
            parceirosCarousel.scrollLeft = scrollLeftParceiros - walk;
        });

        // Funções para os botões manuais (mantendo um salto suave)
        function scrollParceirosManual(direction) {
            const item = parceirosCarousel.querySelector('.parceiro-item');
            if (!item) return;
            
            const track = parceirosCarousel.querySelector('.parceiros-track');
            const gap = parseInt(window.getComputedStyle(track).gap) || 0;
            
            const scrollStep = item.offsetWidth + gap;

            // Aplica rolagem suave temporária apenas para os botões
            parceirosCarousel.style.scrollBehavior = 'smooth';
            if (direction === 'next') {
                parceirosCarousel.scrollBy({ left: scrollStep });
            } else {
                parceirosCarousel.scrollBy({ left: -scrollStep });
            }
            
            setTimeout(() => { parceirosCarousel.style.scrollBehavior = 'auto'; }, 400);
        }

        parceirosNext.addEventListener('click', () => {
            stopParceiros();
            scrollParceirosManual('next');
            clearTimeout(parceirosTouchTimeoutId);
            parceirosTouchTimeoutId = setTimeout(startParceiros, 1500);
        });

        parceirosPrev.addEventListener('click', () => {
            stopParceiros();
            scrollParceirosManual('prev');
            clearTimeout(parceirosTouchTimeoutId);
            parceirosTouchTimeoutId = setTimeout(startParceiros, 1500);
        });
    }
});
