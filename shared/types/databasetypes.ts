export interface Photo {
    id: number,
    path: string,
    capture_date: string,
    location_id: number,
    location_path: string
};

export interface Album {
    id: number,
    name: string
};

export interface PhotoLocation {
    id: number,
    path: string
}

export interface AlbumContentLink {
    album_id: number,
    type: 'photo' | 'heading' | 'spacer',
    index: number,
    photo_id: number,
    title: string
}