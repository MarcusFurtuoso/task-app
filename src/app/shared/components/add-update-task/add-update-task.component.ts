import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Task, Item } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent implements OnInit {
  @Input() task: Task;
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    items: new FormControl([], [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.user = this.utilsService.getElementFromLocalStorage('user');

    if (this.task) {
      this.form.setValue(this.task);
      this.form.updateValueAndValidity();
    }
  }

  submit() {
    if(this.form.valid) {
      if (this.task) {
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  // Create task
  createTask() {
    let path = `Users/${this.user.uid}`;
    this.utilsService.presentLoading();

    delete this.form.value.id;

    this.firebaseService
      .addToSubCollection(path, 'tasks', this.form.value)
      .then(
        (res) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: 'Task created successfully',
            color: 'success',
            icon: 'checkmark-circle-outline',
            duration: 1500
          });
          this.utilsService.dismissLoading();
        },
        (error) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: error,
            color: 'warning',
            icon: 'alert-circle-outline',
            duration: 5000
          });

          this.utilsService.dismissLoading();
        }
      );
  }

  // Update task
  updateTask() {
    let path = `Users/${this.user.uid}/tasks/${this.task.id}`;

    this.utilsService.presentLoading();
    delete this.form.value.id;

    this.firebaseService
      .updateDocument(path, this.form.value)
      .then(
        (res) => {
          this.utilsService.dismissModal({ success: true });

          this.utilsService.presentToast({
            message: 'Task updated successfully',
            color: 'success',
            icon: 'checkmark-circle-outline',
            duration: 1500
          });
          this.utilsService.dismissLoading();
        },
        (error) => {

          this.utilsService.presentToast({
            message: error,
            color: 'warning',
            icon: 'alert-circle-outline',
            duration: 5000
          });

          this.utilsService.dismissLoading();
        }
      );
  }

  getPercentage() {
    return this.utilsService.getPercentage(this.form.value as Task);
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.form.value.items = ev.detail.complete(this.form.value.items);
    this.form.updateValueAndValidity();
  }

  removeItem(index: number) {
    this.form.value.items.splice(index, 1);
    this.form.controls.items.updateValueAndValidity();
  }

  createItem() {
    this.utilsService.presentAlert({
      header: 'New Task',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Type something...',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (res) => {
            let item: Item = { name: res.name, completed: false };

            this.form.value.items.push(item);
            this.form.controls.items.updateValueAndValidity();
          },
        },
      ],
    });
  }
}
