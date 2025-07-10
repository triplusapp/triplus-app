import * as React from "react"
import Svg, {G, Path, Defs, ClipPath, SvgProps} from "react-native-svg"
interface AdnIconProps extends SvgProps {
    color?: string;
}

const AdnIcon = ({ color = "#EB2726", ...props }: AdnIconProps) => (
    <Svg
        viewBox="0 0 500 500"
        fill="none"
        {...props}
    >
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={12}
            d="M302.21 108c0 70.86-105.21 70.86-105.21 141.71 0 70.86 105.21 70.86 105.21 141.71"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={12}
            d="M197 108c0 70.86 105.21 70.86 105.21 141.71 0 70.86-105.21 70.86-105.21 141.71"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={6}
            d="M201.85 249.71h95.5M206.51 282.72h87.58M210.41 351.29h77.41M201.85 379.04h95.5M201.85 120.38h95.5M210.41 148.13h77.41M201.85 218.97h95.5"
        />
    </Svg>
)
export default AdnIcon
