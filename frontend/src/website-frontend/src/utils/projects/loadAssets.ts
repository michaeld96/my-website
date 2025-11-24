export const loadAssets = () => {
    const modules = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,svg}', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
    const map: Record<string, string[]> = {};
    for (const p in modules) {
        const parts = p.split('/');
        const folder = parts[3]; // we know that we can "safely" do this since the size will always have this do to the condition above.
        if (!map[folder]) {
            map[folder] = [];
        }
        map[folder].push(modules[p]);
        
    }
    return map;
}