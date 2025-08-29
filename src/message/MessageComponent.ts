import { Component, Input } from '@angular/core';

type MessageSeverity = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() error: string =  ''; 
  @Input() severity: MessageSeverity = 'info'; 
  
  get icon(): string {
    switch(this.severity) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      default: return 'i';
    }
  }
}