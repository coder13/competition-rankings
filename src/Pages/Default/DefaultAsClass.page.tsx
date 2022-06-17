import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../Store";
import { getFoo, setFoo } from "../../Store/tmp";

type DefaultPageComponentOwnProps = {
    // TODO
}

type DefaultPageComponentProps = PropsFromRedux & {
    // TODO
}

type DefaultPageComponentState = {
    // TODO
}

class DefaultPageComponent extends React.Component<DefaultPageComponentProps, DefaultPageComponentState> {
    public constructor(props:DefaultPageComponentProps) {
        super(props);

        this.state = {};
    }

    public render() {

        return (
            <div>
                <h1>Default</h1>
                <div>
                    Foo: {this.props.foo}
                </div>
                <div>
                    Foo with selector: {this.props.fooWithSelector}
                </div>
                <div>
                    <button onClick={() => this.props.setFoo(new Date().toLocaleTimeString())}>Régler Foo à "Maintenant"</button>
                </div>
            </div>
        )
    }
}

/***********************************************************************/
/************************** REDUX **************************************/
/***********************************************************************/
const mapState = (state: RootState, ownProps:DefaultPageComponentOwnProps) => {
    return {
        foo:state.tmp.foo,
        fooWithSelector: getFoo(state),
    }
}

const mapDispatch = {
    setFoo:setFoo,
};

const connector = connect(
    mapState,
    mapDispatch
)

type PropsFromRedux = ConnectedProps<typeof connector>;

const RxDefaultPageComponent = connector(DefaultPageComponent);
/***********************************************************************/

export default RxDefaultPageComponent;