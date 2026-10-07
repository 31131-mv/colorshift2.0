/**
 * ============================================================================
 * COLOR SHIFT - Jogo de Plataforma 2D
 * Desenvolvido em HTML5, CSS3 e JavaScript Puro (Sem bibliotecas externas)
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================
  // 1. CONFIGURAÇÕES GERAIS E PALETA DE CORES
  // ==========================================
  const CANVAS_WIDTH = 960;
  const CANVAS_HEIGHT = 540;

  const COLOR_PALETTE = {
    blue: {
      name: 'AZUL',
      hex: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.6)',
      fill: 'rgba(0, 240, 255, 0.25)',
      dark: '#005f73'
    },
    red: {
      name: 'VERMELHO',
      hex: '#ff2a6d',
      glow: 'rgba(255, 42, 109, 0.6)',
      fill: 'rgba(255, 42, 109, 0.25)',
      dark: '#730026'
    },
    green: {
      name: 'VERDE',
      hex: '#05ffa1',
      glow: 'rgba(5, 255, 161, 0.6)',
      fill: 'rgba(5, 255, 161, 0.25)',
      dark: '#005c38'
    },
    neutral: {
      name: 'NEUTRO',
      hex: '#64748b',
      glow: 'rgba(148, 163, 184, 0.4)',
      fill: 'rgba(100, 116, 139, 0.35)',
      dark: '#334155'
    }
  };

  // ==========================================
  // 2. DADOS E CONFIGURAÇÃO DAS 5 FASES
  // ==========================================
  // Todas as fases foram matematicamente balanceadas para que o pulo
  // alcance qualquer plataforma necessária com folga e segurança.
  const LEVELS = [
    // ----------------------------------------------------
    // FASE 1: TUTORIAL (Movimento, pulo, troca de cor)
    // ----------------------------------------------------
    {
      id: 1,
      name: 'PRIMEIROS PASSOS',
      subtitle: 'Aprenda a mover, pular e trocar de cor',
      spawn: { x: 70, y: 390 },
      door: { x: 865, y: 208, w: 34, h: 52 },
      platforms: [
        // Chão de início (Neutro - sempre sólido)
        { x: 30, y: 440, w: 230, h: 40, color: 'neutral' },
        // Degrau suave
        { x: 220, y: 400, w: 60, h: 40, color: 'neutral' },
        // Plataforma Azul (o jogador já inicia azul)
        { x: 310, y: 380, w: 100, h: 22, color: 'blue' },
        // Ilha de descanso neutra
        { x: 440, y: 380, w: 90, h: 22, color: 'neutral' },
        // Plataforma Vermelha (necessário pressionar 2)
        { x: 560, y: 340, w: 100, h: 22, color: 'red' },
        // Ilha neutra
        { x: 690, y: 340, w: 60, h: 22, color: 'neutral' },
        // Plataforma Verde (necessário pressionar 3)
        { x: 770, y: 300, w: 90, h: 22, color: 'green' },
        // Plataforma da Porta
        { x: 850, y: 260, w: 90, h: 30, color: 'neutral' },
        // Chão de segurança inferior para o tutorial (impossível morrer na fase 1)
        { x: 0, y: 510, w: 960, h: 30, color: 'neutral' }
      ],
      movingPlatforms: [],
      spikes: [],
      // Mola/trampolim no chão inferior caso o jogador caia
      springs: [
        { x: 470, y: 495, w: 40, h: 15, boost: -14.5 }
      ],
      tutorialHints: [
        { x: 130, y: 360, text: 'A / D ou SETAS: Mover  •  ESPAÇO: Pular' },
        { x: 340, y: 310, text: 'Você começa AZUL! Plataformas azuis são sólidas.' },
        { x: 500, y: 280, text: 'Pressione [ 2 ] para mudar para VERMELHO!' },
        { x: 730, y: 230, text: 'Pressione [ 3 ] para mudar para VERDE!' }
      ]
    },

    // ----------------------------------------------------
    // FASE 2: INTRODUÇÃO À TROCA CONTÍNUA DE CORES
    // ----------------------------------------------------
    {
      id: 2,
      name: 'RITMO DAS CORES',
      subtitle: 'Alterne de cor para atravessar o caminho',
      spawn: { x: 60, y: 400 },
      door: { x: 880, y: 178, w: 34, h: 52 },
      platforms: [
        // Chão inicial neutro
        { x: 20, y: 450, w: 130, h: 35, color: 'neutral' },
        // Sequência de plataformas coloridas
        { x: 180, y: 420, w: 85, h: 20, color: 'blue' },
        { x: 295, y: 380, w: 85, h: 20, color: 'red' },
        { x: 410, y: 340, w: 85, h: 20, color: 'green' },
        // Ilha neutra de descanso central
        { x: 525, y: 320, w: 80, h: 22, color: 'neutral' },
        // Segunda sequência
        { x: 635, y: 290, w: 85, h: 20, color: 'blue' },
        { x: 750, y: 260, w: 85, h: 20, color: 'red' },
        // Plataforma da porta
        { x: 860, y: 230, w: 85, h: 30, color: 'neutral' },
        // Chão de segurança com retorno
        { x: 0, y: 510, w: 960, h: 30, color: 'neutral' }
      ],
      movingPlatforms: [],
      spikes: [],
      springs: [
        { x: 300, y: 495, w: 40, h: 15, boost: -14.5 },
        { x: 600, y: 495, w: 40, h: 15, boost: -14.5 }
      ],
      tutorialHints: [
        { x: 340, y: 460, text: 'Troque de cor [ 1, 2, 3 ] antes ou durante o salto!' }
      ]
    },

    // ----------------------------------------------------
    // FASE 3: ESPINHOS E PRECISÃO
    // ----------------------------------------------------
    {
      id: 3,
      name: 'CAMINHO DE ESPINHOS',
      subtitle: 'Cuidado com os espinhos! 3 vidas por fase',
      spawn: { x: 50, y: 390 },
      door: { x: 880, y: 168, w: 34, h: 52 },
      platforms: [
        // Início neutro seguro
        { x: 20, y: 440, w: 100, h: 30, color: 'neutral' },
        // Plataformas suspensas sobre os espinhos
        { x: 150, y: 410, w: 90, h: 20, color: 'blue' },
        { x: 275, y: 370, w: 90, h: 20, color: 'red' },
        // Ilha segura no meio
        { x: 395, y: 340, w: 80, h: 22, color: 'neutral' },
        // Próximas plataformas
        { x: 505, y: 310, w: 90, h: 20, color: 'green' },
        { x: 625, y: 280, w: 90, h: 20, color: 'blue' },
        { x: 745, y: 250, w: 85, h: 20, color: 'red' },
        // Plataforma da porta
        { x: 860, y: 220, w: 85, h: 30, color: 'neutral' }
      ],
      movingPlatforms: [],
      spikes: [
        // Fossa de espinhos contínua no chão
        { x: 130, y: 510, w: 730, h: 25 }
      ],
      springs: [],
      tutorialHints: [
        { x: 390, y: 270, text: 'Espinhos tiram 1 vida e retornam ao início da fase!' }
      ]
    },

    // ----------------------------------------------------
    // FASE 4: INTRODUÇÃO ÀS PLATAFORMAS MÓVEIS
    // ----------------------------------------------------
    {
      id: 4,
      name: 'PLATAFORMAS CINÉTICAS',
      subtitle: 'Plataformas móveis coloridas requerem sincronia',
      spawn: { x: 50, y: 390 },
      door: { x: 880, y: 148, w: 34, h: 52 },
      platforms: [
        // Início neutro seguro
        { x: 20, y: 440, w: 100, h: 30, color: 'neutral' },
        // Ilha neutra intermediária
        { x: 370, y: 380, w: 80, h: 22, color: 'neutral' },
        // Plataforma neutra superior
        { x: 600, y: 240, w: 80, h: 22, color: 'neutral' },
        // Plataforma final da porta
        { x: 860, y: 200, w: 85, h: 30, color: 'neutral' }
      ],
      movingPlatforms: [
        // 1. Plataforma Azul que se move na horizontal
        {
          x: 150, y: 410, w: 85, h: 20, color: 'blue',
          minX: 140, maxX: 300, minY: 410, maxY: 410,
          speedX: 1.5, speedY: 0
        },
        // 2. Plataforma Vermelha que se move na vertical (elevador)
        {
          x: 485, y: 360, w: 85, h: 20, color: 'red',
          minX: 485, maxX: 485, minY: 230, maxY: 360,
          speedX: 0, speedY: 1.4
        },
        // 3. Plataforma Verde que se move na horizontal até a porta
        {
          x: 710, y: 210, w: 85, h: 20, color: 'green',
          minX: 700, maxX: 800, minY: 210, maxY: 210,
          speedX: 1.5, speedY: 0
        }
      ],
      spikes: [
        // Espinhos no abismo
        { x: 120, y: 510, w: 740, h: 25 }
      ],
      springs: [],
      tutorialHints: [
        { x: 220, y: 320, text: 'Fique na mesma cor da plataforma móvel para subir nela!' }
      ]
    },

    // ----------------------------------------------------
    // FASE 5: O DESAFIO FINAL (Harmonia de todas as mecânicas)
    // ----------------------------------------------------
    {
      id: 5,
      name: 'O DESAFIO FINAL',
      subtitle: 'Prove seu domínio sobre as cores e alcance a vitória!',
      spawn: { x: 50, y: 410 },
      door: { x: 880, y: 128, w: 34, h: 52 },
      platforms: [
        // Plataforma de largada
        { x: 20, y: 460, w: 90, h: 30, color: 'neutral' },
        // Passos iniciais
        { x: 140, y: 420, w: 80, h: 20, color: 'blue' },
        { x: 250, y: 380, w: 80, h: 20, color: 'green' },
        // Ilha segura intermediária
        { x: 510, y: 330, w: 75, h: 22, color: 'neutral' },
        // Plataforma fixa alta
        { x: 730, y: 190, w: 85, h: 20, color: 'blue' },
        // Plataforma final de vitória da Porta
        { x: 850, y: 180, w: 95, h: 30, color: 'neutral' }
      ],
      movingPlatforms: [
        // Plataforma Vermelha Móvel horizontal
        {
          x: 350, y: 350, w: 80, h: 20, color: 'red',
          minX: 350, maxX: 460, minY: 350, maxY: 350,
          speedX: 1.6, speedY: 0
        },
        // Plataforma Verde Móvel vertical (sobe até o deck final)
        {
          x: 615, y: 310, w: 80, h: 20, color: 'green',
          minX: 615, maxX: 615, minY: 190, maxY: 310,
          speedX: 0, speedY: 1.5
        }
      ],
      spikes: [
        // Fossa completa de espinhos no chão
        { x: 110, y: 510, w: 740, h: 25 }
      ],
      springs: [],
      tutorialHints: []
    },

    // ----------------------------------------------------
    // FASE 6: REFLEXO (Alta velocidade, precisão e trocas rápidas)
    // ----------------------------------------------------
    {
      id: 6,
      name: 'REFLEXO',
      subtitle: 'Trocas ágeis de cor, plataformas menores e saltos cirúrgicos',
      spawn: { x: 50, y: 390 },
      door: { x: 880, y: 118, w: 34, h: 52 },
      platforms: [
        // Plataforma inicial neutra
        { x: 20, y: 440, w: 75, h: 25, color: 'neutral' },
        // Plataformas estreitas com alternância contínua de cores
        { x: 125, y: 410, w: 55, h: 18, color: 'blue' },
        { x: 210, y: 375, w: 52, h: 18, color: 'red' },
        { x: 295, y: 340, w: 52, h: 18, color: 'green' },
        // Ilha neutra de estabilização
        { x: 485, y: 300, w: 55, h: 20, color: 'neutral' },
        // Sequência aérea de alta precisão
        { x: 570, y: 265, w: 50, h: 18, color: 'red' },
        { x: 735, y: 175, w: 50, h: 18, color: 'blue' },
        { x: 810, y: 170, w: 50, h: 18, color: 'red' },
        // Plataforma da porta
        { x: 865, y: 170, w: 80, h: 25, color: 'neutral' }
      ],
      movingPlatforms: [
        // 1. Plataforma móvel azul horizontal
        {
          x: 375, y: 310, w: 58, h: 18, color: 'blue',
          minX: 370, maxX: 450, minY: 310, maxY: 310,
          speedX: 1.8, speedY: 0
        },
        // 2. Elevador móvel verde vertical
        {
          x: 645, y: 260, w: 54, h: 18, color: 'green',
          minX: 645, maxX: 645, minY: 175, maxY: 265,
          speedX: 0, speedY: 1.7
        }
      ],
      spikes: [
        // Fossa de espinhos no solo
        { x: 95, y: 510, w: 845, h: 25 },
        // Espinho suspenso de precisão
        { x: 420, y: 380, w: 40, h: 20 }
      ],
      springs: [],
      tutorialHints: []
    },

    // ----------------------------------------------------
    // FASE 7: LABIRINTO (Raciocínio, caminhos e alternância seletiva)
    // ----------------------------------------------------
    {
      id: 7,
      name: 'LABIRINTO',
      subtitle: 'Navegue pelo labirinto de cores e encontre a rota correta',
      spawn: { x: 50, y: 400 },
      door: { x: 885, y: 118, w: 34, h: 52 },
      platforms: [
        // Início neutro
        { x: 20, y: 450, w: 75, h: 25, color: 'neutral' },
        // Rota inferior (aparente atalho bloqueado por espinhos visíveis)
        { x: 120, y: 450, w: 65, h: 18, color: 'green' },
        { x: 205, y: 450, w: 65, h: 18, color: 'red' },
        // Rota superior verdadeira de escalada
        { x: 125, y: 400, w: 65, h: 18, color: 'blue' },
        { x: 215, y: 350, w: 65, h: 18, color: 'red' },
        { x: 305, y: 300, w: 65, h: 18, color: 'green' },
        // Encruzilhada central (Ilha neutra)
        { x: 395, y: 260, w: 65, h: 20, color: 'neutral' },
        // Rota alta com obstáculo de espinho visível à frente
        { x: 485, y: 220, w: 60, h: 18, color: 'red' },
        // Rota intermediária correta
        { x: 575, y: 320, w: 65, h: 18, color: 'green' },
        { x: 665, y: 280, w: 60, h: 18, color: 'red' },
        // Passo alto para o portal
        { x: 820, y: 175, w: 55, h: 18, color: 'blue' },
        // Plataforma da porta
        { x: 875, y: 170, w: 75, h: 25, color: 'neutral' }
      ],
      movingPlatforms: [
        // Elevador Azul que liga a Encruzilhada à Rota Mediana
        {
          x: 485, y: 330, w: 65, h: 18, color: 'blue',
          minX: 485, maxX: 485, minY: 250, maxY: 340,
          speedX: 0, speedY: 1.5
        },
        // Plataforma Móvel Verde horizontal que atravessa o abismo final
        {
          x: 745, y: 230, w: 65, h: 18, color: 'green',
          minX: 740, maxX: 815, minY: 230, maxY: 230,
          speedX: 1.6, speedY: 0
        }
      ],
      spikes: [
        // Abismo inferior contínuo
        { x: 95, y: 510, w: 845, h: 25 },
        // Espinho de bloqueio na rota baixa falsa
        { x: 285, y: 440, w: 60, h: 20 },
        // Espinhos no teto bloqueando avanço cego superior
        { x: 640, y: 160, w: 60, h: 20 },
        // Espinho divisor no poço central
        { x: 380, y: 440, w: 70, h: 20 }
      ],
      springs: [],
      tutorialHints: []
    },

    // ----------------------------------------------------
    // FASE 8: FINAL: COLOR SHIFT (O Desafio Supremo)
    // ----------------------------------------------------
    {
      id: 8,
      name: 'FINAL: COLOR SHIFT',
      subtitle: 'O clímax definitivo: domine todas as mecânicas!',
      spawn: { x: 40, y: 410 },
      door: { x: 855, y: 88, w: 34, h: 52 },
      platforms: [
        // --- ATO 1: A ESCALADA DE CORES ---
        { x: 20, y: 460, w: 70, h: 25, color: 'neutral' },
        { x: 115, y: 425, w: 50, h: 18, color: 'blue' },
        { x: 190, y: 390, w: 48, h: 18, color: 'red' },
        { x: 265, y: 355, w: 48, h: 18, color: 'green' },
        { x: 445, y: 295, w: 48, h: 18, color: 'blue' },

        // --- ATO 2: O RETORNO CENTRAL E BASE DE APOIO ---
        { x: 435, y: 215, w: 48, h: 18, color: 'red' },
        { x: 350, y: 215, w: 48, h: 18, color: 'blue' },
        { x: 255, y: 215, w: 58, h: 22, color: 'neutral' },

        // --- ATO 3: O CLÍMAX SUPREMO (O MAIOR DESAFIO DO JOGO) ---
        { x: 340, y: 180, w: 45, h: 16, color: 'green' },
        { x: 415, y: 170, w: 45, h: 16, color: 'red' },
        { x: 595, y: 160, w: 45, h: 16, color: 'green' },
        { x: 750, y: 140, w: 46, h: 16, color: 'blue' },
        // Deck final da porta de vitória
        { x: 825, y: 140, w: 90, h: 25, color: 'neutral' }
      ],
      movingPlatforms: [
        // 1. Móvel Vermelho horizontal (Ato 1)
        {
          x: 340, y: 325, w: 52, h: 18, color: 'red',
          minX: 335, maxX: 420, minY: 325, maxY: 325,
          speedX: 1.8, speedY: 0
        },
        // 2. Elevador Verde vertical para o Ato 2
        {
          x: 520, y: 285, w: 52, h: 18, color: 'green',
          minX: 520, maxX: 520, minY: 215, maxY: 285,
          speedX: 0, speedY: 1.6
        },
        // 3. Móvel Azul rápido (Ato 3 - Clímax)
        {
          x: 490, y: 165, w: 48, h: 16, color: 'blue',
          minX: 485, maxX: 565, minY: 165, maxY: 165,
          speedX: 2.0, speedY: 0
        },
        // 4. Elevador Vermelho vertical final até o deck do portal
        {
          x: 670, y: 160, w: 48, h: 16, color: 'red',
          minX: 670, maxX: 670, minY: 135, maxY: 180,
          speedX: 0, speedY: 1.6
        }
      ],
      spikes: [
        // Fossa do abismo inferior
        { x: 90, y: 510, w: 850, h: 25 },
        // Faixa de espinhos intermediária protegendo o Ato 3
        { x: 325, y: 265, w: 410, h: 20 }
      ],
      springs: [],
      tutorialHints: []
    }
  ];

  // ==========================================
  // 3. ESTADO GLOBAL DO JOGO
  // ==========================================
  const GameState = {
    MENU: 'MENU',
    LEVEL_SELECT: 'LEVEL_SELECT',
    HOW_TO_PLAY: 'HOW_TO_PLAY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    LEVEL_WIN: 'LEVEL_WIN',
    GAME_OVER: 'GAME_OVER',
    GAME_WIN: 'GAME_WIN'
  };

  let currentState = GameState.MENU;
  let currentLevelIndex = 0; // 0 a 7
  let lives = 3;
  let unlockedLevel = 1; // De 1 a 8

  // Carrega progresso salvo do localStorage
  try {
    const saved = localStorage.getItem('colorshift_unlocked_level');
    if (saved) {
      unlockedLevel = Math.max(1, Math.min(LEVELS.length, parseInt(saved, 10) || 1));
    }
  } catch (e) {
    unlockedLevel = 1;
  }

  function saveProgress() {
    try {
      localStorage.setItem('colorshift_unlocked_level', unlockedLevel.toString());
    } catch (e) {
      // Falha silenciosa se cookies/storage desabilitados
    }
  }

  // ==========================================
  // 4. ENTIDADE DO JOGADOR
  // ==========================================
  const player = {
    x: 70,
    y: 390,
    w: 24,
    h: 30,
    vx: 0,
    vy: 0,
    color: 'blue', // Começa azul como exigido
    facing: 1, // 1 para direita, -1 para esquerda
    isGrounded: false,
    groundedPlatform: null,
    coyoteTime: 0, // Janela de pulo após sair de bordas
    jumpBuffer: 0, // Janela de buffer de pulo
    squashX: 1,
    squashY: 1,
    respawnTimer: 0
  };

  // Constantes de física balanceadas
  const GRAVITY = 0.58;
  const MOVE_SPEED = 4.3;
  const JUMP_FORCE = -11.6;
  const MAX_FALL_SPEED = 10.5;

  // Estado das teclas
  const keys = {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false
  };

  // Efeitos de partículas
  let particles = [];
  let shockwaves = [];
  let confetti = [];
  let screenShake = 0;

  // Elementos da DOM
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Telas e Modais
  const screenMainMenu = document.getElementById('screen-main-menu');
  const screenLevelSelect = document.getElementById('screen-level-select');
  const screenHowToPlay = document.getElementById('screen-how-to-play');
  const modalPause = document.getElementById('modal-pause');
  const modalGameOver = document.getElementById('modal-game-over');
  const modalLevelWin = document.getElementById('modal-level-win');
  const modalGameWin = document.getElementById('modal-game-win');
  const hudElement = document.getElementById('hud');
  const tutorialToast = document.getElementById('tutorial-toast');
  const tutorialToastText = document.getElementById('tutorial-toast-text');

  // Elementos do HUD
  const hudLevelText = document.getElementById('hud-level-text');
  const hudLivesContainer = document.getElementById('hud-lives');
  const colorBtns = {
    blue: document.getElementById('btn-color-blue'),
    red: document.getElementById('btn-color-red'),
    green: document.getElementById('btn-color-green')
  };

  // Modais - Textos
  const winTitle = document.getElementById('win-title');
  const winLivesStat = document.getElementById('win-lives-stat');

  // ==========================================
  // 5. GERENCIAMENTO DE TELAS E MENUS
  // ==========================================
  function showScreen(screen) {
    const screens = [
      screenMainMenu, screenLevelSelect, screenHowToPlay,
      modalPause, modalGameOver, modalLevelWin, modalGameWin
    ];
    screens.forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });

    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('active');
    }
  }

  function setGameState(newState) {
    currentState = newState;

    switch (newState) {
      case GameState.MENU:
        showScreen(screenMainMenu);
        hudElement.classList.add('hidden');
        tutorialToast.classList.add('hidden');
        break;

      case GameState.LEVEL_SELECT:
        renderLevelSelectGrid();
        showScreen(screenLevelSelect);
        hudElement.classList.add('hidden');
        tutorialToast.classList.add('hidden');
        break;

      case GameState.HOW_TO_PLAY:
        showScreen(screenHowToPlay);
        hudElement.classList.add('hidden');
        tutorialToast.classList.add('hidden');
        break;

      case GameState.PLAYING:
        showScreen(null); // Esconde todos os modais
        hudElement.classList.remove('hidden');
        updateHUD();
        break;

      case GameState.PAUSED:
        showScreen(modalPause);
        break;

      case GameState.GAME_OVER:
        showScreen(modalGameOver);
        break;

      case GameState.LEVEL_WIN:
        winTitle.textContent = `FASE ${currentLevelIndex + 1} CONCLUÍDA!`;
        winLivesStat.textContent = '♥ '.repeat(lives).trim();
        showScreen(modalLevelWin);
        break;

      case GameState.GAME_WIN:
        showScreen(modalGameWin);
        createVictoryConfetti();
        break;
    }
  }

  function renderLevelSelectGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';

    LEVELS.forEach((level, idx) => {
      const card = document.createElement('div');
      const isLocked = level.id > unlockedLevel;
      const isCurrent = idx === currentLevelIndex;

      card.className = `level-card ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`;
      card.innerHTML = `
        <div class="level-num">FASE ${level.id}</div>
        <div class="level-status-icon">${isLocked ? '🔒' : '▶'}</div>
        <div class="level-name-tag">${level.name}</div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => {
          startLevel(idx);
        });
      }

      grid.appendChild(card);
    });
  }

  // ==========================================
  // 6. INICIALIZAÇÃO E CONTROLE DAS FASES
  // ==========================================
  // Clone profundo das plataformas para garantir reinício consistente
  let activePlatforms = [];
  let activeMovingPlatforms = [];
  let activeSpikes = [];
  let activeSprings = [];

  function startLevel(levelIndex) {
    currentLevelIndex = levelIndex;
    const levelData = LEVELS[levelIndex];

    lives = 3;
    player.color = 'blue'; // Personagem começa azul como exigido
    player.facing = 1;

    respawnPlayer();

    // Copia profunda dos dados da fase
    activePlatforms = JSON.parse(JSON.stringify(levelData.platforms));
    activeMovingPlatforms = JSON.parse(JSON.stringify(levelData.movingPlatforms));
    activeSpikes = JSON.parse(JSON.stringify(levelData.spikes));
    activeSprings = JSON.parse(JSON.stringify(levelData.springs || []));

    // Inicializa direções das plataformas móveis
    activeMovingPlatforms.forEach(p => {
      p.dirX = 1;
      p.dirY = -1; // Elevadores iniciam subindo a partir da base
      p.currentX = p.x;
      p.currentY = p.y;
    });

    // Limpa efeitos visuais antigos
    particles = [];
    shockwaves = [];
    confetti = [];

    // Mostra aviso de tutorial se for fase 1
    if (levelIndex === 0) {
      tutorialToastText.textContent = 'Use [ A / D ] ou [ SETAS ] para mover • [ ESPAÇO ] para pular';
      tutorialToast.classList.remove('hidden');
    } else {
      tutorialToast.classList.add('hidden');
    }

    setGameState(GameState.PLAYING);
  }

  function respawnPlayer() {
    const levelData = LEVELS[currentLevelIndex];
    player.x = levelData.spawn.x;
    player.y = levelData.spawn.y;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = false;
    player.groundedPlatform = null;
    player.coyoteTime = 0;
    player.jumpBuffer = 0;
    player.squashX = 1;
    player.squashY = 1;
  }

  function updateHUD() {
    hudLevelText.textContent = `${currentLevelIndex + 1}/${LEVELS.length}`;

    // Atualiza corações de vidas
    hudLivesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.className = `heart ${i < lives ? 'filled' : ''}`;
      heart.textContent = '♥';
      hudLivesContainer.appendChild(heart);
    }

    // Atualiza botão de cor ativo
    Object.keys(colorBtns).forEach(colorKey => {
      if (colorKey === player.color) {
        colorBtns[colorKey].classList.add('active');
      } else {
        colorBtns[colorKey].classList.remove('active');
      }
    });
  }

  // ==========================================
  // 7. MECÂNICA DE TROCA DE COR
  // ==========================================
  function changeColor(newColor) {
    if (currentState !== GameState.PLAYING) return;
    if (player.color === newColor) return;

    player.color = newColor;

    // Efeito de onda de choque e partículas da cor
    createColorShockwave(player.x + player.w / 2, player.y + player.h / 2, newColor);
    createColorBurst(player.x + player.w / 2, player.y + player.h / 2, newColor, 20);

    // Se o jogador estava pisando em uma plataforma que agora NÃO é mais sólida:
    if (player.groundedPlatform &&
        player.groundedPlatform.color !== 'neutral' &&
        player.groundedPlatform.color !== newColor) {
      player.isGrounded = false;
      player.groundedPlatform = null;
    }

    // Se o jogador estiver dentro de uma plataforma que acabou de se tornar sólida:
    // Nós o empurramos suavemente para cima para não ficar preso.
    resolvePlayerEmbedded();

    updateHUD();
  }

  function resolvePlayerEmbedded() {
    const allSolids = getActiveSolidPlatforms();
    for (let plat of allSolids) {
      if (checkOverlap(player, plat)) {
        const feetDepth = (player.y + player.h) - plat.y;
        const headDepth = (plat.y + plat.h) - player.y;

        // Se os pés estão mais perto do topo da plataforma, acomoda no topo
        if (feetDepth <= headDepth) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.isGrounded = true;
          player.groundedPlatform = plat;
        } else {
          // Caso contrário, empurra suavemente para baixo para não ficar preso
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }
  }

  function getActiveSolidPlatforms() {
    const solids = [];

    // Plataformas estáticas
    for (let p of activePlatforms) {
      if (p.color === 'neutral' || p.color === player.color) {
        solids.push(p);
      }
    }

    // Plataformas móveis
    for (let p of activeMovingPlatforms) {
      if (p.color === 'neutral' || p.color === player.color) {
        solids.push(p);
      }
    }

    return solids;
  }

  // ==========================================
  // 8. FÍSICA E COLISÕES
  // ==========================================
  function updatePhysics() {
    if (currentState !== GameState.PLAYING) return;

    // 1. Atualizar plataformas móveis
    updateMovingPlatforms();

    // 2. Movimento horizontal do jogador com resposta instantânea e suave
    let targetVx = 0;
    if (keys.left) {
      targetVx -= MOVE_SPEED;
      player.facing = -1;
    }
    if (keys.right) {
      targetVx += MOVE_SPEED;
      player.facing = 1;
    }

    // Aceleração/fricção rápida (sem inércia arrastada)
    player.vx += (targetVx - player.vx) * 0.35;
    if (Math.abs(player.vx) < 0.05) player.vx = 0;

    // 3. Aplica gravidade
    player.vy += GRAVITY;
    if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;

    // 4. Temporizadores de pulo (Coyote Time & Jump Buffer)
    if (player.isGrounded) {
      player.coyoteTime = 6; // 6 quadros de tolerância
    } else {
      if (player.coyoteTime > 0) player.coyoteTime--;
    }

    if (keys.jumpPressed) {
      player.jumpBuffer = 6; // 6 quadros de buffer
      keys.jumpPressed = false;
    } else if (player.jumpBuffer > 0) {
      player.jumpBuffer--;
    }

    // 5. Execução do pulo
    if (player.jumpBuffer > 0 && (player.isGrounded || player.coyoteTime > 0)) {
      player.vy = JUMP_FORCE;
      player.isGrounded = false;
      player.groundedPlatform = null;
      player.coyoteTime = 0;
      player.jumpBuffer = 0;

      // Deformação de estiramento do pulo
      player.squashX = 0.75;
      player.squashY = 1.35;

      // Partículas de poeira no chão
      createJumpDust(player.x + player.w / 2, player.y + player.h);
    }

    // Controle de altura de pulo variável (soltar espaço corta a subida)
    if (!keys.jump && player.vy < -3.5) {
      player.vy = -3.5;
    }

    // 6. Resolução de colisão em dois eixos (X depois Y) para evitar atravessar cantos
    const solidPlatforms = getActiveSolidPlatforms();

    // Movimento no Eixo X
    player.x += player.vx;
    for (let plat of solidPlatforms) {
      if (checkOverlap(player, plat)) {
        if (player.vx > 0) {
          player.x = plat.x - player.w;
          player.vx = 0;
        } else if (player.vx < 0) {
          player.x = plat.x + plat.w;
          player.vx = 0;
        }
      }
    }

    // Limites laterais do cenário
    if (player.x < 0) {
      player.x = 0;
      player.vx = 0;
    } else if (player.x + player.w > CANVAS_WIDTH) {
      player.x = CANVAS_WIDTH - player.w;
      player.vx = 0;
    }

    // Movimento no Eixo Y
    player.y += player.vy;
    let landedThisFrame = false;

    for (let plat of solidPlatforms) {
      if (checkOverlap(player, plat)) {
        if (player.vy > 0) {
          // Aterrissou em cima da plataforma
          player.y = plat.y - player.h;
          player.vy = 0;
          landedThisFrame = true;
          player.groundedPlatform = plat;

          // Se acabou de aterrissar com impacto
          if (!player.isGrounded) {
            player.squashX = 1.35;
            player.squashY = 0.75;
            createJumpDust(player.x + player.w / 2, player.y + player.h);
          }
        } else if (player.vy < 0) {
          // Bateu a cabeça por baixo
          player.y = plat.y + plat.h;
          player.vy = 0;
        }
      }
    }

    player.isGrounded = landedThisFrame;
    if (!landedThisFrame) {
      player.groundedPlatform = null;
    }

    // 7. Retorno suave da deformação do personagem
    player.squashX += (1 - player.squashX) * 0.18;
    player.squashY += (1 - player.squashY) * 0.18;

    // 8. Checagem de molas/trampolins (fases 1 e 2 para retorno seguro)
    for (let spring of activeSprings) {
      if (checkOverlap(player, spring)) {
        player.vy = spring.boost;
        player.isGrounded = false;
        createJumpDust(spring.x + spring.w / 2, spring.y + spring.h);
        createColorBurst(spring.x + spring.w / 2, spring.y, '#00f0ff', 12);
      }
    }

    // 9. Checagem de Espinhos
    for (let spike of activeSpikes) {
      // Hitbox um pouco reduzida para ser justa com o jogador
      const spikeHitbox = {
        x: spike.x + 3,
        y: spike.y + 4,
        w: spike.w - 6,
        h: spike.h - 4
      };
      if (checkOverlap(player, spikeHitbox)) {
        handlePlayerHit();
        return;
      }
    }

    // 10. Queda no abismo inferior
    if (player.y > CANVAS_HEIGHT + 30) {
      handlePlayerHit();
      return;
    }

    // 11. Checagem da Porta de Saída
    const levelData = LEVELS[currentLevelIndex];
    if (checkOverlap(player, levelData.door)) {
      handleLevelComplete();
    }
  }

  function updateMovingPlatforms() {
    activeMovingPlatforms.forEach(p => {
      const oldX = p.x;
      const oldY = p.y;

      // Movimento X
      if (p.speedX > 0) {
        p.x += p.speedX * p.dirX;
        if (p.x >= p.maxX) {
          p.x = p.maxX;
          p.dirX = -1;
        } else if (p.x <= p.minX) {
          p.x = p.minX;
          p.dirX = 1;
        }
      }

      // Movimento Y
      if (p.speedY > 0) {
        p.y += p.speedY * p.dirY;
        if (p.y >= p.maxY) {
          p.y = p.maxY;
          p.dirY = -1;
        } else if (p.y <= p.minY) {
          p.y = p.minY;
          p.dirY = 1;
        }
      }

      const deltaX = p.x - oldX;
      const deltaY = p.y - oldY;

      // Se o jogador estiver apoiado nesta plataforma e ela for sólida, move o jogador junto!
      if (player.isGrounded && player.groundedPlatform === p) {
        player.x += deltaX;
        player.y += deltaY;
      }
    });
  }

  function checkOverlap(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.y + rect1.h > rect2.y
    );
  }

  // ==========================================
  // 9. DANO, MORTE E REINÍCIO
  // ==========================================
  function handlePlayerHit() {
    lives--;
    screenShake = 14;

    // Efeito de explosão de partículas da cor do jogador
    createColorBurst(player.x + player.w / 2, player.y + player.h / 2, player.color, 30);

    updateHUD();

    if (lives <= 0) {
      setGameState(GameState.GAME_OVER);
    } else {
      // Retorna ao início da fase mantendo o jogo funcionando
      respawnPlayer();
    }
  }

  function handleLevelComplete() {
    createVictoryConfetti();

    // Desbloqueia próxima fase se não estava desbloqueada
    const nextLevelNum = currentLevelIndex + 2;
    if (nextLevelNum > unlockedLevel && nextLevelNum <= LEVELS.length) {
      unlockedLevel = nextLevelNum;
      saveProgress();
    }

    // Se completou a última fase (Fase 8):
    if (currentLevelIndex === LEVELS.length - 1) {
      setGameState(GameState.GAME_WIN);
    } else {
      setGameState(GameState.LEVEL_WIN);
    }
  }

  // ==========================================
  // 10. SISTEMA DE PARTÍCULAS E EFEITOS
  // ==========================================
  function createColorShockwave(x, y, colorKey) {
    const colorInfo = COLOR_PALETTE[colorKey] || COLOR_PALETTE.blue;
    shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: 70,
      color: colorInfo.hex,
      alpha: 1
    });
  }

  function createColorBurst(x, y, colorKey, count = 15) {
    const colorInfo = COLOR_PALETTE[colorKey] || COLOR_PALETTE.blue;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color: colorInfo.hex,
        alpha: 1,
        life: 30 + Math.random() * 20
      });
    }
  }

  function createJumpDust(x, y) {
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 1.5,
        size: 2 + Math.random() * 2,
        color: '#94a3b8',
        alpha: 0.6,
        life: 18
      });
    }
  }

  function createVictoryConfetti() {
    confetti = [];
    const colors = ['#00f0ff', '#ff2a6d', '#05ffa1', '#ffc83b', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      confetti.push({
        x: Math.random() * CANVAS_WIDTH,
        y: -10 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        size: 5 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 180
      });
    }
  }

  function updateParticles() {
    // Ondas de choque
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 3.5;
      sw.alpha = 1 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
      }
    }

    // Partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // Gravidade leve
      p.life--;
      p.alpha = Math.max(0, p.life / 35);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Confetes
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vRot;
      c.life--;
      if (c.y > CANVAS_HEIGHT + 20 || c.life <= 0) {
        confetti.splice(i, 1);
      }
    }

    // Tremor de tela
    if (screenShake > 0) {
      screenShake *= 0.85;
      if (screenShake < 0.2) screenShake = 0;
    }
  }

  // ==========================================
  // 11. RENDERIZAÇÃO NO CANVAS
  // ==========================================
  function render() {
    ctx.save();

    // Tremor de tela quando toma dano
    if (screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * screenShake;
      const shakeY = (Math.random() - 0.5) * screenShake;
      ctx.translate(shakeX, shakeY);
    }

    // Fundo Cyberpunk Escuro com Gradiente
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#0a0d16');
    bgGrad.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grade sutil no fundo
    drawBackgroundGrid();

    // Renderiza apenas se estiver no jogo ou nos modais in-game
    if (currentState === GameState.PLAYING ||
        currentState === GameState.PAUSED ||
        currentState === GameState.LEVEL_WIN ||
        currentState === GameState.GAME_OVER ||
        currentState === GameState.GAME_WIN) {

      // 1. Textos e Dicas de Tutorial no Cenário (Fases 1 a 4)
      drawTutorialWorldHints();

      // 2. Molas/Trampolins
      drawSprings();

      // 3. Espinhos
      drawSpikes();

      // 4. Plataformas Estáticas
      drawPlatforms(activePlatforms);

      // 5. Plataformas Móveis
      drawPlatforms(activeMovingPlatforms, true);

      // 6. Porta de Saída
      drawExitDoor();

      // 7. Jogador
      drawPlayer();

      // 8. Efeitos e Partículas
      drawParticles();
    }

    ctx.restore();
  }

  function drawBackgroundGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  }

  function drawTutorialWorldHints() {
    const levelData = LEVELS[currentLevelIndex];
    if (!levelData.tutorialHints) return;

    ctx.save();
    ctx.font = '600 13px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(240, 244, 252, 0.7)';

    levelData.tutorialHints.forEach(hint => {
      // Pequeno fundo escurecido atrás do texto
      const textWidth = ctx.measureText(hint.text).width;
      ctx.fillStyle = 'rgba(12, 16, 28, 0.75)';
      ctx.beginPath();
      ctx.roundRect(hint.x - textWidth / 2 - 8, hint.y - 15, textWidth + 16, 22, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(240, 244, 252, 0.85)';
      ctx.fillText(hint.text, hint.x, hint.y);
    });

    ctx.restore();
  }

  function drawPlatforms(platformsList, isMoving = false) {
    const isPlayerBlue = player.color === 'blue';
    const isPlayerRed = player.color === 'red';
    const isPlayerGreen = player.color === 'green';

    platformsList.forEach(plat => {
      ctx.save();

      const colorKey = plat.color;
      const colorInfo = COLOR_PALETTE[colorKey] || COLOR_PALETTE.neutral;

      // Determina se a plataforma é sólida agora
      let isSolid = false;
      if (colorKey === 'neutral') isSolid = true;
      else if (colorKey === 'blue' && isPlayerBlue) isSolid = true;
      else if (colorKey === 'red' && isPlayerRed) isSolid = true;
      else if (colorKey === 'green' && isPlayerGreen) isSolid = true;

      if (isSolid) {
        // ==========================================
        // ESTADO SÓLIDO (Cor ativa do jogador ou neutra)
        // ==========================================
        ctx.shadowColor = colorInfo.glow;
        ctx.shadowBlur = 12;

        // Preenchimento gradiente elegante
        const grad = ctx.createLinearGradient(plat.x, plat.y, plat.x, plat.y + plat.h);
        grad.addColorStop(0, colorInfo.hex);
        grad.addColorStop(1, colorInfo.dark);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
        ctx.fill();

        // Borda neon vibrante
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Linha de luz brilhante no topo para máxima clareza do piso
        ctx.beginPath();
        ctx.moveTo(plat.x + 2, plat.y + 1);
        ctx.lineTo(plat.x + plat.w - 2, plat.y + 1);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

      } else {
        // ==========================================
        // ESTADO INTANGÍVEL / TRANSLÚCIDO
        // Jogador consegue atravessar esta plataforma
        // ==========================================
        ctx.shadowBlur = 0;

        // Preenchimento fraco
        ctx.fillStyle = colorInfo.fill;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
        ctx.fill();

        // Borda tracejada (indica claramente que pode atravessar)
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = colorInfo.hex;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Marcador visual de plataforma móvel
      if (isMoving) {
        ctx.setLineDash([]);
        ctx.globalAlpha = isSolid ? 0.9 : 0.4;
        ctx.fillStyle = '#ffffff';
        // Pequena seta ou indicador no centro
        const centerX = plat.x + plat.w / 2;
        const centerY = plat.y + plat.h / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }

  function drawSprings() {
    activeSprings.forEach(spring => {
      ctx.save();
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(spring.x, spring.y, spring.w, spring.h, 3);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Desenho em mola
      ctx.strokeStyle = '#b8860b';
      ctx.beginPath();
      ctx.moveTo(spring.x + 8, spring.y + 3);
      ctx.lineTo(spring.x + spring.w - 8, spring.y + spring.h - 3);
      ctx.stroke();

      ctx.restore();
    });
  }

  function drawSpikes() {
    activeSpikes.forEach(spike => {
      ctx.save();

      const spikeWidth = 14;
      const count = Math.floor(spike.w / spikeWidth);

      for (let i = 0; i < count; i++) {
        const sx = spike.x + i * spikeWidth;
        const sy = spike.y + spike.h;

        // Triângulo afiado
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + spikeWidth / 2, spike.y);
        ctx.lineTo(sx + spikeWidth, sy);
        ctx.closePath();

        // Gradiente de perigo vermelho-alaranjado
        const grad = ctx.createLinearGradient(sx, spike.y, sx, sy);
        grad.addColorStop(0, '#ff1744');
        grad.addColorStop(0.6, '#d50000');
        grad.addColorStop(1, '#2a0808');
        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(255, 23, 68, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.strokeStyle = '#ff8a80';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  function drawExitDoor() {
    const levelData = LEVELS[currentLevelIndex];
    const door = levelData.door;

    ctx.save();

    const time = Date.now() * 0.003;
    const isFinalLevel = currentLevelIndex === LEVELS.length - 1;
    const doorColor = isFinalLevel ? '#ffd700' : '#00f0ff';
    const doorGlow = isFinalLevel ? 'rgba(255, 215, 0, 0.8)' : 'rgba(0, 240, 255, 0.8)';

    // Brilho exterior da porta
    ctx.shadowColor = doorGlow;
    ctx.shadowBlur = 18;

    // Moldura exterior metálica
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = doorColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(door.x, door.y, door.w, door.h, [14, 14, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Vórtice interior animado da saída
    const innerGrad = ctx.createLinearGradient(door.x, door.y, door.x, door.y + door.h);
    innerGrad.addColorStop(0, doorColor);
    innerGrad.addColorStop(0.5, '#0f172a');
    innerGrad.addColorStop(1, doorColor);
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.roundRect(door.x + 5, door.y + 6, door.w - 10, door.h - 8, [10, 10, 0, 0]);
    ctx.fill();

    // Linha de energia oscilante central
    const pulseY = door.y + 12 + ((Math.sin(time) + 1) / 2) * (door.h - 24);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(door.x + 8, pulseY);
    ctx.lineTo(door.x + door.w - 8, pulseY);
    ctx.stroke();

    // Ícone de portal no topo
    ctx.fillStyle = doorColor;
    ctx.font = '10px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', door.x + door.w / 2, door.y - 6);

    ctx.restore();
  }

  function drawPlayer() {
    ctx.save();

    const colorInfo = COLOR_PALETTE[player.color] || COLOR_PALETTE.blue;

    // Centro do jogador para rotação/deformação
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;

    ctx.translate(cx, cy);
    ctx.scale(player.squashX, player.squashY);

    const pw = player.w;
    const ph = player.h;

    // 1. Brilho do Personagem
    ctx.shadowColor = colorInfo.glow;
    ctx.shadowBlur = 15;

    // 2. Corpo do Personagem (Robô Cyber Minimalista)
    const bodyGrad = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.3, colorInfo.hex);
    bodyGrad.addColorStop(1, colorInfo.dark);
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 6);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Viseira Cibernética dos Olhos
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#0f172a';

    const visorW = 16;
    const visorH = 8;
    const visorX = player.facing === 1 ? -3 : -pw / 2 + 2;
    const visorY = -ph / 2 + 6;

    ctx.beginPath();
    ctx.roundRect(visorX, visorY, visorW, visorH, 3);
    ctx.fill();

    // Brilho dos olhos dentro da viseira
    ctx.fillStyle = '#ffffff';
    const eyeX = player.facing === 1 ? visorX + 9 : visorX + 3;
    ctx.beginPath();
    ctx.arc(eyeX, visorY + visorH / 2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Núcleo de Energia no Peito
    ctx.shadowColor = colorInfo.glow;
    ctx.shadowBlur = 8;
    ctx.fillStyle = colorInfo.hex;
    ctx.beginPath();
    ctx.arc(0, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawParticles() {
    ctx.save();

    // Ondas de choque
    shockwaves.forEach(sw => {
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 3;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
    });

    // Partículas regulares
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    // Confetes de vitória
    confetti.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      ctx.restore();
    });

    ctx.restore();
  }

  // ==========================================
  // 12. LOOP PRINCIPAL DO JOGO (60 FPS FIXO)
  // ==========================================
  let lastTime = 0;
  const FIXED_DELTA = 1000 / 60; // 16.66ms por frame fixo

  function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;

    // Atualiza lógica apenas se passou o intervalo do quadro
    if (elapsed >= FIXED_DELTA) {
      lastTime = timestamp - (elapsed % FIXED_DELTA);

      if (currentState === GameState.PLAYING) {
        updatePhysics();
      }

      updateParticles();
    }

    render();

    requestAnimationFrame(gameLoop);
  }

  // ==========================================
  // 13. GERENCIAMENTO DE ENTRADAS (TECLADO E CLIQUES)
  // ==========================================
  window.addEventListener('keydown', e => {
    // Tecla ESC para pausar/despausar
    if (e.code === 'Escape') {
      e.preventDefault();
      if (currentState === GameState.PLAYING) {
        setGameState(GameState.PAUSED);
      } else if (currentState === GameState.PAUSED) {
        setGameState(GameState.PLAYING);
      }
      return;
    }

    // Teclas de Troca de Cor (1, 2, 3)
    if (e.code === 'Digit1' || e.code === 'Numpad1') {
      changeColor('blue');
      return;
    }
    if (e.code === 'Digit2' || e.code === 'Numpad2') {
      changeColor('red');
      return;
    }
    if (e.code === 'Digit3' || e.code === 'Numpad3') {
      changeColor('green');
      return;
    }

    // Movimentação: A / D ou SETAS
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      keys.left = true;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      keys.right = true;
    }

    // Pulo: ESPAÇO ou W ou Seta para Cima
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
      if (!keys.jump) {
        keys.jumpPressed = true;
      }
      keys.jump = true;
      // Previne barra de espaço de rolar a página
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', e => {
    if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
      keys.left = false;
    }
    if (e.code === 'KeyD' || e.code === 'ArrowRight') {
      keys.right = false;
    }
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
      keys.jump = false;
    }
  });

  // ==========================================
  // 14. BINDING DE EVENTOS DOS BOTÕES DA UI
  // ==========================================
  // Botões de Cor no HUD (Clicáveis)
  Object.keys(colorBtns).forEach(colorKey => {
    colorBtns[colorKey].addEventListener('click', () => {
      changeColor(colorKey);
    });
  });

  // Botão de Pausa no HUD
  document.getElementById('btn-pause-hud').addEventListener('click', () => {
    if (currentState === GameState.PLAYING) {
      setGameState(GameState.PAUSED);
    }
  });

  // Menu Principal
  document.getElementById('btn-menu-play').addEventListener('click', () => {
    startLevel(0); // Inicia na Fase 1
  });

  document.getElementById('btn-menu-levels').addEventListener('click', () => {
    setGameState(GameState.LEVEL_SELECT);
  });

  document.getElementById('btn-menu-how').addEventListener('click', () => {
    setGameState(GameState.HOW_TO_PLAY);
  });

  // Seleção de Fases
  document.getElementById('btn-back-from-levels').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });

  // Como Jogar
  document.getElementById('btn-back-from-how').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });
  document.getElementById('btn-play-from-how').addEventListener('click', () => {
    startLevel(0);
  });

  // Menu de Pausa
  document.getElementById('btn-pause-resume').addEventListener('click', () => {
    setGameState(GameState.PLAYING);
  });
  document.getElementById('btn-pause-restart').addEventListener('click', () => {
    startLevel(currentLevelIndex);
  });
  document.getElementById('btn-pause-menu').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });

  // Game Over
  document.getElementById('btn-gameover-restart').addEventListener('click', () => {
    startLevel(currentLevelIndex);
  });
  document.getElementById('btn-gameover-menu').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });

  // Vitória da Fase
  document.getElementById('btn-win-next').addEventListener('click', () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      startLevel(currentLevelIndex + 1);
    } else {
      setGameState(GameState.GAME_WIN);
    }
  });
  document.getElementById('btn-win-menu').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });

  // Vitória Final
  document.getElementById('btn-final-menu').addEventListener('click', () => {
    setGameState(GameState.MENU);
  });

  // ==========================================
  // 15. INÍCIO DA APLICAÇÃO
  // ==========================================
  setGameState(GameState.MENU);
  requestAnimationFrame(gameLoop);

})();
