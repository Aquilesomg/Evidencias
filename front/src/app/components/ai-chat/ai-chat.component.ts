import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html'
})
export class AiChatComponent {
  isOpen = false;
  userInput = '';
  isLoading = false;
  conversation: any[] = [];
  
  messages: { sender: 'user' | 'ai', text: string }[] = [
    { sender: 'ai', text: 'Hola, soy tu asistente personal AURA. ¿Cómo puedo ayudarte a encontrar tu fragancia ideal hoy?' }
  ];

  constructor(private aiService: AiService) { }

  toggleChat() { this.isOpen = !this.isOpen; }

  sendMessage() {
    const question = this.userInput.trim();
    if (!question) return;

    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';
    this.isLoading = true;

    this.aiService.ask(question, this.conversation).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messages.push({ sender: 'ai', text: response.answer });
        this.conversation.push({ role: 'user', parts: [{ text: question }] });
        this.conversation.push({ role: 'model', parts: [{ text: response.answer }] });
      },
      error: (err) => {
        this.isLoading = false;
        this.messages.push({ sender: 'ai', text: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.' });
        console.error(err);
      }
    });
  }
}