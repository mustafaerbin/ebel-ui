const InstanceCache = {};
export default function (location: string, cb: Function) {
    if (InstanceCache[location]) {
        cb(null, InstanceCache[location]);
        return;
    }
    System.import("../" + location).then((component) => {
        if (component.default) {
            component = component.default;
        }
        InstanceCache[location] = component;
        cb(null, component);
    });
}
