import * as React from "react"
import Svg, {G, Ellipse, Path, SvgProps} from "react-native-svg"

export default function ShareIcon(props: SvgProps) {
    return (
        <Svg
            viewBox="0 0 105 105"
            {...props}
        >
            <G stroke="none" strokeWidth={1} fill="#00d163" fillRule="nonzero">
                <Ellipse
                    cx={75.0519521}
                    cy={14.9278912}
                    rx={14.9480479}
                    ry={14.9278912}
                />
                <Ellipse cx={29.9480479} cy={52} rx={14.9480479} ry={14.9278912} />
                <Ellipse
                    cx={75.0519521}
                    cy={89.0721088}
                    rx={14.9480479}
                    ry={14.9278912}
                />
                <Path d="M74.5257616 11.8570485L79.4742384 18.1429515 36.362 52.081 77.1492387 85.9216016 72.0410245 92.0783984 27.4458929 55.0783984 23.6371264 51.9183145 27.5257616 48.8570485z" />
            </G>
        </Svg>
    )
}
