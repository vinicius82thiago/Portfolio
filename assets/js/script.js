document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MENU MOBILE
    ========================================================= */

    const menuButton = document.querySelector(".menu-button");
    const nav = document.querySelector(".navbar nav");

    if (menuButton && nav) {

        menuButton.addEventListener("click", () => {

            nav.classList.toggle("active");

            const aberto = nav.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                aberto ? "true" : "false"
            );

        });


        nav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =========================================================
       CARROSSEL
    ========================================================= */

    const carousel =
        document.querySelector(".projects-carousel");

    const wrapper =
        document.querySelector(".projects-wrapper");

    const grid =
        document.querySelector(".projects-grid");

    const prevButton =
        document.querySelector(".projects-carousel .prev");

    const nextButton =
        document.querySelector(".projects-carousel .next");


    if (
        !carousel ||
        !wrapper ||
        !grid ||
        !prevButton ||
        !nextButton
    ) {

        console.error(
            "Carrossel: algum elemento não foi encontrado."
        );

        return;
    }


    /* =========================================================
       PROJETOS ORIGINAIS
    ========================================================= */

    const originalCards = [
        ...grid.querySelectorAll(".project-card")
    ];


    if (originalCards.length < 2) {

        console.warn(
            "Carrossel precisa de pelo menos 2 projetos."
        );

        return;
    }


    /* =========================================================
       CORREÇÃO DAS LARGURAS DOS CARDS
    =========================================================

       O seu CSS usa porcentagens no tablet/celular.

       Como .projects-grid tem width: max-content,
       essas porcentagens podem gerar medidas erradas.

       Aqui definimos a largura diretamente de acordo
       com o tamanho do wrapper.

       Desktop  = 3 cards
       Tablet   = 2 cards
       Celular  = 1 card
    */

    function ajustarCards() {

        const larguraWrapper =
            wrapper.clientWidth;

        if (!larguraWrapper) {
            return;
        }


        const larguraTela =
            window.innerWidth;


        let quantidade;


        if (larguraTela <= 700) {

            quantidade = 1;

        } else if (larguraTela <= 1000) {

            quantidade = 2;

        } else {

            quantidade = 3;

        }


        const gap = 14;

        const larguraCard =
            (
                larguraWrapper -
                gap * (quantidade - 1)
            ) / quantidade;


        grid.querySelectorAll(".project-card").forEach(card => {

            card.style.flex =
                `0 0 ${larguraCard}px`;

            card.style.width =
                `${larguraCard}px`;

        });

    }


    /* =========================================================
       CLONES
    =========================================================

       Criamos uma cópia dos projetos no final.

       Original:

       1 2 3 4 5 6

       Clones:

       1 2 3 4 5 6

       Resultado:

       1 2 3 4 5 6 | 1 2 3 4 5 6

       Quando chegarmos no segundo grupo,
       voltamos silenciosamente para o primeiro.
    */

    originalCards.forEach(card => {

        const clone =
            card.cloneNode(true);

        clone.classList.add(
            "carousel-clone"
        );

        grid.appendChild(clone);

    });


    /* =========================================================
       ESTADO
    ========================================================= */

    let animationFrame = null;

    let pausado = false;

    let arrastando = false;

    let ultimoTempo = 0;

    let acumulador = 0;

    let resizeTimer = null;


    /* =========================================================
       VELOCIDADE
    =========================================================

       Pixels por segundo.

       35 = movimento suave
       50 = mais rápido
       70 = rápido

    */

    const VELOCIDADE = 45;


    /* =========================================================
       LARGURA DO PRIMEIRO GRUPO
    ========================================================= */

    function getLarguraGrupoOriginal() {

        /*
         * O segundo grupo começa exatamente depois
         * de todos os cards originais.
         */

        const primeiroOriginal =
            grid.querySelector(".project-card");

        const primeiroClone =
            grid.querySelector(".carousel-clone");


        if (
            !primeiroOriginal ||
            !primeiroClone
        ) {
            return 0;
        }


        return primeiroClone.offsetLeft;

    }


    /* =========================================================
       LOOP AUTOMÁTICO
    ========================================================= */

    function autoplay(tempo) {

        if (!ultimoTempo) {
            ultimoTempo = tempo;
        }


        const delta =
            tempo - ultimoTempo;


        ultimoTempo = tempo;


        if (
            !pausado &&
            !arrastando
        ) {

            /*
             * Converte velocidade por segundo
             * em pixels por frame.
             */

            const movimento =
                (VELOCIDADE * delta) / 1000;


            wrapper.scrollLeft += movimento;


            const larguraGrupo =
                getLarguraGrupoOriginal();


            /*
             * Chegamos ao início dos clones.
             */

            if (
                larguraGrupo > 0 &&
                wrapper.scrollLeft >= larguraGrupo
            ) {

                wrapper.scrollLeft -=
                    larguraGrupo;

            }

        }


        animationFrame =
            requestAnimationFrame(
                autoplay
            );

    }


    /* =========================================================
       COMEÇAR AUTOPLAY
    ========================================================= */

    function iniciarAutoplay() {

        if (animationFrame) {
            return;
        }


        ultimoTempo = 0;

        animationFrame =
            requestAnimationFrame(
                autoplay
            );

    }


    /* =========================================================
       PARAR AUTOPLAY
    ========================================================= */

    function pararAutoplay() {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;

        }

    }


    /* =========================================================
       PAUSA COM MOUSE
    ========================================================= */

    carousel.addEventListener(
        "mouseenter",
        () => {

            pausado = true;

        }
    );


    carousel.addEventListener(
        "mouseleave",
        () => {

            pausado = false;

        }
    );


    /* =========================================================
       TOQUE
    ========================================================= */

    carousel.addEventListener(
        "touchstart",
        () => {

            arrastando = true;

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        () => {

            arrastando = false;

        },
        {
            passive: true
        }
    );


    /* =========================================================
       DESCOBRE O PASSO
    ========================================================= */

    function getPasso() {

        const card =
            grid.querySelector(".project-card");

        if (!card) {
            return 0;
        }


        const largura =
            card.getBoundingClientRect().width;


        const estilo =
            window.getComputedStyle(grid);


        const gap =
            parseFloat(estilo.columnGap) ||
            parseFloat(estilo.gap) ||
            14;


        return largura + gap;

    }


    /* =========================================================
       BOTÃO DIREITO
       ❯
    ========================================================= */

    nextButton.addEventListener(
        "click",
        () => {

            pausado = true;


            const passo =
                getPasso();


            if (!passo) {
                return;
            }


            wrapper.scrollBy({
                left: passo,
                behavior: "smooth"
            });


            /*
             * Retoma o automático depois do clique.
             */

            setTimeout(() => {

                pausado = false;

            }, 800);

        }
    );


    /* =========================================================
       BOTÃO ESQUERDO
       ❮
    ========================================================= */

    prevButton.addEventListener(
        "click",
        () => {

            pausado = true;


            const passo =
                getPasso();


            if (!passo) {
                return;
            }


            /*
             * Se estamos no começo,
             * vamos para o final do primeiro grupo
             * antes de voltar.
             */

            if (wrapper.scrollLeft <= 2) {

                const larguraGrupo =
                    getLarguraGrupoOriginal();


                if (larguraGrupo > 0) {

                    wrapper.scrollLeft =
                        larguraGrupo;

                }

            }


            wrapper.scrollBy({
                left: -passo,
                behavior: "smooth"
            });


            setTimeout(() => {

                pausado = false;

            }, 800);

        }
    );


    /* =========================================================
       REDIMENSIONAMENTO
    ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(() => {

                    const posicao =
                        wrapper.scrollLeft;


                    ajustarCards();


                    /*
                     * Mantém aproximadamente a posição
                     * atual depois do resize.
                     */

                    requestAnimationFrame(() => {

                        wrapper.scrollLeft =
                            posicao;

                    });

                }, 200);

        }
    );


    /* =========================================================
       ESPERA IMAGENS
    ========================================================= */

    function inicializar() {

        ajustarCards();


        /*
         * Começa no primeiro projeto.
         */

        wrapper.scrollLeft = 0;


        /*
         * Inicia o movimento automático.
         */

        iniciarAutoplay();


        console.log(
            "================================="
        );

        console.log(
            "CARROSSEL INICIADO"
        );

        console.log(
            "Projetos:",
            originalCards.length
        );

        console.log(
            "Autoplay: ATIVO"
        );

        console.log(
            "Velocidade:",
            VELOCIDADE,
            "px/s"
        );

        console.log(
            "================================="
        );

    }


    /* =========================================================
       INICIALIZAÇÃO APÓS IMAGENS
    ========================================================= */

    const imagens =
        grid.querySelectorAll("img");


    let imagensCarregadas = 0;


    if (imagens.length === 0) {

        inicializar();

    } else {

        imagens.forEach(img => {

            if (img.complete) {

                imagensCarregadas++;

            } else {

                img.addEventListener(
                    "load",
                    () => {

                        imagensCarregadas++;


                        if (
                            imagensCarregadas ===
                            imagens.length
                        ) {

                            inicializar();

                        }

                    },
                    {
                        once: true
                    }
                );


                img.addEventListener(
                    "error",
                    () => {

                        imagensCarregadas++;


                        if (
                            imagensCarregadas ===
                            imagens.length
                        ) {

                            inicializar();

                        }

                    },
                    {
                        once: true
                    }
                );

            }

        });


        /*
         * Se todas já estavam carregadas.
         */

        if (
            imagensCarregadas ===
            imagens.length
        ) {

            inicializar();

        }

    }

});
