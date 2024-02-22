import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  user = {} as User;
  loading: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getTasks();
    this.getUser();
  }

  getUser() {
    return this.user = this.utilsService.getElementFromLocalStorage('user');
  }


  getPercentage(task: Task) {
    return this.utilsService.getPercentage(task);
  }

  async addOrUpdatetask(task?: Task) {
    let res = await this.utilsService.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: {
        task,
      },
      cssClass: '.add-update-modal',
    });

    if(res && res.success) {
      this.getTasks();
    }
  }

  getTasks() {
    let user: User = this.utilsService.getElementFromLocalStorage('user');
    let path = `users/${user.uid}`;

    this.loading = true;

    let sub = this.firebaseService.getSubCollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        console.log(res);
        this.tasks = res;
        sub.unsubscribe();
        this.loading = false;
      }
    });
  }

  confirmDeleteTask(task: Task) {
    this.utilsService.presentAlert({
      header: 'Delete task',
      message: 'Do you want to delete this task?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, delete',
          handler: () => {
            this.deleteTask(task);
          },
        },
      ],
    });
  }

  // Delete task
  deleteTask(task: Task) {
    let path = `users/${this.user.uid}/tasks/${task.id}`;

    this.utilsService.presentLoading();

    this.firebaseService
      .deleteDocument(path)
      .then(
        (res) => {

          this.utilsService.presentToast({
            message: 'Task deleted successfully',
            color: 'success',
            icon: 'checkmark-circle-outline',
            duration: 1500
          });
          this.getTasks();
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


}
