import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myform!: FormGroup;
  errorMessage: string = '';
  users: any[] = [];
  showUserList: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.myform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      gmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@reqres\.in$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  onSubmit() {
    if (this.myform.valid) {
      const data = {
        email: this.myform.value.gmail,
        password: this.myform.value.password
      };

      console.log('email is : ', data.email);
      console.log('password is : ', data.password);

      this.http.post('https://reqres.in/api/login', data).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          if (response && response.token) {
            localStorage.setItem('mytoken', response.token);
            this.getUserList();
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
          this.showUserList = false;
        }
      });
    } else {
      this.myform.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  getUserList() {
    this.http.get('https://reqres.in/api/users?page=2').subscribe({
      next: (response: any) => {
        console.log('Users fetched:', response);
        this.users = response.data;
        this.showUserList = this.users.length > 0;
      },
      error: (error) => {
        console.log('Get users error:', error);
        this.showUserList = false;
      }
    });
  }

  onReset() {
    this.myform.reset();
    localStorage.removeItem('formdata');
    this.users = [];
    this.showUserList = false;
  }
}
