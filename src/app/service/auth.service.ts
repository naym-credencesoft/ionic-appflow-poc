import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResetPassword } from "../model/resetPassword";
import { Subcription } from "../model/subscription/Subcription";
import { Token } from "../model/token";
import { ApplicationUser } from "../model/user";
import { TokenStorage } from "../token.storage";
import { CountryConfigService } from "./CountryConfig/countryConfig.service";
import { Logger } from "./logger.service";

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token",
    }),
};

@Injectable({
    providedIn: "root",
})
export class AuthService {
    currentUser: any;
    constructor(
        private http: HttpClient,
        private token: TokenStorage,
        private countryConfig: CountryConfigService
    ) {}
    logout() {
        sessionStorage.removeItem("AuthToken");
        sessionStorage.removeItem("UserId");
        sessionStorage.removeItem("PropertyId");
        sessionStorage.removeItem("RoomDetails");
        sessionStorage.removeItem("PropertyDetails");
        window.sessionStorage.clear();
    }

    login(credentials) {
        return this.http.post<Token>(
            this.countryConfig.getCoreApiURL() + "/api/user/login",
            credentials,
            { observe: "response" }
        );
    }
    createUser(applicationUser: ApplicationUser) {
        Logger.log(applicationUser);
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/signup",
            applicationUser,
            { observe: "response" }
        );
    }

    findUserByEmail(email: string) {
        return this.http.get<any>(
            this.countryConfig.getCoreApiURL() +
                "/api/user/findByName/" +
                email +
                "/",
            { observe: "response" }
        );
    }

    forgotPassswordRequest(applicationUser: ApplicationUser) {
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/forgotPassword",
            applicationUser,
            { observe: "response" }
        );
    }

    isUuidValid(uuid: string) {
        return this.http.get<ApplicationUser>(
            this.countryConfig.getCoreApiURL() +
                "/api/user/isUuidValid/" +
                uuid,
            { observe: "response" }
        );
    }

    updatePassword(applicationUser: ApplicationUser) {
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/updatePassword",
            applicationUser,
            { observe: "response" }
        );
    }

    resetPassswordRequest(resetPassword: ResetPassword) {
        return this.http.post<ResetPassword>(
            this.countryConfig.getCoreApiURL() + "/api/user/resetPassword",
            resetPassword,
            { observe: "response" }
        );
    }

    updateUser(applicationUser: ApplicationUser) {
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/updateUser",
            applicationUser,
            { observe: "response" }
        );
    }

    updateUserProfile(applicationUser: ApplicationUser) {
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/profileUpdate",
            applicationUser,
            { observe: "response" }
        );
    }

    updateUserProfilePicture(applicationUser: ApplicationUser) {
        return this.http.post<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/updateProfilePic",
            applicationUser,
            { observe: "response" }
        );
    }

    getAll(): Observable<ApplicationUser[]> {
        Logger.log(this.countryConfig.getCoreApiURL() + "/users");
        return this.http.get<ApplicationUser[]>(
            this.countryConfig.getCoreApiURL() + "/user/findAll"
        );
    }
    getUserDetailsByUserName(userName: string) {
        return this.http.get<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/user/findByName/" + userName,
            { observe: "response" }
        );
    }
    getUserByUsername(userName: string) {
        return this.http.get<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/user/findByName/" + userName,
            { observe: "response" }
        );
    }
    getUserByUserId(userId: string) {
        return this.http.get<ApplicationUser>(
            this.countryConfig.getCoreApiURL() + "/api/user/findById/" + userId,
            { observe: "response" }
        );
    }



    getPropertySubcription(
        propertyId: number,
        userId: string
    ): Observable<Subcription[]> {
        let headers = new HttpHeaders({
            USER_ID: userId,
        });
        return this.http.get<Subcription[]>(
            this.countryConfig.getCoreApiURL() +
                "/api/property/" +
                propertyId +
                "/subscriptions",
            { headers: headers }
        );
    }
}
