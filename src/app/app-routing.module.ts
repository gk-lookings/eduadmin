import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AuthGuard } from './guards';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { CurriculamComponent } from './curriculam/curriculam.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotesComponent } from './notes/notes.component';
import { SubjectListingComponent } from './subject-listing/subject-listing.component';
import { TemplateDetailComponent } from './template-detail/template-detail.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { EditTemplateComponent } from './edit-template/edit-template.component';


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },

      { path: 'template-list', component: TemplateListComponent },
      { path: 'create-template', component: CreateTemplateComponent },
      { path: 'edit-template/:tempId', component: EditTemplateComponent },
      { path: 'template/:tempId', component: TemplateDetailComponent },
      
      { path: 'subject-listing', component: SubjectListingComponent },
    
      { path: 'documents', component: DocumentListComponent },
      { path: 'create-document', component: CreateDocumentComponent },
      { path: 'curriculam', component: CurriculamComponent },
    
      { path: 'users', component: UsersListComponent },
      { path: 'user/:id', component: UserDetailComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'create-note', component: CreateNoteComponent },
    ]
  },
 { path: '**', redirectTo: '/login', pathMatch: 'full' },
  
];
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
