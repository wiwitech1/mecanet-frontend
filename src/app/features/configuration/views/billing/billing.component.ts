import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfigurationPanelComponent } from '../../../../shared/components/configuration-panel/configuration-panel.component';
import { PlanService, Plan, PlanAttribute } from '../../services/plan.service';
import { SubscriptionService, Subscription } from '../../services/subscription.service';
import { forkJoin } from 'rxjs';
import { ConfirmPlanDialogComponent } from './confirm-plan-dialog/confirm-plan-dialog.component';

interface PlanWithAttributes extends Plan {
  attributes: PlanAttribute[];
  isCurrentPlan: boolean;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    ConfigurationPanelComponent,
    MatDialogModule
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnInit {
  plans: PlanWithAttributes[] = [];
  loading = true;
  changingPlan = false;

  constructor(
    private planService: PlanService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPlans();
  }

  private loadPlans() {
    this.loading = true;

    this.planService.getAllPlans().subscribe(plans => {
      forkJoin([
        this.subscriptionService.getCurrentSubscription(),
        ...plans.map(plan => this.planService.getPlanAttributes(plan.id))
      ]).subscribe({
        next: ([subscription, ...planAttributes]) => {
          this.plans = plans.map((plan, index) => ({
            ...plan,
            attributes: planAttributes[index],
            isCurrentPlan: plan.id === subscription.planId
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading plans:', error);
          this.loading = false;
        }
      });
    });
  }

  changePlan(newPlanId: number) {
    if (this.changingPlan) return;

    const selectedPlan = this.plans.find(plan => plan.id === newPlanId);
    if (!selectedPlan) return;

    const dialogRef = this.dialog.open(ConfirmPlanDialogComponent, {
      data: {
        planName: selectedPlan.name,
        planCost: selectedPlan.cost
      },
      panelClass: 'glamorous-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changingPlan = true;
        this.subscriptionService.changePlan(newPlanId).subscribe({
          next: () => {
            this.loadPlans();
            this.changingPlan = false;
          },
          error: (error) => {
            console.error('Error changing plan:', error);
            this.changingPlan = false;
          }
        });
      }
    });
  }
}
