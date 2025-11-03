import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { OnInit } from '@angular/core';

type GameScene = 'start' | 'discovery' | 'queue' | 'wait' | 'end';
type ProcessType = 'RPV' | 'Precatório';
type GameResult = 'rpv' | 'wait' | 'sell';

interface GameState {
  type?: ProcessType;
  valor?: number;
  isAlimentar?: boolean;
  endTitle?: string;
  endDescription?: string;
  endLesson?: string;
}

@Component({
  standalone: true,
  selector: 'app-credor-journey-game',
  imports: [CommonModule],
  animations: [
    trigger('sceneTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
  templateUrl: './credor-journey-game.html',
  styleUrl: './credor-journey-game.scss',
})
export class CredorJourneyGame implements OnInit {
  private readonly TETO_RPV = 84000;

  ngOnInit(): void {

  }

  private router = inject(Router)

  // Estado reativo com signals
  currentScene = signal<GameScene>('start');
  gameState = signal<GameState>({});
  progressBarWidth = signal('0%');
  progressText = signal('Anos se passando...');
  isAnalysing = signal(false);

  // Computed values
  discoveryCardClass = computed(() => {
    const state = this.gameState();
    return `card discovery-card ${state.type === 'RPV' ? 'is-rpv' : 'is-precatorio'}`;
  });

  queueDescription = computed(() => {
    const state = this.gameState();
    if (state.isAlimentar) {
      return "Seu precatório é 'Alimentar'. Você tem prioridade sobre os 'Comuns'. Mesmo assim, a espera pode ser longa. O que você faz?";
    }
    return "Seu precatório é 'Comum'. Você está na fila geral, atrás dos alimentares. A espera será longa. O que você faz?";
  });

  // Método para redirecionar para a rota principal
  exitGame(): void {

    this.router.navigate(['/']);

    // limpar o estado do jogo
    // this.gameState.set({});
    // this.currentScene.set('start');
  }

  // Métodos principais
  startGame(): void {
    this.gameState.set({});
    this.showScene('discovery');
    this.isAnalysing.set(true);

    // Simula análise do processo
    setTimeout(() => {
      const valor = Math.random() * 500000 + 10000;
      this.isAnalysing.set(false);

      if (valor <= this.TETO_RPV) {
        this.gameState.set({ type: 'RPV', valor });
      } else {
        this.gameState.set({
          type: 'Precatório',
          valor,
          isAlimentar: Math.random() < 0.5
        });
      }
    }, 2000);
  }

  showScene(scene: GameScene): void {
    this.currentScene.set(scene);
  }

  goToQueue(): void {
    this.showScene('queue');
  }

  chooseWait(): void {
    this.showScene('wait');
    this.progressBarWidth.set('0%');
    this.progressText.set('Anos se passando...');

    // Simula progresso da espera
    setTimeout(() => {
      this.progressBarWidth.set('100%');
      this.progressText.set('Pagamento Depositado!');

      setTimeout(() => {
        this.finishGame('wait');
      }, 1000);
    }, 500);
  }

  chooseSell(): void {
    this.finishGame('sell');
  }

  finishGame(resultKey: GameResult): void {
    const state = this.gameState();
    let title = "Jornada Concluída!";
    let description = "";
    let lesson = "";

    switch(resultKey) {
      case 'rpv':
        title = "Vitória Rápida!";
        description = `Você recebeu R$ ${state.valor?.toFixed(2)} em 60 dias!`;
        lesson = "<strong>RPV (Requisição de Pequeno Valor)</strong> é o 'caminho rápido' para dívidas abaixo do teto legal (geralmente 60 salários mínimos). Você não precisa esperar na fila de precatórios!";
        break;
      case 'wait':
        title = "Pagamento Recebido!";
        description = `Após a espera na fila, você recebeu R$ ${state.valor?.toFixed(2)} (corrigidos).`;
        lesson = `<strong>Aguardar na Fila</strong> é a opção padrão. Você garante 100% do seu direito, mas o pagamento pode levar anos, seguindo a ordem cronológica e a prioridade do seu crédito (Alimentar ou Comum).`;
        break;
      case 'sell':
        title = "Liquidez Imediata!";
        const valorVenda = (state.valor || 0) * 0.75;
        description = `Você vendeu seu precatório e recebeu R$ ${valorVenda.toFixed(2)} imediatamente!`;
        lesson = `<strong>Cessão de Crédito (Venda)</strong> é um direito seu. Você troca a espera por um desconto (deságio) e recebe o dinheiro agora. É uma decisão financeira estratégica.`;
        break;
    }

    this.gameState.set({
      ...state,
      endTitle: title,
      endDescription: description,
      endLesson: lesson
    });

    this.showScene('end');
  }

  restartGame(): void {
    this.startGame();
  }
}
