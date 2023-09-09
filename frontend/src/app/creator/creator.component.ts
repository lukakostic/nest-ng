
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../post.model';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {

  postForm: FormGroup;
  images: string[] = [];
  @Output() postCreated = new EventEmitter<Post>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      image: ['']
    });
  }

  onAddImage() {
    const image = this.postForm.get('image')!.value;
    if (image) {
      this.images.push(image);
      this.postForm.get('image')!.reset();
    }
  }

  onRemoveImage(index: number) {
    this.images.splice(index, 1);
  }

  onSubmit() {
    const title = this.postForm.get('title')!.value;
    const text = this.postForm.get('text')!.value;
    const post = new Post("","",title, text, this.images);
    this.postCreated.emit(post);
    this.postForm.reset();
    this.images = [];
  }

}