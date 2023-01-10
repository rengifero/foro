import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  
})

export class AddStudentComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selected?:boolean;
  @ViewChild('chipList', {static: false}) chipList;
  @ViewChild('resetStudentForm', {static: true}) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  studentForm: FormGroup;
  subjectArray: Subject[] = [];
  SectioinArray: any = ['soy miembro iglesia','por un conocido', 'miembro de la iglesia', 'por iglesia local', 'lugar de trabajo', 'publicidad', 'otro'];

  ngOnInit() {
    this.submitBookForm();  
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
       //private studentApi: ApiService
      private studentApi: ApiService
  ) { }

  /* Reactive book form */
  submitBookForm() {
    this.studentForm = this.fb.group({
      student_name: ['', [Validators.required]],
      student_phone: ['',[Validators.required]],
      //student_email: ['', [Validators.required],[ Validators.email]],
      student_email: ['',[ Validators.email]],
      section: ['', [Validators.required]],
      student_university: [''],
      student_faculty: [''],
      student_comment: [''],
      student_ocupation: [''],
      subjects: [this.subjectArray],
     // dob: ['', [Validators.required]],
      gender: ['Male']
    })
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove dynamic languages */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }  

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  }  

  /* Submit book */
  submitStudentForm() {
    if (this.studentForm.valid) {

      

      this.studentApi.AddStudent(this.studentForm.value).subscribe(res => {
        this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
      });

      alert('SUCCESS!!');

    }
  }

}