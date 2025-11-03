import { Component } from '@angular/core';
import { FormatCurrency } from '../../utils/format-currency';
import { NgModel, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-main-page',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {

  // modelo reativo para o input de simulação
  valorPrevidencia = 100000;
  // texto explicativo do fluxo
  explanationText = 'Clique nas etapas para ver a explicação detalhada!';
  activeStep = 1;

  formatCurrency = FormatCurrency;

  constructor() {
    this.updateExplanation(1);

  }

  // logica para destacar passo e mudar explicacao
  highlightStep(step: number) {
  this.activeStep = step;
  this.updateExplanation(step);
  }

  updateExplanation(step: number) {
    switch (step) {
      case 1:
      this.explanationText = "Fase 1: A 'Sentença Transitada em Julgado' significa que não há mais recursos, confirmando o direito do credor.";
    break;
      case 2:
      this.explanationText = "Fase 2: O juiz transforma a condenação em um 'Ofício Requisitório' e o envia ao Tribunal.";
    break;
      case 3:
      this.explanationText = "Fase 3: O Tribunal registra, confere a legalidade e expede o título formal: o PRECATÓRIO.";
    break;
      case 4:
      this.explanationText = "Fase 4: O valor deve ser incluído na Lei Orçamentária Anual (LOA) do ano seguinte para pagamento na ordem cronológica de apresentação.";
    break;
    default:
      this.explanationText = 'Clique nas etapas para ver a explicação detalhada!';
    }
  }

  // simulação de opções (aguardar / cessão)
  get valorCessao(): number {
    const desagioRate = 0.20;
  return this.valorPrevidencia * (1 - desagioRate);
  }




}


