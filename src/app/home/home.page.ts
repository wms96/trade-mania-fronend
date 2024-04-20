import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContactService} from "../../services/contact.service";
import {IUser} from "../../models/IUser";
import {BehaviorSubject, debounceTime, distinctUntilChanged, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  contacts: IUser[] | undefined
  activeFilters: BehaviorSubject<{ keyword?: string } | null> = new BehaviorSubject<{ keyword?: string } | null>(null);
  private subscriptions: Subscription[] = [];

  constructor(private contactService: ContactService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    const getContactSub = this.activeFilters.pipe(
      debounceTime(300), // Wait for 300 milliseconds after the last event
      distinctUntilChanged(), // Ensure the value has changed before triggering
      switchMap(criteria => {
        return this.contactService.get(criteria?.keyword)
      })
    ).subscribe((data) => {
      this.contacts = data;
    })
    this.subscriptions.push(getContactSub)
  }

  applyFilters(event: CustomEvent): void {
    const searchTerm = (event.detail.value || '').trim();
    this.activeFilters.next({keyword: searchTerm});
  }

}
