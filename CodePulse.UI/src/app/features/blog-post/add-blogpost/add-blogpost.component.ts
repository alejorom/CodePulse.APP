import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  isImageSelectorVisible : boolean = false;

  imageSelectSubscricption?: Subscription;

  constructor (private blogPostService : BlogPostService,
    private router : Router,
    private categoryService: CategoryService,
    private imageService: ImageService ) 
  {
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectSubscricption = this.imageService.onSelectImage()
      .subscribe({
        next: (response) => {
          if (this.model) {
            this.model.featuredImageUrl = response.url;
            this.isImageSelectorVisible = false;
          }
        }
      }
    )
  }

  onFormSubmit() : void {
    this.blogPostService.createBlogPost(this.model)
      .subscribe({
          next : (response) => {
            this.router.navigateByUrl('admin/blogposts');
          }
      });
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() : void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.imageSelectSubscricption?.unsubscribe();
  }

}
