import * as React from "react"
import Svg, {Circle, Path, SvgProps} from "react-native-svg"
import {View} from "react-native";
interface BellIconProps extends SvgProps {
    color?: string;
    hasUnread?: boolean;
}
const BellIcon = ({ color = "#00d163", hasUnread = false, ...props }: BellIconProps) => (
    <Svg viewBox="0 0 105 105" {...props}>
        <Path
            fill={color}
            d="M52.92 9C73.3 9 89.84 25.54 89.84 45.92v30.55H16V45.92C16 25.54 32.54 9 52.92 9Zm0 8C36.96 17 24 29.96 24 45.92v22.55h57.84V45.92c0-15.801-12.701-28.66-28.442-28.916L52.92 17Zm13.97 65.28c0 7.72-6.26 13.97-13.97 13.97-7.71 0-13.97-6.26-13.97-13.97H66.9h-.01Z"
        />
        {hasUnread && (
            <View
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: "white",
                }}
            />
        )}
    </Svg>
)
export default BellIcon
