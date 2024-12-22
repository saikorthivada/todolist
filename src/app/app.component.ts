import { Component, inject, model, signal, Signal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';

interface ITodo {
  id: number;
  description: string;
  done: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatCardModule, MatCheckboxModule, FormsModule, CommonModule, MatDialogModule]
})
export class AppComponent {
  todoList = signal<ITodo[]>([]);

  description = model('');

  readonly dialog = inject(MatDialog);

  selectedIndex: number = -1;

  save(): void {
    const obj: ITodo = {
      description: this.description(),
      done: false,
      id: this.todoList().length + 1
    };
    this.todoList().push(obj);
    this.description.set('');
  }

  checkmarkChanged(index: number): void {
    this.todoList()[index].done = !this.todoList()[index].done;
    this.todoList.set(this.todoList());
  }

  deleteConfirmation(index: number): void {
    this.dialog.open(ConfirmationComponent, {
      width: '250px'
    }).afterClosed().subscribe((res: any) => {
      if (res === 'YES') {
        this.todoList().splice(index, 1);
      }
    });
  }

  editItem(index: number, item: ITodo): void {
    this.selectedIndex = index;
    this.description.set(item.description);
  }

  updateItem() {
    if (this.selectedIndex >= 0) {
      this.todoList()[this.selectedIndex].description = this.description();
      this.description.set('');
      this.selectedIndex = -1;
    }
  }
}
