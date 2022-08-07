/**
 * It's a concept that's being considered for addition
 * 
 * This code allows the builder to expose only certain properties of a component.
 * But do users accept this type of operation?
 */
class Component {
    public getProps(): unknown {
        return this;
    }
}

class DrivedComponent extends Component {
    public value1 = 1;
}

interface DrivedComponent2Props {
    value1: number;
    func1: (value: number) => number;
}

class DrivedComponent2 extends Component {
    public override getProps(): DrivedComponent2Props {
        return this;
    }

    public value1 = 1;
    public func1 = (value: number): number => value;
    public func2 = (value: number): number => value;
}

type UnwrapUnknown<T> = T extends unknown
    ? unknown extends T
        ? never
        : T
    : T;

type GetProps<T extends Component> = T["getProps"] extends (() => infer U) ? UnwrapUnknown<U> : never;

type GetPropsOrComponent<T extends Component> = GetProps<T> extends never ? T : GetProps<T>;

function withComponent<T extends Component>(componentCtor: new (...args: any[]) => T, callback: (component: GetPropsOrComponent<T>) => void): void {
    callback(new componentCtor());
}

withComponent(DrivedComponent, c => {
    c.value1 = 2;
});

withComponent(DrivedComponent2, c => {
    c.func1(1);
});
