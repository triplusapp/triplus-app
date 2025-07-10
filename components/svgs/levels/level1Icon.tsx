import * as React from "react"
import Svg, {G, Circle, Path, SvgProps} from "react-native-svg"

export default function Level1Icon(props: SvgProps) {
    return (
        <Svg viewBox="0 0 105 105" {...props}>
            <G fill="#EB2726">
                <Circle cx={52.39} cy={23.155} r={23.155} />
                <Path d="M52.39 57.588c15.776 0 28.614 12.833 28.614 28.613v13.022H23.777V86.2c0-15.776 12.834-28.613 28.613-28.613m0-5.777C33.398 51.81 18 67.205 18 86.2V105h68.777V86.2c0-18.991-15.395-34.39-34.39-34.39h.003z" />
            </G>
        </Svg>
    )
}

