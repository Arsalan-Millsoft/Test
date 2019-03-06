/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5c7f5719568681581952ce50
*
* You will get 10% discount for each one of your friends
* 
*/
// Import Libraries
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { sha3_512 } from 'js-sha3';

// Security
import { AuthenticationService } from '../security/authentication.service';
import { SecurityService } from "../security/services/security.service";
import { UserService } from '../services/user.service';
import { User } from "../domain/test_db/user";

/**
 * Change password component
 */
@Component({
    selector: 'modal-change-password',
    templateUrl: './modal-change-password.component.html',
})
export class ModalChangePasswordComponent implements OnInit {

    user: User;
    id: string;
    passwordOld: string;
    passwordNew: string = "";
    passwordNewConfirm: string = "";
    passwordAdmin: string;
    showError: boolean;
    clicked:boolean;
    
    constructor(
        public dialogRef: MatDialogRef<ModalChangePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService,
        private route:ActivatedRoute,
        private authenticationService:AuthenticationService,
        private securityService: SecurityService
    ) {
        if(data.id)
            this.id = data.id;     
    }

    ngOnInit(): void {
        this.route.params.subscribe( params => {
            //GET LOGGED USER
            this.authenticationService.getUser().subscribe((user:User) => {
                this.user = user;
            });
        })
    }

    /**
     * Change my password
     */
    changePassword = function(formValid: boolean) {
        this.showError = false;
        if (formValid) {
            // Convert passwords in SHA-3
            const passwordNew = sha3_512(this.passwordNew).toString();
            const passwordOld = sha3_512(this.passwordOld).toString();
    
            // Change password
            this.securityService.changePassword(passwordNew, passwordOld ).subscribe( (data:any) => {
                this.passwordOld = null;
                this.passwordNew = "";
                this.passwordNewConfirm = "";
                this.passwordAdmin = null;
                this.showError = false;
                this.close();
            }, (err:any) => {
                this.showError = true;
            })
        } else {
            this.clicked = true
        }
    }

    /**
     * Change password other users from admin
     */
    changePasswordByAdmin(formValid:boolean) {
        this.showError = false;
        if (formValid) {
            
            // Convert passwords in SHA-3
            const passwordNew = sha3_512(this.passwordNew).toString();
            const passwordAdmin = sha3_512(this.passwordAdmin).toString();
    
            // Change password
            this.userService.changePassword(this.id, passwordNew, passwordAdmin ).subscribe(data => {
                this.passwordAdmin = null;
                this.passwordNew = null;
                this.passwordNewConfirm = null;
                this.showError = false;
                this.close();
            }, err => {
                this.showError = true;
            })
        } else {
            this.clicked = true
        }
    };

    /**
     * Close modal
     */
    close(): void {
        this.dialogRef.close();
    }
    
    /**
     * Close Error
     */
    closeError = function(){
        this.showError = false;
    }

}