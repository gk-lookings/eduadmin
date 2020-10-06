import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { ApiService, NumberOnlyDirective } from './services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, HttpInterceptor } from './helpers';

// mat-modules

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule} from '@angular/material';


// components

import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';
import { TemplateDetailComponent } from './template-detail/template-detail.component';
import { SubjectListingComponent } from './subject-listing/subject-listing.component';
import { TruncatePipe } from './pipe/truncate.pipe';
import { CreateSubjectComponent } from './create-subject/create-subject.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { CurriculamComponent } from './curriculam/curriculam.component';
import { CreateSectionComponent } from './create-section/create-section.component';
import { NotesComponent } from './notes/notes.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { LogOutModelComponent } from './log-out-model/log-out-model.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    CreateTemplateComponent,
    DndDirective,
    ProgressComponent,
    TemplateDetailComponent,
    SubjectListingComponent,
    TruncatePipe,
    CreateSubjectComponent,
    CreateDocumentComponent,
    DocumentListComponent,
    CurriculamComponent,
    CreateSectionComponent,
    NotesComponent,
    CreateNoteComponent,
    LogOutModelComponent,
    UsersListComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRippleModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  entryComponents: [
    CreateSubjectComponent,
    CreateSectionComponent,
    LogOutModelComponent
  ],
  providers: 
    [
      ApiService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpInterceptor,
        multi: true
      },
      NumberOnlyDirective
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
