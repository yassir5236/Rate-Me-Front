import { trigger, transition, style, query, group, animate } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0
        })
      ], { optional: true }),

      group([
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('500ms ease', style({ transform: 'translateX(0%)', opacity: 1 }))
        ], { optional: true }),

        query(':leave', [
          style({ transform: 'translateX(0%)', opacity: 1 }),
          animate('500ms ease', style({ transform: 'translateX(-100%)', opacity: 0 }))
        ], { optional: true }),
      ])
    ])
  ]);
