import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service'; // Importamos el servicio
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  categories$: Observable<any[]>; // Usaremos un observable para las categorías
  uploadedFiles: File[] = [];
  imagePreviews: string[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService, // Inyectamos el servicio
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      categoryId: [null, Validators.required],
      gender: ['Unisex', Validators.required],
      inspiration: [''],
      notes: this.fb.group({ salida: [''], corazon: [''], fondo: [''] }),
      variations: this.fb.array([], Validators.required)
    });
    // --- CORRECCIÓN: Obtenemos las categorías al inicializar ---
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void { this.addVariation(); }
  get variations(): FormArray { return this.productForm.get('variations') as FormArray; }
  createVariationGroup(): FormGroup { return this.fb.group({ size_ml: ['', Validators.required], price: ['', [Validators.required, Validators.min(0.01)]], stock: [0, [Validators.required, Validators.min(0)]] }); }
  addVariation(): void { this.variations.push(this.createVariationGroup()); }
  removeVariation(index: number): void { this.variations.removeAt(index); }
  
  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) this.handleFiles(files);
  }
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.handleFiles(input.files);
  }
  handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (this.uploadedFiles.length < 4 && file.type.startsWith('image/')) {
        this.uploadedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  removeImage(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

onSubmit(): void {
  if (this.productForm.invalid || this.uploadedFiles.length === 0) {
    this.errorMessage = this.uploadedFiles.length === 0
      ? "Debes subir al menos una imagen."
      : "Por favor, completa todos los campos requeridos.";
    this.productForm.markAllAsTouched();
    return;
  }

  this.errorMessage = null;
  this.successMessage = null;

  const formData = new FormData();

  Object.keys(this.productForm.value).forEach(key => {
    if (key === 'notes') {
      const notesObj = this.productForm.value.notes;
      const notesArray = [
        ...notesObj.salida.split(',').map((n: string) => n.trim()),
        ...notesObj.corazon.split(',').map((n: string) => n.trim()),
        ...notesObj.fondo.split(',').map((n: string) => n.trim())
      ];
      formData.append('notes', JSON.stringify(notesArray));
    } else if (key === 'variations') {
      formData.append('variations', JSON.stringify(this.productForm.value[key]));
    } else {
      formData.append(key, this.productForm.value[key]);
    }
  });

  this.uploadedFiles.forEach(file => formData.append('images', file));

  this.productService.createProduct(formData).subscribe({
    next: () => {
      this.successMessage = '¡Perfume creado y publicado exitosamente!';
      this.productForm.reset({ gender: 'Unisex' });
      this.variations.clear();
      this.addVariation();
      this.uploadedFiles = [];
      this.imagePreviews = [];
      setTimeout(() => this.successMessage = null, 4000);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Ocurrió un error.';
    }
  });
}
}
