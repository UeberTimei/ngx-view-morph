import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MorphDirective } from './morph.directive';

@Component({
  imports: [MorphDirective],
  template: `<div [morph]="name()" [morphClass]="cls()"></div>`,
})
class HostComponent {
  readonly name = signal<string | null>('card-42');
  readonly cls = signal<string | null>(null);
}

function hostEl(fixture: ComponentFixture<HostComponent>): HTMLElement {
  return fixture.debugElement.query(By.directive(MorphDirective)).nativeElement as HTMLElement;
}

function vtName(fixture: ComponentFixture<HostComponent>): string {
  return hostEl(fixture).style.getPropertyValue('view-transition-name');
}

describe('MorphDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('applies the view-transition-name from the input to the host element', () => {
    fixture.detectChanges();

    expect(vtName(fixture)).toBe('card-42');
  });

  it('updates the view-transition-name when the input changes', () => {
    fixture.detectChanges();

    fixture.componentInstance.name.set('hero');
    fixture.detectChanges();

    expect(vtName(fixture)).toBe('hero');
  });

  it("maps 'auto' to match-element where the browser supports it", () => {
    fixture.componentInstance.name.set('auto');
    fixture.detectChanges();

    const supported = globalThis.CSS?.supports?.('view-transition-name', 'match-element') ?? true;
    expect(vtName(fixture)).toBe(supported ? 'match-element' : '');
  });

  it('clears the view-transition-name when the input is null', () => {
    fixture.detectChanges();

    fixture.componentInstance.name.set(null);
    fixture.detectChanges();

    expect(vtName(fixture)).toBe('');
  });

  it('always scopes its elements with the ngx-morph view-transition-class', () => {
    fixture.detectChanges();

    expect(hostEl(fixture).style.getPropertyValue('view-transition-class')).toBe('ngx-morph');
  });

  it('merges the morphClass input with the ngx-morph scope class', () => {
    fixture.componentInstance.cls.set('list-item');
    fixture.detectChanges();

    expect(hostEl(fixture).style.getPropertyValue('view-transition-class')).toBe(
      'ngx-morph list-item',
    );
  });

  it('forces the single library radius on Cover hosts so both states cannot differ', () => {
    fixture.componentInstance.cls.set('morph-cover');
    fixture.detectChanges();

    expect(hostEl(fixture).style.getPropertyValue('border-radius')).toBe(
      'var(--morph-radius, 16px)',
    );
  });

  it('does not touch border-radius for non-Cover morphs', () => {
    fixture.componentInstance.cls.set('list-item');
    fixture.detectChanges();

    expect(hostEl(fixture).style.getPropertyValue('border-radius')).toBe('');
  });
});
