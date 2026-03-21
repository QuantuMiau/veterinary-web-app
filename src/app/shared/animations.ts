import { trigger, transition, style, animate, query, animateChild, group } from '@angular/animations';

export const modalOverlayAnimation = trigger('modalOverlayAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0 }))
  ])
]);

export const modalContentAnimation = trigger('modalContentAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(15px) scale(0.98)' }),
    animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(15px) scale(0.98)' }))
  ])
]);
