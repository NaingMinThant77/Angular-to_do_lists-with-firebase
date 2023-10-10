import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  taskArray: any[] = [];
  taskName: string = '';
  apiUrl = 'https://todoapp-e3caf-default-rtdb.asia-southeast1.firebasedatabase.app/todos.json';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  onSubmit() {
    if (this.taskName.trim() !== '') {
      this.taskArray.push({
        taskName: this.taskName,
        isCompleted: false,
      });
      this.taskName = '';
      this.saveTaskToFirebase();
    }
  }

  onDelete(index: number) {
    this.taskArray.splice(index, 1);
    this.saveTaskToFirebase();
  }

  fetchTodos() {
    this.http.get(this.apiUrl).subscribe((data: any) => {
      if (data) {
        this.taskArray = Object.keys(data).map((key) => ({
          taskName: data[key].title,
          isCompleted: data[key].completed,
        }));
      } else {
        this.taskArray = [];
      }
    });
  }

  saveTaskToFirebase() {
    const tasksData = this.taskArray.map((task) => ({
      title: task.taskName,
      completed: task.isCompleted,
    }));

    this.http.put(this.apiUrl, tasksData).subscribe(() => {
      console.log('Data saved to Firebase');
    });
  }
}
