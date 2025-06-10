import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorCloudResult, CKEditorModule, loadCKEditorCloud } from '@ckeditor/ckeditor5-angular';
import { DecoupledEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-details2',
  imports: [CommonModule,FormsModule,CKEditorModule],
  templateUrl: './details2.component.html',
  styleUrl: './details2.component.css'
})

export class Details2Component implements OnInit {

  editMode: boolean = false;
    dataId: any;
    private params = inject(ActivatedRoute);
    private http = inject(HttpClient);
    details: any;

    data = {
      id: 0,
      type:'',
      name: '',
      imageUrl: '',
      Introduction: '',
      Scope_Of_Work: '',
      Future_Enhancements: ''
    };

    public Editor: typeof DecoupledEditor | null = null;
    public config: EditorConfig | null = null;

    ngOnInit(): void {
      loadCKEditorCloud({ version: '44.3.0' }).then(this._setupEditor.bind(this));
      this.dataId = this.params.snapshot.paramMap.get('id');
      this.fetchDetails();
    }

    private _setupEditor(cloud: CKEditorCloudResult<{ version: '44.3.0' }>) {
      const { DecoupledEditor, Essentials, Paragraph, Bold, Italic } = cloud.CKEditor;
      this.Editor = DecoupledEditor;
      this.config = {
        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzI2Njg3OTksImp0aSI6IjNmMDEzNzRjLTFlMTgtNDI2NS05OTIwLWYwZDU0YTI5MThhYiIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiMDMyOGQzNzYifQ.cYE43GaiYA9oZDAFCMtOeq7eGMw5I-GSakmuFnNVqyOsy-FLoajmA4yApiqQXAFlJVUsEr3NsjRGp_Il0bzyRw',
        plugins: [Essentials, Paragraph, Bold, Italic],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic']
      };
    }

    public onReady(editor: DecoupledEditor) {
      const element = editor.ui.getEditableElement()!;
      const parent = element.parentElement!;
      parent.insertBefore(editor.ui.view.toolbar.element!, element);
    }

    toggle() {
      this.editMode = !this.editMode;
    }

    fetchDetails() {
      this.http.get('http://localhost:3000/api/routes/getData').subscribe((data: any) => {
        const combined = [...data.Passenger,...data.Operational];
        combined.forEach(item => item.edit = false);

        this.details = {
          Departments: combined
        };
        //this.details = data;
        this.data = { ...this.details.Departments[this.dataId - 1] };
      });
    }

    save() {
      // Remove <p> and </p> from all fields in this.data
      Object.keys(this.data).forEach(key => {
        if (typeof this.data[key as keyof typeof this.data] === 'string') {
          (this.data as Record<string, any>)[key] = ((this.data as Record<string, any>)[key] as string).replace(/<p>/g, '').replace(/<\/p>/g, '');
        }
      });
      this.details.Departments[this.dataId - 1] = { ...this.data };
      this.details.Departments[this.dataId - 1].edit = true; // Set edit to false after saving
      const newData =  this.details ;  // Wrapping in an object to send properly
      console.log(newData)
      this.http.post(`http://localhost:3000/api/routes/saveData`, this.details).subscribe(() => {
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
          doc.setFont("helvetica", "bold");
          doc.text(title, margin, y);
          y += 7;
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(text || 'N/A', usableWidth);
          doc.text(lines, margin, y);
          y += lines.length * 7 + 5;

          if (y >= pageHeight - margin) {
              doc.addPage();
              y = margin;
          }
      };

      const addImage = (url: string) => {
          if (y + 50 >= pageHeight) { // Ensure enough space for the image
              doc.addPage();
              y = margin;
          }
          doc.addImage(url, "JPEG", margin, y, usableWidth, 50); // Add image with fixed height
          y += 55; // Add spacing after the image
      };

      for (let i = 0; i < this.details.Departments.length; i++) {
          if (this.details.Departments[i].edit) {
              hasEditableItems = true;

              const { name, Introduction, Scope_Of_Work, Future_Enhancements, imageUrl } = this.details.Departments[i];

              addWrappedText("Name:", name);
              addWrappedText("Introduction:", Introduction);
              addWrappedText("Scope Of Work:", Scope_Of_Work);
              addWrappedText("Future Enhancements:", Future_Enhancements);

              if (imageUrl) {
                  addImage(imageUrl); // Add the image
              }

              y += 10;
          }
      }

      if (hasEditableItems) {
          doc.save("CombinedDetails.pdf");
      } else {
          alert("No editable item found. PDF not generated.");
      }
  }
  downloadPDF() {
    const { name, Introduction, Scope_Of_Work, Future_Enhancements, imageUrl } = this.data;
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
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 7;
        doc.setFont("helvetica", "normal");
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
        doc.addImage(url, "JPEG", margin, y, usableWidth, 50); // Add image
        y += 55;
    };

    addWrappedText("Name:", name);
    addWrappedText("Introduction:", Introduction);
    addWrappedText("Scope Of Work:", Scope_Of_Work);
    addWrappedText("Future Enhancements:", Future_Enhancements);

    if (imageUrl) {
        addImage(imageUrl); // Add the image
    }

    const fileName = `${name || 'Details'}.pdf`;
    doc.save(fileName);
  }
}
