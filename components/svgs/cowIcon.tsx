import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"

interface CowIconProps extends SvgProps {
    color?: string;
}
const CowIcon = ({ color = "#EB2726", ...props }: CowIconProps) => (

    <Svg
        viewBox="0 0 500 500"
        fill="none"
        {...props}
    >
        <Path
            stroke={color}
            strokeMiterlimit={10}
            strokeWidth={7}
            d="M203.683 316.532c-21.41-20.36-29.73-51.54-20.41-80.38l18.13-56.12c4.74-14.67 18.4-24.61 33.81-24.61h29.01c15.42 0 29.08 9.94 33.81 24.61l18.13 56.12c9.32 28.84.99 60.01-20.41 80.38"
        />
        <Path
            fill={color}
            d="M211.163 163.752s-20.12-7.97-28.57-23.93-22.06 10.33-11.27 40.37l24.28 9.79 15.56-27.49"
        />
        <Path
            stroke={color}
            strokeMiterlimit={10}
            strokeWidth={7}
            d="M187.273 223.782s-56.31 9.09-60.06-29.87c-3.76-38.96 42.9-19.25 87.4 6.57 28.71 16.66 16.59 62.22 4.4 89.83"
        />
        <Path
            fill={color}
            d="M208.173 251.932a9.62 9.62 0 0 0 9.62-9.62 9.62 9.62 0 0 0-9.62-9.62 9.62 9.62 0 0 0-9.62 9.62 9.62 9.62 0 0 0 9.62 9.62Z"
        />
        <Path
            stroke={color}
            strokeMiterlimit={10}
            strokeWidth={7}
            d="M249.723 345.062h-34.97c-6.09 0-11.03-4.94-11.03-11.03v-8.68c-1.41-47.88 46-41.31 46-41.31s47.41-6.57 46 41.31v8.68c0 6.09-4.94 11.03-11.03 11.03h-34.97ZM217.803 347.402s-4.69 18.15 31.92 18.15 31.92-18.15 31.92-18.15"
        />
        <Path
            fill={color}
            d="M328.103 180.192c10.8-30.04-2.82-56.33-11.27-40.37s-28.57 23.93-28.57 23.93l12.98 26.23 26.86-9.79Z"
        />
        <Path
            stroke={color}
            strokeMiterlimit={10}
            strokeWidth={7}
            d="M312.173 223.782s56.31 9.09 60.06-29.87-42.9-19.25-87.4 6.57c-28.71 16.66-16.59 62.22-4.4 89.83"
        />
        <Path
            fill={color}
            d="M291.263 251.932a9.62 9.62 0 0 0 9.62-9.62 9.62 9.62 0 0 0-9.62-9.62 9.62 9.62 0 0 0-9.62 9.62 9.62 9.62 0 0 0 9.62 9.62Z"
        />
    </Svg>
)
export default CowIcon
