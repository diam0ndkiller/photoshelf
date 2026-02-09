export interface ErrorResultObject {
    err: Error | { message: string }
}

export interface BackendConfig {
    credentials: BackendConfigCredentials
    databaseLocation: string,
    defaultBackgroundColor: string
}

export interface BackendConfigCredentials {
    [key: string]: string
}

export interface SuccessObject {
    success: boolean
}

export interface TrueSuccessObject extends SuccessObject {
    success: true;
}

export interface FalseSuccessObject extends SuccessObject {
    success: false;
}