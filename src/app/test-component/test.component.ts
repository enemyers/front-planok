import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container" style="padding: 20px; margin: 20px; background-color: #f0f0f0; border-radius: 5px;">
      <h2>Componente de Prueba</h2>
      <p>Si puedes ver este mensaje, el componente está funcionando correctamente.</p>
      <p>La hora actual es: {{ currentTime }}</p>
    </div>
  `,
  styles: [`
    .test-container {
      font-family: Arial, sans-serif;
      color: #333;
    }
    h2 {
      color: #0066cc;
    }
  `]
})
export class TestComponent {
  currentTime = new Date().toLocaleTimeString();
}
