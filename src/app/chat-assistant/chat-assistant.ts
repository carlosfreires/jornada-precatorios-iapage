import { Component, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  from: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-assistant.html',
  styleUrl: './chat-assistant.scss',
})
export class ChatAssistant {
  @ViewChild('messagesBox') messagesBox!: ElementRef<HTMLDivElement>;
  @ViewChild('userInput') userInputRef!: ElementRef<HTMLTextAreaElement>;

  // Estado do chat
  chatOpen = false;
  chatMinimized = false;
  showBadge = true;
  userText = '';
  messages: Message[] = [];
  isTyping = false;

  // Tema
  isLightTheme = true;

  // Sugestões contextuais
  suggestions = [
    'Como funciona o processo de precatórios?',
    'Quais os prazos para recebimento?',
    'Preciso de ajuda com documentação',
    'Como consultar andamento do processo?',
    'Quais são os requisitos para elegibilidade?',
    'O que é natureza alimentar?',
    'Como funciona a cessão de crédito?',
    'Quais são as prioridades de pagamento?'
  ];

  constructor(private renderer: Renderer2, private host: ElementRef) {
    this.initializeChat();
  }

  private initializeChat() {
    this.messages.push({
      from: 'bot',
      text: `Olá! Me chamo PrecatorIA, sou sua assistente especializado em precatórios. Estou aqui para ajudar com dúvidas sobre processos, prazos, documentação e tudo mais relacionado ao tema. Como posso ajudá-lo hoje?`,
      time: this.now()
    });
  }

  now(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.showBadge = false;
      this.chatMinimized = false;
      setTimeout(() => this.focusInput(), 100);
    }
  }

  openChat(): void {
    this.chatOpen = true;
    this.showBadge = false;
    this.chatMinimized = false;
    setTimeout(() => this.focusInput(), 100);
  }

  minimizeChat(): void {
    this.chatMinimized = !this.chatMinimized;
    if (!this.chatMinimized) {
      setTimeout(() => this.focusInput(), 50);
    }
  }

  closeChat(): void {
    this.chatOpen = false;
    this.chatMinimized = false;
  }

  focusInput(): void {
    try {
      this.userInputRef?.nativeElement.focus();
    } catch (e) {
      console.warn('Could not focus input:', e);
    }
  }

  addUserMessage(text: string): void {
    const msg: Message = {
      from: 'user',
      text: this.escapeHtml(text),
      time: this.now()
    };
    this.messages.push(msg);

    setTimeout(() => this.scrollToBottom(), 50);
    this.analyzeAndRespond(text);
  }

  addBotMessage(text: string): void {
    const msg: Message = {
      from: 'bot',
      text: text,
      time: this.now()
    };
    this.messages.push(msg);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom(): void {
    try {
      const el = this.messagesBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (e) {
      console.warn('Could not scroll to bottom:', e);
    }
  }

  async analyzeAndRespond(text: string): Promise<void> {
    this.showTyping();

    try {
      // Delay natural para simular processamento
      const responseDelay = 800 + Math.random() * 400;
      await this.sleep(responseDelay);

      const response = this.generateResponse(text);
      this.hideTyping();
      this.addBotMessage(response);
    } catch (error) {
      console.error('Erro na análise:', error);
      this.hideTyping();
      this.addBotMessage(
        'Desculpe, estou tendo dificuldades técnicas no momento. Por favor, tente novamente ou reformule sua pergunta.'
      );
    }
  }

  generateResponse(userInput: string): string {
    const lower = userInput.toLowerCase();

    // Respostas baseadas em contexto
    const responses = {
      greeting: [
        "Olá! É um prazer conversar com você. Como posso ajudar com seus precatórios hoje?",
        "Oi! Fico feliz em ter você aqui. Em que posso ser útil?",
        "Olá! Espero que esteja tendo um bom dia. Conte-me como posso ajudá-lo."
      ],

      gratitude: [
        "Fico feliz em poder ajudar! Se tiver mais alguma dúvida, estarei aqui.",
        "Por nada! É sempre um prazer auxiliá-lo.",
        "De nada! Fico à disposição para qualquer outra questão."
      ],

      precatorio_definition: [
        "Um precatório é um requerimento de pagamento contra a Fazenda Pública, decorrente de sentença judicial transitada em julgado. Basicamente, é o instrumento pelo qual o poder judiciário ordena o pagamento de uma dívida pelo governo.",
        "Precatório é o título judicial que formaliza o direito de receber valores da Fazenda Pública após decisão final do judiciário. É a forma legal de executar o pagamento de condenações contra o governo."
      ],

      process: [
        "O processo de precatórios envolve várias etapas: inclusão na lista de precatórios, análise documental, previsão orçamentária e finalmente o pagamento. Cada etapa tem seus prazos e requisitos específicos.",
        "O caminho do precatório começa com a sentença judicial, passa pela expedição do precatório, inclusão nas listas anuais, análise pelos órgãos competentes e só então o pagamento. Todo esse processo visa garantir a segurança jurídica e orçamentária."
      ],

      timing: [
        "Os prazos variam bastante conforme o ente público e a complexidade do caso. Em geral, pode levar de 2 a 7 anos, mas cada situação é única. Posso ajudar a entender melhor seu caso específico?",
        "O tempo de espera depende de fatores como o valor, a origem do débito e a capacidade financeira do ente público. Alguns precatórios são pagos mais rapidamente, outros exigem mais paciência."
      ],

      documentation: [
        "Para análise de documentação, geralmente são necessários: cópia autenticada da sentença, comprovantes de atualização cadastral e documentos de identificação. Posso detalhar melhor conforme sua necessidade.",
        "A documentação requer atenção especial. Precisamos verificar a regularidade processual, a qualificação das partes e a conformidade com as exigências legais."
      ],

      alimentar: [
        "Os precatórios de natureza alimentar têm prioridade no pagamento e incluem créditos como salários, vencimentos, proventos de aposentadoria, pensões e indenizações por morte ou invalidez.",
        "Natureza alimentar refere-se aos créditos essenciais para a sobrevivência do credor, como salários, pensões e aposentadorias. Estes têm preferência na fila de pagamento."
      ],

      comum: [
        "Precatórios de natureza comum são aqueles não considerados alimentares, como indenizações por desapropriação ou danos morais. São pagos por ordem cronológica após os alimentares.",
        "Natureza comum abrange créditos que não são essenciais para a subsistência, como indenizações por danos materiais. Estes aguardam sua vez na lista cronológica geral."
      ],

      rpv: [
        "RPV (Requisição de Pequeno Valor) é para créditos abaixo de 60 salários mínimos. Tem tramitação mais rápida e prazos menores que o precatório tradicional.",
        "RPVs são para valores menores e têm processo simplificado, com pagamento muito mais rápido que os precatórios convencionais."
      ],

      default: [
        "Entendi sua questão sobre precatórios. Pode me dar mais detalhes para que eu possa oferecer uma orientação mais precisa?",
        "Compreendo sua dúvida. Para que eu possa ajudá-lo da melhor forma, poderia especificar um pouco mais sua situação?",
        "Interessante sua pergunta. Vou precisar de algumas informações adicionais para dar uma resposta mais direcionada."
      ]
    };

    // Identificação da intenção
    if (/^(olá|oi|ola|bom dia|boa tarde|boa noite)/i.test(lower)) {
      return this.getRandomResponse(responses.greeting);
    }

    if (/(obrigad|agradeço|valeu|grato|agradecido)/i.test(lower)) {
      return this.getRandomResponse(responses.gratitude);
    }

    if (/(precatório|precatórios)/i.test(lower)) {
      if (/(o que é|defin|significa|conceito)/i.test(lower)) {
        return this.getRandomResponse(responses.precatorio_definition);
      } else if (/(como funciona|processo|etapas|passo a passo)/i.test(lower)) {
        return this.getRandomResponse(responses.process);
      } else if (/(tempo|demora|prazo|quando|calendário)/i.test(lower)) {
        return this.getRandomResponse(responses.timing);
      } else if (/(document|papel|requisito|comprovante)/i.test(lower)) {
        return this.getRandomResponse(responses.documentation);
      } else if (/(alimentar|alimentícia)/i.test(lower)) {
        return this.getRandomResponse(responses.alimentar);
      } else if (/(comum|não alimentar|não-alimentar)/i.test(lower)) {
        return this.getRandomResponse(responses.comum);
      } else if (/(rpv|pequeno valor|requisição)/i.test(lower)) {
        return this.getRandomResponse(responses.rpv);
      }
    }

    return this.getRandomResponse(responses.default);
  }

  getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  showTyping(): void {
    this.isTyping = true;
    this.scrollToBottom();
  }

  hideTyping(): void {
    this.isTyping = false;
  }

  async send(): Promise<void> {
    const text = (this.userText || '').trim();
    if (!text) return;

    this.addUserMessage(text);
    this.userText = '';
    this.resetTextarea();
  }

  useSuggestion(suggestion: string): void {
    this.userText = suggestion;
    setTimeout(() => {
      this.send();
      this.focusInput();
    }, 50);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  private resetTextarea(): void {
    if (this.userInputRef?.nativeElement) {
      this.userInputRef.nativeElement.style.height = 'auto';
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para alternar tema (opcional)
  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
  }

}
