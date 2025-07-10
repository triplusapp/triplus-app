import * as React from "react"
import Svg, {Circle, Path, SvgProps} from "react-native-svg"
const UserIcon = (props: SvgProps) => (
    <Svg viewBox="0 0 105 105" {...props}>
        <Path
            fill="#00d163"
            d="M56.92 44.68c16.96 0 30.72 13.76 30.72 30.72v29.14H17V75.4c0-16.96 13.76-30.72 30.72-30.72h9.2Zm0 8h-9.2C35.18 52.68 25 62.86 25 75.4v21.14h54.64V75.4c0-12.415-9.977-22.516-22.344-22.717l-.376-.003ZM52.33 39.9c11.018 0 19.95-8.932 19.95-19.95C72.28 8.932 63.348 0 52.33 0 41.312 0 32.38 8.932 32.38 19.95c0 11.018 8.932 19.95 19.95 19.95Z"
        />
    </Svg>
)
export default UserIcon
