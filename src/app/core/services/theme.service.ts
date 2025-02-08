import { Injectable, Renderer2, RendererFactory2, signal, WritableSignal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private theme = signal<Theme>(this.getCurrentTheme());

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    this.initializeTheme();
  }

  private getCurrentTheme(): Theme {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private initializeTheme(): void {
    const theme = this.getCurrentTheme();
    this.setTheme(theme);

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only auto-switch if user hasn't manually set a theme
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  setTheme(newTheme: Theme): void {
    const oldTheme = this.theme();
    this.renderer.removeClass(document.body, `theme-${oldTheme}`);
    this.renderer.addClass(document.body, `theme-${newTheme}`);
    localStorage.setItem('theme', newTheme);
    this.theme.set(newTheme);
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getTheme(): WritableSignal<Theme> {
    return this.theme;
  }
}
