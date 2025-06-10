import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CKEditorCloudResult,
  CKEditorModule,
  loadCKEditorCloud,
} from '@ckeditor/ckeditor5-angular';
import {
  DecoupledEditor,
  EditorConfig,
} from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { jsPDF } from 'jspdf';
class CloudinaryUploadAdapter {
  loader: any;
  xhr!: XMLHttpRequest;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'railwayapp'); // your cloudinary preset

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/djnla7qym/image/upload', true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            default: response.secure_url // URL of uploaded image
          });
        } else {
          reject('Upload failed');
        }
      };

      xhr.onerror = () => reject('Upload failed');
      xhr.send(formData);
    }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, CKEditorModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  editMode: boolean = false;
  dataId: any;
  private params = inject(ActivatedRoute);
  private http = inject(HttpClient);
  details: any;

  data = {
    id: 0,
    type: '',
    name: '',
    imageUrl: '',
    Introduction: '',
    Scope_Of_Work: '',
    Future_Enhancements: '',
  };

  public Editor: typeof DecoupledEditor | null = null;
  public config: EditorConfig | null = null;
  public ImageUpload: any; // Declare ImageUpload here


  ngOnInit(): void {
    loadCKEditorCloud({ version: '44.3.0' }).then(this._setupEditor.bind(this));
    this.dataId = this.params.snapshot.paramMap.get('id');
    this.fetchDetails();

    // Check if the configuration includes ImageUpload
    if (this.config?.plugins?.includes(this.ImageUpload)) {
      // Listen for image selection events
      document.addEventListener('change', (event: any) => {
        if (event.target && event.target.type === 'file') {
          this.onImageSelected(event);
        }
      });
    }
  }

  private _setupEditor(cloud: CKEditorCloudResult<{ version: '44.3.0' }>) {
    const { DecoupledEditor, Essentials, Paragraph, Bold, Italic, Underline, Link, List, Image, ImageToolbar, ImageUpload, ImageCaption, ImageStyle } =
      cloud.CKEditor;
    this.Editor = DecoupledEditor;
    this.config = {
      licenseKey:
        'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzI2Njg3OTksImp0aSI6IjNmMDEzNzRjLTFlMTgtNDI2NS05OTIwLWYwZDU0YTI5MThhYiIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiMDMyOGQzNzYifQ.cYE43GaiYA9oZDAFCMtOeq7eGMw5I-GSakmuFnNVqyOsy-FLoajmA4yApiqQXAFlJVUsEr3NsjRGp_Il0bzyRw',
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Underline,
        Link,
        List,
        Image,
        ImageToolbar,
        ImageUpload,
        ImageCaption,
        ImageStyle,
      ],
      toolbar: [
        'undo', 'redo', '|',
        'bold', 'italic', 'underline', '|',
        'link', '|',
        'bulletedList', 'numberedList', '|',
        'uploadImage'
      ],
    };
  }

  public onReady(editor: DecoupledEditor) {
    const element = editor.ui.getEditableElement()!;
    const parent = element.parentElement!;
    parent.insertBefore(editor.ui.view.toolbar.element!, element);

    // 👇 ADD this part to connect CKEditor Image Upload to Cloudinary
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CloudinaryUploadAdapter(loader);
    };
  }


  // public onReady(editor: DecoupledEditor) {
  //   const element = editor.ui.getEditableElement()!;
  //   const parent = element.parentElement!;
  //   parent.insertBefore(editor.ui.view.toolbar.element!, element);
  // }

  toggle() {
    this.editMode = !this.editMode;
  }

  fetchDetails() {
    this.http
      .get('http://localhost:3000/api/routes/getData')
      .subscribe((data: any) => {
        this.details = data.Departments;
        this.data = data.Departments[this.dataId - 1];
        console.log(data);
      });
  }
  uploading: boolean = false;

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'railwayapp'); // MUST be set up in Cloudinary settings
    console.log('File:', file);

    this.uploading = true;

    this.http
      .post('https://api.cloudinary.com/v1_1/djnla7qym/image/upload', formData)
      .subscribe({
        next: (response: any) => {
          this.data.imageUrl = response.secure_url;
          this.uploading = false;
        },
        error: (error) => {
          console.error('Image upload failed:', error);
          this.uploading = false;
        },
      });
  }

  save() {
    const fieldsToCheck = ['Introduction', 'Scope_Of_Work', 'Future_Enhancements'];

    fieldsToCheck.forEach((field) => {
      let value = this.data[field as keyof typeof this.data] as string;
      if (value && typeof value === 'string') {
        const figureMatch = value.match(/<figure class="image">.*?<img [^>]*src="([^"]+)"[^>]*>.*?<\/figure>/);

        if (figureMatch) {
          const imageUrl = figureMatch[1]; // Extracted src URL
          this.data.imageUrl = imageUrl;   // Set to imageUrl

          // Remove the entire <figure>...</figure> block
          value = value.replace(/<figure class="image">.*?<\/figure>/, '');
          (this.data as Record<string, any>)[field] = value;
        }
      }
    });

    // Remove <p> and </p> tags from all fields
    Object.keys(this.data).forEach((key) => {
      if (typeof this.data[key as keyof typeof this.data] === 'string') {
        (this.data as Record<string, any>)[key] = (
          (this.data as Record<string, any>)[key] as string
        )
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '');
      }
    });

    this.details[this.dataId - 1] = { ...this.data };
    this.details[this.dataId - 1].edit = true;

    const newData = this.details;

    console.log(newData);

    this.http
      .post(`http://localhost:3000/api/routes/saveData`, {
        Departments: this.details,
      })
      .subscribe(() => {
        this.editMode = false;
        this.fetchDetails();
        this.downloadPDF();
      });
  }

  download() {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;

    let hasEditableItems = false; // Flag to check for editable items
    let y = margin; // Initial vertical position for text in the PDF

    const addWrappedText = (title: string, text: string) => {
      if (y + 10 >= pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text || 'N/A', usableWidth);
      doc.text(lines, margin, y);
      y += lines.length * 7 + 5;

      if (y >= pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const addImage = (url: string) => {
      if (y + 50 >= pageHeight) {
        // Ensure enough space for the image
        doc.addPage();
        y = margin;
      }
      doc.addImage(url, 'JPEG', margin, y, usableWidth, 50); // Add image with fixed height
      y += 55; // Add spacing after the image
    };

    for (let i = 0; i < this.details.length; i++) {
      if (this.details[i].edit) {
        hasEditableItems = true;

        const {
          name,
          Introduction,
          Scope_Of_Work,
          Future_Enhancements,
          imageUrl,
        } = this.details[i];

        addWrappedText('Name:', name);
        addWrappedText('Introduction:', Introduction);
        addWrappedText('Scope Of Work:', Scope_Of_Work);
        addWrappedText('Future Enhancements:', Future_Enhancements);

        if (imageUrl) {
          addImage(imageUrl); // Add the image
        }

        y += 10;
      }
    }

    if (hasEditableItems) {
      doc.save('CombinedDetails.pdf');
    } else {
      alert('No editable item found. PDF not generated.');
    }
  }
  downloadPDF() {
    const { name, Introduction, Scope_Of_Work, Future_Enhancements, imageUrl } =
      this.data;
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;

    let y = margin; // Initial Y position

    const addWrappedText = (title: string, text: string) => {
      if (y + 10 >= pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(text || 'N/A', usableWidth);
      doc.text(lines, margin, y);
      y += lines.length * 7 + 5;

      if (y >= pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const addImage = (url: string) => {
      if (y + 50 >= pageHeight) {
        doc.addPage();
        y = margin;
      }
      doc.addImage(url, 'JPEG', margin, y, usableWidth, 50); // Add image
      y += 55;
    };

    addWrappedText('Name:', name);
    addWrappedText('Introduction:', Introduction);
    addWrappedText('Scope Of Work:', Scope_Of_Work);
    addWrappedText('Future Enhancements:', Future_Enhancements);

    if (imageUrl) {
      addImage(imageUrl); // Add the image
    }

    const fileName = `${name || 'Details'}.pdf`;
    doc.save(fileName);
  }
}
