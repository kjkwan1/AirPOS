import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [],
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent {

}
