export interface ErrorResultObject {
    err: Error | { message: string }
}

export interface BackendConfig {
    credentials: BackendConfigCredentials
    databaseLocation: string
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

export interface PhotoType {
    id: number,
    path: string,
    capture_date: string,
    location_id: number,
    location_path: string
};

export interface AlbumType {
    id: number,
    name: string
};

export interface PhotoLocationType {
    id: number,
    path: string
}