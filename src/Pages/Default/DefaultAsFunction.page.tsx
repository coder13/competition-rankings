import { useAppDispatch, useAppSelector } from "../../Store";
import { getFoo, setFoo } from "../../Store/tmp";

function DefaultPageComponent() {
    const fooValue = useAppSelector(getFoo);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h1>Default</h1>
            <div>
                Foo: {fooValue}
            </div>
            <div>
                <button onClick={() => dispatch(setFoo(new Date().toLocaleTimeString()))}>Régler Foo à "Maintenant"</button>
            </div>
        </div>
    )
}

export default DefaultPageComponent;