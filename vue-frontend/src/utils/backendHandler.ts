async function getUrl(url: string) {
    const res = await fetch(url);
    return await res.json();
}

const baseUrl = import.meta.env.VITE_API_BASE_URL

export async function getHelloworld() {
    return await getUrl(`${baseUrl}/helloworld`);
}