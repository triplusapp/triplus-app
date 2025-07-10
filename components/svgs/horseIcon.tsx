import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

interface HorseIconProps extends SvgProps {
    color?: string;
}
const HorseIcon = ({ color = "#EB2726", ...props }: HorseIconProps) => (

    <Svg
        viewBox="0 0 500 500"
        fill="none"
        {...props}
    >
        <Path
            fill={color}
            d="M232.914 376.28c5.666 0 10.26-4.594 10.26-10.26 0-5.666-4.594-10.26-10.26-10.26-5.667 0-10.26 4.594-10.26 10.26 0 5.666 4.593 10.26 10.26 10.26ZM266.674 376.28c5.666 0 10.26-4.594 10.26-10.26 0-5.666-4.594-10.26-10.26-10.26-5.667 0-10.26 4.594-10.26 10.26 0 5.666 4.593 10.26 10.26 10.26Z"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={7}
            d="M220.284 153.03s7.38-32.2-30.19-59.03c-19.45 29.52-21.47 54.25 2.01 88.5l-7.02 14.96a92.5 92.5 0 0 0-6.21 60.89l20.61 85.86s2.01 63.06 50.31 61.04"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={7}
            d="M249.794 329.58c-1.34-.79-30.86-10.71-49.64 21.75"
        />
        <Path
            fill={color}
            d="M212.404 278.43c5.904 0 10.69-4.786 10.69-10.69s-4.786-10.69-10.69-10.69-10.69 4.786-10.69 10.69 4.786 10.69 10.69 10.69Z"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={7}
            d="M279.314 153.03s-7.38-32.2 30.19-59.03c19.45 29.52 21.47 54.25-2.01 88.5l7.02 14.96a92.5 92.5 0 0 1 6.21 60.89l-20.61 85.86s-2.01 63.06-50.31 61.04"
        />
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={7}
            d="M249.794 329.58c1.34-.79 30.86-10.71 49.64 21.75"
        />
        <Path
            fill={color}
            d="M297.884 267.74c0 5.9-4.78 10.69-10.69 10.69-5.9 0-10.69-4.78-10.69-10.69 0-5.91 4.78-10.69 10.69-10.69 5.9 0 10.69 4.78 10.69 10.69ZM276.534 140.78c-26.08-23.25-66.93-2-63.15 32.73.05.47.11.95.17 1.44 6.04 48.3 39.58 59.03 39.58 59.03s-6.04-31.53 24.82-59.7c14.04-12.82 8.64-24.53-1.42-33.5Z"
        />
    </Svg>
)
export default HorseIcon
