import BackendHandler from "./backendHandler";

export default class navigationUtils {
    static async getNavigationDrawerItems() {
        var items: Array<{}> = [
            {
                title: "Home",
                value: "/home",
                props: {
                    prependIcon: 'mdi-home',
                },
            },
            {
                title: "Settings",
                value: "/settings",
                props: {
                    prependIcon: 'mdi-cog',
                },
            },
            {type: 'divider'},
            {
                type: 'subheader',
                title: 'PHOTOS',
            },
            {
                title: "All Photos",
                value: "/photos",
                props: {
                    prependIcon: 'mdi-image',
                }
            },
            {type: 'divider'},
            {
                type: 'subheader',
                title: 'ALBUMS',
            },
            {
                title: "All Albums",
                value: "/albums",
                props: {
                    prependIcon: 'mdi-view-grid',
                }
            },
        ]

        var albums = (await BackendHandler.listAlbums()).albums;//.splice(0, 5);

        for (var album of albums) {
            items.push({
                title: album.name,
                value: "/albums/" + album.id,
                props: {
                    prependIcon: 'mdi-image-album',
                }
            })
        }

        return items;
    }

    static decodePathSegments(path: string): Array<{ title: string, pathLink: string }> {
        console.log(path);
        const pathElements = path.split("/").splice(1);
        var output: Array<{ title: string, pathLink: string }> = [];
        for (let i = 0; i < pathElements.length; i++) {
            const segmentId = pathElements[i];
            const pathLink = '/' + pathElements.slice(0, i+1).join('/');
            output.push({title: this.decodeDisplayName(segmentId, this.PATH_SEGMENTS_DICT), pathLink})
        }
        return output;
    }

    static PATH_SEGMENTS_DICT: { [key: string]: string } = {
        'home': 'Home',
        'albums': 'All Albums'
    }

    static decodeDisplayName(key: string, dict: { [key: string]: any }) {
        if (key in dict) return dict[key];
        else return key;
    }
}