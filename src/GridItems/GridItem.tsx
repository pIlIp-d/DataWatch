import {Component, ReactElement} from "react";
import {DragHandle} from "@mui/icons-material";
import Measure from 'react-measure'

export  type GridItemProps = {
    name: string;
};
export type GridItemState = {
    name: string,
    data: object,
    dimensions: {
        width: number,
        height: number
    }
};


export default class GridItem<T = object, S = object> extends Component<GridItemProps & T, GridItemState & S> {

    constructor(props: T & GridItemProps) {
        super(props);
        this.state = {
            ...this.state,
            name: this.props.name,
            data: {},
            dimensions: {
                width: -1,
                height: -1,
            }
        }
    }

    generateDOM(_: { width: number, height: number }): ReactElement | null {
        return null;
    }

    render() {
        return <Measure scroll={false} bounds onResize={contentRect => {
            console.log("resized");
            this.setState({
                ...this.state,
                dimensions: {width: contentRect.bounds?.width ?? -1, height: contentRect.bounds?.height ?? -1}
            })
        }}
        >
            {({measureRef}) => (
                <div  className={"grid-item flex h-full w-full flex-col bg-background"}>
                    <DragHandle className="drag-handle"/>
                    <div ref={measureRef} className={"cancel-drag flex-1 overflow-hidden"}>
                        <div className={"overflow-clip"} style={{height: this.state.dimensions.height, width: this.state.dimensions.width}}>
                            {this.generateDOM(this.state.dimensions)}
                        </div>
                    </div>
                </div>
            )}
        </Measure>
    }
}
