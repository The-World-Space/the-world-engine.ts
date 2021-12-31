/**
 * reference object for call by reference. this class used when building hierarchy
 */
export class PrefabRef<T> {
    public ref: T|null;

    public constructor(ref: T|null = null) {
        this.ref = ref;
    }
}
