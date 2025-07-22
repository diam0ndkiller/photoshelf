export default class navigationUtils {
    static async getNavigationDrawerItems() {
        return [
            {
                title: "Home",
                value: "/home",
                props: {
                    prependIcon: 'mdi-home',
                },
            },
            {
                title: "Albums",
                value: "/view-albums",
                props: {
                    prependIcon: 'mdi-image-album',
                }
            }
        ]
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
        'view-albums': 'Albums'
    }

    static decodeDisplayName(key: string, dict: { [key: string]: any }) {
        if (key in dict) return dict[key];
        else return key;
    }
}