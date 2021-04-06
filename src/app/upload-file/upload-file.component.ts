import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  files: any[] = [];
  fileArray: any[] = [];
  constructor( public dialogRef : MatDialogRef<UploadFileComponent>) { }

  ngOnInit() {
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }


  keepUnique(data, key) {
    return [... new Map(data.map(x => [key(x), x])).values()]
  }


  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.fileArray.push(item);
    }
    if (this.files.length > 0) {
      this.files = this.keepUnique(this.files.concat(this.fileArray), it => it.name)
    }
    else {
      this.files = this.fileArray
    }
    this.uploadFilesSimulator(0);
  }


  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  submit(){
    if(this.files.length > 0)
    {
      this.dialogRef.close(this.files)
    }
  }
}
